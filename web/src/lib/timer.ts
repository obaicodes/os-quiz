// Quiz timers (docs/SYSTEM_DESIGN.md 5.2). Time is measured as the difference between
// Date.now() readings, so a throttled background tab still counts correctly.

import type { Attempt, AttemptItem } from './types'

export const HINT_DELAY_MS = 2 * 60 * 1000

/** Remembers the last reading and returns the time passed since it. */
export class Clock {
  private last: number | null = null
  constructor(private now: () => number = Date.now) {}

  start() {
    this.last = this.now()
  }

  stop() {
    this.last = null
  }

  /** Milliseconds since the previous call (or start); 0 when stopped or if the clock went back. */
  take(): number {
    if (this.last === null) return 0
    const t = this.now()
    const delta = Math.max(0, t - this.last)
    this.last = t
    return delta
  }
}

/** Adds time to the whole quiz and to the question on screen; reveals its hint after 2 minutes. */
export function advance(attempt: Attempt, deltaMs: number) {
  if (deltaMs <= 0) return
  attempt.elapsedMs += deltaMs
  const item = attempt.items[attempt.current]
  if (!item) return
  item.timeMs += deltaMs
  if (item.timeMs >= HINT_DELAY_MS) item.hintShown = true
}

export function hintRemainingMs(item: AttemptItem): number {
  return item.hintShown ? 0 : Math.max(0, HINT_DELAY_MS - item.timeMs)
}

/** "m:ss", or "h:mm:ss" from one hour. */
export function formatDuration(ms: number): string {
  const total = Math.floor(Math.max(0, ms) / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = String(total % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`
}
