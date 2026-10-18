// localStorage access (docs/SYSTEM_DESIGN.md 4). Every read and write is guarded so the site
// still works when storage is blocked (e.g. some private modes); `ok` turns false in that case.

import type { SeenMap } from './select'
import type { Attempt } from './types'

const PREFIX = 'osq:v1:'
const KEYS = { active: PREFIX + 'active', history: PREFIX + 'history', seen: PREFIX + 'seen' }

function isAttempt(v: unknown): v is Attempt {
  const a = v as Attempt
  return (
    !!a &&
    typeof a.id === 'string' &&
    Array.isArray(a.items) &&
    Array.isArray(a.units) &&
    typeof a.current === 'number' &&
    typeof a.elapsedMs === 'number' &&
    a.items.every((i) => typeof i?.qid === 'string' && Array.isArray(i.order))
  )
}

export class Store {
  ok = true

  constructor(private backend: Storage | null) {
    if (!backend) this.ok = false
  }

  private read(key: string): unknown {
    try {
      const raw = this.backend?.getItem(key)
      return raw ? JSON.parse(raw) : null
    } catch {
      this.ok = false
      return null
    }
  }

  private write(key: string, value: unknown) {
    try {
      if (value === null) this.backend?.removeItem(key)
      else this.backend?.setItem(key, JSON.stringify(value))
    } catch {
      this.ok = false
    }
  }

  getActive(): Attempt | null {
    const v = this.read(KEYS.active)
    return isAttempt(v) ? v : null
  }

  setActive(a: Attempt | null) {
    this.write(KEYS.active, a)
  }

  /** Finished attempts, newest first. */
  getHistory(): Attempt[] {
    const v = this.read(KEYS.history)
    return Array.isArray(v) ? v.filter(isAttempt) : []
  }

  addHistory(a: Attempt) {
    this.write(KEYS.history, [a, ...this.getHistory().filter((h) => h.id !== a.id)])
  }

  getSeen(): SeenMap {
    const v = this.read(KEYS.seen)
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as SeenMap) : {}
  }

  setSeen(seen: SeenMap) {
    this.write(KEYS.seen, seen)
  }
}

function browserStorage(): Storage | null {
  try {
    const s = globalThis.localStorage
    const probe = PREFIX + 'probe'
    s.setItem(probe, '1')
    s.removeItem(probe)
    return s
  } catch {
    return null
  }
}

export const store = new Store(browserStorage())
