<script lang="ts">
  import AttemptActions from '../components/AttemptActions.svelte'
  import { findAttempt } from '../lib/app.svelte'
  import { getQuestion, unitLabel } from '../lib/bank'
  import { formatDate, gradeClass } from '../lib/format'
  import { scoreAttempt } from '../lib/grade'
  import { route } from '../lib/router.svelte'
  import { formatDuration } from '../lib/timer'

  const attempt = $derived(findAttempt(route.param))
  const score = $derived(attempt && scoreAttempt(attempt, getQuestion))
</script>

{#if attempt && score}
  <h1>Result</h1>
  <p class="muted">{formatDate(attempt.finishedAt ?? attempt.createdAt)}</p>

  <section class="card summary">
    <div class="big">
      <span class="percent">{score.percent}%</span>
      <span class="grade {gradeClass(score.grade)}">{score.grade}</span>
    </div>
    <dl class="stats">
      <div>
        <dt>Correct</dt>
        <dd class="ok">{score.correct}</dd>
      </div>
      <div>
        <dt>Wrong</dt>
        <dd class="bad">{score.wrong}</dd>
      </div>
      <div>
        <dt>Unanswered</dt>
        <dd>{score.unanswered}</dd>
      </div>
      <div>
        <dt>Time</dt>
        <dd>{formatDuration(attempt.elapsedMs)}</dd>
      </div>
      <div>
        <dt>Hints used</dt>
        <dd>{score.hintsUsed}</dd>
      </div>
    </dl>
    <p class="muted note">Unanswered questions count as wrong in the score.</p>
    {#if score.removed}
      <p class="muted note">
        {score.removed} question(s) were removed from the bank and are not counted.
      </p>
    {/if}
  </section>

  <section class="card">
    <h2>By unit</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Unit</th><th>Correct</th><th>Wrong</th><th>Score</th></tr>
        </thead>
        <tbody>
          {#each score.byUnit as u (u.unit)}
            <tr>
              <td>{unitLabel(u.unit)}</td>
              <td>{u.correct}</td>
              <td>{u.wrong + u.unanswered}</td>
              <td>{u.percent}%</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <AttemptActions {attempt} />
  <p><a href="#/">Home</a></p>
{:else}
  <section class="card">
    <h1>Result not found</h1>
    <a href="#/history">Go to history</a>
  </section>
{/if}

<style>
  section {
    margin-bottom: 12px;
  }
  .big {
    display: flex;
    align-items: baseline;
    gap: 16px;
    margin-bottom: 12px;
  }
  .percent {
    font-size: 2.5rem;
    font-weight: 700;
  }
  .grade {
    font-size: 1.25rem;
    font-weight: 600;
  }
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 8px;
    margin: 0;
  }
  .stats div {
    background: var(--surface-2);
    border-radius: var(--radius);
    padding: 8px 12px;
  }
  dt {
    color: var(--muted);
    font-size: 0.8125rem;
  }
  dd {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
  .ok {
    color: var(--correct);
  }
  .bad {
    color: var(--wrong);
  }
  .note {
    margin: 12px 0 0;
    font-size: 0.875rem;
  }
  .table-wrap {
    overflow-x: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    text-align: left;
    padding: 8px;
    border-bottom: 1px solid var(--line);
  }
  th:not(:first-child),
  td:not(:first-child) {
    text-align: right;
    white-space: nowrap;
  }
  th {
    color: var(--muted);
    font-weight: 500;
    font-size: 0.875rem;
  }
</style>
