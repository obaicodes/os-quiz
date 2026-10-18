// Scoring and grades (docs/SYSTEM_DESIGN.md 5.3).

import type { Attempt, Question, UnitId } from './types'

export type Grade = 'Excellent' | 'Very Good' | 'Good' | 'Pass' | 'Fail'

/** `percent` is 0–100. */
export function gradeFor(percent: number): Grade {
  if (percent >= 90) return 'Excellent'
  if (percent >= 80) return 'Very Good'
  if (percent >= 70) return 'Good'
  if (percent >= 60) return 'Pass'
  return 'Fail'
}

export interface Tally {
  total: number
  correct: number
  wrong: number
  unanswered: number
  /** Rounded down, so the shown number never lands in a higher grade band than the score. */
  percent: number
}

export interface Score extends Tally {
  grade: Grade
  hintsUsed: number
  byUnit: ({ unit: UnitId } & Tally)[]
  /** Items whose question is no longer in the bank; they are left out of the score. */
  removed: number
}

function tally(results: ('correct' | 'wrong' | 'unanswered')[]): Tally {
  const count = (r: string) => results.filter((x) => x === r).length
  const total = results.length
  const correct = count('correct')
  return {
    total,
    correct,
    wrong: count('wrong'),
    unanswered: count('unanswered'),
    percent: total ? Math.floor((correct * 100) / total) : 0,
  }
}

export function scoreAttempt(
  attempt: Attempt,
  getQuestion: (id: string) => Question | undefined,
): Score {
  const rows: { unit: UnitId; result: 'correct' | 'wrong' | 'unanswered' }[] = []
  let removed = 0
  for (const item of attempt.items) {
    const q = getQuestion(item.qid)
    if (!q) {
      removed++
      continue
    }
    const result =
      item.answer === null ? 'unanswered' : item.answer === q.answer ? 'correct' : 'wrong'
    rows.push({ unit: q.unit, result })
  }
  const all = tally(rows.map((r) => r.result))
  const units = [...new Set(rows.map((r) => r.unit))].sort()
  return {
    ...all,
    grade: gradeFor(all.percent),
    hintsUsed: attempt.items.filter((i) => i.hintShown).length,
    byUnit: units.map((unit) => ({
      unit,
      ...tally(rows.filter((r) => r.unit === unit).map((r) => r.result)),
    })),
    removed,
  }
}
