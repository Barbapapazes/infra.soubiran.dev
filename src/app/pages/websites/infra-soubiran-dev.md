---
id: eb77373d-1d0f-42c2-8714-6e7e05c3ad11
title: infra.soubiran.dev
description: >-
  The public wiki that documents my infrastructure and publishes the same
  content as HTML, Markdown, and machine-readable catalogs.
url: 'https://infra.soubiran.dev'
repository: 'https://github.com/barbapapazes/infra.soubiran.dev'
ecosystem:
  - type: deployment
    id: infra-soubiran-dev
    name: Cloudflare Workers
    description: Deploy this infrastructure website to Cloudflare's edge worldwide.
    ecosystem:
      - type: build
        id: infra-soubiran-dev
        name: Cloudflare Build
        description: Build and deploy the Vite app automatically.
        ecosystem:
          - type: repository
            id: infra.soubiran.dev
            name: GitHub
            description: Host the source code, content, and deployment configuration for this website.
            href: 'https://github.com/barbapapazes/infra.soubiran.dev'
            ecosystem:
              - type: stack
                name: Vite
                href: 'https://vite.dev'
              - type: stack
                name: Vue
                href: 'https://vuejs.org'
              - type: ci/cd
                relationship: consumer
                name: GitHub Actions
                description: React to a push on `main` after the documentation changes.
                ecosystem:
                  - type: service
                    relationship: consumer
                    name: redeploy.soubiran.dev
                    description: Coordinate the API deployment after this website is online.
  - type: data
    relationship: consumer
    name: meta.json
    description: Publish stable page IDs, URLs, titles, and descriptions.
    ecosystem:
      - type: service
        relationship: consumer
        name: api.soubiran.dev
        description: Import page metadata during each API deployment.
  - type: data
    relationship: consumer
    name: MCP catalog and documents
    description: Publish `pages.json` and sanitized Markdown pages.
    ecosystem:
      - type: service
        relationship: consumer
        name: mcp.soubiran.dev
        description: Expose the wiki content to MCP clients.
  - type: object-storage
    id: infra-soubiran-dev
    name: Cloudflare R2
    description: Store this website's public assets.
  - type: domain
    name: Cloudflare Domains
    description: Manage the DNS records that route `infra.soubiran.dev` to this website.
  - type: realtime
    name: PartyKit
    description: Power the live viewer count shown on this website and across the rest of my ecosystem.
---

[infra.soubiran.dev](https://infra.soubiran.dev) documents the production environment behind my websites and services. It is written for developers who want to see how the projects connect and why I chose each part of the architecture.

The website also publishes its content in formats consumed by [api.soubiran.dev](/services/api-soubiran-dev) and [mcp.soubiran.dev](/services/mcp-soubiran-dev). The wiki is both documentation and a source of structured data for the rest of the ecosystem.

## Why a static wiki

The content changes when my production environment changes, not for each visitor. I use Vue, Vite, and Vite SSG to generate the complete website during the build. Cloudflare then serves static files instead of rendering pages for every request.

Each project is a Markdown file with frontmatter that describes its public URL, repository, and relationships with the rest of the ecosystem. The prose and structured metadata stay together, so a change to a project only needs one source update.

This setup fits public technical documentation maintained in Git. It gives me reviewable content changes, repeatable builds, and predictable files that other services can consume.

## One source, several outputs

The build turns every Markdown page into several public outputs:

- HTML is the documentation developers browse.
- Sanitized Markdown gives [mcp.soubiran.dev](/services/mcp-soubiran-dev) clean content to return to its clients.
- `pages.json` tells the MCP server which pages exist and where it can fetch them.
- `meta.json` gives [api.soubiran.dev](/services/api-soubiran-dev) stable IDs, URLs, titles, and descriptions to synchronize.

This contract lets each consumer use the format it needs without adding an application server to the wiki. A browser gets rendered pages, the MCP server gets the original content, and the API gets the metadata it needs to reference each page.

The ecosystem graph comes from the same frontmatter. Each page records the services, deployments, and data involved in that project. Build-time checks reject links to missing project pages, which keeps the documentation connected as the production environment changes.

## Publication and deployment

Cloudflare Builds generates the website after a change reaches `main`, then deploys it as Workers Static Assets. Public images and generated Open Graph images are stored in Cloudflare R2 and uploaded with rclone.

The same push asks [redeploy.soubiran.dev](/services/redeploy-soubiran-dev) to redeploy the API. It waits until the new wiki deployment is online before calling the API deploy hook. During that deployment, [api.soubiran.dev](/services/api-soubiran-dev) imports the new `meta.json`. The ordering prevents the API from synchronizing against the previous version of the documentation.
