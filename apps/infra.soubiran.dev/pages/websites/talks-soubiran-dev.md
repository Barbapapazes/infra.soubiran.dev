---
title: talks.soubiran.dev
---

The website [talks.soubiran.dev](https://talks.soubiran.dev) contains all the talks I've given at conferences and meetups over the years.

The build output is an aggregation of all the Slidev builds. Under the hood, each talk generates a static site; all outputs are combined into a single directory and deployed as one website.

## Automation

The platform itself doesn't list talks. Instead, it generates a `meta.json` file with metadata for each talk that other websites and platforms can consume.

Currently, [soubiran.dev](./soubiran-dev.md) reads this file using a [virtual module](https://vite.dev/guide/api-plugin.html#virtual-modules-convention). Its content is injected into the dedicated page, [soubiran.dev/talks](https://soubiran.dev/talks), at build time, avoiding any client-side fetching.

To ensure soubiran.dev always has the latest talks, a GitHub Actions workflow triggers a redeployment, with a rebuild, on every push to the [talks repository](https://github.com/barbapapazes/talks). This way, any new talk added to the repository is automatically reflected on the website, without manual intervention.
