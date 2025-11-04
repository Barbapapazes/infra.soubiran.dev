---
title: soubiran.dev
ecosystem:
  - type: deployment
    name: soubiran-dev
    platform: Cloudflare Workers
    description: Deploy the website worldwide.
    ecosystem:
      - type: build
        name: soubiran-dev
        platform: Cloudflare Build
        description: Build the website automatically.
        ecosystem:
          - type: repository
            name: soubiran.dev
            platform: GitHub
            description: Source code for the website.
            href: https://github.com/barbapapazes/soubiran.dev
            ecosystem:
              - type: stack
                platform: VitePress
                href: https://vitepress.dev
              - type: stack
                platform: Pinia Colada
                href: https://pinia-colada.esm.dev
          - type: ci/cd
            platform: GitHub Actions
            description: Trigger a build every day.
          - type: data
            platform: talks.soubiran.dev
            description: Fetch talks data.
            href: /websites/talks-soubiran-dev
          - type: data
            name: projects
            platform: GitHub
            description: Fetch projects data.
            href: https://github.com/barbapapazes?tab=repositories
  - type: object-storage
    name: soubiran-dev
    platform: Cloudflare R2
    description: Host videos.
  - type: domain
    platform: Cloudflare Domains
    description: Manage the DNS records.
---

<!-- missing partykit in the schema -->
