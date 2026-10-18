<script lang="ts">
  import QuestionBody from '../components/QuestionBody.svelte'
  import { findAttempt } from '../lib/app.svelte'
  import { getQuestion, sourceLabel, unitLabel } from '../lib/bank'
  import { route } from '../lib/router.svelte'

  type Filter = 'all' | 'wrong' | 'flagged'
  const LETTERS = 'ABCD'

  let filter = $state<Filter>('all')
  const attempt = $derived(findAttempt(route.param))

  const rows = $derived(
    (attempt?.items ?? []).map((item, i) => {
      const q = getQuestion(item.qid)
      const result = !q
        ? 'removed'
        : item.answer === null
          ? 'unanswered'
          : item.answer === q.answer
            ? 'correct'
            : 'wrong'
      return { n: i + 1, item, q, result }
    }),
  )

  const counts = $derived({
    all: rows.length,
    wrong: rows.filter((r) => r.result === 'wrong' || r.result === 'unanswered').length,
    flagged: rows.filter((r) => r.item.flagged).length,
  })

  const shown = $derived(
    rows.filter((r) =>
      filter === 'all'
        ? true
        : filter === 'wrong'
          ? r.result === 'wrong' || r.result === 'unanswered'
          : r.item.flagged,
    ),
  )

  const LABELS: Record<Filter, string> = { all: 'All', wrong: 'Wrong', flagged: 'Flagged' }
  const RESULT: Record<string, string> = {
    correct: 'Correct',
    wrong: 'Wrong',
    unanswered: 'Unanswered',
  }
</script>

{#if attempt}
  <h1>Review answers</h1>
  <p><a href="#/result/{attempt.id}">Back to result</a></p>

  <div class="filters" role="group" aria-label="Filter questions">
    {#each Object.keys(LABELS) as Filter[] as f (f)}
      <button aria-pressed={filter === f} onclick={() => (filter = f)}>
        {LABELS[f]} ({counts[f]})
      </button>
    {/each}
  </div>
  {#if filter === 'wrong'}
    <p class="muted small">Includes unanswered questions.</p>
  {/if}

  {#each shown as r (r.item.qid)}
    <article class="card {r.result}">
      {#if r.q}
        {@const q = r.q}
        <header>
          <strong>Q{r.n}</strong>
          <span class="badge {r.result}">{RESULT[r.result]}</span>
          {#if r.item.flagged}<span class="badge flag">Flagged</span>{/if}
        </header>
        <p class="meta muted">{unitLabel(q.unit)} · {q.topic}</p>
        <QuestionBody {q} />
        <ul class="options read">
          {#each r.item.order as stored, d (stored)}
            {@const mine = r.item.answer === stored}
            {@const right = q.answer === stored}
            <li class:right class:mine-wrong={mine && !right}>
              <span class="letter">{LETTERS[d]}</span>
              <span class="text">{q.options[stored]}</span>
              {#if right && mine}<span class="tag">Your answer ✓</span>
              {:else if right}<span class="tag">Correct answer</span>
              {:else if mine}<span class="tag">Your answer ✗</span>{/if}
            </li>
          {/each}
        </ul>
        <p class="read explanation"><strong>Explanation:</strong> {q.explanation}</p>
        <p class="muted small">
          Hint used: {r.item.hintShown ? 'Yes' : 'No'} · Source: {sourceLabel(q)}
        </p>
      {:else}
        <header><strong>Q{r.n}</strong></header>
        <p class="muted">This question was removed from the bank.</p>
      {/if}
    </article>
  {:else}
    <p class="muted">No questions match this filter.</p>
  {/each}
{:else}
  <section class="card">
    <h1>Quiz not found</h1>
    <a href="#/history">Go to history</a>
  </section>
{/if}

<style>
  .filters {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  .filters button[aria-pressed='true'] {
    border-color: var(--accent);
    background: var(--accent-soft);
  }
  article {
    margin-bottom: 12px;
    border-left-width: 4px;
  }
  article.correct {
    border-left-color: var(--correct);
  }
  article.wrong {
    border-left-color: var(--wrong);
  }
  article.unanswered {
    border-left-color: var(--muted);
  }
  header {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .badge {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 999px;
    background: var(--surface-2);
  }
  .badge.correct {
    color: var(--correct);
  }
  .badge.wrong {
    color: var(--wrong);
  }
  .badge.flag {
    color: var(--flag);
  }
  .meta {
    margin: 4px 0 8px;
    font-size: 0.875rem;
  }
  .options {
    list-style: none;
    padding: 0;
    margin: 0 0 12px;
    display: grid;
    gap: 6px;
  }
  .options li {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    padding: 8px 12px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
  }
  .options .text {
    flex: 1;
  }
  .options li.right {
    border-color: var(--correct);
    background: rgb(63 182 122 / 0.12);
  }
  .options li.mine-wrong {
    border-color: var(--wrong);
    background: rgb(229 83 75 / 0.12);
  }
  .letter {
    font-family: var(--font-ui);
    font-weight: 700;
    color: var(--muted);
  }
  .tag {
    font-family: var(--font-ui);
    font-size: 0.8125rem;
    font-weight: 600;
  }
  .right .tag {
    color: var(--correct);
  }
  .mine-wrong .tag {
    color: var(--wrong);
  }
  .explanation {
    margin: 0 0 8px;
  }
  .small {
    font-size: 0.875rem;
    margin: 0;
  }
</style>
