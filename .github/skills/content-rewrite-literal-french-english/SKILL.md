---
name: content-rewrite-literal-french-english
description: 'Use when editing Markdown, docs, headings, or website copy to replace literal French-to-English phrasing with idiomatic English, while preserving meaning and nuance.'
argument-hint: 'Target file(s), text to review, and optional tone guidance'
---

# Rewrite Literal French-to-English Phrasing

## When to Use

Use this skill when English content is understandable but clearly reflects literal transfer from French and needs to be rewritten into idiomatic English without changing the intended meaning.

Typical triggers:
- Rewrite literal French-to-English phrasing in `*.md` files
- Fix false friends or translated-sounding expressions in docs
- Smooth headings or website copy that read like direct translations from French
- Preserve the original point while replacing French-influenced structure with idiomatic English
- Review text that is grammatically acceptable but still unmistakably translation-shaped

## What This Skill Produces

The revised content should:
- Replace literal French-influenced phrasing with idiomatic English
- Preserve meaning, nuance, and level of certainty
- Avoid false friends and translation artifacts
- Keep the tone professional, simple, and readable unless the user requests otherwise
- Preserve Markdown, frontmatter, links, code, and formatting

## Procedure

1. Identify the editing scope.
   - Determine which file, section, or snippet should be reviewed.
   - Prioritize user-named files or the current open content file.

2. Detect translation artifacts.
   - Look for literal calques, false friends, unnatural word order, French-style abstractions, and phrasing that makes sense only because the French source is easy to imagine.
   - Infer the intended meaning before rewriting.

3. Rewrite idiomatically.
   - Replace literal constructions with natural English equivalents.
   - Rebuild the sentence when needed rather than editing word by word.
   - Prefer plain, direct English over visibly translated phrasing.

4. Preserve nuance carefully.
   - Do not change certainty, scope, or emphasis.
   - Keep technical terms, product names, URLs, and identifiers unchanged unless they are themselves mistranslated.
   - If the intended meaning is ambiguous, ask for clarification rather than guessing.

5. Review the result.
   - Re-read the text without mentally translating back from French.
   - Confirm that it now reads like original English while still expressing the same idea.

## Decision Points

- If wording is clearly a literal translation from French, rewrite it idiomatically.
- If the issue is only grammar or spelling, prefer the more targeted grammar or typo skill.
- If the text is merely clunky but not specifically French-influenced, prefer an awkward-English skill.
- If a literal phrase may carry a subtle meaning that could be lost in rewriting, choose the safer phrasing or ask for clarification.
- If a term may be a proper noun or project-specific label, do not normalize it casually.

## Completion Checks

Before considering the work done, verify that:
- Literal French-to-English phrasing was rewritten idiomatically
- False friends and translation artifacts were removed where needed
- Meaning, nuance, and emphasis were preserved
- The final English reads naturally on its own
- Markdown, frontmatter, and formatting remain valid

## Response Style

When reporting the result:
- Briefly mention that literal French-to-English phrasing was rewritten idiomatically
- Call out any phrase whose intended meaning was especially delicate to preserve
- Keep the explanation concise unless the user asks for more detail
