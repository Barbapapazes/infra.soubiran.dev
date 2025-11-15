import { expect, test } from '@playwright/test'

test.describe('API JSON files', () => {
  test.describe('websites', () => {
    test('websites.json exists and has valid structure', async ({ request }) => {
      const response = await request.get('/api/websites.json')

      expect(response.ok()).toBeTruthy()
      expect(response.status()).toBe(200)

      const websites = await response.json()

      // Should be an array
      expect(Array.isArray(websites)).toBe(true)

      // Should have at least one website
      expect(websites.length).toBeGreaterThan(0)

      // Validate first website has required fields
      const firstWebsite = websites[0]
      expect(firstWebsite).toHaveProperty('path')
      expect(firstWebsite.path).toMatch(/^\/websites\//)
      expect(firstWebsite).toHaveProperty('title')
      expect(typeof firstWebsite.title).toBe('string')
    })

    test('websites.json contains expected metadata fields', async ({ request }) => {
      const response = await request.get('/api/websites.json')
      const websites = await response.json()

      for (const website of websites) {
      // Each website should have a path
        expect(website.path).toBeTruthy()
        expect(typeof website.path).toBe('string')

        // Title should be present
        expect(website.title).toBeTruthy()
        expect(typeof website.title).toBe('string')

        // Optional fields that may be present
        if (website.url) {
          expect(typeof website.url).toBe('string')
          expect(website.url).toMatch(/^https?:\/\//)
        }

        if (website.repository) {
          const isString = typeof website.repository === 'string'
          const isObject = typeof website.repository === 'object' && website.repository !== null
          expect(isString || isObject).toBe(true)
        }
      }
    })

    test('all paths in websites.json are unique', async ({ request }) => {
      const response = await request.get('/api/websites.json')
      const websites = await response.json()

      const paths = websites.map((w: any) => w.path)
      const uniquePaths = new Set(paths)

      expect(paths.length).toBe(uniquePaths.size)
    })
  })

  test.describe('platforms', () => {
    test('platforms.json exists and has valid structure', async ({ request }) => {
      const response = await request.get('/api/platforms.json')

      expect(response.ok()).toBeTruthy()
      expect(response.status()).toBe(200)

      const platforms = await response.json()

      // Should be an array
      expect(Array.isArray(platforms)).toBe(true)

      // Should have at least one platform
      expect(platforms.length).toBeGreaterThan(0)

      // Validate first platform has required fields
      const firstPlatform = platforms[0]
      expect(firstPlatform).toHaveProperty('path')
      expect(firstPlatform.path).toMatch(/^\/platforms\//)
      expect(firstPlatform).toHaveProperty('title')
      expect(typeof firstPlatform.title).toBe('string')
    })

    test('platforms.json contains expected metadata fields', async ({ request }) => {
      const response = await request.get('/api/platforms.json')
      const platforms = await response.json()

      for (const platform of platforms) {
      // Each platform should have a path
        expect(platform.path).toBeTruthy()
        expect(typeof platform.path).toBe('string')

        // Title should be present
        expect(platform.title).toBeTruthy()
        expect(typeof platform.title).toBe('string')

        // Optional fields that may be present
        if (platform.url) {
          expect(typeof platform.url).toBe('string')
          expect(platform.url).toMatch(/^https?:\/\//)
        }

        if (platform.repository) {
          const isString = typeof platform.repository === 'string'
          const isObject = typeof platform.repository === 'object' && platform.repository !== null
          expect(isString || isObject).toBe(true)
        }
      }
    })

    test('all paths in platforms.json are unique', async ({ request }) => {
      const response = await request.get('/api/platforms.json')
      const platforms = await response.json()

      const paths = platforms.map((p: any) => p.path)
      const uniquePaths = new Set(paths)

      expect(paths.length).toBe(uniquePaths.size)
    })
  })

  test.describe('meta', () => {
    test('meta.json exists and has valid structure', async ({ request }) => {
      const response = await request.get('/api/meta.json')

      expect(response.ok()).toBeTruthy()
      expect(response.status()).toBe(200)

      const pages = await response.json()

      // Should be an array
      expect(Array.isArray(pages)).toBe(true)

      // Should have at least one page
      expect(pages.length).toBeGreaterThan(0)

      // Validate first page has required fields
      const firstPage = pages[0]
      expect(firstPage).toHaveProperty('id')
      expect(firstPage).toHaveProperty('title')
      expect(firstPage).toHaveProperty('uri')
      expect(firstPage).toHaveProperty('url')
      expect(firstPage).toHaveProperty('hash')
    })

    test('meta.json contains expected metadata fields', async ({ request }) => {
      const response = await request.get('/api/meta.json')
      const pages = await response.json()

      for (const page of pages) {
        // ID should be a valid UUIDv4
        expect(typeof page.id).toBe('string')
        expect(page.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)

        // Title should be present and non-empty
        expect(page.title).toBeTruthy()
        expect(typeof page.title).toBe('string')

        // URI should be present and start with /
        expect(page.uri).toBeTruthy()
        expect(typeof page.uri).toBe('string')
        expect(page.uri).toMatch(/^\//)

        // URL should be a valid HTTPS URL
        expect(page.url).toBeTruthy()
        expect(typeof page.url).toBe('string')
        expect(page.url).toMatch(/^https:\/\//)

        // Description is optional
        if (page.description) {
          expect(typeof page.description).toBe('string')
        }

        // Hash should be present and be a SHA-256 hash (64 hex characters)
        expect(page.hash).toBeTruthy()
        expect(typeof page.hash).toBe('string')
        expect(page.hash).toMatch(/^[a-f0-9]{64}$/)
      }
    })

    test('all IDs in meta.json are unique UUIDs', async ({ request }) => {
      const response = await request.get('/api/meta.json')
      const pages = await response.json()

      const ids = pages.map((p: any) => p.id)

      // All IDs should be unique
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)

      // All IDs should be valid UUIDs
      for (const id of ids) {
        expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
      }
    })

    test('all URIs in meta.json are unique', async ({ request }) => {
      const response = await request.get('/api/meta.json')
      const pages = await response.json()

      const uris = pages.map((p: any) => p.uri)
      const uniqueUris = new Set(uris)

      expect(uris.length).toBe(uniqueUris.size)
    })

    test('all hashes in meta.json are valid SHA-256 hashes', async ({ request }) => {
      const response = await request.get('/api/meta.json')
      const pages = await response.json()

      for (const page of pages) {
        // SHA-256 hash should be 64 hexadecimal characters
        expect(page.hash).toMatch(/^[a-f0-9]{64}$/)
      }
    })
  })
})
