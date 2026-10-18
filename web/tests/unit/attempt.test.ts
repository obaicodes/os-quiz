import { describe, expect, it } from 'vitest'
import {
  choose,
  dropMissing,
  flaggedCount,
  goTo,
  newAttempt,
  retakeNew,
  retakeSame,
  toggleFlag,
  unansweredCount,
} from '../../src/lib/attempt'
import { getQuestion, QUESTIONS } from '../../src/lib/bank'
import { seeded } from '../../src/lib/random'
import { markSeen } from '../../src/lib/select'

const make = (seed = 1) =>
  newAttempt({ pool: QUESTIONS, units: [5, 1], count: 10, seen: {}, now: 1000, rand: seeded(seed) })

describe('newAttempt', () => {
  it('creates a fresh attempt with shuffled options', () => {
    const a = make()
    expect(a).toMatchObject({
      createdAt: 1000,
      finishedAt: null,
      units: [1, 5],
      current: 0,
      elapsedMs: 0,
    })
    expect(a.items).toHaveLength(10)
    for (const i of a.items) {
      expect([...i.order].sort()).toEqual([0, 1, 2, 3])
      expect(i).toMatchObject({ answer: null, flagged: false, timeMs: 0, hintShown: false })
    }
    expect(a.items.some((i) => i.order.join() !== '0,1,2,3')).toBe(true)
  })
})

describe('answering', () => {
  it('stores the bank option index, not the display position', () => {
    const a = make()
    const item = a.items[0]
    item.order = [2, 0, 3, 1]
    choose(a, 0)
    expect(item.answer).toBe(2)
    choose(a, 3)
    expect(item.answer).toBe(1)
  })

  it('tracks flags, unanswered count and navigation bounds', () => {
    const a = make()
    toggleFlag(a)
    goTo(a, 99)
    expect(a.current).toBe(9)
    choose(a, 0)
    goTo(a, -1)
    expect(a.current).toBe(0)
    expect(flaggedCount(a)).toBe(1)
    expect(unansweredCount(a)).toBe(9)
  })
})

describe('retakes', () => {
  it('same: keeps the questions, resets the state and links to the original', () => {
    const a = make()
    a.items[0].answer = 1
    a.items[0].hintShown = true
    const b = retakeSame(a, getQuestion, 2000, seeded(2))
    expect(b.id).not.toBe(a.id)
    expect(b.retakeOf).toBe(a.id)
    expect(b.items.map((i) => i.qid).sort()).toEqual(a.items.map((i) => i.qid).sort())
    expect(b.items.every((i) => i.answer === null && !i.hintShown)).toBe(true)
  })

  it('new: same units and count, avoiding the questions already seen', () => {
    const a = make()
    const seen = markSeen(
      {},
      a.items.map((i) => i.qid),
      1000,
    )
    const b = retakeNew(a, { pool: QUESTIONS, seen, rand: seeded(3) })
    expect(b.units).toEqual(a.units)
    expect(b.items).toHaveLength(10)
    expect(b.items.filter((i) => seen[i.qid])).toHaveLength(0)
  })
})

describe('dropMissing', () => {
  it('removes deleted questions and keeps the current one selected', () => {
    const a = make()
    const gone = a.items[1].qid
    const current = a.items[3].qid
    a.current = 3
    dropMissing(a, (id) => (id === gone ? undefined : getQuestion(id)))
    expect(a.items).toHaveLength(9)
    expect(a.items[a.current].qid).toBe(current)
  })
})
