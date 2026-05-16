---
name: content-rewrite-awkward-english
description: 'Use when editing Markdown, docs, headings, or website copy to rewrite awkward English so it sounds natural, while preserving meaning.'
argument-hint: 'Target file(s), text to review, and optional tone guidance'
---

# Rewrite Awkward English in Content

## When to Use

Use this skill when content is understandable but reads clumsily, stiffly, or unnaturally in English and needs smoother phrasing without changing the intended message.

Typical triggers:
- Smooth awkward English in `*.md` files
- Rewrite clunky headings, summaries, or website copy
- Improve flow in docs that sound translated or overly literal without obvious grammar errors
- Reduce repetition or heavy phrasing while keeping the same meaning
- Make existing English content easier to scan and more pleasant to read

## What This Skill Produces

The revised content should:
- Sound natural to an English reader
- Preserve meaning, nuance, and level of certainty
- Improve flow, rhythm, and readability
- Prefer clear, direct phrasing over stiff or translated-sounding wording
- Preserve Markdown, frontmatter, links, code, and formatting

## Procedure

1. Identify the editing scope.
   - Determine which file, section, or snippet should be reviewed.
   - Prioritize the user-named files or the current open content file.

2. Read for naturalness.
   - Look for clunky wording, repetition, overlong sentences, unnatural collocations, and stiff transitions.
   - Identify the intended point of each sentence before rewriting.

3. Rewrite lightly but effectively.
   - Replace awkward phrasing with natural English.
   - Split long sentences when it improves readability.
   - Remove unnecessary filler and repetition.
   - Rewrite only as much as needed to improve naturalness.

4. Preserve meaning and scope.
   - Do not strengthen, weaken, broaden, or narrow the original meaning.
   - Keep terminology and product names consistent.
   - Leave technical identifiers, URLs, and code untouched.

5. Review the result.
   - Re-read the revised text for clarity and rhythm.
   - Check that the content now sounds natural without drifting into a different message.

## Decision Points

- If the text is correct but clunky, rewrite it for natural English.
- If the issue is only spelling, leave it for a typo-focused skill.
- If the issue is only grammar, prefer a grammar-focused skill.
- If the awkwardness clearly comes from literal French-to-English transfer, prefer a translation-phrasing skill for a more targeted rewrite.
- If a smoother rewrite risks changing nuance, choose the more literal safe version or ask for clarification.

## Completion Checks

Before considering the work done, verify that:
- Awkward English was smoothed into natural phrasing
- Meaning and nuance were preserved
- Sentences are easier to read and scan
- Terminology remains consistent
- Markdown, frontmatter, and formatting remain valid

## Response Style

When reporting the result:
- Briefly mention that awkward phrasing was rewritten for more natural English
- Call out any especially delicate wording where nuance was preserved carefully
- Keep the explanation concise unless the user asks for more detail
