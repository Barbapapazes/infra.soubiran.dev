---
name: content-fix-grammar
description: 'Use when editing Markdown, docs, headings, or website copy to fix grammar only, without broad stylistic rewrites.'
argument-hint: 'Target file(s), text to review, and optional tone or locale guidance'
---

# Fix Grammar in Content

## When to Use

Use this skill when content is already close to final but contains grammar issues that should be corrected without turning the task into a general rewrite.

Typical triggers:
- Fix grammar mistakes in `*.md` files
- Correct article, preposition, agreement, or tense issues in docs
- Clean up grammatical problems in headings or summaries
- Review website copy that reads correctly in intent but has grammatical errors
- Tighten sentence correctness while preserving the author's wording and emphasis

## What This Skill Produces

The revised content should:
- Correct grammar errors in a precise, conservative way
- Preserve the original meaning, tone, and level of certainty
- Avoid unnecessary stylistic rewriting
- Keep terminology, capitalization, and spelling consistent within the scope
- Preserve Markdown, frontmatter, links, code, and formatting

## Procedure

1. Identify the editing scope.
   - Determine which file, section, or snippet should be reviewed.
   - Prioritize the files named by the user or the current open content file.

2. Read for grammatical correctness.
   - Look for issues with articles, prepositions, subject-verb agreement, pronouns, sentence structure, tense consistency, punctuation tied to grammar, and countability.
   - Focus on correctness rather than style.

3. Correct grammar with minimal rewriting.
   - Make the smallest change that resolves the grammatical issue.
   - Keep the original sentence structure when possible.
   - Do not rewrite a sentence just because a more elegant version exists.

4. Preserve meaning and conventions.
   - Keep the original nuance and emphasis.
   - Follow the dominant spelling style already used in the file.
   - Leave branding, URLs, identifiers, and technical names unchanged unless clearly incorrect.

5. Review the result.
   - Re-read the edited scope for correctness and flow.
   - Confirm that the task stayed focused on grammar rather than broader copyediting.

## Decision Points

- If the issue is grammatical, fix it directly.
- If the text contains only typos, leave broad grammar unchanged and use a typo-focused skill instead.
- If a sentence is grammatical but awkward, leave stylistic smoothing for an awkward-English skill.
- If wording appears to be a literal French-to-English construction, leave that for a translation-phrasing skill unless the grammar error must be corrected to keep the sentence valid.
- If fixing grammar would require changing meaning or emphasis, choose the smallest safe correction or ask for clarification.

## Completion Checks

Before considering the work done, verify that:
- Grammar issues were corrected
- Meaning, tone, and emphasis were preserved
- The edit did not expand into a general rewrite
- Markdown, frontmatter, and formatting remain valid
- Terminology and spelling style remain consistent within the scope

## Response Style

When reporting the result:
- Briefly mention that grammar issues were corrected
- Call out any phrases where meaning limited how far the rewrite could go
- Keep the explanation concise unless the user asks for more detail
