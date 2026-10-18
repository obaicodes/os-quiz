import { describe, expect, it } from 'vitest'
import { QUESTIONS } from '../../src/lib/bank'
import { seeded } from '../../src/lib/random'
import { allocate, markSeen, rankBySeen, selectQuestions } from '../../src/lib/select'
import type { Question, UnitId } from '../../src/lib/types'

const avail = (entries: [UnitId, number][]) => new Map<UnitId, number>(entries)
const sum = (m: Map<UnitId, number>) => [...m.values()].reduce((a, b) => a + b, 0)

describe('allocate', () => {
  it('splits evenly and spreads the remainder', () => {
    const plan = allocate(
      avail([
        [1, 50],
        [2, 50],
        [3, 50],
      ]),
      10,
      seeded(1),
    )
    expect(sum(plan)).toBe(10)
    expect([...plan.values()].sort()).toEqual([3, 3, 4])
  })

  it('moves the shortfall of a small unit to the others', () => {
    const plan = allocate(
      avail([
        [1, 2],
        [2, 50],
        [3, 50],
      ]),
      12,
      seeded(2),
    )
    expect(plan.get(1)).toBe(2)
    expect(plan.get(2)! + plan.get(3)!).toBe(10)
    expect(Math.abs(plan.get(2)! - plan.get(3)!)).toBeLessThanOrEqual(1)
  })

  it('never exceeds what is available', () => {
    const plan = allocate(
      avail([
        [1, 3],
        [2, 4],
      ]),
      25,
      seeded(3),
    )
    expect(plan.get(1)).toBe(3)
    expect(plan.get(2)).toBe(4)
  })

  it('handles a single unit', () => {
    expect(allocate(avail([[4, 52]]), 25, seeded(4)).get(4)).toBe(25)
  })
})

describe('rankBySeen', () => {
  const qs = ['a', 'b', 'c', 'd'].map((id) => ({ id }) as Question)

  it('puts unseen first, then the oldest seen', () => {
    const seen = {
      a: { count: 2, lastSeen: 100 },
      b: { count: 1, lastSeen: 500 },
      c: { count: 1, lastSeen: 200 },
    }
    expect(rankBySeen(qs, seen, seeded(5)).map((q) => q.id)).toEqual(['d', 'c', 'b', 'a'])
  })
})

describe('selectQuestions', () => {
  it('returns the requested count from the chosen units only, without duplicates', () => {
    for (let seed = 0; seed < 20; seed++) {
      const picked = selectQuestions(QUESTIONS, [2, 4], 25, {}, seeded(seed))
      expect(picked).toHaveLength(25)
      expect(new Set(picked.map((q) => q.id)).size).toBe(25)
      expect(picked.every((q) => q.unit === 2 || q.unit === 4)).toBe(true)
    }
  })

  it('avoids questions seen before while unseen ones remain', () => {
    const first = selectQuestions(QUESTIONS, [4], 25, {}, seeded(7))
    const seen = markSeen(
      {},
      first.map((q) => q.id),
      1000,
    )
    const second = selectQuestions(QUESTIONS, [4], 25, seen, seeded(8))
    const overlap = second.filter((q) => seen[q.id])
    expect(overlap).toHaveLength(0)
  })

  it('reuses the oldest-seen questions when unseen ones run out', () => {
    // Unit 4 has 52 questions: after two quizzes of 25, only 2 are unseen.
    const r = seeded(9)
    const a = selectQuestions(QUESTIONS, [4], 25, {}, r)
    let seen = markSeen(
      {},
      a.map((q) => q.id),
      1,
    )
    const b = selectQuestions(QUESTIONS, [4], 25, seen, r)
    seen = markSeen(
      seen,
      b.map((q) => q.id),
      2,
    )
    const c = selectQuestions(QUESTIONS, [4], 25, seen, r)
    const fromA = c.filter((q) => a.some((x) => x.id === q.id))
    expect(c.filter((q) => !seen[q.id])).toHaveLength(2)
    expect(fromA).toHaveLength(23)
  })
})

describe('markSeen', () => {
  it('counts views and keeps the latest time', () => {
    const s = markSeen(markSeen({}, ['x'], 10), ['x', 'y'], 20)
    expect(s).toEqual({ x: { count: 2, lastSeen: 20 }, y: { count: 1, lastSeen: 20 } })
  })
})
