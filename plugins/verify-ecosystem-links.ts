import type { Plugin } from 'vite'
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

type PageKind = 'platforms' | 'websites'

interface EcosystemPage {
  filePath: string
  kind: PageKind
  route: string
  publicUrl: string
}

interface ValidationError {
  filePath: string
  line: number
  column: number
  message: string
}

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?/
const FENCED_CODE_BLOCK_RE = /```[\s\S]*?```|~~~[\s\S]*?~~~/g
const MARKDOWN_LINK_RE = /(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g

export function verifyEcosystemLinks(): Plugin {
  let root = process.cwd()
  const pageCache = new Map<string, Promise<EcosystemPage | null>>()

  return {
    name: 'verify-ecosystem-links',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
    },
    async transform(code, id) {
      const filePath = normalizeFileId(id)

      if (!isEcosystemMarkdownPage(filePath, root)) {
        return null
      }

      const errors = await validateMarkdownFile(filePath, code, root, pageCache)

      if (errors.length > 0) {
        this.error(formatErrors(errors, root))
      }

      return null
    },
  }
}

async function validateMarkdownFile(
  filePath: string,
  source: string,
  root: string,
  pageCache: Map<string, Promise<EcosystemPage | null>>,
): Promise<ValidationError[]> {
  const page = extractCurrentPage(filePath, source, root)

  if (!page) {
    return []
  }

  const errors: ValidationError[] = []
  const { body } = splitFrontmatter(source)
  const bodyWithoutCode = body.replaceAll(FENCED_CODE_BLOCK_RE, '')

  for (const match of bodyWithoutCode.matchAll(MARKDOWN_LINK_RE)) {
    const href = match[1]

    if (!href) {
      continue
    }

    const absoluteTarget = normalizeAbsoluteLink(href)
    const internalTarget = normalizeInternalLink(href)
    const linkedPage = await resolveLinkedPage(href, root, pageCache)

    if (!linkedPage) {
      continue
    }

    const location = getLineAndColumn(bodyWithoutCode, match.index ?? 0)

    if (linkedPage.filePath === page.filePath && internalTarget) {
      errors.push({
        filePath: page.filePath,
        line: location.line,
        column: location.column,
        message: `Current page subject must use its public URL \`${page.publicUrl}\`, not internal route \`${linkedPage.route}\`.`,
      })
    }

    if (linkedPage.filePath !== page.filePath && absoluteTarget) {
      errors.push({
        filePath: page.filePath,
        line: location.line,
        column: location.column,
        message: `Cross-ecosystem reference to \`${linkedPage.publicUrl}\` must use internal page route \`${linkedPage.route}\`.`,
      })
    }
  }

  return errors
}

function extractCurrentPage(filePath: string, source: string, root: string): EcosystemPage | null {
  const pageMatch = getPageMatch(filePath, root)

  if (!pageMatch) {
    return null
  }

  const frontmatter = splitFrontmatter(source).frontmatter
  const publicUrl = extractTopLevelScalar(frontmatter, 'url')

  if (!publicUrl) {
    return null
  }

  const { kind, slug } = pageMatch

  return {
    filePath,
    kind,
    route: `/${kind}/${slug}`,
    publicUrl: normalizePublicUrl(publicUrl),
  }
}

async function resolveLinkedPage(
  href: string,
  root: string,
  pageCache: Map<string, Promise<EcosystemPage | null>>,
): Promise<EcosystemPage | null> {
  const internalTarget = normalizeInternalLink(href)

  if (internalTarget) {
    const match = /^\/(platforms|websites)\/([^/]+)$/.exec(internalTarget)

    if (!match) {
      return null
    }

    const [, kind, slug] = match

    return loadPage(root, kind as PageKind, slug, pageCache)
  }

  const absoluteTarget = normalizeAbsoluteLink(href)

  if (!absoluteTarget) {
    return null
  }

  for (const kind of ['platforms', 'websites'] as const) {
    for (const slug of getCandidateSlugs(absoluteTarget)) {
      const page = await loadPage(root, kind, slug, pageCache)

      if (page?.publicUrl === absoluteTarget) {
        return page
      }
    }
  }

  return null
}

