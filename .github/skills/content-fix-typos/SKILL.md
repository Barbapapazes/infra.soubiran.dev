---
name: content-fix-typos
description: 'Use when editing Markdown, docs, headings, or website copy to fix typos only, while preserving wording, structure, and meaning.'
argument-hint: 'Target file(s), text to review, and optional spelling style guidance'
---

# Fix Typos in Content

## When to Use

Use this skill when content is already correct in meaning and structure but contains spelling mistakes or obvious typographical errors.

Typical triggers:
- Fix typos in `*.md` files
- Correct misspelled words in headings or summaries
- Clean up obvious keyboard slips in website copy
- Standardize accidental misspellings without rewriting sentences
- Review drafted content when the wording is already acceptable

## What This Skill Produces

The revised content should:
- Correct spelling mistakes and obvious typographical errors
- Preserve the original wording as much as possible
- Keep sentence structure and tone intact unless a typo fix requires a tiny adjustment
- Respect the dominant spelling style already used in the file
- Preserve Markdown, frontmatter, links, code, and formatting

## Procedure

1. Identify the editing scope.
   - Determine which file, section, or snippet should be reviewed.
   - Prioritize user-named files or the currently open content file.

2. Scan for spelling issues.
   - Look for misspelled words, duplicated letters, missing letters, transposed characters, and obvious keyboard slips.
   - Check headings, summaries, body text, captions, and metadata-like prose within the scope.

3. Correct typos conservatively.
   - Fix only clear spelling or typographical mistakes.
   - Do not rewrite phrasing just because it sounds stylistically weak.
   - Do not change grammar, tone, or sentence structure unless strictly necessary to complete the typo fix.

4. Preserve local conventions.
   - Follow the spelling style already dominant in the file when variants exist.
   - Keep product names, URLs, identifiers, and intentional branding unchanged unless they are clearly incorrect.

5. Review the result.
   - Re-read the edited scope to confirm the text still says the same thing.
   - Check that formatting and Markdown syntax remain intact.

## Decision Points

- If a word is clearly misspelled, fix it directly.
- If a wording issue is grammatical rather than typographical, leave it for a grammar-focused skill.
- If a phrase is understandable but awkward, leave it for an awkward-English skill.
- If a phrase appears to be a literal translation from French, leave it for a translation-phrasing skill unless there is also a clear typo.
- If a spelling variant is acceptable in context, prefer the form already used nearby.

## Completion Checks

Before considering the work done, verify that:
- Clear typos were fixed
- Meaning and sentence structure were preserved
- Product names, links, code spans, and identifiers were not broken
- Spelling style remains consistent within the edited scope
- No broader rewrites slipped into the edit

## Response Style

When reporting the result:
- Briefly mention that typos were corrected
- Call out any intentionally unchanged words that may look unusual but appear to be proper names or branding
- Keep the explanation concise unless the user asks for more detail
