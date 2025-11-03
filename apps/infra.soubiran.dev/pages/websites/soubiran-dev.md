---
title: soubiran.dev
description: This is my personal website and main domain. I use it as the entry point to access all my writings, projects, and talks.
---

[soubiran.dev](https://soubiran.dev) is my personal website. It is a content-driven site built with [VitePress](https://vitepress.dev/) and hosted on [Cloudflare Workers](https://workers.cloudflare.com/).

To reduce maintenance, keep a single source of truth, and focus on creating content, I've automated data fetching and the redeployment of both the website and the API whenever new content is available.

1. Every day, a GitHub Action rebuilds and deploys the website to Cloudflare Workers, ensuring that the data are always up-to-date.
2. Every time I publish a new talk, the website is rebuilt and deployed automatically.
3. For every commit on the main branch, a GitHub Action triggers a new deployment of the API to ensure it is always in sync with the website content.

Videos are hosted on [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/) to optimize performance and avoid bloating the Git repository with large files. All images are converted to WebP to reduce their size and improve loading times.

The domain `soubiran.dev` is also my main domain, used as the entry point to access my entire ecosystem, including my writings, projects, talks, and self-hosted services.
