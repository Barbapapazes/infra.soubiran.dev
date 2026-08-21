# Page publication guide

Use this guide before writing a project page. After writing it, complete the [page review checklist](./CONTENT_REVIEW.md).

## Editorial contract

The wiki is for experienced web developers who want to understand my production environment. It explains how my projects connect, how each one works, why I chose its architecture, and when that approach fits another project.

The catalog is the main entry point. Each page must also make sense when opened directly from search.

Document current, stable production behavior. Keep the happy path and the architectural decisions. Leave out:

- local setup tutorials and exhaustive file tours;
- public drafts, speculative plans, placeholders, and unfinished systems;
- runbooks, failure analysis, recovery procedures, costs, backups, and known weaknesses;
- generic documentation for Cloudflare, Laravel, GitHub Actions, or another dependency;
- secrets, sensitive values, and details that weaken a security boundary.

Keep a detail only if it helps a reader understand a production choice, a connection between projects, or an approach they could reuse. Skip repository bookkeeping, minor UI behavior, incidental dependencies, and lists of technologies the project does not use.

Identify the dependencies that another developer needs to recognize from the source and dependency manifest. Add them as `stack` entries in the ecosystem frontmatter instead of creating a technology-stack section. Leave out implementation utilities that do not explain the product.

Name each project-specific component or service on first reference and explain its job, inputs, and output. Do not rely on labels such as "the coordinator" or "the service" before establishing what they refer to.

Omit quotas, timeouts, payload sizes, and other operational numbers unless the exact value explains an architectural choice or security boundary. Describe the mechanism and its effect instead.

## Decide whether to create a page

A page represents a product with a distinct role in the ecosystem. It does not represent every repository or deployment.

- Keep related deployables on the product page. PartyKit belongs to `soubiran.dev`. The MCP route belongs to `code.soubiran.dev`.
- Explain small support components inside the product that gives them meaning. The Assets Worker does not need its own page.
- Do not create a page for a shared repository. Document the products it contains instead.
- Explain third-party tools inside the project that uses them. Do not create provider or library pages.
- Do not publish a stub. Draft outside `src/app/pages` so it cannot reach the generated catalog or a deployment.
- Remove a retired project and its links. Do not keep an archive page.

## Catalog

The catalog contains nine project pages. Cards are ordered alphabetically within each category.

| Category | Project | Main teaching angle |
| --- | --- | --- |
| Websites | `code.soubiran.dev` | URL-based state, browser rendering, and MCP integration |
| Websites | `infra.soubiran.dev` | Markdown SSG, generated catalogs, validation, and the ecosystem graph |
| Websites | `soubiran.dev` | Static content with API-backed and realtime features |
| Websites | `talks.soubiran.dev` | Slidev monorepo, metadata generation, and asset publishing |
| Services | `api.soubiran.dev` | Laravel-owned dynamic data and deployment ordering |
| Services | `automation.soubiran.dev` | Scheduled workflows and reminders |
| Services | `mcp.soubiran.dev` | Content contracts, retrieval, search, and MCP tools |
| Services | `redeploy.soubiran.dev` | Deployment coordination with Workers and Workflows |
| Internal tools | `calendar.soubiran.dev` | Calendar generation and private delivery |

Category pages contain cards only. The global ecosystem page contains the interactive map only.

## Prepare the page

Before drafting:

1. Read the current source code, deployment configuration, and relevant workflows.
2. Confirm the production behavior, dependencies, consumers, and exchanged data.
3. Write one sentence for the project's job and one for its main architectural choice.
4. Trace a normal request, job, build, or publication flow from entry to result.
5. List every related wiki page that needs a link to or from the new page.

Repeat enough shared Cloudflare or Laravel context for the page to stand alone. Do not make readers open another project page to understand the basic flow.

## Shape the page

Keep the page within a 5 to 8 minute read. A simple project should be shorter. Never add detail to reach a target length. Keep this sequence, but merge or rename headings when the project needs a simpler narrative.

### What it is

Open with two or three sentences that state what the project does and where it fits in the production environment. Address developers directly when describing what they can learn from it.

### Why this approach

Explain the constraints, the architecture you chose, and when the same approach is useful. Name alternatives only if you considered them at the time.

### How it works

Identify the dependencies, consumers, and exchanged data that explain the architecture. Describe the flow in prose. Do not use the `Dataflow` component until its design has been reworked.

Use a short code or configuration excerpt only when prose would be less precise. Link it to its current source. Add dedicated runtime or data sections only for complex projects.

### How it runs

Explain the build, deployment, automation, cross-project triggers, and required ordering. Cover access, security, storage, and observability only when they change how readers should understand the architecture.

Describe what runs in production and why. Do not list databases, queues, bindings, services, or tools that the project does not use.

## Add the page to the site

- Use a lowercase kebab-case filename under the correct collection.
- Add a unique UUID in `id`.
- Add `title`, `description`, `url`, and `repository` frontmatter.
- Use the object form of `repository` when its `private` state must be recorded.
- Add `ecosystem` data so the project and its relationships appear on the global map.
- Link the page subject to its public `url` in the body.
- Link every website, service, or internal tool named in the article to its wiki page.
- Set `relationship: consumer` when an ecosystem element consumes its parent. Omit `relationship` for producers, which are the default.
- Nest each element under the project or resource it produces for or consumes. The graph uses `relationship` to choose the edge direction.
- Nest event-driven automation under its event source. For example, a workflow triggered by a repository push is a consumer of that repository.
- Treat generated artifacts as consumers of their source project. Nest each service that reads those artifacts beneath the data node as another consumer.
- Mark documented projects with their `website`, `service`, or `internal-tool` type. Let the ecosystem component derive their wiki route instead of setting `href` by hand.
- Add screenshots only when they explain something the prose cannot show as clearly. Write useful alt text.

Before publication, update affected project links, complete [the review checklist](./CONTENT_REVIEW.md), and run the repository checks and production build.
