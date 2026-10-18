// Display helpers shared by pages.

import type { Grade } from './grade'
import type { UnitId } from './types'

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatUnits(units: UnitId[]): string {
  return (units.length === 1 ? 'Unit ' : 'Units ') + units.join(', ')
}

/** CSS class for coloring a grade (see app.css). */
export function gradeClass(g: Grade): string {
  return 'grade-' + g.replace(' ', '-')
}
