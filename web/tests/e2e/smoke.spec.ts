import { expect, test } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Operating Systems')
  await expect(page.getByText(/\d+ questions/)).toBeVisible()
  await expect(page.getByRole('link', { name: 'New quiz' }).first()).toBeVisible()
})

test('new quiz page lists the five units', async ({ page }) => {
  await page.goto('/#/new')
  await expect(page.getByRole('checkbox')).toHaveCount(5)
  await expect(page.getByText('Unit 5: CPU Scheduling')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Start quiz' })).toBeDisabled()
})
