---
title: infra.soubiran.dev
ecosystem:
  - type: deployment
    name: infra-soubiran-dev
    platform: Cloudflare Workers
    description: Deploy the infrastructure worldwide.
    ecosystem:
      - type: build
        name: infra-soubiran-dev
        platform: Cloudflare Build
        description: Build the infrastructure automatically.
        ecosystem:
          - type: repository
            name: infra.soubiran.dev
            platform: GitHub
            description: Source code for the infrastructure.
            href: https://github.com/barbapapazes/infra.soubiran.dev
            ecosystem:
              - type: stack
                platform: Vite
                href: https://vite.dev
              - type: stack
                platform: Vue
                href: https://vuejs.org
  - type: object-storage
    name: infra-soubiran-dev
    platform: Cloudflare R2
    description: Host public assets.
  - type: domain
    platform: Cloudflare Domains
    description: Manage the DNS records.
---

<!-- missing partykit in the schema -->
