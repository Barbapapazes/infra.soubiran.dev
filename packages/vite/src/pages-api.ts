import type { UserConfig } from 'vite'
import { readdirSync, readFileSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'

export interface PageData {
  path: string
  title?: string
  description?: string
  url?: string
  repository?: string | { url: string, private?: boolean }
  [key: string]: any
}

/**
 * Recursively scan a directory for markdown files
 */
function scanMarkdownFiles(dir: string, baseDir: string): string[] {
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
function processMarkdownFile(filePath: string, category: 'websites' | 'platforms'): PageData {
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
export async function generatePagesApi(config: UserConfig, pagesDir: string) {
  const websitesDir = join(pagesDir, 'websites')
  const platformsDir = join(pagesDir, 'platforms')

  // Scan for markdown files
  const websiteFiles = scanMarkdownFiles(websitesDir, websitesDir)
  const platformFiles = scanMarkdownFiles(platformsDir, platformsDir)

  // Process all files
  const websites = websiteFiles.map(file => processMarkdownFile(file, 'websites'))
  const platforms = platformFiles.map(file => processMarkdownFile(file, 'platforms'))

  // Create api directory and write JSON files
  const apiDir = join(config.build!.outDir!, 'api')
  const websitesPath = join(apiDir, 'websites.json')
  const platformsPath = join(apiDir, 'platforms.json')

  await mkdir(apiDir, { recursive: true })
  await writeFile(websitesPath, JSON.stringify(websites, null, 2))
  await writeFile(platformsPath, JSON.stringify(platforms, null, 2))

  // eslint-disable-next-line no-console
  console.log(`Generated pages API: ${websitesPath} (${websites.length} websites), ${platformsPath} (${platforms.length} platforms)`)
}
