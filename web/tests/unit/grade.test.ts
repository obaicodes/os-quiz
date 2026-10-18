import { describe, expect, it } from 'vitest'
import { gradeFor, scoreAttempt } from '../../src/lib/grade'
import type { Attempt, AttemptItem, Question } from '../../src/lib/types'

describe('gradeFor', () => {
  it.each([
    [100, 'Excellent'],
    [90, 'Excellent'],
    [89, 'Very Good'],
    [80, 'Very Good'],
    [79, 'Good'],
    [70, 'Good'],
    [69, 'Pass'],
    [60, 'Pass'],
    [59, 'Fail'],
    [0, 'Fail'],
  ])('%i%% -> %s', (p, g) => expect(gradeFor(p)).toBe(g))
})

describe('scoreAttempt', () => {
  const bank: Record<string, Question> = {
    a: { id: 'a', unit: 1, answer: 2 } as Question,
    b: { id: 'b', unit: 1, answer: 0 } as Question,
    c: { id: 'c', unit: 3, answer: 1 } as Question,
  }
  const item = (qid: string, answer: number | null, hintShown = false): AttemptItem => ({
    qid,
    order: [0, 1, 2, 3],
    answer,
    flagged: false,
    timeMs: 0,
    hintShown,
  })
  const attempt = (items: AttemptItem[]) => ({ items }) as Attempt

  it('counts correct, wrong and unanswered, and breaks them down by unit', () => {
    const s = scoreAttempt(
      attempt([item('a', 2, true), item('b', 3), item('c', null)]),
      (id) => bank[id],
    )
    expect(s).toMatchObject({
      total: 3,
      correct: 1,
      wrong: 1,
      unanswered: 1,
      percent: 33,
      grade: 'Fail',
    })
    expect(s.hintsUsed).toBe(1)
    expect(s.byUnit).toEqual([
      { unit: 1, total: 2, correct: 1, wrong: 1, unanswered: 0, percent: 50 },
      { unit: 3, total: 1, correct: 0, wrong: 0, unanswered: 1, percent: 0 },
    ])
  })

  it('rounds the percent down so it matches the grade band', () => {
    // 8 of 9 = 88.9% -> 88, Very Good (not 89 rounded up to 90 / Excellent territory)
    const items = Array.from({ length: 9 }, (_, i) => item('a', i < 8 ? 2 : 0))
    expect(scoreAttempt(attempt(items), (id) => bank[id])).toMatchObject({
      percent: 88,
      grade: 'Very Good',
    })
  })

  it('leaves out questions that were removed from the bank', () => {
    const s = scoreAttempt(attempt([item('a', 2), item('gone', 1)]), (id) => bank[id])
    expect(s).toMatchObject({ total: 1, correct: 1, removed: 1, percent: 100 })
  })
})
