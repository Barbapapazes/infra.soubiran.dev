import type { Plugin, ResolvedConfig } from 'vite'
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { cwd } from 'node:process'
import { cyan, dim, green, yellow } from 'ansis'
import matter from 'gray-matter'

/**
 * Recursively scan a directory for markdown files
 */
function scanMarkdownFiles(dir: string, baseDir?: string): string[] {
  const files: string[] = []

  try {
    const entries = readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        files.push(...scanMarkdownFiles(fullPath, baseDir))
      }
      else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
        files.push(fullPath)
      }
    }
  }
  catch {
    // Directory doesn't exist, return empty array
  }

  return files
}

/**
 * Process a markdown file and extract its frontmatter
 */
function processMarkdownFile(filePath: string, category: string): Record<string, any> {
  const content = readFileSync(filePath, 'utf-8')
  const { data } = matter(content)

  // Extract the filename without extension to create the path
  const fileName = filePath.split('/').pop()?.replace(/\.md$/, '') || ''
  const path = `/${category}/${fileName}`

  return {
    path,
    ...data,
  }
}

/**
 * Generates the pages API JSON files in dist/api directory
 */
async function api(config: ResolvedConfig) {
  const pagesDir = resolve(cwd(), 'pages')
  const distDir = resolve(cwd(), config.build.outDir)

  const names = ['websites', 'platforms']

  for (const name of names) {
    const dir = join(pagesDir, name)

    const processedFiles = scanMarkdownFiles(dir).map(file => processMarkdownFile(file, name))

    const apiDir = join(distDir, 'api')
    const path = join(apiDir, `${name}.json`)

    mkdirSync(apiDir, { recursive: true })
    writeFileSync(path, JSON.stringify(processedFiles, null, 2))

    config.logger.info(`${dim(`${config.build.outDir}/`)}${cyan(path.replace(`${distDir}/`, ''))}`)
  }
}

export function apiPlugin(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'api',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    closeBundle() {
      if (this.environment.name !== 'client') {
        return
      }

      const time = new Date()
      config.logger.info(yellow('Generate API files'))

      api(config)

      config.logger.info(green(`✓ generated in ${new Date().getTime() - time.getTime()}ms`))
    },
  }
}
