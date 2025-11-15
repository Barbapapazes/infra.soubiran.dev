import type { Plugin, ResolvedConfig } from 'vite'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { cwd } from 'node:process'
import { cyan, dim, green, yellow } from 'ansis'
import matter from 'gray-matter'

interface PageMeta {
  id: number
  title: string
  uri: string
  url: string
  description?: string
  hash: string
}

interface PageData {
  uri: string
  title?: string
  description?: string
  content: string
}

/**
 * Generate a hash of the content for change detection
 */
function generateContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}

/**
 * Recursively scan all markdown and vue files and extract metadata
 */
function scanPagesForMeta(pagesDir: string, baseUri = ''): PageData[] {
  const pages: PageData[] = []

  if (!existsSync(pagesDir)) {
    return pages
  }

  const entries = readdirSync(pagesDir)

  for (const entry of entries) {
    const fullPath = join(pagesDir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      const subPages = scanPagesForMeta(fullPath, `${baseUri}/${entry}`)
      pages.push(...subPages)
    }
    else if (entry.endsWith('.md')) {
      // Process markdown file
      const content = readFileSync(fullPath, 'utf-8')
      const { data, content: markdownContent } = matter(content)

      // Generate URI from file path
      let uri = baseUri
      if (entry !== 'index.md') {
        uri = `${baseUri}/${entry.replace(/\.md$/, '')}`
      }
      // Normalize URI (remove leading slash for root, ensure single slash)
      uri = uri.replace(/^\/+/, '/').replace(/\/$/, '') || '/'

      pages.push({
        uri,
        title: data.title,
        description: data.description,
        content: markdownContent,
      })
    }
    else if (entry.endsWith('.vue')) {
      // Process Vue file - extract title from definePageMeta or route meta
      const content = readFileSync(fullPath, 'utf-8')

      // Generate URI from file path
      const fileName = entry.replace(/\.vue$/, '')
      const uri = baseUri ? `${baseUri}/${fileName}` : `/${fileName}`

      // Try to extract title from route meta or comments
      // For now, we'll use a simple approach - the file name as fallback
      let title = fileName.charAt(0).toUpperCase() + fileName.slice(1)

      // Try to find title in route meta (simple match)
      const titleMatch = content.match(/\btitle:\s*['"]([^'"]+)['"]/)

      if (titleMatch) {
        title = titleMatch[1].trim()
      }

      pages.push({
        uri: uri.replace(/^\/+/, '/').replace(/\/$/, '') || '/',
        title,
        description: undefined,
        content,
      })
    }
  }

  return pages
}

/**
 * Generate meta.json file with all pages metadata
 */
async function generateMeta(config: ResolvedConfig, hostname: string) {
  const pagesDir = resolve(cwd(), 'pages')
  const distDir = resolve(cwd(), config.build.outDir)

  // Scan all pages and collect metadata
  const pagesData = scanPagesForMeta(pagesDir)

  // Convert to PageMeta format, filtering out pages without title
  const pages: PageMeta[] = pagesData
    .filter(page => page.title)
    .map(page => ({
      id: 0, // Will be set later
      title: page.title!,
      uri: page.uri,
      url: `https://${hostname}${page.uri}`,
      ...(page.description ? { description: page.description } : {}),
      hash: generateContentHash(page.content),
    }))

  // Sort pages by URI for consistent ordering
  pages.sort((a, b) => a.uri.localeCompare(b.uri))

  // Assign sequential IDs starting from 1
  pages.forEach((page, index) => {
    page.id = index + 1
  })

  // Write to dist/api/meta.json
  const apiDir = join(distDir, 'api')
  const metaPath = join(apiDir, 'meta.json')

  mkdirSync(apiDir, { recursive: true })
  writeFileSync(metaPath, JSON.stringify(pages, null, 2))

  config.logger.info(`${dim(`${config.build.outDir}/`)}${cyan(metaPath.replace(`${distDir}/`, ''))}`)
}

export function metaPlugin(hostname: string): Plugin {
  let config: ResolvedConfig

  return {
    name: 'meta',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    closeBundle() {
      if (this.environment.name !== 'client') {
        return
      }

      const time = new Date()
      config.logger.info(yellow('Generate meta.json'))

      generateMeta(config, hostname)

      config.logger.info(green(`✓ generated in ${new Date().getTime() - time.getTime()}ms`))
    },
  }
}
