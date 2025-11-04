---
title: soubiran.dev
ecosystem:
  - type: deployment
    platform: Cloudflare Workers
    description: Deploy the website worldwide.
    ecosystem:
      - type: build
        platform: Cloudflare Build
        description: Build the website automatically.
        ecosystem:
          - type: repository
            platform: GitHub
            description: Source code for the website.
            href: https://github.com/barbapapazes/soubiran.dev
          - type: ci/cd
            platform: GitHub Actions
            description: Trigger a build every day.
          - type: data
            platform: talks.soubiran.dev
            description: Fetch talks data.
            href: /websites/talks-soubiran-dev
          - type: data
            platform: GitHub
            description: Fetch projects data.
            href: https://github.com/barbapapazes?tab=repositories
  - type: object-storage
    platform: Cloudflare R2
    description: Host videos.
  - type: domain
    platform: Cloudflare Domains
    description: Manage the DNS records.
---
