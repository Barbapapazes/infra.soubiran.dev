---
title: eats.soubiran.dev
description:
url: https://eats.soubiran.dev
repository:
  url: https://github.com/barbapapazes/eats.soubiran.dev
  private: true
ecosystem:
---

> [!WARNING]
> This platform is currently under development.

The platform [eats.soubiran.dev](https://eats.soubiran.dev) is a personal project aimed to showcase my pastry. It serves as a portfolio containing all the recipes I tried and pictures of the results.

![eats.soubiran.dev homepage screenshot](/platforms/eats-soubiran-dev/homepage.png)

## Development

This platform is built with [Laravel](https://laravel.com) and [Vue.js](https://vuejs.org). [Inertia.js](https://inertiajs.com) is used to simplify the development. [Nuxt UI](https://ui.nuxt.com) is used as the component library.

> [!NOTE]
> The design is work in progress to match my current branding.

Contrary to most of many other projects, a database is required as the content is created and managed directly on the platform. No Markdown files or static content are used. So, images of the pastries are stored on [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/) to avoid storing them on the server directly. This makes the system more resilient.

For the authentication system, I rely on an external service hosted, [Authentik](https://goauthentik.io/), by a friend. The workflow is similar to any OAuth2 provider. However, this makes sure that only authorized and known users can access the platform.

## Deployment

The platform is hosted on a [Hetzner VPS](https://www.hetzner.com/cloud/). The deployment is automated using [Forge](https://forge.laravel.com).

On production, a [SQLite](https://sqlite.org/) database is used to keep things simple. A backup system is in place, using [Listream](https://litestream.io/), to replicate the database to a dedicated R2 bucket.

In case of failure, the server can be rebuilt from scratch without any data loss.
