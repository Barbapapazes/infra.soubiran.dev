---
title: soubiran.dev
ecosystem:
  - type: deployment
    id: soubiran-dev
    name: Cloudflare Workers
    description: Deploy the website worldwide.
    ecosystem:
      - type: build
        id: soubiran-dev
        name: Cloudflare Build
        description: Build the website automatically.
        ecosystem:
          - type: repository
            id: soubiran.dev
            name: GitHub
            description: Source code for the website.
            href: https://github.com/barbapapazes/soubiran.dev
            ecosystem:
              - type: stack
                name: VitePress
                href: https://vitepress.dev
              - type: stack
                name: Pinia Colada
                href: https://pinia-colada.esm.dev
          - type: ci/cd
            name: GitHub Actions
            description: Trigger a build every day.
          - type: data
            name: talks.soubiran.dev
            description: Fetch talks data.
            href: /websites/talks-soubiran-dev
          - type: data
            id: projects
            name: GitHub
            description: Fetch projects data.
            href: https://github.com/barbapapazes?tab=repositories
  - type: object-storage
    id: soubiran-dev
    name: Cloudflare R2
    description: Host videos.
  - type: domain
    name: Cloudflare Domains
    description: Manage the DNS records.
  - type: realtime
    name: PartyKit
    description: Provide real-time viewer count.
---
