import type { Plugin, ResolvedConfig } from 'vite'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { cwd } from 'node:process'
import { cyan, dim, green, yellow } from 'ansis'
import matter from 'gray-matter'

/**
 * Sanitize markdown content for LLM consumption
 * - Removes HTML tags while preserving content inside paired tags
 * - Adds title as H1 heading at the top
 * - Safe for build-time processing
 */
function sanitizeMarkdown(content: string, title?: string): string {
  // Remove HTML tags and their content completely
  // This handles self-closing tags, paired tags, and complex nested structures
  // Note: This is safe for build-time markdown processing. The output files
  // are for LLM consumption, not web rendering, so HTML injection is not a concern.
  let sanitized = content

  // Remove all HTML tags (opening, closing, and self-closing)
  // Do multiple passes to handle nested tags until no more tags remain
  let prevSanitized = ''
  while (sanitized !== prevSanitized) {
    prevSanitized = sanitized
    // Remove paired tags with content (e.g., <span>text</span>)
    sanitized = sanitized.replace(/<[^>]+>([^<]*)<\/[^>]+>/g, '$1')
    // Remove all remaining tags (self-closing and unpaired)
    sanitized = sanitized.replace(/<[^>]*>/g, '')
  }

  // Add title as H1 at the top if it exists
  if (title) {
    sanitized = `# ${title}\n\n${sanitized}`
  }

  return sanitized.trim()
}

/**
 * Recursively copy and sanitize markdown files from source to target directory
 * - Parses frontmatter and removes it
 * - Sanitizes HTML tags
 * - Preserves directory structure
 * - Converts /<something>/index.md to /<something>.md (except for root /index.md)
 */
function copyAndSanitizeMarkdownFiles(config: ResolvedConfig, sourceDir: string, targetDir: string, isRoot = true): void {
  const outDir = join(resolve(cwd()), config.build.outDir)
  const entries = readdirSync(sourceDir)

  for (const entry of entries) {
    const sourcePath = join(sourceDir, entry)
    const stat = statSync(sourcePath)

    if (stat.isDirectory()) {
      const newTargetDir = join(targetDir, entry)
      if (!existsSync(newTargetDir)) {
        mkdirSync(newTargetDir, { recursive: true })
      }
      copyAndSanitizeMarkdownFiles(config, sourcePath, newTargetDir, false)
    }
    else if (entry.endsWith('.md')) {
      // Determine the target path
      let targetPath: string

      // Convert /<something>/index.md to /<something>.md (except for root /index.md)
      if (entry === 'index.md' && !isRoot) {
        // For non-root index.md files, place them one level up with the parent directory name
        const parentDirName = basename(sourceDir)
        targetPath = join(dirname(targetDir), `${parentDirName}.md`)
      }
      else {
        targetPath = join(targetDir, entry)
      }

      const targetDirPath = dirname(targetPath)
      if (!existsSync(targetDirPath)) {
        mkdirSync(targetDirPath, { recursive: true })
      }

      // Read and parse markdown file
      const fileContent = readFileSync(sourcePath, 'utf-8')
      const { data, content } = matter(fileContent)

      // Sanitize the content and add title
      const sanitizedContent = sanitizeMarkdown(content, data.title)

      // Write sanitized content to target
      writeFileSync(targetPath, sanitizedContent, 'utf-8')

      config.logger.info(`${dim(`${config.build.outDir}/`)}${cyan(targetPath.replace(`${outDir}/`, ''))}`)
    }
  }
}

export function markdownPlugin(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'markdown',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    closeBundle() {
      if (this.environment.name !== 'client') {
        return
      }

      const pagesDir = resolve(cwd(), 'pages')
      const distDir = resolve(cwd(), config.build.outDir)

      const time = new Date()
      config.logger.info(yellow('Copy and Sanitize Markdown'))

      copyAndSanitizeMarkdownFiles(config, pagesDir, distDir)

      config.logger.info(green(`✓ copied in ${new Date().getTime() - time.getTime()}ms`))
    },
  }
}
