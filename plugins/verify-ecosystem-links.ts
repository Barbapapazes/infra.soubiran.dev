import type { Plugin } from 'vite'
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

type PageKind = 'platforms' | 'websites'

const PAGE_KINDS = ['platforms', 'websites'] as const
const PAGE_ROUTE_RE = /^\/(platforms|websites)\/([^/]+)$/

interface EcosystemPage {
  filePath: string
  kind: PageKind
  route: string
  title: string
  publicUrl: string
}

interface ValidationError {
  filePath: string
  line: number
  column: number
  message: string
}

interface MarkdownPage {
  body: string
  bodyOffset: number
  title: string | null
  publicUrl: string | null
}

interface InternalPageRoute {
  kind: PageKind
  slug: string
  route: string
}

const FENCED_CODE_BLOCK_RE = /```[\s\S]*?```|~~~[\s\S]*?~~~/g
const MARKDOWN_LINK_RE = /(?<!!)\[(?<label>[^\]]+)\]\((?<href>[^)\s]+)(?:\s+"[^"]*")?\)/g

/**
 * Verifies ecosystem markdown links during the Vite transform step.
 *
 * Rules:
 * - the current page subject must use its public `url` frontmatter value
 * - root links to other internal `*.soubiran.dev` sites must use their internal doc routes
 */
export function verifyEcosystemLinks(): Plugin {
  let root: string
  const pageCache = new Map<string, Promise<EcosystemPage | null>>()

  return {
    name: 'verify-ecosystem-links',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
    },
    transform: {
      filter: {
        id: /\.md$/,
      },
      async handler(code, id) {
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
    },
  }
}

async function validateMarkdownFile(
  filePath: string,
  source: string,
  root: string,
  pageCache: Map<string, Promise<EcosystemPage | null>>,
): Promise<ValidationError[]> {
  const markdownPage = parseMarkdownPage(source)
  const page = extractCurrentPage(filePath, markdownPage, root)

  if (!page) {
    return []
  }

  const bodyWithoutCode = maskFencedCodeBlocks(markdownPage.body)
  const errors = await Promise.all(
    [...bodyWithoutCode.matchAll(MARKDOWN_LINK_RE)].map(match => validateMarkdownLink(match, source, markdownPage.bodyOffset, page, root, pageCache)),
  )

  return errors.filter((error): error is ValidationError => error !== null)
}

async function validateMarkdownLink(
  match: RegExpMatchArray,
  source: string,
  bodyOffset: number,
  page: EcosystemPage,
  root: string,
  pageCache: Map<string, Promise<EcosystemPage | null>>,
): Promise<ValidationError | null> {
  const href = match.groups?.href
  const label = match.groups?.label?.trim()

  if (!href) {
    return null
  }

  const absoluteTarget = normalizeAbsoluteLink(href)
  const internalTarget = normalizeInternalLink(href)
  const internalPageRoute = internalTarget ? parseInternalPageRoute(internalTarget) : null
  const location = getLineAndColumn(source, bodyOffset + (match.index ?? 0))

  if (isCurrentPageSubjectLink(page, label, href)) {
    return createValidationError(
      page,
      location,
      `Current page subject must use its public URL \`${page.publicUrl}\`, not \`${href}\`.`,
    )
  }

  const linkedPage = internalPageRoute
    ? await loadPage(root, internalPageRoute.kind, internalPageRoute.slug, pageCache)
    : await resolveAbsoluteLinkedPage(href, root, pageCache)

  if (internalPageRoute && !linkedPage) {
    return createValidationError(
      page,
      location,
      `Internal documentation page route \`${internalPageRoute.route}\` does not exist.`,
    )
  }

  if (absoluteTarget && isCrossInternalSiteReference(absoluteTarget, page.publicUrl)) {
    return createValidationError(
      page,
      location,
      linkedPage
        ? `Cross-ecosystem reference to \`${linkedPage.publicUrl}\` must use internal page route \`${linkedPage.route}\`.`
        : `Internal site \`${absoluteTarget}\` must use its documentation page route, not an absolute URL.`,
    )
  }

  if (linkedPage?.filePath === page.filePath && internalTarget) {
    return createValidationError(
      page,
      location,
      `Current page subject must use its public URL \`${page.publicUrl}\`, not internal route \`${linkedPage.route}\`.`,
    )
  }

  return null
}

