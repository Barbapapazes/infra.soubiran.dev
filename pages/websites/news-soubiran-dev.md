---
id: 64b4ed5c-79a3-4149-bacd-c603651a4ce3
title: news.soubiran.dev
description: null
url: https://news.soubiran.dev
repository: https://github.com/barbapapazes/news.soubiran.dev
ecosystem:
  - type: deployment
    id: news-soubiran-dev
    name: Cloudflare Workers
    description: Serve the static website and the `/api` Worker worldwide.
    ecosystem:
      - type: build
        id: news-soubiran-dev
        name: Cloudflare Build
        description: Build and deploy the website automatically.
        ecosystem:
          - type: repository
            id: news.soubiran.dev
            name: GitHub
            description: Source code for the website and its API.
            href: https://github.com/barbapapazes/news.soubiran.dev
            ecosystem:
              - type: stack
                name: Vite
                href: https://vite.dev
              - type: stack
                name: Vue
                href: https://vuejs.org
              - type: stack
                name: Nuxt UI
                href: https://ui.nuxt.com
              - type: stack
                name: Hono
                href: https://hono.dev
          - type: data
            name: quick-news.soubiran.dev
            description: Fetch published entries at build time to generate pages, the RSS feed, and the JSON API.
            href: /platforms/quick-news-soubiran-dev
      - type: auth
        name: api.soubiran.dev
        description: Resolve the current user from forwarded cookies before accepting a news submission.
        href: /platforms/api-soubiran-dev
      - type: data
        name: quick-news.soubiran.dev
        description: Proxy submissions and notification actions to the internal platform through service bindings.
        href: /platforms/quick-news-soubiran-dev
  - type: domain
    name: Cloudflare Domains
    description: Manage the DNS records.
---

