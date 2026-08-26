---
id: 867adb28-d1d1-4017-adca-ffe1972b5f19
title: redeploy.soubiran.dev
description: >-
  The deployment coordinator that waits for an upstream Cloudflare Worker to
  reach production before it triggers a dependent build.
url: 'https://redeploy.soubiran.dev'
repository: 'https://github.com/barbapapazes/redeploy.soubiran.dev'
ecosystem:
  - type: auth
    name: Cloudflare One
    description: Authenticate deployment requests before they reach the Worker.
    ecosystem:
      - type: deployment
        id: redeploy-soubiran-dev
        name: Cloudflare Workers
        description: Validate each request and start its deployment workflow.
        ecosystem:
          - type: repository
            id: redeploy.soubiran.dev
            name: GitHub
            description: Host the public Worker source and deployment configuration.
            href: 'https://github.com/barbapapazes/redeploy.soubiran.dev'
            ecosystem:
              - type: stack
                name: Cloudflare SDK
                description: Read Worker build and production deployment state from the Cloudflare API.
                href: 'https://github.com/cloudflare/cloudflare-typescript'
              - type: stack
                name: Evlog
                description: Correlate the incoming request with its Workflow execution.
                href: 'https://evlog.dev'
              - type: stack
                name: Wrangler
                description: Configure and deploy the Worker and Workflow binding.
                href: 'https://developers.cloudflare.com/workers/wrangler/'
          - type: workflows
            relationship: consumer
            name: Cloudflare Workflows
            description: Wait for the upstream deployment and invoke the dependent deploy hook.
            ecosystem:
              - type: ci/cd
                relationship: consumer
                name: Cloudflare deploy hooks
                description: Start the dependent build after the upstream Worker reaches production.
                ecosystem:
                  - type: service
                    relationship: consumer
                    name: api.soubiran.dev
                    description: Rebuild after infrastructure or personal website content changes.
                  - type: website
                    relationship: consumer
                    name: soubiran.dev
                    description: Rebuild after new talk metadata reaches production.
  - type: website
    name: infra.soubiran.dev
    description: Request an API rebuild after publishing new infrastructure metadata.
  - type: website
    name: soubiran.dev
    description: Request an API rebuild after publishing personal website content.
  - type: website
    name: talks.soubiran.dev
    description: Request a personal website rebuild after publishing talk metadata.
  - type: domain
    name: Cloudflare Domains
    description: Route `redeploy.soubiran.dev` to the Worker.
---

[redeploy.soubiran.dev](https://redeploy.soubiran.dev) coordinates builds that depend on files published by another Cloudflare Worker. A GitHub Actions workflow sends the upstream Worker name and a downstream deploy hook. The service waits for the upstream deployment to reach production, then calls the hook.

This keeps build-time dependencies in order across separate repositories. [api.soubiran.dev](/services/api-soubiran-dev) must read current metadata from [infra.soubiran.dev](/websites/infra-soubiran-dev) and [soubiran.dev](/websites/soubiran-dev), while the personal website must read current talk metadata from [talks.soubiran.dev](/websites/talks-soubiran-dev).

## Why coordination happens outside GitHub Actions

A push starts GitHub Actions and Cloudflare Builds independently. The source workflow knows that a commit reached `main`, but it does not know when Cloudflare has promoted the resulting Worker version to production. Calling the dependent deploy hook immediately could start a build against the previous metadata.

I put that wait in one service instead of copying Cloudflare API checks into each repository. This fits projects that deploy independently but share a build-time data contract. Each source repository only declares what Worker must finish and which build should follow.

Cloudflare Workflows owns the long-running part. The request handler validates the input, creates a Workflow instance, and responds without holding the HTTP request open. The Workflow can retry deployment checks and retain its execution state independently of the caller.

## How a redeployment flows

The [`POST /url` handler](https://github.com/barbapapazes/redeploy.soubiran.dev/blob/main/src/index.ts) accepts a deploy hook URL and an optional Worker name. When the Worker name is absent, the Workflow calls the hook without waiting. Production callers include it because they need deployment ordering.

For a coordinated request, the Workflow first checks for another running instance with the same Worker and deploy hook. It hashes the hook URL when it builds the instance identifier, so it can reject duplicate work without putting the secret URL in that identifier.

The [`waitForLatestWorkersDeployment` check](https://github.com/barbapapazes/redeploy.soubiran.dev/blob/main/src/workers.ts) compares two views from the Cloudflare API. It reads the latest build for the Worker and the build attached to its latest production deployment. The step succeeds only when the latest build completed successfully and both records point to the same build. Until then, Cloudflare Workflows retries the step.

Once those records match, the Workflow sends a `POST` request to the supplied deploy hook. The three current flows are:

- A push to `infra.soubiran.dev` waits for its Worker, then rebuilds `api.soubiran.dev` so the API imports the new wiki metadata.
- A push to `soubiran.dev` waits for its Worker, then rebuilds `api.soubiran.dev` so website content and API data stay aligned.
- A push to `talks.soubiran.dev` waits for its Worker, then rebuilds `soubiran.dev` with the new talk catalog.

The initial `OK` response confirms that the Workflow started. The Workflow execution records whether the later deployment check and deploy hook succeeded.

## Access and operations

Cloudflare Access protects the endpoint with service tokens stored as GitHub Actions secrets. The Worker does not duplicate that authentication check. Callers also send an `x-service` header, which identifies the source repository in logs but does not grant access.

The deploy hook URL stays inside the Workflow payload. Structured events record its host and a redacted path, then connect the incoming request ID, caller name, Workflow instance, checked deployment, and hook result. This gives each cross-project deployment one trace without writing the hook secret to logs.

The [Wrangler configuration](https://github.com/barbapapazes/redeploy.soubiran.dev/blob/main/wrangler.jsonc) maps the custom domain to the Worker and binds the `RedeploySoubiranDev` Workflow class. Wrangler deploys both pieces together. GitHub Actions runs ESLint on pushes and pull requests. Cloudflare stores Workflow execution state and exposes the resulting events through its observability tools.