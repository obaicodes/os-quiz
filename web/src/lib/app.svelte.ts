// App-wide state: the unfinished quiz, the history and the "seen" map, kept in sync with storage.

import { dropMissing } from './attempt'
import { getQuestion } from './bank'
import { go } from './router.svelte'
import { markSeen } from './select'
import { store } from './storage'
import type { Attempt } from './types'

const saved = store.getActive()
if (saved) dropMissing(saved, getQuestion)

export const app = $state({
  active: saved && saved.items.length ? saved : null,
  history: store.getHistory(),
  /** A quiz waiting for the user to decide what to do with the unfinished one. */
  pending: null as Attempt | null,
  storageOk: store.ok,
})

function sync() {
  app.storageOk = store.ok
}

export function saveActive() {
  store.setActive(app.active ? $state.snapshot(app.active) : null)
  sync()
}

/** Starts a quiz, or asks first if another one is unfinished (only one at a time). */
export function startQuiz(a: Attempt) {
  if (app.active) {
    app.pending = a
    return
  }
  app.active = a
  store.setSeen(
    markSeen(
      store.getSeen(),
      a.items.map((i) => i.qid),
      a.createdAt,
    ),
  )
  saveActive()
  go('quiz')
}

export function resumeInstead() {
  app.pending = null
  go('quiz')
}

export function discardAndStartPending() {
  const next = app.pending
  app.pending = null
  app.active = null
  if (next) startQuiz(next)
}

export function cancelActive() {
  app.active = null
  saveActive()
}

export function submitActive() {
  if (!app.active) return
  const done = { ...$state.snapshot(app.active), finishedAt: Date.now() }
  store.addHistory(done)
  app.history = store.getHistory()
  app.active = null
  saveActive()
  go(`result/${done.id}`)
}

export function findAttempt(id: string | undefined): Attempt | undefined {
  return app.history.find((h) => h.id === id)
}

export function seen() {
  return store.getSeen()
}
