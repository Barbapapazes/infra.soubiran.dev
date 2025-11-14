import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import matter from 'gray-matter'

/**
 * Sanitize markdown content for LLM consumption
 * - Removes HTML tags while preserving content inside paired tags
 * - Adds title as H1 heading at the top
 * - Safe for build-time processing
 */
export function sanitizeMarkdown(content: string, title?: string): string {
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
 */
export function copyAndSanitizeMarkdownFiles(sourceDir: string, targetDir: string): void {
  const entries = readdirSync(sourceDir)

  for (const entry of entries) {
    const sourcePath = join(sourceDir, entry)
    const stat = statSync(sourcePath)

    if (stat.isDirectory()) {
      const newTargetDir = join(targetDir, entry)
      if (!existsSync(newTargetDir)) {
        mkdirSync(newTargetDir, { recursive: true })
      }
      copyAndSanitizeMarkdownFiles(sourcePath, newTargetDir)
    }
    else if (entry.endsWith('.md')) {
      const targetPath = join(targetDir, entry)
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
    }
  }
}
