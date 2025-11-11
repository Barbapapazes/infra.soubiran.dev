import type MarkdownIt from 'markdown-it'
// @ts-expect-error No declaration file
import implicitFigures from 'markdown-it-image-figures'

export function implicitFiguresRule(md: MarkdownIt) {
  md.use(implicitFigures, { figcaption: 'alt' })
}
