---
title: talks.soubiran.dev
ecosystem:
  - type: deployment
    id: talks-soubiran-dev
    name: Cloudflare Workers
    description: Deploy the website worldwide.
    ecosystem:
      - type: build
        id: talks-soubiran-dev
        name: Cloudflare Build
        description: Build the website automatically.
        ecosystem:
          - type: repository
            id: talks-soubiran-dev
            name: GitHub
            description: Source code of the website.
            href: https://github.com/barbapapazes/talks
            ecosystem:
              - type: stack
                name: Slidev
                href: https://sli.dev
  - type: object-storage
    id: talks-soubiran-dev
    name: Cloudflare R2
    description: Host PDFs of the talks.
  - type: domain
    name: Cloudflare Domains
    description: Manage the DNS records.
---
