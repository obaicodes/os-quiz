// Shapes of the question bank (data/bank/ch*.json) and of the data kept in localStorage.
// See docs/SYSTEM_DESIGN.md section 4.

export type UnitId = 1 | 2 | 3 | 4 | 5
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  id: string
  unit: UnitId
  topic: string
  difficulty: Difficulty
  question: string
  table?: { headers: string[]; rows: string[][] }
  code?: string
  options: string[]
  /** Index of the correct option in `options` (the stored order, not the display order). */
  answer: number
  hint: string
  explanation: string
  source: { kind: 'leak' | 'generated'; refs?: string[] }
  syllabus_ref: { file: string; slides: number[] }
  review_status: 'pending' | 'approved' | 'rejected'
}

export interface AttemptItem {
  qid: string
  /** Display order of the options: order[displayIndex] = stored option index. */
  order: number[]
  /** Chosen stored option index, or null if unanswered. */
  answer: number | null
  flagged: boolean
  /** Time spent on this question so far (drives the hint countdown). */
  timeMs: number
  hintShown: boolean
}

export interface Attempt {
  id: string
  createdAt: number
  finishedAt: number | null
  units: UnitId[]
  items: AttemptItem[]
  current: number
  elapsedMs: number
  retakeOf?: string
}

export interface SeenInfo {
  count: number
  lastSeen: number
}
