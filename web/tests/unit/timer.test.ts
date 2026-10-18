import { describe, expect, it } from 'vitest'
import { advance, Clock, formatDuration, HINT_DELAY_MS, hintRemainingMs } from '../../src/lib/timer'
import type { Attempt, AttemptItem } from '../../src/lib/types'

const item = (): AttemptItem => ({
  qid: 'q',
  order: [0, 1, 2, 3],
  answer: null,
  flagged: false,
  timeMs: 0,
  hintShown: false,
})

describe('Clock', () => {
  it('returns the time between readings and nothing while stopped', () => {
    let t = 1000
    const c = new Clock(() => t)
    expect(c.take()).toBe(0)
    c.start()
    t = 1600
    expect(c.take()).toBe(600)
    t = 1650
    expect(c.take()).toBe(50)
    c.stop()
    t = 9000
    expect(c.take()).toBe(0)
  })

  it('ignores the system clock going back', () => {
    let t = 5000
    const c = new Clock(() => t)
    c.start()
    t = 4000
    expect(c.take()).toBe(0)
  })
})

describe('advance', () => {
  it('adds time to the quiz and only to the current question', () => {
    const a = { items: [item(), item()], current: 1, elapsedMs: 0 } as Attempt
    advance(a, 1500)
    expect(a.elapsedMs).toBe(1500)
    expect(a.items[0].timeMs).toBe(0)
    expect(a.items[1].timeMs).toBe(1500)
  })

  it('reveals the hint after two minutes in total, across visits', () => {
    const a = { items: [item(), item()], current: 0, elapsedMs: 0 } as Attempt
    advance(a, HINT_DELAY_MS - 1000)
    expect(a.items[0].hintShown).toBe(false)
    expect(hintRemainingMs(a.items[0])).toBe(1000)
    a.current = 1
    advance(a, 5000)
    a.current = 0
    advance(a, 1000)
    expect(a.items[0].hintShown).toBe(true)
    expect(hintRemainingMs(a.items[0])).toBe(0)
    expect(a.items[1].hintShown).toBe(false)
  })
})

describe('formatDuration', () => {
  it.each([
    [0, '0:00'],
    [59_999, '0:59'],
    [61_000, '1:01'],
    [3_600_000, '1:00:00'],
    [3_725_000, '1:02:05'],
  ])('%i ms -> %s', (ms, s) => expect(formatDuration(ms)).toBe(s))
})
