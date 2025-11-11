import { expect, test } from '@playwright/test'

test('url meta tag is present on platform pages', async ({ page }) => {
  await page.goto('/platforms/chat-soubiran-dev')

  const url = await page.locator('meta[property="og:url"]').getAttribute('content')

  expect(url).not.toBeNull()
  expect(url).toContain('https://chat.soubiran.dev')
})

test('url meta tag is present on website pages', async ({ page }) => {
  await page.goto('/websites/soubiran-dev')

  const url = await page.locator('meta[property="og:url"]').getAttribute('content')

  expect(url).not.toBeNull()
  expect(url).toContain('https://soubiran.dev')
})
