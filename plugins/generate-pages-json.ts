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

/** Generates a JSON data envelope containing the raw frontmatter for every Markdown page. */
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
      const pages = await Promise.all(markdownFiles.map(filePath => createPageEntry(filePath, options.hostname)))
      const outputPath = path.resolve(outDir, options.outputFile)

      await mkdir(path.dirname(outputPath), { recursive: true })
      await writeFile(outputPath, `${JSON.stringify({ data: pages })}\n`)
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

async function createPageEntry(filePath: string, hostname: string): Promise<Record<string, unknown>> {
  const source = await readFile(filePath, 'utf8')
  const frontmatter = { ...matter(source).data }
  const projectUrl = frontmatter.url ?? null

  delete frontmatter.uri
  delete frontmatter.url

  return {
    ...frontmatter,
    projectUrl,
    pageUrl: toUrl(hostname, getUri(filePath)),
  }
}