async function loadPage(
  root: string,
  kind: PageKind,
  slug: string,
  pageCache: Map<string, Promise<EcosystemPage | null>>,
): Promise<EcosystemPage | null> {
  const cacheKey = `${kind}/${slug}`
  const cached = pageCache.get(cacheKey)

  if (cached) {
    return cached
  }

  const pending = loadPageUncached(root, kind, slug)
  pageCache.set(cacheKey, pending)

  return pending
}

async function loadPageUncached(root: string, kind: PageKind, slug: string): Promise<EcosystemPage | null> {
  const filePath = path.join(root, 'pages', kind, `${slug}.md`)

  if (!await fileExists(filePath)) {
    return null
  }

  const source = await readFile(filePath, 'utf8')
  const publicUrl = extractTopLevelScalar(splitFrontmatter(source).frontmatter, 'url')

  if (!publicUrl) {
    return null
  }

  return {
    filePath,
    kind,
    route: `/${kind}/${slug}`,
    publicUrl: normalizePublicUrl(publicUrl),
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath)
    return true
  }
  catch {
    return false
  }
}

function getCandidateSlugs(value: string): string[] {
  const url = new URL(value)
  const hostParts = url.hostname.split('.')

  if (hostParts.length < 2) {
    return []
  }

  return [hostParts.join('-')]
}

function normalizeFileId(id: string): string {
  return id.split('?', 1)[0]
}

function isEcosystemMarkdownPage(filePath: string, root: string): boolean {
  return getPageMatch(filePath, root) !== null
}

function getPageMatch(filePath: string, root: string): { kind: PageKind, slug: string } | null {
  const pagesDir = path.join(root, 'pages')
  const relativePath = path.relative(pagesDir, filePath)
  const normalizedPath = relativePath.split(path.sep).join('/')
  const match = /^(platforms|websites)\/([^/]+)\.md$/.exec(normalizedPath)

  if (!match || match[2] === 'index') {
    return null
  }

  return {
    kind: match[1] as PageKind,
    slug: match[2],
  }
}

function splitFrontmatter(source: string): { frontmatter: string, body: string } {
  const match = FRONTMATTER_RE.exec(source)

  if (!match) {
    return { frontmatter: '', body: source }
  }

  return {
    frontmatter: match[1],
    body: source.slice(match[0].length),
  }
}

function extractTopLevelScalar(frontmatter: string, key: string): string | null {
  const match = new RegExp(`^${key}:\\s*(.+)$`, 'm').exec(frontmatter)

  if (!match) {
    return null
  }

  return stripWrappingQuotes(match[1].trim())
}

function stripWrappingQuotes(value: string): string {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
    return value.slice(1, -1)
  }

  return value
}

function normalizePublicUrl(value: string): string {
  const url = new URL(value)
  const pathname = url.pathname.replace(/\/+$/, '')

  return `${url.protocol}//${url.host}${pathname}`
}

function normalizeAbsoluteLink(value: string): string | null {
  if (!/^https?:\/\//.test(value)) {
    return null
  }

  return normalizePublicUrl(value)
}

function normalizeInternalLink(value: string): string | null {
  if (!value.startsWith('/')) {
    return null
  }

  const [pathname] = value.split(/[?#]/, 1)

  return normalizeRoute(pathname)
}

function normalizeRoute(value: string): string {
  if (value === '/') {
    return value
  }

  return value.replace(/\/+$/, '')
}

function getLineAndColumn(source: string, index: number): { line: number, column: number } {
  const before = source.slice(0, index)
  const lines = before.split('\n')

  return {
    line: lines.length,
    column: (lines.at(-1)?.length ?? 0) + 1,
  }
}

function formatErrors(errors: ValidationError[], root: string): string {
  return [
    'Ecosystem link verification failed.',
    ...errors.map(error => `- ${path.relative(root, error.filePath)}:${error.line}:${error.column} ${error.message}`),
  ].join('\n')
}
