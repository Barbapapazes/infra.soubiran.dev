---
id: 31d1ccc9-a1e5-4fb5-b84a-736b91d8f360
title: calendar.soubiran.dev
description: >-
  The private calendar feed that turns scheduled LinkedIn Markdown into
  iCalendar events and serves them from R2 through a token-protected Worker.
url: 'https://calendar.soubiran.dev'
repository:
  url: 'https://github.com/barbapapazes/platform'
  private: true
ecosystem:
  - type: deployment
    id: calendar-soubiran-dev
    name: Cloudflare Workers
    description: Authorize calendar subscriptions and return the current iCalendar object.
    ecosystem:
      - type: repository
        id: calendar-soubiran-dev
        name: GitHub
        description: Host the private Worker and content-creation CLI source.
        href: 'https://github.com/barbapapazes/platform'
        ecosystem:
          - type: stack
            name: Wrangler
            description: Configure the custom domain and R2 binding, then deploy the Worker.
            href: 'https://developers.cloudflare.com/workers/wrangler/'
          - type: stack
            name: Evlog
            description: Record structured delivery events without recording the calendar token.
            href: 'https://evlog.dev'
      - type: object-storage
        name: Cloudflare R2
        description: Store the generated calendar under the fixed `content-creation.ics` key.
        ecosystem:
          - type: data
            name: LinkedIn iCalendar feed
            description: Hold the complete set of dated LinkedIn entries as all-day events.
            ecosystem:
              - type: build
                name: Content creation CLI
                description: Generate the complete feed and upload it to R2.
                ecosystem:
                  - type: data
                    name: LinkedIn Markdown
                    description: Supply dated publication state and metadata from the private content repository.
  - type: domain
    name: Cloudflare Domains
    description: Route `calendar.soubiran.dev` to the Worker.
---

[calendar.soubiran.dev](https://calendar.soubiran.dev) publishes my LinkedIn content schedule as a private iCalendar feed. A command in my content-creation CLI turns dated Markdown files into calendar events, uploads one `.ics` file to Cloudflare R2, and gives my calendar client a tokenized subscription URL.

The hostname is a delivery endpoint rather than a calendar interface. The Worker reads the generated file and returns it to authorized calendar clients. This keeps the private content repository outside the request path.

## Why I publish a complete calendar file

The schedule is a derived view of content I already manage as Markdown. Generating it during my publishing workflow means the Markdown remains the source of truth, while calendar applications receive a format they understand without gaining access to the repository.

I store the complete feed as one R2 object instead of rebuilding it on every request. The Worker does not scan directories, parse frontmatter, or assemble events. It only checks access and reads the current object. Replacing that object updates every subscriber without a Worker deployment.

This split fits internal feeds derived from files or another authoring system. Generation can use trusted local context, while delivery stays small and read-only.

## How Markdown becomes calendar events

The `linkedin publish-calendar` workflow runs through the content-creation CLI in the private `platform` monorepo. It scans the selected content directory for dated `YYYY/MM/DD` folders and reads each `linkedin.md` file. Frontmatter provides the title, theme, publication state, and planned media.

The generator sorts the entries by date and creates one all-day event for each file. Its summary combines the content title with a status such as `Not ready`, `To be recorded`, `To be published`, or `Published`. The description links back to the private source file and its local VS Code path, with theme and media details when present.

After serializing the events as iCalendar data, the CLI uploads the result to the `content-creation` R2 bucket under the fixed `content-creation.ics` key. It then prints the subscription URL with the configured calendar token. The calendar artifact changes independently of the Worker code because publication replaces the object directly.

## How private delivery works

The Calendar Worker exposes `GET` and `HEAD` requests for `/content-creation.ics`. It compares the `token` query parameter with a Worker secret through a timing-safe equality check, then reads the fixed object through its R2 binding. Invalid credentials never reach storage.

The response uses the `text/calendar` content type and disables shared caching with `private, no-store`. This boundary matters because event descriptions contain links into my private content repository and local editor paths. The token is a subscription credential, not part of the calendar data, and the Worker does not write it to structured logs.

Evlog records the requested route, whether a credential was present, the R2 object metadata, and the response result. These events show delivery failures without exposing the feed or its token.

## How it runs

The Calendar Worker and the content-creation CLI live in the private [`platform` repository](https://github.com/barbapapazes/platform). The Worker's Wrangler configuration maps `calendar.soubiran.dev` to the deployment, binds the `content-creation` R2 bucket, and enables Cloudflare observability. Its deployment command publishes the Worker with Wrangler.

Calendar publication follows a separate path. I run the CLI against the content repository when its LinkedIn schedule changes, and Wrangler uploads the generated object to remote R2. Existing calendar subscriptions read that new object on their next request, so a content update does not rebuild or redeploy the delivery service.
