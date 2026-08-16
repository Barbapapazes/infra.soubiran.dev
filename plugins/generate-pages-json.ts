import type { Plugin } from 'vite'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getUri, toUrl } from '@soubiran/vite/utils'
import matter from 'gray-matter'

export interface GeneratePagesJsonOptions {
  hostname: string
  pagesDir: string
  outputFile: string
}

type PageType = 'documentation' | 'platform' | 'website'

interface RepositoryLink {
  url: string
  private?: boolean
}

interface PageLinks {
  project?: string
  repository?: RepositoryLink
}

interface PageCatalogItem {
  id: string
  type: PageType
  title: string
  language: 'en'
  url: string
  description?: string
  links?: PageLinks
  ecosystem?: unknown[]
}

interface PagesCatalog {
  schemaVersion: '1.0'
  generatedAt: string
  site: {
    id: 'infra.soubiran.dev'
    url: string
  }
  data: PageCatalogItem[]
}

/** Generates a self-describing documentation catalog from Markdown frontmatter. */
export function generatePagesJson(options: GeneratePagesJsonOptions): Plugin {
  let root: string
  let outDir: string

  return {
    name: 'generate-pages-json',
    apply: 'build',
    configResolved(config) {
      root = config.root
      outDir = path.resolve(root, config.build.outDir)
    },
    async closeBundle() {
      const pagesDir = path.resolve(root, options.pagesDir)
      const markdownFiles = await findMarkdownFiles(pagesDir)
      const pages = await Promise.all(markdownFiles.map(filePath => createPageEntry(filePath, options.hostname, pagesDir)))
      const outputPath = path.resolve(outDir, options.outputFile)
      const catalog: PagesCatalog = {
        schemaVersion: '1.0',
        generatedAt: new Date().toISOString(),
        site: {
          id: 'infra.soubiran.dev',
          url: `https://${options.hostname}`,
        },
        data: pages,
      }

      await mkdir(path.dirname(outputPath), { recursive: true })
      await writeFile(outputPath, `${JSON.stringify(catalog)}\n`)
    },
  }
}

async function findMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const filePath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      return findMarkdownFiles(filePath)
    }

    return entry.isFile() && path.extname(entry.name) === '.md' ? [filePath] : []
  }))

  return files.flat().sort((left, right) => left.localeCompare(right))
}

async function createPageEntry(filePath: string, hostname: string, pagesDir: string): Promise<PageCatalogItem> {
  const source = await readFile(filePath, 'utf8')
  const frontmatter = matter(source).data
  const project = toOptionalString(frontmatter.url)
  const repository = toRepositoryLink(frontmatter.repository)
  const links = withoutUndefined({ project, repository })

  return {
    id: toRequiredString(frontmatter.id, filePath, 'id'),
    type: getPageType(filePath, pagesDir),
    title: toRequiredString(frontmatter.title, filePath, 'title'),
    description: toOptionalString(frontmatter.description),
    language: 'en',
    url: toUrl(hostname, getUri(filePath)),
    links: Object.keys(links).length > 0 ? links : undefined,
    ecosystem: Array.isArray(frontmatter.ecosystem) ? frontmatter.ecosystem : undefined,
  }
}

function getPageType(filePath: string, pagesDir: string): PageType {
  const relativePath = path.relative(pagesDir, filePath)

  if (relativePath.startsWith(`platforms${path.sep}`)) {
    return 'platform'
  }

  if (relativePath.startsWith(`websites${path.sep}`)) {
    return 'website'
  }

  return 'documentation'
}

function toRequiredString(value: unknown, filePath: string, field: string): string {
  const string = toOptionalString(value)

  if (!string) {
    throw new Error(`${filePath} must define a ${field} frontmatter field`)
  }

  return string
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function toRepositoryLink(value: unknown): RepositoryLink | undefined {
  if (typeof value === 'string') {
    return toOptionalString(value) ? { url: value } : undefined
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined
  }

  const repository = value as Record<string, unknown>
  const url = toOptionalString(repository.url)

  return url
    ? {
        url,
        private: typeof repository.private === 'boolean' ? repository.private : undefined,
      }
    : undefined
}

function withoutUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T
}
