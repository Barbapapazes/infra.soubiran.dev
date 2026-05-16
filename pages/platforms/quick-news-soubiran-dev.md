---
id: 8b4905df-479c-450d-872c-1849e5af7bce
title: quick-news.soubiran.dev
description: >-
  An internal platform that analyzes articles, stores the results, and
  publishes summaries to Discord and news.soubiran.dev.
url: https://quick-news.soubiran.dev
repository:
  url: https://github.com/barbapapazes/quick-news.soubiran.dev
  private: true
ecosystem:
  - type: auth
    name: Cloudflare One
    description: Restrict access to the platform and secure service-to-service calls.
    ecosystem:
      - type: deployment
        id: quick-news-soubiran-dev
        name: Cloudflare Workers
        description: Host the platform and process submitted articles.
        ecosystem:
          - type: build
            id: quick-news-soubiran-dev
            name: Cloudflare Build
            description: Deploy the platform automatically.
            ecosystem:
              - type: repository
                id: quick-news-soubiran-dev
                name: GitHub
                description: Source code for the platform.
                href: https://github.com/barbapapazes/quick-news.soubiran.dev
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
          - type: workflows
            name: Cloudflare Workflows
            description: Run the article analysis pipeline in the background.
            ecosystem:
              - type: stack
                name: Browser Run
                description: Fetch article content during the analysis workflow.
              - type: database
                name: Cloudflare D1
                description: Store metadata for submitted articles and the Discord channel configuration.
              - type: object-storage
                name: Cloudflare R2
                description: Store the generated analysis payloads.
          - type: database
            name: Cloudflare D1
            description: Store metadata for submitted articles and the Discord channel configuration.
  - type: domain
    name: Cloudflare Domains
    description: Manage the DNS records.
---

