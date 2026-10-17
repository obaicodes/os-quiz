import ch1 from '@bank/ch1.json'
import ch2 from '@bank/ch2.json'
import ch3 from '@bank/ch3.json'
import ch4 from '@bank/ch4.json'
import ch5 from '@bank/ch5.json'
import type { Question, UnitId } from './types'

export const UNITS: { id: UnitId; title: string }[] = [
  { id: 1, title: 'Introduction' },
  { id: 2, title: 'Operating-System Structures' },
  { id: 3, title: 'Processes' },
  { id: 4, title: 'Threads & Concurrency' },
  { id: 5, title: 'CPU Scheduling' },
]

/** Only approved questions are used in quizzes. */
export const QUESTIONS: Question[] = (
  [...ch1, ...ch2, ...ch3, ...ch4, ...ch5] as Question[]
).filter((q) => q.review_status === 'approved')

const byId = new Map(QUESTIONS.map((q) => [q.id, q]))

/** Returns undefined for ids that are no longer in the bank (e.g. a removed question in old history). */
export function getQuestion(id: string): Question | undefined {
  return byId.get(id)
}

export function questionsInUnit(unit: UnitId): Question[] {
  return QUESTIONS.filter((q) => q.unit === unit)
}
