import { expect, test } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Estéban's Infra/)
})

test('has suffix', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/· Estéban Soubiran/)
})

test('suffix is last', async ({ page }) => {
  await page.goto('/')

  const title = await page.title()
  expect(title.endsWith('· Estéban Soubiran')).toBe(true)
})
