import { expect, test } from '@playwright/test'

test.describe('Markdown files', () => {
  test.describe('file existence', () => {
    test('root index.md exists', async ({ request }) => {
      const response = await request.get('/index.md')

      expect(response.ok()).toBeTruthy()
      expect(response.status()).toBe(200)
    })

    test('platforms.md exists (converted from platforms/index.md)', async ({ request }) => {
      const response = await request.get('/platforms.md')

      expect(response.ok()).toBeTruthy()
      expect(response.status()).toBe(200)
    })

    test('websites.md exists (converted from websites/index.md)', async ({ request }) => {
      const response = await request.get('/websites.md')

      expect(response.ok()).toBeTruthy()
      expect(response.status()).toBe(200)
    })

    test('platforms/chat-soubiran-dev.md exists', async ({ request }) => {
      const response = await request.get('/platforms/chat-soubiran-dev.md')

      expect(response.ok()).toBeTruthy()
      expect(response.status()).toBe(200)
    })

    test('platforms/eats-soubiran-dev.md exists', async ({ request }) => {
      const response = await request.get('/platforms/eats-soubiran-dev.md')

      expect(response.ok()).toBeTruthy()
      expect(response.status()).toBe(200)
    })

    test('websites/infra-soubiran-dev.md exists', async ({ request }) => {
      const response = await request.get('/websites/infra-soubiran-dev.md')

      expect(response.ok()).toBeTruthy()
      expect(response.status()).toBe(200)
    })

    test('websites/soubiran-dev.md exists', async ({ request }) => {
      const response = await request.get('/websites/soubiran-dev.md')

      expect(response.ok()).toBeTruthy()
      expect(response.status()).toBe(200)
    })

    test('websites/talks-soubiran-dev.md exists', async ({ request }) => {
      const response = await request.get('/websites/talks-soubiran-dev.md')

      expect(response.ok()).toBeTruthy()
      expect(response.status()).toBe(200)
    })
  })

  test.describe('content sanitization', () => {
    test('root index.md has title as H1', async ({ request }) => {
      const response = await request.get('/index.md')
      const content = await response.text()

      // Should start with H1 title
      expect(content).toMatch(/^# Estéban's Infra/)
    })

    test('root index.md has no frontmatter', async ({ request }) => {
      const response = await request.get('/index.md')
      const content = await response.text()

      // Should not start with frontmatter delimiters
      expect(content).not.toMatch(/^---/)
    })

    test('root index.md has no HTML tags', async ({ request }) => {
      const response = await request.get('/index.md')
      const content = await response.text()

      // Should not contain HTML tags like <Component />
      expect(content).not.toMatch(/<[A-Z][^>]*>/)
    })

    test('platforms.md has title as H1', async ({ request }) => {
      const response = await request.get('/platforms.md')
      const content = await response.text()

      // Should start with H1 title
      expect(content).toMatch(/^# Platforms/)
    })

    test('websites.md has title as H1', async ({ request }) => {
      const response = await request.get('/websites.md')
      const content = await response.text()

      // Should start with H1 title
      expect(content).toMatch(/^# Websites/)
    })

    test('platforms/chat-soubiran-dev.md has sanitized content', async ({ request }) => {
      const response = await request.get('/platforms/chat-soubiran-dev.md')
      const content = await response.text()

      // Should have H1 title
      expect(content).toMatch(/^# chat\.soubiran\.dev/)

      // Should not have frontmatter
      expect(content).not.toMatch(/^---/)

      // Should have actual content (not just title)
      expect(content.length).toBeGreaterThan(50)
    })

    test('websites/soubiran-dev.md has sanitized content', async ({ request }) => {
      const response = await request.get('/websites/soubiran-dev.md')
      const content = await response.text()

      // Should have H1 title
      expect(content).toMatch(/^# soubiran\.dev/)

      // Should not have frontmatter
      expect(content).not.toMatch(/^---/)

      // Should have actual content (not just title)
      expect(content.length).toBeGreaterThan(50)
    })
  })

  test.describe('markdown structure', () => {
    test('all markdown files have valid markdown format', async ({ request }) => {
      const files = [
        '/index.md',
        '/platforms.md',
        '/websites.md',
        '/platforms/chat-soubiran-dev.md',
        '/platforms/eats-soubiran-dev.md',
        '/websites/infra-soubiran-dev.md',
        '/websites/soubiran-dev.md',
        '/websites/talks-soubiran-dev.md',
      ]

      for (const file of files) {
        const response = await request.get(file)
        const content = await response.text()

        // Should start with # (H1)
        expect(content).toMatch(/^#\s+/)

        // Should not be empty
        expect(content.trim().length).toBeGreaterThan(0)
      }
    })

    test('markdown files contain expected markdown elements', async ({ request }) => {
      const response = await request.get('/index.md')
      const content = await response.text()

      // Should have at least one paragraph
      expect(content).toMatch(/\n\n/)

      // Should have links in markdown format
      expect(content).toMatch(/\[.+\]\(.+\)/)
    })
  })
})
