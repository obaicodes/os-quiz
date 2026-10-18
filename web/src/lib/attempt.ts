// Creating attempts and changing their answers. Functions mutate the attempt they are given,
// which works with Svelte's $state proxies.

import { permutation, randomId, shuffle, type Rand } from './random'
import { selectQuestions, type SeenMap } from './select'
import type { Attempt, AttemptItem, Question, UnitId } from './types'

function makeItem(q: Question, rand: Rand): AttemptItem {
  return {
    qid: q.id,
    order: permutation(q.options.length, rand),
    answer: null,
    flagged: false,
    timeMs: 0,
    hintShown: false,
  }
}

function makeAttempt(
  questions: Question[],
  units: UnitId[],
  now: number,
  rand: Rand,
  retakeOf?: string,
): Attempt {
  return {
    id: randomId(),
    createdAt: now,
    finishedAt: null,
    units: [...units].sort(),
    items: questions.map((q) => makeItem(q, rand)),
    current: 0,
    elapsedMs: 0,
    ...(retakeOf ? { retakeOf } : {}),
  }
}

export interface NewQuizOptions {
  pool: Question[]
  units: UnitId[]
  count: number
  seen: SeenMap
  now?: number
  rand?: Rand
}

export function newAttempt(o: NewQuizOptions, retakeOf?: string): Attempt {
  const rand = o.rand ?? Math.random
  const questions = selectQuestions(o.pool, o.units, o.count, o.seen, rand)
  return makeAttempt(questions, o.units, o.now ?? Date.now(), rand, retakeOf)
}

/** Same questions, new order of questions and options. Questions removed from the bank are skipped. */
export function retakeSame(
  prev: Attempt,
  getQuestion: (id: string) => Question | undefined,
  now = Date.now(),
  rand: Rand = Math.random,
): Attempt {
  const questions = prev.items.map((i) => getQuestion(i.qid)).filter((q): q is Question => !!q)
  return makeAttempt(shuffle(questions, rand), prev.units, now, rand, prev.id)
}

/** Same units and count, fresh questions (least seen first). */
export function retakeNew(prev: Attempt, o: Omit<NewQuizOptions, 'units' | 'count'>): Attempt {
  return newAttempt({ ...o, units: prev.units, count: prev.items.length }, prev.id)
}

/** Stored option index shown at a display position. */
export function storedIndex(item: AttemptItem, displayIndex: number): number {
  return item.order[displayIndex]
}

export function choose(attempt: Attempt, displayIndex: number) {
  const item = attempt.items[attempt.current]
  item.answer = storedIndex(item, displayIndex)
}

export function toggleFlag(attempt: Attempt) {
  const item = attempt.items[attempt.current]
  item.flagged = !item.flagged
}

export function goTo(attempt: Attempt, index: number) {
  attempt.current = Math.min(Math.max(0, index), attempt.items.length - 1)
}

export function showHint(attempt: Attempt) {
  attempt.items[attempt.current].hintShown = true
}

export function unansweredCount(attempt: Attempt) {
  return attempt.items.filter((i) => i.answer === null).length
}

export function flaggedCount(attempt: Attempt) {
  return attempt.items.filter((i) => i.flagged).length
}

/** Drops items whose question has been removed from the bank (e.g. a saved quiz after an update). */
export function dropMissing(attempt: Attempt, getQuestion: (id: string) => Question | undefined) {
  const kept = attempt.items.filter((i) => getQuestion(i.qid))
  if (kept.length === attempt.items.length) return
  const currentId = attempt.items[attempt.current]?.qid
  attempt.items = kept
  attempt.current = Math.max(
    0,
    kept.findIndex((i) => i.qid === currentId),
  )
}
