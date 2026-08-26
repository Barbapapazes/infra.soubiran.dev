---
id: 6ea85ef4-62a7-49ab-b9c5-d1c28ae70808
title: soubiran.dev
description: >-
  My statically generated personal website, with build-time content sources,
  API-backed interactions, and a realtime viewer count.
url: 'https://soubiran.dev'
repository:
  url: 'https://github.com/barbapapazes/soubiran.dev'
  private: true
ecosystem:
  - type: deployment
    id: soubiran-dev
    name: Cloudflare Workers
    description: Deploy my personal website worldwide on Cloudflare's edge.
    ecosystem:
      - type: build
        id: soubiran-dev
        name: Cloudflare Build
        description: Build and deploy the statically generated site automatically.
        ecosystem:
          - type: repository
            id: soubiran.dev
            name: GitHub
            description: Host the private source code and content for my main website.
            href: 'https://github.com/barbapapazes/soubiran.dev'
            ecosystem:
              - type: stack
                name: VitePress
                href: 'https://vitepress.dev'
              - type: stack
                name: Vue
                href: 'https://vuejs.org'
              - type: stack
                name: Tailwind CSS
                href: 'https://tailwindcss.com'
              - type: stack
                name: Pinia Colada
                href: 'https://pinia-colada.esm.dev'
              - type: ci/cd
                relationship: consumer
                name: GitHub Actions
                description: Check changes, refresh remote build data each day, and react to pushes on `main`.
                ecosystem:
                  - type: service
                    relationship: consumer
                    name: redeploy.soubiran.dev
                    description: Wait for this website deployment before invoking the API deploy hook.
  - type: website
    name: talks.soubiran.dev
    description: Supply talk metadata and transcripts to the website build.
  - type: data
    id: github-projects
    name: GitHub repository data
    description: Supply current public project metadata to the projects section during the build.
  - type: service
    name: api.soubiran.dev
    description: Own accounts, comments, reactions, feedback, votes, messages, and notifications.
  - type: realtime
    name: PartyKit
    description: Count active browser connections and broadcast the current viewer count.
  - type: data
    relationship: consumer
    name: Website metadata
    description: Publish `meta.json` with stable post and series records.
    ecosystem:
      - type: service
        relationship: consumer
        name: api.soubiran.dev
        description: Import the current website records during each API deployment.
  - type: data
    relationship: consumer
    name: Website catalog and documents
    description: Publish `pages.json` and complete Markdown documents.
    ecosystem:
      - type: service
        relationship: consumer
        name: mcp.soubiran.dev
        description: List and retrieve the public website content for MCP clients.
  - type: domain
    name: Cloudflare Domains
    description: Manage the DNS records that route `soubiran.dev` to the website.
---

[soubiran.dev](https://soubiran.dev) is my personal website and the main public entry point for my posts, series, projects, and talks. VitePress generates the content as static files, while [api.soubiran.dev](/services/api-soubiran-dev) and PartyKit add the parts that need shared state after a page reaches the browser.

The split is the useful part of this project. Most requests need only files at the edge, but readers can still comment, react, vote, receive notifications, and see how many people are online.

## Why the content stays static

My content changes when I publish, not when someone requests a page. I keep the English and French Markdown in the website repository and let VitePress render it during the build. Cloudflare Workers Static Assets can then serve the result without a server rendering each visit.

Some sections depend on data owned elsewhere. The build reads public repository metadata from GitHub and the current catalog from [talks.soubiran.dev](/websites/talks-soubiran-dev). It also downloads available talk transcripts to create pages under the main domain. Pulling this data at build time keeps the delivered pages static and gives the website one consistent snapshot of each source.

I did not put comments or accounts into that build. Those records change independently of publication and belong to [api.soubiran.dev](/services/api-soubiran-dev), where Laravel owns their validation, permissions, and storage. This division works well for a content site whose public pages are read often but whose interactive data still needs authenticated writes.

## How the build and live features meet

The build produces more than HTML. It copies the source Markdown into the deployed output and generates two catalogs with different consumers:

- `pages.json` describes pages, posts, series, episodes, translations, source references, and canonical URLs. [mcp.soubiran.dev](/services/mcp-soubiran-dev) uses it with the published Markdown to list and retrieve website content.
- `meta.json` contains the stable IDs, titles, URLs, dates, and publication fields that the Laravel API imports for posts and series.

Those stable IDs connect a generated page to its mutable records. Once the browser loads, it calls the API for comments, reactions, feedback, next-article votes, the current user, and notifications. It also sends comments, reactions, votes, feedback, and messages there. Requests include the browser session, and writes use Laravel Sanctum's CSRF cookie rather than exposing credentials in the static files.

PartyKit handles one smaller realtime concern. The viewer component opens a WebSocket connection to the `soubiran-dev` room. The PartyKit server counts active connections and broadcasts the new total whenever someone connects or leaves. The browser only reads that count, so realtime presence stays separate from both the static build and the Laravel data model.

## How publication stays in order

Cloudflare Builds runs the VitePress build and deploys `.vitepress/dist` through Workers Static Assets. A scheduled GitHub Actions workflow calls the website deploy hook each day so the build refreshes GitHub and talk data even when the content repository has not changed.

Remote build data makes deployment order matter. When [talks.soubiran.dev](/websites/talks-soubiran-dev) changes, it asks [redeploy.soubiran.dev](/services/redeploy-soubiran-dev) to wait until the new Talks Worker is in production before calling the personal website deploy hook. The website build then reads the matching talk catalog and transcripts instead of the previous deployment.

A push to the website's `main` branch starts the reverse dependency. GitHub Actions sends the website Worker name and the API deploy hook to [redeploy.soubiran.dev](/services/redeploy-soubiran-dev). After the coordinator confirms that the latest website build is live, it invokes the API deployment. Laravel imports the new `meta.json` during that deployment, so it can associate interactive records with newly published posts and series.

GitHub Actions also runs the unit tests and linter for repository changes. Cloudflare Access service credentials protect requests to the redeployment coordinator, and GitHub stores the deploy hook URLs as secrets. The website, its catalogs, and its Markdown documents stay public.
