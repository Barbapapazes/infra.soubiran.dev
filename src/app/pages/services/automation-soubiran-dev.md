---
id: 640cabcb-1bd2-4960-b25b-df4f4eb2e9de
title: automation.soubiran.dev
description: >-
  An internal service for automating tasks using Cloudflare Workflows and secured
  by Cloudflare One to ensure only authorized access.
url: https://automation.soubiran.dev
repository:
  url: https://github.com/barbapapazes/platform
  private: true
ecosystem:
  - type: auth
    name: Cloudflare One
    description: Protect the automation endpoints so only my CLI can trigger them.
    ecosystem:
    - type: deployment
      id: automation-soubiran-dev
      name: Cloudflare Workers
      description: Expose the automation endpoints and trigger workflows from incoming requests.
      ecosystem:
        - type: build
          id: automation-soubiran-dev
          name: Cloudflare Build
          description: Deploy the worker and workflows automatically on each push.
          ecosystem:
            - type: repository
              id: automation-repository
              name: GitHub
              description: Host the private source code for this internal automation service.
              ecosystem:
                - type: stack
                  name: Wrangler
                  href: https://developers.cloudflare.com/workers/wrangler
                - type: stack
                  name: Evlog
                  href: https://evlog.dev
        - type: workflows
          name: Cloudflare Workflows
          description: Run background jobs for the automation tasks handled by the service.
  - type: domain
    name: Cloudflare Domains
    description: Manage the DNS records that route `automation.soubiran.dev` to the worker.
---

[automation.soubiran.dev](https://automation.soubiran.dev) is an internal service that helps me automate various tasks with [Cloudflare Workflows](https://developers.cloudflare.com/workflows/).

There is no public access or frontend interface. The endpoint only receives calls and triggers workflows.

## Development

The service runs on a Cloudflare Worker that receives HTTP requests from my local CLI tool. Each endpoint triggers a different Cloudflare Workflow.

For example, I have a workflow that I use to remind myself to publish scheduled tweets.

```ts [src/index.ts]
import type { WorkflowEvent, WorkflowStep } from 'cloudflare:workers'
import { WorkflowEntrypoint } from 'cloudflare:workers'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body = await request.json<{ scheduleAt?: number, content?: string }>()

    await env.AUTOMATION_WORKFLOW.create({
      params: {
        scheduleAt: body.scheduleAt,
        content: body.content,
      },
    })

    return new Response('Scheduled', { status: 201 })
  },
}

export class Automation extends WorkflowEntrypoint<Env, any> {
  async run(event: WorkflowEvent<any>, step: WorkflowStep) {
    await step.sleepUntil('trigger time', event.payload.scheduleAt)

    await step.do('trigger action', async () => {
      await fetch(this.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: event.payload.content }),
      })
    })
  }
}
```

> [!NOTE]
> The code is simplified for clarity. The actual implementation includes error handling, logging, and other production-ready features.

The worker itself does not authenticate requests, even though it is exposed to the public internet. Instead, I rely on [Cloudflare One](https://developers.cloudflare.com/cloudflare-one/) with a [service token](https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/service-tokens/) to ensure that only my CLI tool can call the endpoints.

This keeps authentication outside the worker and prevents unauthorized requests from triggering workflows and generating costs.

## Deployment

Cloudflare Builds deploys the service automatically. Every push to the main branch triggers a new deployment of the worker and its workflows.

Cloudflare's observability tools expose workflow executions and worker metrics in the dashboard.
