---
title: talks.soubiran.dev
ecosystem:
  - type: deployment
    name: talks-soubiran-dev
    platform: Cloudflare Workers
    description: Deploy the website worldwide.
    ecosystem:
      - type: build
        name: talks-soubiran-dev
        platform: Cloudflare Build
        description: Build the website automatically.
        ecosystem:
          - type: repository
            name: talks-soubiran-dev
            platform: GitHub
            description: Source code of the website.
            href: https://github.com/barbapapazes/talks
            ecosystem:
              - type: stack
                platform: Slidev
                href: https://sli.dev
  - type: object-storage
    name: talks-soubiran-dev
    platform: Cloudflare R2
    description: Host PDFs of the talks.
  - type: domain
    platform: Cloudflare Domains
    description: Manage the DNS records.
---
