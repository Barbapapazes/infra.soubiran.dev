---
id: eb77373d-1d0f-42c2-8714-6e7e05c3ad11
title: infra.soubiran.dev
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
