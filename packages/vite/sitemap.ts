import type { UserConfig } from 'vite'
import { createWriteStream } from 'node:fs'
import { join } from 'node:path'
import { SitemapStream } from 'sitemap'

export const routes = new Set<string>()

export function sitemap(config: UserConfig, hostname: string, routes: string[]) {
  const sitemapStream = new SitemapStream({ hostname: `https://${hostname}` })
  const sitemapPath = join(config.build!.outDir!, 'sitemap.xml')
  const writeStream = createWriteStream(sitemapPath)

  sitemapStream.pipe(writeStream)
  routes.forEach(item => sitemapStream.write(item))
  sitemapStream.end()
}
