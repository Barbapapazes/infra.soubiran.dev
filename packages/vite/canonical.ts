import { joinURL } from 'ufo'

export function canonical(id: string, frontmatter: Record<string, any>, hostname: string) {
  const route = id.split('/pages/')[1].replace(/\.md$/, '').replace(/index$/, '')

  const url = joinURL(`https://${hostname}/`, route)

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
