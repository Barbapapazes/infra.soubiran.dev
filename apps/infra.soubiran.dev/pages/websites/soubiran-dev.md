---
title: soubiran.dev
description: This is my personal website and main domain. It is the entry point to my writings, projects, talks, and other content.
url: https://soubiran.dev
repository:
  url: https://github.com/barbapapazes/soubiran.dev
  private: true
---

The website [soubiran.dev](https://soubiran.dev) is my personal website and main domain. It serves as the entry point to my writings, projects, talks, and more.

![soubiran.dev homepage screenshot](/websites/soubiran-dev/homepage.png)

## Development

This website is content-driven and built with [VitePress](https://vitepress.dev) and a custom fork of Nuxt UI. This setup streamlines development and makes it easy to create and manage content.

> [!NOTE]
> A migration is scheduled to a standard Vite + Vue setup later in 2025.

## Deployment

The website is statically generated. The build process is automated with [Cloudflare Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) and deployed to [Cloudflare Workers](https://workers.cloudflare.com/).

At build time, the website fetches data from [talks.soubiran.dev](/websites/talks-soubiran-dev) to display the list of talks I've given over the years. GitHub data is also fetched to populate the projects section with up-to-date information about my open source repositories.

The website accesses [the API](/platforms/api-soubiran-dev) only on the client side to fetch dynamic data, such as comments, reactions, and more.

Videos are hosted on [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/) using [rclone](https://rclone.org/) to optimize performance and avoid bloating the Git repository with large files. All images are converted to WebP to reduce their size and improve loading times.

This last step is not part of the build process. It is done manually when new videos or images are added.

> [!NOTE]
> Currently, Raycast is used to resize and convert images. In the future, images will be stored in R2 and processed on the fly using Cloudflare Images.

## Automation

To reduce maintenance, keep a single source of truth, and focus on creating content, I've automated data fetching and the redeployment of both the website and the API whenever new content is available.

1. Every day, a GitHub Action rebuilds and deploys the website to Cloudflare Workers, ensuring the data is always up to date.
2. Every time I publish a new talk, the website is rebuilt and deployed automatically.
3. For every commit on the main branch, a GitHub Action triggers a new deployment of [the API](/platforms/api-soubiran-dev) to ensure it is always in sync with the website content.