The website [news.soubiran.dev](https://news.soubiran.dev) is the public facing website of the [quick-news.soubiran.dev](/platforms/quick-news-soubiran-dev) platform.

It contains all the news entries, with links to access the article or the Discord discussion. A form to submit a news entry is also available, but it is only accessible to logged in users. For those who want to integrate the news feed into their own tools, a RSS feed and a JSON API are also available. Users can also subscribe to web push notifications to receive be notified when their entry is approved, when a new entry is published, or to be notified periodically with a digest of the news entries.

<!-- TODO: codemode mcp, skill to ensure that technologie are wrapped with a link, that other website than the current one is arrounded with a link to the current website -->
<!-- TODO: inject my sponsors and a frame to support my work in all pages, similar to the ecosystem (juste une petite frame, comme pour les newsletter avec un lien vers ma page sponsor -->

> [!INFO]
> For a better context understanding, read the announcement blog post: [Building a Curated Technical Monitoring Feed is Hard](https://soubiran.dev/posts/building-a-curated-technical-monitoring-feed-is-hard).

<!-- screenshot of the entry page -->

<!-- screenshot of the create page -->

## Tech Stack

This website is a combination of both a static website and an API server on the same domain thanks to the power of [Cloudflare Workers](https://workers.cloudflare.com/). The static website is served from the root domain, while the API is served from the `/api` subpath.

### Static Website

The static website is built using [Vite](https://vitejs.dev/), [Vue](https://vuejs.org/) and a custom plugin `@soubiran/vite` to ensure a cohesive stack across all the platforms and websites of the ecosystem. Under the hood, the custom plugin provides [Vue Router](https://router.vuejs.org/) for routing, [Nuxt UI](https://ui.nuxt.com/) for UI and [Vite SSG](https://github.com/antfu-collective/vite-ssg) for static site generation.

All news are injected at build time to ensure a smooth and fast user experience. The injection is done using another custom plugin that provides through a virtual module the list of news entries, fetched from the [quick-news.soubiran.dev](/platforms/quick-news-soubiran-dev) API.

From a code point of view, the plugin looks like this:

```ts
function virtualQuickNews(): Plugin {
  const QUICK_NEWS_MODULE_ID = 'virtual:quick-news'
  const RESOLVED_QUICK_NEWS_MODULE_ID = `\0${QUICK_NEWS_MODULE_ID}`

  return {
    name: 'quick-news:virtual-module',
    resolveId: {
      filter: {
        id: new RegExp(`^${QUICK_NEWS_MODULE_ID}$`),
      },
      handler: () => {
        return RESOLVED_QUICK_NEWS_MODULE_ID
      },
    },
    load: {
      filter: {
        id: new RegExp(`^${RESOLVED_QUICK_NEWS_MODULE_ID}$`),
      },
      handler: async () => {
        const articles = await fetchQuickNews()

        return `export default ${JSON.stringify(articles)}`
      },
    },
  }
}
```

It's a standard Vite plugin that intercepts the import of the `virtual:quick-news` module and replaces it with the list of news entries fetched from the API.

Two other plugins are also used to generated both the RSS feed and the JSON API at build time, using the same data fetched from the API.

> [!INFO]
> If you want to demystify Vite plugins, I've written a full 45-minutes conference about it named: [Inside a pipeline: demystifying Vite and its plugins](https://talks.soubiran.dev/).

### Dynamic API

The dynamic part of the website is built using [Cloudflare Workers](https://workers.cloudflare.com/) using the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/) to ensure a seamless development experience. The API is written using [Hono](https://hono.dev/) and mainly serves as a proxy to the [quick-news.soubiran.dev](/platforms/quick-news-soubiran-dev) API, with some additional logic to handle authentication and authorization.

Speaking of authentication, the website relies on my own authentication: [api.soubiran.dev](/platforms/api-soubiran-dev). As the website is on the same domain as the authentication server, the API forward the cookies to the authentication server to retrieve the user information. Then, the API uses them to create the payload of the news entry submission form that is then sent to the [quick-news.soubiran.dev](/platforms/quick-news-soubiran-dev) API using a [service binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/).

By looking at the architecture with a macro view, it looks like this:

<!-- TODO: voir pour injecter un vue-flow avec les 3 services -->

The controller responsible for handling the news entry submission looks like this:

```ts
import { Hono } from 'hono'

const app = new Hono()

app.post('/', async (c) => {
  const body = await c.req.json()
  const referer = c.req.header('referer') ?? ''
  const cookies = c.req.header('cookie')

  const session = sessionService.get({ cookies })
  const currentUser = await currentUserService.resolveCurrentUser({ session, referer })
  const result = await quickNewsService.createPending({
    user_id: currentUser.id,
    discord_id: currentUser.discord_id ?? '',
    url: body.url,
  })

  if (result && !result.success) {
    return c.json(result.errors, 400)
  }

  return c.body(null, 201)
})
```

I first extract the cookies from the request and use them to retrieve the user session and information from the authentication server. Within the method `resolveCurrentUser`, an synchrone HTTP request is made to [api.soubiran.dev](/platforms/api-soubiran-dev) to retrieve the user information. Then, the news entry payload is created and sent to the [quick-news.soubiran.dev](/platforms/quick-news-soubiran-dev) API using a service binding.

> [!NOTE]
> Within a bigger distributed architecture, using a JWT token would be a better option to avoid the synchrone HTTP request. However, this comes with cost of complexity. For now, it works.

The service binding is configured in the `wrangler.jsonc` file and within `quickNewsService` as follow:

```ts
export async function createPendingQuickNews(dto: CreatePendingQuickNewsDto) {
  return (env.QUICK_NEWS as any).createPendingQuickNews(dto)
}
```

The exact same logic is applied to handle the notification part of the website.

## Automation

As the website frontend is statically generated at build time, I need to rebuild and redeploy the website each time a new news entry is published. This is done using a [Deploy Hook](https://developers.cloudflare.com/pages/configuration/deploy-hooks/) that is triggered at the end of the [quick-news.soubiran.dev](/platforms/quick-news-soubiran-dev) workflow. At step is dedicated to call the deploy hook URL to trigger the rebuild and redeploy of the website.

```ts
await step.do(
  'trigger-news-soubiran-deploy-hook',
  { /* ... */ },
  async () => {
    await ofetch(env.CLOUDFLARE_NEWS_SOUBIRAN_DEV_DEPLOY_HOOK_URL, {
      method: 'POST',
    })
  },
)
```
