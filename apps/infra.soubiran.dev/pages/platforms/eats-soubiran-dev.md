---
title: eats.soubiran.dev
description:
url: https://eats.soubiran.dev
repository:
  url: https://github.com/barbapapazes/eats.soubiran.dev
  private: true
ecosystem:
  - type: auth
    id: bipbip.boo
    name: Authentik
    description: Provide authentication for the platform.
  - type: object-storage
    id: eats-soubiran-dev
    name: Cloudflare R2
    description: Store images of the pastries.
  - type: domain
    name: Cloudflare Domains
    description: Manage the DNS records.
  - type: deployment
    id: perso
    name: Hetzner
    description: Host the platform.
    ecosystem:
      - type: build
        id: perso
        name: Forge
        description: Deploy the platform automatically.
        ecosystem:
          - type: repository
            id: eats-soubiran-dev
            name: GitHub
            description: Source code for the platform.
            href: https://github.com/barbapapazes/eats.soubiran.dev
            ecosystem:
              - type: stack
                name: Laravel
                href: https://laravel.com
              - type: stack
                name: Inertia.js
                href: https://inertiajs.com
              - type: stack
                name: Nuxt UI
                href: https://ui.nuxt.com
              - type: stack
                name: Vue
                href: https://vuejs.org
              - type: stack
                name: Vite
                href: https://vite.dev
      - type: object-storage
        id: eats-soubiran-dev
        name: Cloudflare R2
        description: Store images of the pastries.
      - type: database
        id: eats-soubiran-dev
        name: SQLite
        description: Store the platform data.
      - type: backup
        id: eats-soubiran-dev
        name: Litestream
        description: Backup the SQLite database to Cloudflare R2.
        ecosystem:
          - type: object-storage
            id: backups
            name: Cloudflare R2
            description: Store the database backups.
---

> [!WARNING]
> This platform is currently under development.

The platform [eats.soubiran.dev](https://eats.soubiran.dev) is a personal project aimed to showcase my pastry. It serves as a portfolio containing all the recipes I tried and pictures of the results.

![eats.soubiran.dev homepage screenshot](/platforms/eats-soubiran-dev/homepage.png)

## Development

This platform is built with [Laravel](https://laravel.com) and [Vue.js](https://vuejs.org). [Inertia.js](https://inertiajs.com) is used to simplify the development. [Nuxt UI](https://ui.nuxt.com) is used as the component library.

> [!NOTE]
> The design is work in progress to match my current branding.

Contrary to most of my other projects, a database is required as the content is created and managed directly on the platform. No Markdown files or static content are used. So, images of the pastries are stored on [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/) to avoid storing them on the server directly. This makes the system more resilient.

For the authentication system, I rely on an external service, [Authentik](https://goauthentik.io/), hosted by a friend. The workflow is similar to any OAuth2 provider. However, this makes sure that only authorized and known users can access the platform.

## Deployment

The platform is hosted on a [Hetzner VPS](https://www.hetzner.com/cloud/). The deployment is automated using [Forge](https://forge.laravel.com).

On production, a [SQLite](https://sqlite.org/) database is used to keep things simple. A backup system is in place, using [Litestream](https://litestream.io/), to replicate the database to a dedicated R2 bucket.

In case of failure, the server can be rebuilt from scratch without any data loss.
