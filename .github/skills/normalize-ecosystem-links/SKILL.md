---
name: normalize-ecosystem-links
description: 'Use when editing Markdown or content pages to normalize links and URLs across the soubiran.dev ecosystem: current page subject uses its real absolute public URL, other ecosystem websites and platforms use internal documentation page links.'
argument-hint: 'Target file(s) or section, plus the current website or platform if it is not obvious from the file name'
---

# Normalize Ecosystem Links

## When to Use

Use this skill when editing Markdown content that references websites or platforms from the `soubiran.dev` ecosystem and link targets need to be made consistent.

Typical triggers:
- Normalize links in `pages/**/*.md`
- Replace incorrect public URLs with internal documentation page links
- Fix self-references so the current page subject points to its real deployed website
- Review content after copyediting to make sure link targets follow the project convention
- Standardize references between website pages and platform pages in the ecosystem

## What This Skill Produces

The revised content should:
- Keep the intended meaning and navigation purpose of each link
- Use the real absolute public URL for the page's own subject
- Use internal documentation page routes for other websites or platforms from the same ecosystem
- Keep canonical frontmatter website URLs absolute when they represent a real deployed site
- Keep repository URLs external
- Leave non-ecosystem links untouched unless they are clearly wrong
- Preserve Markdown structure, frontmatter, code, and formatting

## Procedure

1. Identify the current page subject.
   - Determine which website or platform the file is primarily describing.
   - Use the file name, title, frontmatter `url`, and opening paragraph to confirm the subject.
   - Treat that subject as the only ecosystem site that should usually appear with its real absolute public URL in prose.

2. Inventory ecosystem references.
   - Scan the full file for Markdown links, bare URLs, and frontmatter URL fields.
   - Separate links into four groups:
     - current subject
     - other `soubiran.dev` ecosystem websites or platforms
     - repository links
     - external non-ecosystem links

3. Normalize links for the current subject.
   - In prose, use the real deployed absolute URL for the current subject.
   - Example in `news-soubiran-dev.md`: use `[news.soubiran.dev](https://news.soubiran.dev)`.
   - Example in `quick-news-soubiran-dev.md`: use `[quick-news.soubiran.dev](https://quick-news.soubiran.dev)`.

4. Normalize links for the rest of the ecosystem.
   - For other websites or platforms from the same ecosystem, use the internal documentation page route.
   - Prefer routes such as `/websites/news-soubiran-dev` or `/platforms/quick-news-soubiran-dev`.
   - Keep these links internal even when the public website exists, because the goal is cross-navigation inside the infrastructure documentation.

5. Preserve structured URLs correctly.
   - Keep frontmatter `url` fields absolute when they represent the actual public website or platform URL.
   - Keep `repository` URLs pointing to the real external repository.
   - Do not convert canonical external metadata into internal documentation routes.

6. Leave unrelated links alone.
   - Keep links to third-party documentation, products, standards, articles, and tools external.
   - Do not rewrite links inside code examples unless the example itself is being corrected intentionally.

7. Review the result.
   - Check that the current subject uses an absolute production URL in prose.
   - Check that other ecosystem websites and platforms use internal documentation page links.
   - Verify that frontmatter and repository metadata still point to real external destinations where appropriate.
   - Ensure Markdown remains valid and readable.

## Decision Points

- If the file clearly documents one ecosystem site, treat that site as the current subject.
- If multiple ecosystem sites seem equally central, prefer the one named in the title or frontmatter `url`.
- If a link exists only to identify the current site itself, use the absolute public URL.
- If a link is a cross-reference to another ecosystem page for explanation or navigation, use the internal page route.
- If a URL appears in frontmatter as canonical metadata, keep it absolute.
- If a repository is referenced, keep the repository URL external.
- If it is unclear whether a target belongs to the documented ecosystem, infer cautiously from nearby files or ask for clarification.

## Completion Checks

Before considering the work done, verify that:
- The file's own website or platform uses its real absolute public URL in prose
- Other `soubiran.dev` ecosystem websites and platforms use internal documentation page links
- Frontmatter canonical URLs remain absolute where appropriate
- Repository URLs remain external
- Non-ecosystem external links were not incorrectly rewritten
- Markdown, frontmatter, and formatting remain valid

## Response Style

When reporting the result:
- Briefly mention which links were normalized
- Call out any ambiguous ecosystem references
- Mention if any frontmatter or repository URLs were intentionally left unchanged
