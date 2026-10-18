<script lang="ts">
  import { getQuestion } from '../lib/bank'
  import { formatDate, formatUnits, gradeClass } from '../lib/format'
  import { scoreAttempt } from '../lib/grade'
  import { formatDuration } from '../lib/timer'
  import type { Attempt } from '../lib/types'
  import AttemptActions from './AttemptActions.svelte'

  let { attempt, actions = true }: { attempt: Attempt; actions?: boolean } = $props()
  const score = $derived(scoreAttempt(attempt, getQuestion))
</script>

<li class="card">
  <div class="top">
    <a href="#/result/{attempt.id}" class="date"
      >{formatDate(attempt.finishedAt ?? attempt.createdAt)}</a
    >
    <span
      ><strong>{score.percent}%</strong>
      <span class={gradeClass(score.grade)}>{score.grade}</span></span
    >
  </div>
  <p class="muted">
    {formatUnits(attempt.units)} · {attempt.items.length} questions · {formatDuration(
      attempt.elapsedMs,
    )}
    {#if attempt.retakeOf}· Retake{/if}
  </p>
  {#if actions}<AttemptActions {attempt} />{/if}
</li>

<style>
  li {
    list-style: none;
    margin-bottom: 8px;
  }
  .top {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
  }
  .date {
    font-weight: 600;
  }
  p {
    margin: 4px 0 8px;
    font-size: 0.875rem;
  }
</style>
