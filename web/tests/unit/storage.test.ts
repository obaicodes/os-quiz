import { describe, expect, it } from 'vitest'
import { Store } from '../../src/lib/storage'
import type { Attempt } from '../../src/lib/types'

class MemoryStorage implements Storage {
  data = new Map<string, string>()
  get length() {
    return this.data.size
  }
  clear() {
    this.data.clear()
  }
  getItem(k: string) {
    return this.data.get(k) ?? null
  }
  key(i: number) {
    return [...this.data.keys()][i] ?? null
  }
  removeItem(k: string) {
    this.data.delete(k)
  }
  setItem(k: string, v: string) {
    this.data.set(k, v)
  }
}

const attempt = (id: string): Attempt => ({
  id,
  createdAt: 1,
  finishedAt: null,
  units: [1],
  items: [
    {
      qid: 'c1-001',
      order: [0, 1, 2, 3],
      answer: null,
      flagged: false,
      timeMs: 0,
      hintShown: false,
    },
  ],
  current: 0,
  elapsedMs: 0,
})

describe('Store', () => {
  it('saves and clears the active attempt under a versioned key', () => {
    const mem = new MemoryStorage()
    const s = new Store(mem)
    s.setActive(attempt('a'))
    expect(mem.getItem('osq:v1:active')).toContain('"id":"a"')
    expect(s.getActive()?.id).toBe('a')
    s.setActive(null)
    expect(s.getActive()).toBeNull()
    expect(s.ok).toBe(true)
  })

  it('keeps history newest first without duplicates', () => {
    const s = new Store(new MemoryStorage())
    s.addHistory(attempt('a'))
    s.addHistory(attempt('b'))
    s.addHistory(attempt('a'))
    expect(s.getHistory().map((h) => h.id)).toEqual(['a', 'b'])
  })

  it('ignores corrupted or malformed data', () => {
    const mem = new MemoryStorage()
    mem.setItem('osq:v1:active', '{not json')
    mem.setItem('osq:v1:history', JSON.stringify([attempt('ok'), { id: 5 }, null]))
    mem.setItem('osq:v1:seen', '[1,2]')
    const s = new Store(mem)
    expect(s.getActive()).toBeNull()
    expect(s.getHistory().map((h) => h.id)).toEqual(['ok'])
    expect(s.getSeen()).toEqual({})
  })

  it('keeps working when storage throws (e.g. blocked or full)', () => {
    const broken = new MemoryStorage()
    broken.setItem = () => {
      throw new Error('QuotaExceededError')
    }
    const s = new Store(broken)
    expect(() => s.setActive(attempt('a'))).not.toThrow()
    expect(s.ok).toBe(false)
  })

  it('works without any storage', () => {
    const s = new Store(null)
    expect(s.ok).toBe(false)
    expect(s.getHistory()).toEqual([])
    expect(() => s.setSeen({})).not.toThrow()
  })
})
