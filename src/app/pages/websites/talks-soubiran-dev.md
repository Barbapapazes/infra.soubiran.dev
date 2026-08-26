---
id: a1a1a745-8ba1-47a9-9b02-9ed1f55fd3a8
title: talks.soubiran.dev
description: >-
  The static archive that publishes my Slidev decks, talk metadata, and
  resources consumed by my website and MCP server.
url: 'https://talks.soubiran.dev'
repository: 'https://github.com/barbapapazes/talks'
ecosystem:
  - type: deployment
    id: talks-soubiran-dev
    name: Cloudflare Workers
    description: Serve the compiled decks, thumbnails, redirects, and catalogs as static assets.
    ecosystem:
      - type: build
        id: talks-soubiran-dev
        name: Cloudflare Build
        description: Build every Slidev workspace and deploy the combined output.
        ecosystem:
          - type: repository
            id: talks.soubiran.dev
            name: GitHub
            description: Host the public monorepo, its decks, shared theme, and generation scripts.
            href: 'https://github.com/barbapapazes/talks'
            ecosystem:
              - type: stack
                name: Slidev
                href: 'https://sli.dev'
              - type: ci/cd
                relationship: consumer
                name: GitHub Actions
                description: Check each change and react to pushes on `main`.
                ecosystem:
                  - type: service
                    relationship: consumer
                    name: redeploy.soubiran.dev
                    description: Wait for this Worker deployment, then invoke the personal website deploy hook.
                    ecosystem:
                      - type: website
                        relationship: consumer
                        name: soubiran.dev
                        description: Rebuild with the newly published talk metadata.
  - type: data
    relationship: consumer
    name: Talk metadata
    description: Publish `meta.json` with talk details, resource links, and aggregate statistics.
    ecosystem:
      - type: website
        relationship: consumer
        name: soubiran.dev
        description: Build the public talk index and transcript pages from this metadata.
  - type: data
    relationship: consumer
    name: MCP catalog and transcripts
    description: Publish `talks.json` and available Markdown transcripts.
    ecosystem:
      - type: service
        relationship: consumer
        name: mcp.soubiran.dev
        description: List talks and retrieve their transcripts for MCP clients.
  - type: object-storage
    name: PDF and audio storage
    description: Serve manually published talk exports through dedicated asset domains.
  - type: domain
    name: Cloudflare Domains
    description: Manage the DNS records that route `talks.soubiran.dev` to the archive.
---

[talks.soubiran.dev](https://talks.soubiran.dev) is the static archive for the talks I give at conferences and meetups. It publishes each Slidev deck at a stable URL along with its source, thumbnails, PDF, and optional recording resources. The root redirects readers to the talk index on [soubiran.dev](/websites/soubiran-dev).

The archive also acts as a content source. My personal website builds its talk pages from the published metadata, while [mcp.soubiran.dev](/services/mcp-soubiran-dev) uses a separate catalog and the available transcripts.

## Why each appearance has its own workspace

I keep the talks in a public pnpm monorepo. Each dated directory contains an independent Slidev project for one event appearance. When I give a talk again, I copy it into a new directory instead of making the old event URL point to changing slides.

This keeps event-specific edits and resources attached to the version that the audience saw. The workspace still shares dependency versions, root commands, and one local Slidev theme, so a visual or tooling change does not need to be maintained in every deck.

The pattern fits a collection whose entries need stable histories and URLs but use the same presentation system. The [source repository](https://github.com/barbapapazes/talks) remains the place to inspect a deck or reuse its code.

## How decks become a catalog

Each talk splits its metadata between two sources. Its `package.json` records the event, location, description, and optional recording or article. The frontmatter in `slides.md` supplies the title, language, and topics. A generation script reads both files and gives every appearance a date-based ID and public resource URLs.

The root build compiles every Slidev workspace into one `dist` directory, then adds redirects and two JSON files:

- `meta.json` contains the display data, resource links, and statistics used when [soubiran.dev](/websites/soubiran-dev) builds its talk index and transcript pages.
- `talks.json` is a versioned content catalog with stable IDs, topics, event details, and links. [mcp.soubiran.dev](/services/mcp-soubiran-dev) validates this file before it lists talks or retrieves a transcript.

Thumbnails and PDFs follow a separate authoring step. The thumbnail scripts copy light and dark images into each deck's public directory, so the next Slidev build includes them. PDF exports and audio files are copied to dedicated asset hosts. Generated redirects keep `/pdf`, `/audio`, `/recording`, `/transcript`, `/article`, and `/src` links consistent even though those resources come from different places.

## How publication stays ordered

GitHub Actions builds the complete archive, lints the repository, and tests the shared theme. Cloudflare Builds runs the production build and deploys `dist` through Workers Static Assets.

A push to `main` also sends an authenticated request to [redeploy.soubiran.dev](/services/redeploy-soubiran-dev). This Cloudflare Worker starts a Cloudflare Workflow with the Talks Worker name and the deploy hook for [soubiran.dev](/websites/soubiran-dev). The Workflow checks Cloudflare until the latest successful Talks build is the version running in production, then calls the deploy hook. The new personal website build can now fetch the matching `meta.json`. Without this ordering, it could fetch the previous catalog and need another deployment before a new talk appeared.

Decks, catalogs, and transcripts are public. The redeployment endpoint is not. The workflow sends Cloudflare Access service credentials from GitHub Actions secrets, which keeps deployment control separate from the public archive.
