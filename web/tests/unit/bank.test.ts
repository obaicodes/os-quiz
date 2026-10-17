import { describe, expect, it } from 'vitest'
import { QUESTIONS, UNITS, getQuestion, questionsInUnit } from '../../src/lib/bank'

describe('question bank', () => {
  it('loads approved questions from every unit', () => {
    expect(QUESTIONS.length).toBeGreaterThan(0)
    for (const unit of UNITS) {
      // Requirement 5.5: at least 50 questions per unit.
      expect(questionsInUnit(unit.id).length).toBeGreaterThanOrEqual(50)
    }
  })

  it('has unique ids that can be looked up', () => {
    const ids = new Set(QUESTIONS.map((q) => q.id))
    expect(ids.size).toBe(QUESTIONS.length)
    expect(getQuestion(QUESTIONS[0].id)).toBe(QUESTIONS[0])
    expect(getQuestion('does-not-exist')).toBeUndefined()
  })

  it('has exactly four distinct options and a valid answer index', () => {
    for (const q of QUESTIONS) {
      expect(q.options, q.id).toHaveLength(4)
      expect(new Set(q.options).size, q.id).toBe(4)
      expect(q.answer, q.id).toBeGreaterThanOrEqual(0)
      expect(q.answer, q.id).toBeLessThan(4)
    }
  })

  it('has a hint and an explanation for every question', () => {
    for (const q of QUESTIONS) {
      expect(q.hint.trim(), q.id).not.toBe('')
      expect(q.explanation.trim(), q.id).not.toBe('')
    }
  })
})
