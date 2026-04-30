import { expect, test } from '@playwright/test'

interface HeadTag {
  tag: string
  as: string | null
  charset: boolean
  defer: boolean
  href: string | null
  id: string | null
  name: string | null
  rel: string | null
  src: string | null
  type: string | null
}

function getAttribute(tagMarkup: string, attribute: string) {
  const match = tagMarkup.match(new RegExp(`${attribute}=(?:"([^"]*)"|'([^']*)'|([^\s>]+))`, 'i'))

  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null
}

function hasAttribute(tagMarkup: string, attribute: string) {
  return new RegExp(`(?:^|\\s)${attribute}(?:\\s|=|>|/)`, 'i').test(tagMarkup)
}

function parseHeadTags(html: string): HeadTag[] {
  const headMarkup = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1]

  expect(headMarkup, 'Expected the response HTML to contain a <head> element').toBeTruthy()

  const openingTags = headMarkup!.match(/<(meta|title|link|script|style)\b[^>]*>/gi) ?? []

  return openingTags.map((tagMarkup) => {
    const tag = tagMarkup.match(/^<([a-z]+)/i)?.[1]?.toLowerCase()

    expect(tag, `Expected to parse a supported tag from ${tagMarkup}`).toBeTruthy()

    return {
      tag: tag!,
      as: getAttribute(tagMarkup, 'as'),
      charset: hasAttribute(tagMarkup, 'charset'),
      defer: hasAttribute(tagMarkup, 'defer'),
      href: getAttribute(tagMarkup, 'href'),
      id: getAttribute(tagMarkup, 'id'),
      name: getAttribute(tagMarkup, 'name'),
      rel: getAttribute(tagMarkup, 'rel'),
      src: getAttribute(tagMarkup, 'src'),
      type: getAttribute(tagMarkup, 'type'),
    }
  })
}

function findFirstIndex(tags: HeadTag[], predicate: (tag: HeadTag) => boolean, description: string) {
  const index = tags.findIndex(predicate)

  expect(index, `Expected to find ${description} in the page head`).toBeGreaterThan(-1)

  return index
}

function findAllIndices(tags: HeadTag[], predicate: (tag: HeadTag) => boolean, description: string) {
  const indices = tags.flatMap((tag, index) => predicate(tag) ? [index] : [])

  expect(indices.length, `Expected to find at least one ${description} in the page head`).toBeGreaterThan(0)

  return indices
}

test('index page head keeps capo-like tag ordering', async ({ request }) => {
  const response = await request.get('/')

  expect(response.ok()).toBe(true)

  const html = await response.text()
  const tags = parseHeadTags(html)

  const charset = findFirstIndex(tags, tag => tag.tag === 'meta' && tag.charset, '<meta charset>')
  const viewport = findFirstIndex(tags, tag => tag.tag === 'meta' && tag.name === 'viewport', '<meta name="viewport">')
  const title = findFirstIndex(tags, tag => tag.tag === 'title', '<title>')
  const preconnect = findFirstIndex(
    tags,
    tag => tag.tag === 'link' && tag.rel === 'preconnect',
    '<link rel="preconnect">',
  )
  const syncScript = findFirstIndex(
    tags,
    tag => tag.tag === 'script' && !tag.defer && tag.type !== 'module' && tag.type !== 'application/ld+json',
    'blocking inline <script>',
  )
  const styles = findAllIndices(
    tags,
    tag => (tag.tag === 'link' && tag.rel === 'stylesheet') || tag.tag === 'style',
    'stylesheet or style tag',
  )
  const preloads = findAllIndices(
    tags,
    tag => tag.tag === 'link' && (tag.rel === 'preload' || tag.rel === 'modulepreload'),
    'preload or modulepreload tag',
  )
  const lateScripts = findAllIndices(
    tags,
    tag => tag.tag === 'script' && (tag.defer || tag.type === 'module'),
    'deferred or module script',
  )
  const canonical = findFirstIndex(
    tags,
    tag => tag.tag === 'link' && tag.rel === 'canonical',
    '<link rel="canonical">',
  )

  expect(charset).toBeLessThan(viewport)
  expect(viewport).toBeLessThan(title)
  expect(title).toBeLessThan(preconnect)

  expect(syncScript).toBeLessThan(Math.min(...styles))
  expect(Math.max(...styles)).toBeLessThan(Math.min(...preloads))
  expect(Math.max(...preloads)).toBeLessThan(Math.min(...lateScripts))
  expect(Math.max(...lateScripts)).toBeLessThan(canonical)
})
