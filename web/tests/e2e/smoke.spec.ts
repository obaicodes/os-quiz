import { expect, test } from '@playwright/test'

test('home page loads the question bank', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Operating Systems')
  await expect(page.getByText(/Question bank: \d+ questions/)).toBeVisible()
  await expect(page.getByText(/Unit 5: CPU Scheduling/)).toBeVisible()
})
