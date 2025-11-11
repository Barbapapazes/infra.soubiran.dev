import { joinURL } from 'ufo'
import { getUri, toUrl } from './utils'

export function getCanonicalUrl(id: string, hostname: string) {
  return joinURL(toUrl(hostname), getUri(id))
}

export function canonical(id: string, frontmatter: Record<string, any>, hostname: string) {
  const url = getCanonicalUrl(id, hostname)

  frontmatter.meta ??= []
  frontmatter.meta.push({
    property: 'og:url',
    content: url,
  })

  frontmatter.link ??= []
  frontmatter.link.push({
    rel: 'canonical',
    href: url,
  })
}
