import type MarkdownIt from 'markdown-it'

export function customLink(md: MarkdownIt, hostname: string) {
  md.use((md) => {
    const linkRule = md.renderer.rules.link_open!
    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      const href = token.attrGet('href')

      // Add UTM for internal links (including subdomains)
      if (href && /^https?:\/\/(?:[a-z0-9-]+\.)?soubiran\.dev(?:[/?#]|$)/.test(href)) {
        token.attrSet('href', `${href}?utm_source=${hostname}&utm_medium=link`)
      }

      return linkRule(tokens, idx, options, env, self)
    }
  })
}
