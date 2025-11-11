import type { MarkdownItAsync } from 'markdown-it-async'
import linkAttributes from 'markdown-it-link-attributes'

export function linkAttributesRule(md: MarkdownItAsync) {
  md.use(linkAttributes as any, [
    {
      matcher: (link: string) => /^https?:\/\/(?:[a-z0-9-]+\.)?soubiran\.dev(?:[/?#]|$)/.test(link),
      attrs: {
        target: '_blank',
      },
    },
    {
      matcher: (link: string) => /^https?:\/\//.test(link),
      attrs: {
        target: '_blank',
        rel: 'noopener',
      },
    },
  ])
}