The platform [quick-news.soubiran.dev](https://quick-news.soubiran.dev) is an internal tool.

It is used for technical monitoring and to keep track of articles I've read. It's mainly composed of a form where I can submit a URL, and then it generates a summary and a critical analysis of the article. Those are then published to my Discord server and made public on [news.soubiran.dev](/websites/news-soubiran-dev).

![Screenshot of quick-news.soubiran.dev](/platforms/quick-news-soubiran-dev/homepage.png)

> [!INFO]
> For a better context understanding, read the announcement blog post: [Building a Curated Technical Monitoring Feed is Hard](https://soubiran.dev/posts/building-a-curated-technical-monitoring-feed-is-hard).

## Tech Stack

This website is a SPA built with [Vite](https://vitejs.dev/) and [Vue](https://vuejs.org/), and a custom plugin `@soubiran/vite` to ensure a cohesive stack across all the platforms and websites of the ecosystem. Under the hood, the custom plugin provides [Vue Router](https://router.vuejs.org/) for routing, [Nuxt UI](https://ui.nuxt.com/) for UI and [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/) to integrate a Worker for the server part.

The central part of this platform is the workflow, named `quick-news-workflow`, triggered when a news is submitted.

Now than [news.soubiran.dev](/websites/news-soubiran-dev) is live, pages are mainly dedicated to the workflow configuration and management. For example, there is a page dedicated to set the available categories and their associated Discord channels, which are used to post the summaries and analyses.

![Screenshot of quick-news.soubiran.dev showing the categories and channels configuration within a dedicated page](/platforms/quick-news.soubiran-dev/categories-configuration.png)

Another page is dedicated to the list of articles to track them, their status, and to accept or reject the analysis when the news has been submitted by a [news.soubiran.dev](/websites/news-soubiran-dev) users.

![Screenshot of quick-news.soubiran.dev showing the list of articles within a dedicated page](/platforms/quick-news-soubiran-dev/articles-list.png)

### The Workflow

The workflow is, by far, the most interesting part of the platform. It is built with [Cloudflare Workflows](https://developers.cloudflare.com/workers/platform/workflows/) to ensure its durability and reliability.

### Workflow Triggering

Before starting the workflow, the submitted URL is validated, sanitized, and stored in a [D1 database](https://developers.cloudflare.com/d1/). The workflow is then started with the record ID as a parameter.

```ts
const quickNewsId = await quickNewsRepository.insert({
  url: validated.data.url,
})

await env.QUICK_NEWS_WORKFLOW.create({
  params: {
    quickNewsId,
  },
})
```

When an external user submit an URL, the same workflow is triggered but manually by myself after validating the relevance of the news and the source. This way, I can ensure that only relevant news are analyzed and published and having a single workflow for both internal and external submissions simplifies the architecture and maintenance of the platform.

### Workflow Steps

Then, the workflow runs eleven steps to go from the submitted URL to the published summary and analysis. The steps are the following:

1. `mark-quick-news-generation-started`, mark the record as being processed so the platform can track that generation has started.

   ```ts
   await step.do(
     'mark-quick-news-generation-started',
     { /* ... */ },
     async () => {
       await quickNewsService.markAsGenerationStarted(params.quickNewsId)
     }
   )
   ```

2. `get-quick-news`, load the submitted entry from D1 to retrieve the URL and any existing Discord metadata.

   ```ts
   const quickNews = await step.do(
     'get-quick-news',
     { /* ... */ },
     async () => {
       return await quickNewsService.getById(params.quickNewsId)
     }
   )
   ```

3. `fetch-markdown`, fetch the source article and convert it to Markdown so the AI can work on clean, normalized content.

   ```ts
   const markdown = await step.do(
     'fetch-markdown',
     { /* ... */ },
     async () => {
       return await cloudflareService.renderPageToMarkdown(quickNews.url)
     }
   )
   ```

4. `create-quick-news-batch`, build the AI request, including the expected JSON schema and available categories, then submit it as an OpenAI batch job.

   ```ts
   const quickNewsBatchId = await step.do(
     'create-quick-news-batch',
     { /* ... */ },
     async () => {
       return openaiService.createBatch(file)
     }
   )
   ```

5. `poll-quick-news-batch`, after a short pause to let the batch start and eventually complete, poll OpenAI until the structured generation result is available.

   ```ts
   await step.sleep('wait-before-poll-quick-news-batch', INITIAL_BATCH_POLL_DELAY)

   const generation = await step.do(
     'poll-quick-news-batch',
     { /* ... */ },
     async () => {
       return await openaiService.pollBatch(quickNewsBatchId)
     }
   )
   ```

6. `share-discord-summary`, publish the generated quick news summary to the Discord channel matching the inferred category, or update the existing message if one already exists.

   ```ts
   const discordMessage = await step.do(
     'share-discord-summary',
     { /* ... */ },
     async () => {
       return await discordService.sendWebhookMessage(discordWebhook.webhook_url, markdown)
     }
   )
   ```

7. `create-discord-thread`, create a dedicated Discord thread attached to the summary message so the critical analysis stays separate from the main post.

   ```ts
   const threadId = await step.do(
     'create-discord-thread',
     { /* ... */ },
     async () => {
       return await discordService.createThread(discordMessage.channelId, discordMessage.id, `Critical Analysis (...)`)
     }
   )
   ```

8. `share-discord-critical-analysis`, post the critical analysis in the thread, again reusing the existing message when the workflow is replayed.

   ```ts
   const threadMessage = await step.do(
     'share-discord-critical-analysis',
     { /* ... */ },
     async () => {
       return await discordService.sendWebhookMessageToThread(discordWebhook.webhook_url, threadId, generation.criticalAnalysis)
     }
   )
   ```

9. `store-quick-news`, persist the generated title, summary, analysis, authors, and Discord identifiers so the result becomes part of the platform state.

   ```ts
   await step.do(
     'store-quick-news',
     { /* ... */ },
     async () => {
       await quickNewsService.saveGenerated(
         quickNews.id,
         quickNews.url,
         generation.category,
         generation.criticalAnalysis,
         { title: generation.title, summary: generation.summary },
         generation.authors,
       )
     }
   )
   ```

10. `mark-quick-news-as-processed`, mark the entry as fully processed so it no longer appears as pending in the management interface.

    ```ts
    await step.do(
      'mark-quick-news-as-processed',
      { /* ... */ },
      async () => {
        await quickNewsService.markAsProcessed(quickNews.id)
      }
    )
    ```

11. `trigger-news-soubiran-deploy-hook`, trigger a deployment of `news.soubiran.dev` so the freshly generated content becomes public.

    ```ts
    await step.do(
      'trigger-news-soubiran-deploy-hook',
      { /* ... */ },
      async () => {
        await cloudflareService.triggerNewsSoubiranDevDeployment()
      }
    )
    ```

At step 5, the sleep isn't necessary for the workflow to work but it helps to reduce the number of polling attempts, and so the number of CPU cycles used by the workflow. The workflow sleeps for 10  minutes and most of the time, the batch is complete within this delay.

At the end, the workflow looks like this:

<!-- TODO: integrate a workflow chart (similar to the one on soubiran.dev (and maybe create a dedicated component in @soubiran.dev/ui)) -->

### Authorization

The website is protected by [Cloudflare One](https://www.cloudflare.com/teams/cloudflare-one/) so only I can access the interface directly. Other apps, such as [news.soubiran.dev](/websites/news-soubiran-dev), can still interact with it through the API by using a [service binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/) for the runtime access or a [service token](https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/service-tokens/) for the build time plugin.
