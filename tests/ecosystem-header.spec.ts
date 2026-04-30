import { expect, test } from '@playwright/test'

test('ecosystem page has overlay header', async ({ page }) => {
  await page.goto('/ecosystem')

  // Check that the overlay header is present
  const header = page.locator('header').first()
  await expect(header).toBeVisible()

  // Verify navigation buttons are present
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Websites' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Platforms' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ecosystem' })).toBeVisible()
})
