import type { MarkdownItAsync } from 'markdown-it-async'
// @ts-expect-error No declaration file
import implicitFigures from 'markdown-it-image-figures'

export function implicitFiguresRule(md: MarkdownItAsync) {
  md.use(implicitFigures, { figcaption: 'alt' })
}
