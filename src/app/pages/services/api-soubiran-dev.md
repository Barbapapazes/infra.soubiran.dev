---
id: f2225f4f-7da6-4515-a5bf-e6adf1c9f294
title: api.soubiran.dev
description: >-
  The Laravel service that owns accounts, comments, reactions, votes, feedback,
  and other dynamic data for my personal website.
url: 'https://api.soubiran.dev'
repository: 'https://github.com/barbapapazes/api.soubiran.dev'
ecosystem:
  - type: deployment
    name: Forge
    description: Deploy the Laravel application and run its database migrations and metadata imports.
    ecosystem:
      - type: repository
        id: api.soubiran.dev
        name: GitHub
        description: Host the public application source and Forge deployment script.
        href: 'https://github.com/barbapapazes/api.soubiran.dev'
        ecosystem:
          - type: stack
            name: Laravel
            description: Handle HTTP routes, persistence, authorization, queues, and notifications.
            href: 'https://laravel.com'
          - type: stack
            name: Laravel Sanctum
            description: Authenticate first-party browser requests with the Laravel session.
            href: 'https://laravel.com/docs/sanctum'
          - type: stack
            name: Laravel Socialite
            description: Connect user accounts to GitHub, Google, and Discord.
            href: 'https://laravel.com/docs/socialite'
          - type: stack
            name: Filament
            description: Provide the private administration panel for application records.
            href: 'https://filamentphp.com'
          - type: stack
            name: Spatie Laravel Markdown
            description: Render the Markdown preview used when writing comments.
            href: 'https://github.com/spatie/laravel-markdown'
          - type: stack
            name: Sentry
            description: Capture application exceptions and performance traces.
            href: 'https://sentry.io'
      - type: service
        name: redeploy.soubiran.dev
        description: Trigger this deployment only after an upstream website reaches production.
  - type: data
    name: soubiran.dev metadata
    description: Supply stable page IDs, titles, URLs, and optional release metadata.
    ecosystem:
      - type: website
        name: soubiran.dev
        description: Publish the metadata during its static build.
  - type: data
    name: infra.soubiran.dev metadata
    description: Supply stable page IDs, titles, and URLs for the infrastructure wiki.
    ecosystem:
      - type: website
        name: infra.soubiran.dev
        description: Publish the metadata during its static build.
  - type: website
    relationship: consumer
    name: soubiran.dev
    description: Read public interaction data and send authenticated changes from the browser.
---

[api.soubiran.dev](https://api.soubiran.dev) owns the dynamic data behind [soubiran.dev](/websites/soubiran-dev). The personal website remains statically generated, while this Laravel application stores user accounts, comments, reactions, votes, feedback, messages, and notifications.

It also imports stable records for content published by [soubiran.dev](/websites/soubiran-dev) and [infra.soubiran.dev](/websites/infra-soubiran-dev). Stable page IDs keep those records connected when a title or URL changes.

## Why the dynamic state is separate

Most requests to my personal website only need static HTML and assets. Comments and reactions have different requirements. They need authenticated writes, authorization, persistence, and an administration interface. Putting those concerns in a separate application keeps them out of the static publishing path.

Laravel provides the data model and request lifecycle for that mutable state. The website can still deploy as static files on Cloudflare, and its browser code calls the API only for interactive features. This split fits a content site that benefits from static delivery but still needs accounts and user-generated data.

The API stores a local page record rather than copying article content. Published records use the UUID from the source website as their API route key. Interactions point to that record, so a later content build can change the page title or canonical URL without breaking its comments or reactions.

## How content and interactions meet

Both websites publish a `meta.json` catalog. During deployment, the API fetches those catalogs and upserts their entries by UUID. The [soubiran.dev catalog](/websites/soubiran-dev) supplies the title, URI, canonical URL, and optional release metadata. The [infra.soubiran.dev catalog](/websites/infra-soubiran-dev) supplies the stable identity and location of each wiki page.

The browser addresses published-page interaction routes with that UUID. Public endpoints return emoji definitions, vote totals, feedback summaries, reactions, and comment threads. They also accept page feedback without creating an account. Comment responses include rendered Markdown, replies, like counts, author data, and capability flags, which lets the website render the thread without reproducing Laravel's authorization rules.

Voting is the exception to UUID routing. A candidate article can exist in the API before publication, so vote mutations use its internal database ID. Once the article is published, a metadata import attaches the public UUID to the same record.

Authenticated routes cover user-specific data and mutations. They return the current account, votes, reactions, and notifications, and they handle comments, likes, reactions, votes, Markdown previews, and ask-me-anything messages. The API only includes private identity fields when a signed-in user reads their own account.

Laravel Sanctum treats the website as a stateful first-party client. Before an unsafe request, the browser obtains a CSRF cookie and sends the request with its session credentials. Users sign in through GitHub, Google, or Discord with Laravel Socialite. This uses the browser session for the first-party website instead of exposing long-lived API tokens to client code.

Filament provides the private administration panel. New accounts and user activity can create queued database notifications for administrators, while Laravel policies decide which comment and account actions each request may perform.

## Deployment ordering

Forge deploys the application on a server. Its deployment script enables maintenance mode, pulls the selected branch, installs production PHP dependencies, optimizes Laravel, reloads PHP-FPM, and runs database migrations. It then imports metadata from both websites before bringing the application back online.

Those imports make deployment order part of the data contract. A normal API deployment must fetch catalogs that are already live, not files from the previous website build. After a push to either website, [redeploy.soubiran.dev](/services/redeploy-soubiran-dev) waits for the corresponding Cloudflare Worker deployment to reach production before it calls the API deploy hook.

This sequence keeps static content and mutable records independent without letting their shared page IDs drift. Website builds publish the source metadata first. The API deployment imports it second. Browser requests can then attach current interaction data to the new pages.
