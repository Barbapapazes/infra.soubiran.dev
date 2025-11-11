import type MarkdownIt from 'markdown-it'
import shiki from '@shikijs/markdown-it'

export async function shikiHighlight(md: MarkdownIt) {
  md.use(await shiki({
    defaultColor: false,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  }))
}
