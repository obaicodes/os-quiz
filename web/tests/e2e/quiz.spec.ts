import { expect, test, type Page } from '@playwright/test'

async function startQuiz(page: Page, units: number[], count: number) {
  await page.goto('/#/new')
  for (const u of units)
    await page.getByRole('checkbox', { name: new RegExp(`^Unit ${u}:`) }).check()
  await page.getByLabel('Number of questions').fill(String(count))
  await page.getByLabel('Number of questions').blur()
  await page.getByRole('button', { name: 'Start quiz' }).click()
  await expect(page.getByText(`Question 1 of ${count}`)).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})

test('full quiz: answer, flag, hint, submit, result, review, history', async ({ page }) => {
  await startQuiz(page, [1, 3], 5)

  // Hint countdown and the "Show hint now" button, which also reveals the unit.
  await expect(page.getByText(/Hint in 1:5\d|Hint in 2:00/)).toBeVisible()
  await page.getByRole('button', { name: 'Show hint now' }).click()
  await expect(page.getByText(/^Unit [13] — /)).toBeVisible()
  await expect(page.getByText('Hint:')).toBeVisible()

  // Answer the first three questions, flag the second, skip the rest.
  for (let i = 0; i < 3; i++) {
    await page.getByRole('radio').first().click()
    await expect(page.getByRole('radio').first()).toHaveAttribute('aria-checked', 'true')
    if (i === 1) await page.getByRole('button', { name: 'Flag for review' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
  }
  await expect(page.getByRole('button', { name: /Question 2, answered, flagged/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Question 5, not answered/ })).toBeVisible()

  await page.getByRole('button', { name: 'Submit' }).click()
  const dialog = page.getByRole('dialog', { name: 'Submit the quiz?' })
  await expect(dialog).toContainText('Unanswered: 2')
  await expect(dialog).toContainText('Flagged for review: 1')
  await dialog.getByRole('button', { name: 'Submit' }).click()

  await expect(page.getByRole('heading', { name: 'Result' })).toBeVisible()
  await expect(page.locator('.percent')).toBeVisible()
  await expect(page.locator('dt', { hasText: 'Unanswered' }).locator('+ dd')).toHaveText('2')
  await expect(page.locator('dt', { hasText: 'Hints used' }).locator('+ dd')).toHaveText('1')
  await expect(page.getByRole('cell', { name: /^Unit 1 — / })).toBeVisible()

  await page.getByRole('button', { name: 'Review' }).click()
  await expect(page.locator('article')).toHaveCount(5)
  await page.getByRole('button', { name: /^Flagged/ }).click()
  await expect(page.locator('article')).toHaveCount(1)
  await page.getByRole('button', { name: /^Wrong/ }).click()
  await expect(page.locator('article .badge.correct')).toHaveCount(0)
  await page.getByRole('button', { name: /^All/ }).click()
  await expect(
    page.getByText('Correct answer').or(page.getByText('Your answer ✓')).first(),
  ).toBeVisible()

  await page.getByRole('link', { name: 'History' }).click()
  await expect(page.getByRole('heading', { name: 'Past quizzes' })).toBeVisible()
  await expect(page.getByText(/Units 1, 3 · 5 questions/)).toBeVisible()
})

test('save & exit keeps the quiz; resume continues where it stopped', async ({ page }) => {
  await startQuiz(page, [5], 6)
  await page.getByRole('button', { name: 'Next' }).click()
  await page.getByRole('radio').nth(2).click()
  const chosen = await page.getByRole('radio').nth(2).textContent()
  await page.getByRole('button', { name: 'Save & Exit' }).click()

  await page.reload()
  await expect(page.getByText('Unfinished quiz', { exact: true })).toBeVisible()
  await expect(page.getByText(/1\/6 answered/)).toBeVisible()
  await page.getByRole('link', { name: 'Resume' }).click()
  await expect(page.getByText('Question 2 of 6')).toBeVisible()
  await expect(page.getByRole('radio').nth(2)).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByRole('radio').nth(2)).toHaveText(chosen!)
})

test('cancel deletes the quiz after confirmation', async ({ page }) => {
  await startQuiz(page, [2], 5)
  await page.getByRole('button', { name: 'Cancel quiz' }).click()
  await page.getByRole('button', { name: 'Keep quiz' }).click()
  await expect(page.getByText('Question 1 of 5')).toBeVisible()
  await page.getByRole('button', { name: 'Cancel quiz' }).click()
  await page.getByRole('button', { name: 'Delete quiz' }).click()
  await expect(page.getByRole('link', { name: 'New quiz' }).first()).toBeVisible()
  await expect(page.getByText('Unfinished quiz', { exact: true })).toHaveCount(0)
})

test('starting a new quiz while one is unfinished asks first', async ({ page }) => {
  await startQuiz(page, [4], 5)
  await page.getByRole('button', { name: 'Save & Exit' }).click()
  await page.goto('/#/new')
  await page.getByRole('button', { name: 'Select all' }).click()
  await page.getByRole('button', { name: 'Start quiz' }).click()
  const dialog = page.getByRole('dialog', { name: 'You have an unfinished quiz' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: /Delete it/ }).click()
  await expect(page.getByText('Question 1 of 10')).toBeVisible()
})

test('retakes: same questions and new questions', async ({ page }) => {
  await startQuiz(page, [4], 5)
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Submit' }).click()
  const firstIds = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('osq:v1:history')!)[0].items.map((i: { qid: string }) => i.qid),
  )

  await page.getByRole('button', { name: 'Retake (same questions)' }).click()
  await expect(page.getByText('Question 1 of 5')).toBeVisible()
  const sameIds = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('osq:v1:active')!).items.map((i: { qid: string }) => i.qid),
  )
  expect([...sameIds].sort()).toEqual([...firstIds].sort())

  await page.getByRole('button', { name: 'Submit' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Submit' }).click()
  await page.getByRole('button', { name: 'Retake (new questions)' }).click()
  await expect(page.getByText('Question 1 of 5')).toBeVisible()
  const newIds: string[] = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('osq:v1:active')!).items.map((i: { qid: string }) => i.qid),
  )
  expect(newIds.filter((id) => firstIds.includes(id))).toHaveLength(0)
  expect(newIds.every((id) => id.startsWith('c4-'))).toBe(true)
})

test('hint appears by itself after two minutes without leaving the question', async ({ page }) => {
  await page.clock.install()
  await startQuiz(page, [5], 5)
  await expect(page.getByText(/Hint in/)).toBeVisible()
  await page.clock.runFor(121_000)
  await expect(page.getByText('Hint:')).toBeVisible()
  await expect(page.getByText('Question 1 of 5')).toBeVisible()
})

test('a submitted or cancelled quiz does not come back', async ({ page }) => {
  await startQuiz(page, [5], 5)
  await page.getByRole('radio').first().click()
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('heading', { name: 'Result' })).toBeVisible()
  await page.waitForTimeout(1200)
  expect(await page.evaluate(() => localStorage.getItem('osq:v1:active'))).toBeNull()
  await page.goto('/')
  await expect(page.getByText('Unfinished quiz', { exact: true })).toHaveCount(0)
})

test('leaving through the header keeps the quiz and its time', async ({ page }) => {
  await startQuiz(page, [3], 5)
  await page.getByRole('radio').first().click()
  await page.getByRole('link', { name: 'History' }).click()
  await page.reload()
  await expect(page.getByText(/1\/5 answered/)).toBeVisible()
})
