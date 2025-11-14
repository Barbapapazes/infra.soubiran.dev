import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'

// Dynamically discover markdown files from the dist directory
function getMarkdownFiles(): string[] {
  const distPath = join(process.cwd(), 'dist')
  const files: string[] = []

  function scanDir(relativePath = ''): void {
    const entries = readdirSync(join(distPath, relativePath), { withFileTypes: true })

    for (const entry of entries) {
      const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name

      if (entry.isDirectory()) {
        scanDir(relPath)
      }
      else if (entry.name.endsWith('.md')) {
        files.push(`/${relPath}`)
      }
    }
  }

  scanDir()
  return files.sort()
}

// Get all markdown files dynamically
const markdownFiles = getMarkdownFiles()

test.describe('Markdown files', () => {
  test.describe('file existence', () => {
    test('at least one markdown file exists', () => {
      expect(markdownFiles.length).toBeGreaterThan(0)
    })

    for (const file of markdownFiles) {
      test(`${file} exists and is accessible`, async ({ request }) => {
        const response = await request.get(file)

        expect(response.ok()).toBeTruthy()
        expect(response.status()).toBe(200)
      })
    }
  })

  test.describe('content sanitization', () => {
    for (const file of markdownFiles) {
      test(`${file} has title as H1`, async ({ request }) => {
        const response = await request.get(file)
        const content = await response.text()

        // Should start with H1 title
        expect(content).toMatch(/^#\s+/)
      })

      test(`${file} has no frontmatter`, async ({ request }) => {
        const response = await request.get(file)
        const content = await response.text()

        // Should not start with frontmatter delimiters
        expect(content).not.toMatch(/^---/)
      })

      test(`${file} has no HTML component tags`, async ({ request }) => {
        const response = await request.get(file)
        const content = await response.text()

        // Should not contain HTML component tags like <Component />
        expect(content).not.toMatch(/<[A-Z][^>]*>/)
      })
    }
  })

  test.describe('markdown structure', () => {
    test('all markdown files have valid markdown format', async ({ request }) => {
      for (const file of markdownFiles) {
        const response = await request.get(file)
        const content = await response.text()

        // Should start with # (H1)
        expect(content).toMatch(/^#\s+/, `${file} should start with H1`)

        // Should not be empty
        expect(content.trim().length).toBeGreaterThan(0, `${file} should not be empty`)
      }
    })

    test('markdown files contain expected markdown elements', async ({ request }) => {
      // Test with the root index.md as a representative sample
      const rootFile = markdownFiles.find(f => f === '/index.md')
      if (rootFile) {
        const response = await request.get(rootFile)
        const content = await response.text()

        // Should have at least one paragraph
        expect(content).toMatch(/\n\n/)

        // Should have links in markdown format
        expect(content).toMatch(/\[.+\]\(.+\)/)
      }
    })
  })
})
