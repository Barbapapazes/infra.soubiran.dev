---
title: soubiran.dev
ecosystem:
  - type: deployment
    platform: Cloudflare Workers
    ecosystem:
      - type: build
        platform: Cloudflare Build
        ecosystem:
        - type: repository
          platform: GitHub
          url: https://github.com/barbapapzes/soubiran.dev
        - type: ci/cd
          platform: GitHub Actions
        - type: data
          platform: talks.soubiran.dev
        - type: data
          platform: GitHub
  - type: object-storage
    platform: Cloudflare R2
  - type: domain
    platform: Cloudflare Domains
---
