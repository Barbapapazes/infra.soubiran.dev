---
id: 8b4905df-479c-450d-872c-1849e5af7bce
title: quick-news.soubiran.dev
description: >-
  An internal platform that analyzes articles, stores the results, and
  publishes summaries to Discord and news.soubiran.dev.
url: https://quick-news.soubiran.dev
repository: https://github.com/barbapapazes/quick-news.soubiran.dev
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

<!-- input -->
<!-- all steps of the workflow mostly in details with some code -->

At the end, the workflow looks like this:

<!-- TODO: integrate a workflow chart (similar to the one on soubiran.dev (and maybe create a dedicated component in @soubiran.dev/ui)) -->

### Authorization

The website is protected by [Cloudflare One](https://www.cloudflare.com/teams/cloudflare-one/) so only I can access the interface directly. Other apps, such as [news.soubiran.dev](/websites/news-soubiran-dev), can still interact with it through the API by using a [service binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/) for the runtime access or a [service token](https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/service-tokens/) for the build time plugin.
