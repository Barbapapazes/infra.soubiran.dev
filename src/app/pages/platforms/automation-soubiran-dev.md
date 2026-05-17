---
id: 640cabcb-1bd2-4960-b25b-df4f4eb2e9de
title: automation.soubiran.dev
description: >-
  An internal tool for automating tasks using Cloudflare Workflows and secured
  by Cloudflare One to ensure only authorized access.
url: https://automation.soubiran.dev
repository:
  url: https://github.com/barbapapazes/platform
  private: true
ecosystem:
  - type: auth
    name: Cloudflare One
    description: Secure the endpoints with service tokens.
    ecosystem:
    - type: deployment
      id: automation-soubiran-dev
      name: Cloudflare Workers
      description: Host the platform and handle HTTP requests.
      ecosystem:
        - type: build
          id: automation-soubiran-dev
          name: Cloudflare Build
          description: Deploy the platform automatically.
          ecosystem:
            - type: repository
              id: platform
              name: GitHub
              description: Private source code for the platform.
              ecosystem:
                - type: stack
                  name: Wrangler
                  href: https://developers.cloudflare.com/workers/wrangler
                - type: stack
                  name: Evlog
                  href: https://evlog.dev
        - type: workflows
          name: Cloudflare Workflows
          description: Automate tasks through background processes.
  - type: domain
    name: Cloudflare Domains
    description: Manage the DNS records.
---

The platform [automation.soubiran.dev](https://automation.soubiran.dev) is an internal tool that helps me automate various tasks by relying on [Cloudflare Workflows](https://developers.cloudflare.com/workflows/).

There is no public access to this platform or frontend interface, as the endpoint is only used to receive calls and trigger workflows.

## Development

The platform is based on a Cloudflare Worker that receives HTTP requests from my local CLI tool. Depending on the endpoint called, different Cloudflare Workflows are triggered to perform specific tasks.

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

This makes the development and maintenance of the platform easier while maintaining a good level of security. Also, this avoids triggering the worker from unauthorized sources, which could lead to unexpected costs.

## Deployment

The platform is deployed automatically using [Cloudflare Builds](https://developers.cloudflare.com/workers/ci-cd/builds/). Every push to the main branch triggers a new deployment of the worker and the workflows.

Thanks to Cloudflare's observability tools, I can monitor workflow executions and worker metrics directly from the Cloudflare dashboard.
