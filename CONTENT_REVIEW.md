# Page review checklist

Use this checklist after following the [page publication guide](./CONTENT_PUBLICATION.md). Publish the page only when every relevant item passes.

## Scope

- [ ] The page documents a current, stable project.
- [ ] An experienced web developer can read it within 5 to 8 minutes and understand more about my production environment.
- [ ] The page is not padded to reach a target length.
- [ ] The page explains this project, not the tools in general.
- [ ] It contains no setup tutorial, speculative plan, retired behavior, secret, or sensitive value.
- [ ] It is complete. There are no placeholders or "coming soon" sections.
- [ ] Every detail explains a production choice, a project connection, or an approach the reader could reuse.
- [ ] Numeric limits appear only when their exact values explain an architectural choice or security boundary.

## Content

- [ ] The opening states what the project does and where it fits in the ecosystem.
- [ ] It explains why I chose this architecture and when the same approach is useful.
- [ ] It names alternatives only if I considered them at the time.
- [ ] It identifies dependencies, consumers, and the data exchanged between them.
- [ ] Important frameworks and libraries appear as `stack` entries in the ecosystem frontmatter, without a technology-stack section in the prose.
- [ ] Acorn, `ofetch`, TypeScript, and Zod remain implementation details and do not appear as `stack` entries.
- [ ] It explains the main flow without relying on a data-flow diagram.
- [ ] Any code or configuration excerpt is necessary, short, and linked to its source.
- [ ] Deployment and automation are clear, including cross-project triggers and ordering.
- [ ] Access, security, storage, and observability appear only when they affect the architecture.
- [ ] The page describes what the project uses, not what it lacks.
- [ ] Minor UI behavior and internal implementation details are absent unless they change the production architecture.

The page may use its own headings, but its narrative should answer four questions in this order:

1. What is it?
2. Why this approach?
3. How does it work?
4. How does it run?

## Accuracy

- [ ] The frontmatter contains a unique ID, title, description, production URL, and repository.
- [ ] Every technical claim matches the current source code and production configuration.
- [ ] Project names, URLs, repository links, and internal wiki links are correct.
- [ ] Every website, service, or internal tool named in the article links to its internal wiki route.
- [ ] The page distinguishes build-time behavior from runtime behavior.
- [ ] Ecosystem consumers set `relationship: consumer`. Producers omit the field or set `relationship: producer`.
- [ ] Each ecosystem edge points from producer to consumer.
- [ ] Event-driven automation is nested under the repository, schedule, webhook, or service that triggers it.
- [ ] Generated artifacts consume their source project, and services that read those artifacts consume the data node.
- [ ] Documented ecosystem projects use their product type instead of a manual `href`.

## Writing

- [ ] I use first person for my decisions and active voice for technical behavior.
- [ ] Each paragraph makes one concrete point about this project.
- [ ] I replace vague claims with named components, actions, files, or data.
- [ ] I introduce project-specific components by name and explain their job before using a shorter label.
- [ ] I remove generic sentences that could appear unchanged in another project's documentation.
- [ ] I use plain words such as "use" and "is" instead of inflated alternatives.
- [ ] I remove puffery, promotional language, filler, vague attribution, and generic conclusions.
- [ ] I remove chatbot phrases, vague disclaimers, tired AI vocabulary, and abstract technical metaphors.
- [ ] I cut needless hedging, adverbs, and clauses that end in `-ing` without adding a concrete fact.
- [ ] I avoid forced groups of three, false ranges, synonym cycling, and stock contrast formulas.
- [ ] Headings use sentence case. Bold text is rare. Decorative emoji and curly quotes are absent.
- [ ] I use no em dashes. Colons introduce real lists or examples, not ordinary sentences.
- [ ] Sentences vary in length, and none require a second reading to parse.

## Final pass

- [ ] I read the page aloud and cut anything slow, repetitive, or awkward.
- [ ] I can summarize the project's role and main architectural choice after one reading.
- [ ] A developer can follow every production connection without opening the source repository.