function extractCurrentPage(filePath: string, markdownPage: MarkdownPage, root: string): EcosystemPage | null {
  const pageMatch = getPageMatch(filePath, root)

  if (!pageMatch || !markdownPage.publicUrl || !markdownPage.title) {
    return null
  }

  const { kind, slug } = pageMatch

  return createEcosystemPage(filePath, kind, slug, markdownPage.title, markdownPage.publicUrl)
}

async function resolveAbsoluteLinkedPage(
  href: string,
  root: string,
  pageCache: Map<string, Promise<EcosystemPage | null>>,
): Promise<EcosystemPage | null> {
  const absoluteTarget = normalizeAbsoluteLink(href)

  if (!absoluteTarget) {
    return null
  }

  for (const kind of PAGE_KINDS) {
    for (const slug of getCandidateSlugs(absoluteTarget)) {
      const page = await loadPage(root, kind, slug, pageCache)

      if (page?.publicUrl === absoluteTarget) {
        return page
      }
    }
  }

  return null
}

function parseInternalPageRoute(value: string): InternalPageRoute | null {
  const match = PAGE_ROUTE_RE.exec(value)

  if (!match) {
    return null
  }

  const [, kind, slug] = match

  return {
    kind: kind as PageKind,
    slug,
    route: value,
  }
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
  const filePath = path.join(getPagesDir(root), kind, `${slug}.md`)

  if (!await fileExists(filePath)) {
    return null
  }

  const source = await readFile(filePath, 'utf8')
  const { publicUrl, title } = parseMarkdownPage(source)

  if (!publicUrl || !title) {
    return null
  }

  return createEcosystemPage(filePath, kind, slug, title, publicUrl)
}

function createEcosystemPage(
  filePath: string,
  kind: PageKind,
  slug: string,
  title: string,
  publicUrl: string,
): EcosystemPage {
  return {
    filePath,
    kind,
    route: `/${kind}/${slug}`,
    title,
    publicUrl,
  }
}

function createValidationError(
  page: EcosystemPage,
  location: { line: number, column: number },
  message: string,
): ValidationError {
  return {
    filePath: page.filePath,
    line: location.line,
    column: location.column,
    message,
  }
}

function isCurrentPageSubjectLink(page: EcosystemPage, label: string | undefined, href: string): boolean {
  return label === page.title && href !== page.publicUrl
}

function isCrossInternalSiteReference(absoluteTarget: string, currentPublicUrl: string): boolean {
  return absoluteTarget !== currentPublicUrl && isInternalAbsoluteSite(absoluteTarget)
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

function getPagesDir(root: string): string {
  return path.join(root, 'src', 'app', 'pages')
}

function getPageMatch(filePath: string, root: string): { kind: PageKind, slug: string } | null {
  const pagesDir = getPagesDir(root)
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

function parseMarkdownPage(source: string): MarkdownPage {
  const parsed = matter(source)

  return {
    body: parsed.content,
    bodyOffset: source.length - parsed.content.length,
    title: typeof parsed.data.title === 'string'
      ? parsed.data.title.trim()
      : null,
    publicUrl: typeof parsed.data.url === 'string'
      ? normalizePublicUrl(parsed.data.url)
      : null,
  }
}

function maskFencedCodeBlocks(source: string): string {
  return source.replaceAll(FENCED_CODE_BLOCK_RE, block => block.replace(/[^\n]/g, ' '))
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

function isInternalAbsoluteSite(value: string): boolean {
  const url = new URL(value)

  return isRootPath(url.pathname) && isInternalSoubiranHostname(url.hostname)
}

function isInternalSoubiranHostname(value: string): boolean {
  return value === 'soubiran.dev' || value.endsWith('.soubiran.dev')
}

function isRootPath(value: string): boolean {
  return value === '' || value === '/'
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
