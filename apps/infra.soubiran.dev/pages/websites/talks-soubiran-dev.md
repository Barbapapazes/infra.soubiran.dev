---
title: talks.soubiran.dev
description: My collection of talks given at conferences and meetups. Automatically listed on my personal website.
url: https://talks.soubiran.dev
repository: https://github.com/barbapapazes/talks
---

The website [talks.soubiran.dev](https://talks.soubiran.dev) contains all the talks I've given at conferences and meetups over the years. The root redirects to the page listing all talks: [soubiran.dev/talks](https://soubiran.dev/talks).

From the list, you can access each talk's deck, a direct link to the source, recordings, audio, transcripts, and articles when available. This makes it easy to find and share my talks with others.

## Development

The project is a monorepo managed with [pnpm](https://pnpm.io). Each talk is stored in its own folder as a standalone Slidev project. This means each talk is independent, and when I give the same talk in a different context, I copy it into a new folder. The date of the talk is used as the folder name.

A theme ensures a consistent look and feel across all talks. It also speeds up the creation of new talks by providing pre-configured styles and components.

The code is open source and available on [GitHub](https://github.com/barbapapazes/talks).

## Deployment

This website is statically generated. Each talk is built using [Slidev](https://sli.dev), and all outputs are combined into a single static site.

The process is automated with [Cloudflare Builds](https://developers.cloudflare.com/workers/ci-cd/builds/), then deployed to [Cloudflare Workers](https://workers.cloudflare.com/).

After the build, a file named `meta.json` is generated. It contains metadata for each talk, such as the title, date, description, and links to resources. This file is used by [soubiran.dev](/websites/soubiran-dev) to display the list of talks.

PDF exports and thumbnails for each talk are generated locally and pushed to [R2](https://developers.cloudflare.com/r2/) using [rclone](https://rclone.org/). They aren't part of the build process.

## Automation

To ensure [soubiran.dev](/websites/soubiran-dev) always has the latest talks, a GitHub Actions workflow triggers a rebuild and redeployment on every push to the [talks repository](https://github.com/barbapapazes/talks). This way, any new talk added to the repository is automatically reflected on the website, without manual intervention. This makes it easy to keep the talks list up to date with changes, like a new talk or a new recording added to an existing talk.
