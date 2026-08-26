---
id: 2e9e7543-2215-49a6-b37d-a531f779b2da
title: code.soubiran.dev
description: >-
  The browser editor and public MCP endpoint that turn URL-based editor state
  into syntax-highlighted PNG images.
url: 'https://code.soubiran.dev'
repository: 'https://github.com/barbapapazes/code.soubiran.dev'
ecosystem:
  - type: deployment
    id: code-soubiran-dev
    name: Cloudflare Workers
    description: Serve the browser app and handle the public `/mcp` endpoint.
    ecosystem:
      - type: repository
        id: code.soubiran.dev
        name: GitHub
        description: Host the editor, Worker, shared image contract, and deployment configuration.
        href: 'https://github.com/barbapapazes/code.soubiran.dev'
        ecosystem:
          - type: stack
            name: Vite
            description: Build the browser app and Worker from one project.
            href: 'https://vite.dev'
          - type: stack
            name: Vue
            description: Bind the editor controls to URL search parameters.
            href: 'https://vuejs.org'
          - type: stack
            name: Nuxt UI
            description: Provide the editor controls and visual components.
            href: 'https://ui.nuxt.com'
          - type: stack
            name: Shiki
            description: Render the syntax-highlighted code layer in the browser.
            href: 'https://shiki.style'
          - type: stack
            name: modern-screenshot
            description: Capture the rendered editor element as a PNG in the browser.
            href: 'https://github.com/qq15725/modern-screenshot'
          - type: stack
            name: Model Context Protocol SDK
            description: Define the image-generation tool and its image response.
            href: 'https://modelcontextprotocol.io'
          - type: stack
            name: Cloudflare Agents
            description: Expose the MCP server through the Worker's `/mcp` route.
            href: 'https://developers.cloudflare.com/agents/'
          - type: stack
            name: Evlog
            description: Record structured MCP tool telemetry without logging image content.
            href: 'https://evlog.dev'
          - type: ci/cd
            relationship: consumer
            name: GitHub Actions
            description: Lint, build, type-check, and test changes pushed to the repository.
      - type: stack
        name: Cloudflare Browser Run
        description: Load a URL that describes an image and capture its rendered editor element.
        href: 'https://developers.cloudflare.com/browser-rendering/'
  - type: domain
    name: Cloudflare Domains
    description: Route `code.soubiran.dev` to the Worker deployment.
---

[code.soubiran.dev](https://code.soubiran.dev) turns source code into syntax-highlighted PNG images. It combines a browser editor for people with a public MCP endpoint for assistants, and both paths use the same page to render the final image.

The browser exposes URL-backed controls for the code, language, canvas size, gradient, title, and watermark before downloading the result. An MCP client can send those fields to `https://code.soubiran.dev/mcp` and receive the PNG as image content.

## Why the URL holds the editor state

I wanted shared links and automated captures to reproduce the same image without storing documents on a server. The app therefore keeps its editor state in URL search parameters. It encodes the source code as Base64 over UTF-8 bytes and stores the other options as plain parameter values.

This URL is the contract between the two ways to use the product. Opening it reconstructs the editor in a browser. The MCP Worker can build the same URL from tool arguments and pass it to a remote browser without maintaining a second rendering implementation.

The approach fits a small rendering tool whose state can travel with the link and does not need persistence. Base64 turns the UTF-8 source bytes into text that the query parameter can carry. It does not encrypt them, so these URLs are not intended for secrets.

## How the browser creates an image

The Vue app reads the URL when it starts. Each URL-backed control writes its new value back to the query string, while empty and default values stay out of the URL where possible. Copying the current address is enough to preserve the image configuration.

The editor renders two aligned layers. Shiki produces highlighted HTML underneath a transparent textarea, so users edit normal text while seeing highlighted code. A wrapper around the editor, title, background, and watermark marks the exact DOM element used for capture.

When the user selects Capture, `modern-screenshot` converts that element into a PNG data URL and the browser downloads it. This capture path does not call the Worker or an image-generation API.

## How the MCP route reuses the page

The Cloudflare Worker handles `/mcp` and exposes one tool, `generate_code_image`. Its input uses the URL-backed image fields: code, language, size, gradient, title, and watermark.

For each call, the Worker validates the arguments and creates a `code.soubiran.dev` URL. It omits options that match the defaults and uses the same Base64 encoder as the browser for source code. The Worker then asks Cloudflare Browser Run to open that public URL, wait for the marked editor element, and capture it as a PNG.

Browser Run returns the image bytes to the Worker. The MCP response carries those bytes as Base64-encoded image content with its MIME type. Reusing the public page keeps browser downloads and MCP results on the same Vue, Shiki, and CSS rendering path.

The MCP endpoint is public, but its Browser Run credentials remain in Worker environment bindings. Tool logs record option choices, source length, outcome, duration, and image metadata without recording the source code, title, or watermark.

## How it runs

Vite builds the Vue app and the Worker from the [same repository](https://github.com/barbapapazes/code.soubiran.dev). Cloudflare Workers Static Assets serves the app, while the asset configuration sends `/mcp` to the Worker before applying the single-page application fallback. The editor and its automation endpoint therefore share one deployment and one domain.

The deployment command builds the project before Wrangler publishes it. GitHub Actions checks pushes and pull requests with linting, a production build, type checking, and tests. Cloudflare logs and traces cover Worker requests, including MCP tool outcomes.
