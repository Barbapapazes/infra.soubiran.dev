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
              id: platform
              name: GitHub
              description: Host the private source code for this internal automation platform.
              ecosystem:
                - type: stack
                  name: Wrangler
                  href: https://developers.cloudflare.com/workers/wrangler
                - type: stack
                  name: Evlog
                  href: https://evlog.dev
        - type: workflows
          id: automation-soubiran-dev
          name: Cloudflare Workflows
          description: Run background jobs for the automation tasks handled by the platform.
  - type: domain
    name: Cloudflare Domains
    description: Manage the DNS records that route `automation.soubiran.dev` to the worker.
---

The platform [automation.soubiran.dev](https://automation.soubiran.dev) is an internal tool.

It helps me to schedule messages to be sent to Discord, in a dedicated reminder channel, to remind me to publish scheduled tweets.

## Tech Stack

The platform is pretty simple as it is based on a single [Cloudflare Worker](https://www.cloudflare.com/products/workers/) that receives HTTP requests and triggers [Cloudflare Workflows](https://developers.cloudflare.com/workflows/) to perform the actual tasks.

As I access the platform using my local CLI tool, the platform does not have a user interface.

## The Workflow

The workflow is the heart of this platform. When a request is received, the worker triggers a workflow that will wait until the scheduled time and then send a message to Discord.

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
```

Once triggered, the workflow runs the following steps:

1. `trigger-time`: Wait until the scheduled time.

  ```ts
  await step.sleepUntil('trigger-time', event.payload.scheduleAt)
  ```

2. `trigger-action`: Send the message to Discord.

  ```ts
  await step.do('trigger-action', async () => {
    await fetch(this.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: event.payload.content }),
    })
  })
  ```

At the end, the workflow looks like this:

<AutomationGraph />

## Authorization

The platform is protected by [Cloudflare One](https://developers.cloudflare.com/cloudflare-one/) and a [service token](https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/service-tokens/) that allows only my CLI tool to call the endpoints.
