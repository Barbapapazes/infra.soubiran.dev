import { expect, test } from '@playwright/test'

test('description length is between 110 and 160 characters', async ({ page }) => {
  await page.goto('/')

  const description = await page.locator('meta[name="description"]').getAttribute('content')
  
  expect(description).not.toBeNull()
  expect(description!.length).toBeGreaterThanOrEqual(110)
  expect(description!.length).toBeLessThanOrEqual(160)
})
