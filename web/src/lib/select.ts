// Question selection (docs/SYSTEM_DESIGN.md 5.1).

import { shuffle, type Rand } from './random'
import type { Question, SeenInfo, UnitId } from './types'

export const MIN_COUNT = 5
export const MAX_COUNT = 25

export type SeenMap = Record<string, SeenInfo>

/**
 * How many questions to take from each unit.
 * Splits `count` evenly, gives the remainder to random units, then moves any shortfall
 * (a unit with too few questions) to units that still have spare questions.
 * The total never exceeds the number of available questions.
 */
export function allocate(
  available: Map<UnitId, number>,
  count: number,
  rand: Rand = Math.random,
): Map<UnitId, number> {
  const units = shuffle([...available.keys()], rand)
  const result = new Map<UnitId, number>(units.map((u) => [u, 0]))
  if (units.length === 0) return result

  const base = Math.floor(count / units.length)
  units.forEach((u, i) => result.set(u, base + (i < count % units.length ? 1 : 0)))

  let shortfall = 0
  for (const u of units) {
    const extra = result.get(u)! - available.get(u)!
    if (extra > 0) {
      shortfall += extra
      result.set(u, available.get(u)!)
    }
  }
  // Hand out the shortfall one question at a time so it stays spread across units.
  while (shortfall > 0) {
    const spare = units.filter((u) => result.get(u)! < available.get(u)!)
    if (spare.length === 0) break
    for (const u of spare) {
      if (shortfall === 0) break
      result.set(u, result.get(u)! + 1)
      shortfall--
    }
  }
  return result
}

/** Least-seen first, then least recently seen; ties are broken randomly. */
export function rankBySeen(questions: Question[], seen: SeenMap, rand: Rand = Math.random) {
  const info = (q: Question) => seen[q.id] ?? { count: 0, lastSeen: 0 }
  return shuffle(questions, rand).sort((a, b) => {
    const x = info(a)
    const y = info(b)
    return x.count - y.count || x.lastSeen - y.lastSeen
  })
}

/** Picks the questions for a new quiz, in random display order. */
export function selectQuestions(
  pool: Question[],
  units: UnitId[],
  count: number,
  seen: SeenMap,
  rand: Rand = Math.random,
): Question[] {
  const byUnit = new Map<UnitId, Question[]>(
    units.map((u) => [u, pool.filter((q) => q.unit === u)]),
  )
  const available = new Map([...byUnit].map(([u, qs]) => [u, qs.length] as const))
  const plan = allocate(available, count, rand)
  const picked = [...plan].flatMap(([u, n]) => rankBySeen(byUnit.get(u)!, seen, rand).slice(0, n))
  return shuffle(picked, rand)
}

/** Records that these questions were shown, so later quizzes prefer others. */
export function markSeen(seen: SeenMap, ids: string[], now: number): SeenMap {
  const next = { ...seen }
  for (const id of ids) next[id] = { count: (next[id]?.count ?? 0) + 1, lastSeen: now }
  return next
}
