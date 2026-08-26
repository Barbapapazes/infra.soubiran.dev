---
id: cf208554-4904-4184-8ddb-05a8201c4347
title: mcp.soubiran.dev
description: >-
  The MCP server that lets assistants search, list, and retrieve content from
  my website, talks, and infrastructure wiki.
url: 'https://mcp.soubiran.dev/mcp'
repository: 'https://github.com/barbapapazes/mcp.soubiran.dev'
ecosystem:
  - type: deployment
    id: mcp-soubiran-dev
    name: Cloudflare Workers
    description: Run the public MCP endpoint.
    ecosystem:
      - type: repository
        id: mcp.soubiran.dev
        name: GitHub
        description: Host the Worker source and deployment configuration.
        href: 'https://github.com/barbapapazes/mcp.soubiran.dev'
        ecosystem:
          - type: stack
            name: Model Context Protocol SDK
            description: Define the MCP server, tool contracts, and protocol responses.
            href: 'https://modelcontextprotocol.io'
          - type: stack
            name: Cloudflare Agents
            description: Expose the MCP server through the Worker's `/mcp` endpoint.
            href: 'https://developers.cloudflare.com/agents/'
          - type: stack
            name: better-result
            description: Distinguish client, content, upstream, and execution errors.
          - type: stack
            name: Sentry
            description: Capture exceptions from requests and tool execution.
            href: 'https://sentry.io'
          - type: stack
            name: Evlog
            description: Record structured request and tool telemetry with content redaction.
            href: 'https://evlog.dev'
      - type: data
        name: Cloudflare AI Search
        description: Return ranked content excerpts for `search_content`.
      - type: workflows
        name: Cloudflare Dynamic Workers
        description: Run `list_content` queries in temporary Workers isolated from the MCP Worker.
  - type: data
    name: Website catalog and pages
    description: Supply `pages.json` and complete Markdown documents.
    ecosystem:
      - type: website
        name: soubiran.dev
        description: Publish pages, posts, series, and episodes.
  - type: data
    name: Talk catalog and transcripts
    description: Supply `talks.json` and available Markdown transcripts.
    ecosystem:
      - type: website
        name: talks.soubiran.dev
        description: Publish talks and their related resources.
  - type: data
    name: Infrastructure catalog and pages
    description: Supply `pages.json` and complete Markdown documents.
    ecosystem:
      - type: website
        name: infra.soubiran.dev
        description: Publish infrastructure documentation.
---

[mcp.soubiran.dev](https://mcp.soubiran.dev/mcp) is the MCP endpoint for my public content. It lets assistants search, query, and retrieve content from [soubiran.dev](/websites/soubiran-dev), [talks.soubiran.dev](/websites/talks-soubiran-dev), and [infra.soubiran.dev](/websites/infra-soubiran-dev).

The service connects content that is already published by those websites. Each website remains the source of its own catalog and documents, while the MCP gives clients one interface across all three.

## Why catalogs stay with each website

Each website generates a JSON catalog during its build. The catalog contains stable IDs, canonical URLs, and the metadata needed to discover its documents. The MCP fetches these catalogs and validates them before using their data.

This keeps publication and discovery tied together. A website deploys its content and catalog as one version, then the MCP reads that public version. Adding another content source requires a catalog adapter, a document retrieval rule, and a corresponding search index.

This approach fits public, read-only content spread across several static websites. It keeps the MCP focused on discovery and retrieval instead of turning it into another content store.

## How the three tools work

The server exposes three tools:

- `search_content` performs a semantic search with Cloudflare AI Search. It matches each result with the corresponding catalog entry, then returns an excerpt, category, score, and stable content ID.
- `get_content` resolves one stable ID across the three catalogs and fetches the complete Markdown page or talk transcript from its source website.
- `list_content` runs a read-only JavaScript query against the complete catalogs. It handles questions that are easier to express as code, such as listing recent posts or filtering talks by topic.

`search_content` and `list_content` return stable IDs that `get_content` can resolve. It rejects duplicate IDs across catalogs rather than choosing one result, so a new source cannot silently change which document an existing ID returns.

## Code Mode without broad access

`list_content` follows the Code Mode pattern. The client sends one asynchronous JavaScript function, and the server runs it against frozen copies of the three catalogs in a temporary Worker.

The temporary Worker cannot access the network, secrets, storage, or bindings. It receives frozen catalogs and returns JSON to the MCP Worker. This boundary supports filtering and aggregation without giving generated code access to the MCP Worker or the source websites.

Catalog questions vary widely. One constrained query tool avoids a growing set of narrow tools and reduces the result before it enters the model context.

## Deployment and observability

The MCP runs on Cloudflare Workers and is deployed with Wrangler. Cloudflare AI Search provides semantic results, while Worker Loader creates the isolated Workers used by `list_content`.

Cloudflare records logs and sampled traces. Sentry captures exceptions, and Evlog records tool outcomes, durations, selected upstream timings, and result sizes. Queries, content, excerpts, authorization headers, and cookies are redacted from those logs.
