---
id: 92295a6b-89e7-4dd8-a404-bb5e4271aa1b
title: redeploy.soubiran.dev
description: >-
  An internal service that coordinates dependent Cloudflare deployments by
  waiting for a Worker deployment to finish before triggering a deployment webhook.
url: https://redeploy.soubiran.dev
repository:
  url: https://github.com/barbapapazes/redeploy.soubiran.dev
ecosystem:
  - type: auth
    name: Cloudflare One
    description: Protect the redeploy endpoint so only trusted automation can trigger deployment webhooks.
    ecosystem:
      - type: deployment
        id: redeploy-soubiran-dev
        name: Cloudflare Workers
        description: Receive redeploy requests, validate them, and start the coordination workflow.
        ecosystem:
          - type: build
            id: redeploy-soubiran-dev
            name: Cloudflare Build
            description: Deploy the Worker and its Workflow automatically from the repository.
            ecosystem:
              - type: repository
                id: redeploy.soubiran.dev
                name: GitHub
                description: Source code for the redeploy coordination service.
                href: https://github.com/barbapapazes/redeploy.soubiran.dev
                ecosystem:
                  - type: stack
                    name: Wrangler
                    href: https://developers.cloudflare.com/workers/wrangler
                  - type: stack
                    name: Evlog
                    href: https://evlog.dev
          - type: workflows
            id: redeploy-soubiran-dev
            name: Cloudflare Workflows
            description: Wait for dependent deployments and trigger deploy hooks durably.
            ecosystem:
              - type: services
                name: Cloudflare API
                description: Inspect Workers deployments and Cloudflare Build status before continuing.
  - type: domain
    name: Cloudflare Domains
    description: Manage the DNS records that route `redeploy.soubiran.dev` to the worker.
---

The platform [redeploy.soubiran.dev](https://redeploy.soubiran.dev) is an internal service.

It coordinates deployments between projects. When one application has to be redeployed after another Cloudflare Worker is available in production, the service waits for that dependency and then triggers a deployment webhook. It is especially useful from GitHub Actions, where a workflow can call a single endpoint and let Cloudflare Workflows handle the waiting part reliably.

For example, `infra.soubiran.dev` can ask the service to redeploy `api.soubiran.dev` only after the `infra-soubiran-dev` Worker has reached production:

```yaml [.github/workflows/redeploy-api-soubiran-dev.yml]
- name: Trigger
  run: |
    curl --fail-with-body --silent --show-error -X POST https://redeploy.soubiran.dev/url \
      -H "Content-Type: application/json" \
      -H "CF-Access-Client-Id: ${{ secrets.CLOUDFLARE_ACCESS_CLIENT_ID }}" \
      -H "CF-Access-Client-Secret: ${{ secrets.CLOUDFLARE_ACCESS_CLIENT_SECRET }}" \
      -H "x-service: infra.soubiran.dev" \
      -d '{
        "deploy_hook_url": "${{ secrets.API_DEPLOY_URL }}",
        "cloudflare": {
          "to_wait": {
            "worker": "infra-soubiran-dev"
          }
        }
      }'
```

## Tech Stack

The service is based on a single [Cloudflare Worker](https://www.cloudflare.com/products/workers/) and a [Cloudflare Workflow](https://developers.cloudflare.com/workflows/). The Worker exposes a small HTTP API, validates requests with [Zod](https://zod.dev), and starts a Workflow with the deployment hook and optional Worker to wait for.

The Workflow uses the [Cloudflare SDK](https://github.com/cloudflare/cloudflare-typescript) to inspect Workers deployments and Cloudflare Build status. Logs are emitted with [Evlog](https://evlog.dev) from both the Worker and the Workflow so each redeploy request can be correlated with the calling service.

## The API

The service exposes a single endpoint: `POST /url`. The request body contains the deploy hook URL to trigger and, optionally, the Cloudflare Worker that must be deployed first.

```ts [src/schema.ts]
const cloudflareWorkerSchema = z.object({
  worker: z.string().regex(/^[\w-]+$/),
})

export const bodySchema = z.object({
  deploy_hook_url: z.url(),
  cloudflare: z.object({
    to_wait: cloudflareWorkerSchema.optional(),
  }).optional(),
})
```

When the request is valid, the Worker creates a workflow instance. If a Worker name is provided, the workflow ID is prefixed with both that target and a short hash of the deploy hook URL. This keeps duplicate requests for the same Worker and deploy hook from running at the same time, while allowing different deploy hooks to wait for the same Worker in parallel.

```ts [src/index.ts]
const deployHookUrl = validatedBody.data.deploy_hook_url
const workerToWait = validatedBody.data.cloudflare?.to_wait?.worker

const workflowId = await getWorkflowId(workerToWait, deployHookUrl)
const params = {
  deploy_hook_url: deployHookUrl,
  workerToWait,
  requestedByService: callerService,
  triggerRequestId: requestId,
}

await env.REDEPLOY_SOUBIRAN_DEV.create({
  id: workflowId,
  params,
})
```

## The Workflow

The Workflow is the heart of this service. It is durable, retryable, and can wait for up to one hour without keeping a GitHub Actions job busy.

It runs three main steps:

1. `check-if-workflow-exists-[worker]`: prevent two redeploy workflows for the same target Worker and deploy hook from waiting at the same time.

   ```ts
   await step.do(`check-if-workflow-exists-${workerToWait}`, async () => {
     const json = await cloudflare.workflows.instances.list(WORKFLOW_NAME, {
       account_id: ACCOUNT_ID,
       status: 'running',
     })

     const workflowIdPrefix = await getWorkflowIdPrefix(workerToWait, deploy_hook_url)
     const otherInstances = json.result
       .filter(instance => instance.id !== event.instanceId)
       .filter(instance => instance.id.startsWith(workflowIdPrefix))

     if (otherInstances.length > 0) {
       throw new NonRetryableError(`Another instance is already running for worker ${workerToWait}`)
     }
   })
   ```

   Workflow instance IDs for waiting requests look like `worker-[worker]-hook-[deploy-hook-hash]-[uuid]`. For example, two requests waiting for `infra-soubiran-dev` with two different deploy hook URLs receive different prefixes, so both can run. If the Worker and deploy hook URL are identical, the second request is rejected as a duplicate.

2. `wait-for-latest-production-deployment-[worker]`: poll Cloudflare until the latest build has stopped, succeeded, and is the version deployed to production.

   ```ts
   const deployment = await step.do(`wait-for-latest-production-deployment-${workerToWait}`, {
     retries: {
       limit: 60,
       delay: '1 minute',
       backoff: 'constant',
     },
     timeout: '1 hour',
   }, async () => {
     return await waitForLatestWorkersDeployment(workerToWait)
   })
   ```

3. `trigger-deploy-hook`: call the Cloudflare deploy hook once the dependency is ready, or immediately when no dependency was provided.

   ```ts
   const response = await fetch(deploy_hook_url, { method: 'POST' })

   if (!response.ok) {
     const error = await response.text()
     throw new Error(`Deploy hook trigger failed with ${response.status}${error ? `: ${error}` : ''}`)
   }
   ```

At the end, the workflow looks like this:

<RedeployGraph />

## Authorization

The platform is protected by [Cloudflare One](https://developers.cloudflare.com/cloudflare-one/). Automation callers use a [service token](https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/service-tokens/) through the `CF-Access-Client-Id` and `CF-Access-Client-Secret` headers.

Callers also send an `x-service` header. It is not used for authorization, but it makes logs much easier to read because the Worker and Workflow can both record which service requested the redeploy.
