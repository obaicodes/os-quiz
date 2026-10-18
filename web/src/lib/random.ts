// Randomness helpers. Every function takes `rand` so tests can pass a seeded generator.

export type Rand = () => number

/** Returns a shuffled copy (Fisher–Yates). */
export function shuffle<T>(items: readonly T[], rand: Rand = Math.random): T[] {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** A random permutation of 0..n-1. */
export function permutation(n: number, rand: Rand = Math.random): number[] {
  return shuffle(
    Array.from({ length: n }, (_, i) => i),
    rand,
  )
}

/** Small deterministic generator (mulberry32), used by tests. */
export function seeded(seed: number): Rand {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function randomId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
