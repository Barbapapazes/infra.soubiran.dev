---
title: infra.soubiran.dev
ecosystem:
  - type: deployment
    id: infra-soubiran-dev
    name: Cloudflare Workers
    description: Deploy the infrastructure worldwide.
    ecosystem:
      - type: build
        id: infra-soubiran-dev
        name: Cloudflare Build
        description: Build the infrastructure automatically.
        ecosystem:
          - type: repository
            id: infra.soubiran.dev
            name: GitHub
            description: Source code for the infrastructure.
            href: https://github.com/barbapapazes/infra.soubiran.dev
            ecosystem:
              - type: stack
                name: Vite
                href: https://vite.dev
              - type: stack
                name: Vue
                href: https://vuejs.org
  - type: object-storage
    id: infra-soubiran-dev
    name: Cloudflare R2
    description: Host public assets.
  - type: domain
    name: Cloudflare Domains
    description: Manage the DNS records.
  - type: realtime
    name: PartyKit
    description: Provide real-time viewer count.
---
