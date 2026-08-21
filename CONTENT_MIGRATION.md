# Existing content migration

This is the one-time plan for bringing the existing wiki in line with the [publication guide](./CONTENT_PUBLICATION.md). Use the [review checklist](./CONTENT_REVIEW.md) on every rewritten or new page.

## Target structure

The migration organizes the wiki into three product collections:

```text
src/app/pages/
├── websites/
│   ├── index.md
│   ├── code-soubiran-dev.md
│   ├── infra-soubiran-dev.md
│   ├── soubiran-dev.md
│   └── talks-soubiran-dev.md
├── services/
│   ├── index.md
│   ├── api-soubiran-dev.md
│   ├── automation-soubiran-dev.md
│   ├── mcp-soubiran-dev.md
│   └── redeploy-soubiran-dev.md
└── internal-tools/
    ├── index.md
    └── calendar-soubiran-dev.md
```

Collection pages remain card-only. Cards use alphabetical order. The ecosystem page remains an interactive map without explanatory articles or project cards.

## Page inventory

Preserve the `id` of an existing page when moving or rewriting it. Give each new page a unique UUID.

| Project | Action | Main work |
| --- | --- | --- |
| `code.soubiran.dev` | Create under Websites | Explain URL state, browser rendering, and the MCP route as one product. |
| `infra.soubiran.dev` | Rewrite under Websites | Explain Markdown routing, static generation, catalogs, validation, and the ecosystem graph. |
| `soubiran.dev` | Rewrite under Websites | Replace outdated notes and explain static content, build-time data, the API, PartyKit, and deployment triggers. |
| `talks.soubiran.dev` | Rewrite under Websites | Explain the Slidev monorepo, generated metadata, assets, and downstream website deployment. |
| `api.soubiran.dev` | Move to Services and rewrite | Explain Laravel-owned dynamic data, consumers, authentication boundaries, and deployment ordering. |
| `automation.soubiran.dev` | Move to Services and rewrite | Explain scheduled workflows and reminders without documenting its shared repository. |
| `mcp.soubiran.dev` | Keep under Services | Migrate the service collection while preserving its content contracts, retrieval, search, and Code Mode explanation. |
| `redeploy.soubiran.dev` | Create under Services | Explain deployment coordination, waiting behavior, deploy hooks, Workers, and Workflows. |
| `calendar.soubiran.dev` | Create under Internal tools | Explain calendar generation, private delivery, and the state it reads. |

Do not create an overview for a shared repository. Mention the Assets Worker only inside a product page when it helps explain that product. Keep PartyKit on the `soubiran.dev` page and the code-image MCP route on the `code.soubiran.dev` page.

## Remove obsolete content

- Remove stale `chat.soubiran.dev`, `eats.soubiran.dev`, and `preview.soubiran.dev` pages, routes, generated declarations, tests, and links.
- Remove links to retired projects instead of keeping archive pages.
- Remove draft files from `src/app/pages`. Drafts must not enter generated catalogs or deployments.
- Remove future plans and dated migration notes from retained pages. The wiki describes current production behavior.

## Migrate the site model

Update the implementation before publishing the migrated catalog:

- recognize `websites`, `services`, and `internal-tools` in route extraction;
- provide collection wrappers and card lists for all three categories;
- expose all three categories through generated API files;
- classify each page correctly in `pages.json`;
- generate article breadcrumbs for each category;
- include all three categories in ecosystem-link validation;
- include all three categories in the global ecosystem map;
- remove manual `href` values from ecosystem entries that represent documented products;
- update navigation and any category labels;
- update tests for routes, catalogs, metadata, cards, links, and Markdown output;
- regenerate route declarations only after the source pages have their final paths.

## Rewrite the pages

Handle one project at a time:

1. Read its source code, deployment configuration, workflows, and current wiki references.
2. Confirm its production URL, repository visibility, runtime, dependencies, consumers, and exchanged data.
3. Draft outside `src/app/pages` until the page is complete.
4. Follow the four-part narrative from the publication guide.
5. Add only short source excerpts that are clearer than prose.
6. Add or update ecosystem metadata and reciprocal wiki links.
7. Mark consumers with `relationship: consumer` and check that every ecosystem edge points from producer to consumer.
8. Complete the review checklist before moving the draft into its collection.

Rewrite shared Cloudflare or Laravel context on each page where readers need it. The pages must work when opened directly from search.

## Publish the migration

Publish the taxonomy and its pages together. Do not expose half-migrated categories, empty cards, temporary routes, or stubs.

Before merging:

- confirm that the catalog contains the nine intended pages and no others;
- confirm alphabetical card order in every collection;
- confirm that all internal project links resolve to the new routes;
- confirm that page subjects link to their public production URLs;
- confirm that ecosystem relationships match the prose and every consumer is marked explicitly;
- confirm that generated catalogs contain the expected category and metadata for every page;
- complete the review checklist for all nine pages;
- run the repository checks and production build.

Delete this migration guide once the migration is complete. The publication guide and review checklist remain the permanent rules.
