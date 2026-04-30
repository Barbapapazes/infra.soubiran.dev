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

The platform [quick-news.soubiran.dev](https://quick-news.soubiran.dev) is an internal tool I use for technical monitoring. It takes a URL as input, ingests the article, searches for related content on the web, and produces both a summary and a critical analysis.

The result is then published to my Discord server and to [news.soubiran.dev](/websites/news-soubiran-dev), so I can revisit it later and share it with other people.

![Screenshot of quick-news.soubiran.dev](/platforms/quick-news-soubiran-dev/homepage.png)

![Screenshot of Quick News page on quick-news.soubiran.dev](/platforms/quick-news-soubiran-dev/quick-news-page.png)

![Screenshot of configuration page on quick-news.soubiran.dev](/platforms/quick-news-soubiran-dev/configuration-page.png)

## Why it exists

I spend a significant amount of time following the tech ecosystem, and blog posts are one of my main sources of information.

The problem starts once I finish reading an article. If it is insightful, I still need a reliable way to remember it and find it again later. For a long time, my process was simply to close the tab and hope future me would magically remember it.

That approach failed regularly. I would remember that I had read something valuable, but not where it was, and I often ended up searching for the same article again or rereading it from scratch.

So I built [quick-news.soubiran.dev](https://quick-news.soubiran.dev) to keep a record of the articles I read, make them easy to find again, and attach a summary that helps me remember why they mattered.

Publishing the summary and critical analysis publicly on both my Discord server and [news.soubiran.dev](/websites/news-soubiran-dev) also makes the work useful beyond my own notes. It gives my community a place to react, add context, and share their own perspective.

## How it fits into the ecosystem

Because [quick-news.soubiran.dev](https://quick-news.soubiran.dev) is personal software, it is protected by Cloudflare One so only I can access the interface directly. Other apps, such as [news.soubiran.dev](/websites/news-soubiran-dev), can still interact with it through the API by using service authentication.

This makes the platform both private and reusable. It stays behind access control for day-to-day usage, while still acting as a backend service for the rest of my ecosystem.

## How it runs

Under the hood, [quick-news.soubiran.dev](https://quick-news.soubiran.dev) is a Vite application built with Vue and Nuxt UI. I use the Cloudflare Vite plugin for the server part so I can integrate a Worker easily, and Hono keeps the HTTP layer simple to work with.

When I submit a quick news, the Worker starts a multi-step workflow. That workflow fetches the article content with Browser Run, asks the OpenAI API for a structured output, stores metadata in D1 and the generated payload in R2, publishes the summary and analysis to Discord, and finally triggers a redeployment of [news.soubiran.dev](/websites/news-soubiran-dev) so the new entry appears on the website.

On Discord, multiple channels have been set up to post the summaries and analyses, depending on the topic. This configuration is stored in D1 and can be updated through the platform interface. A description field is used to help the AI to choose the correct channel for each article as only one channel is used for posting. To post, a webhook URL is stored in the configuration and used at the end of the workflow.

![Screenshot of quick-news.soubiran.dev configuration page showing the Discord channel configuration](/platforms/quick-news-soubiran-dev/discord-configuration.png)

There is also a retry workflow for articles that failed during analysis, for example when Browser Run returns an empty page without raising an error.

## Notes for Future Me

The platform is still very early, and YouTube video analysis is still a work in progress.

The overall design should eventually move to my custom design system instead of relying directly on Nuxt UI.

External users will also be able to submit quick news in the future. Most of the infrastructure for that is already in place, but the public-facing experience is not ready yet.
