<script lang="ts">
  import HistoryRow from '../components/HistoryRow.svelte'
  import ResumeBanner from '../components/ResumeBanner.svelte'
  import { app } from '../lib/app.svelte'
  import { QUESTIONS } from '../lib/bank'

  const recent = $derived(app.history.slice(0, 3))
</script>

<h1>Operating Systems — Midterm 1 practice</h1>
<p class="muted">Multiple-choice quizzes on chapters 1–5 · {QUESTIONS.length} questions</p>

<ResumeBanner />

<a class="button new" href="#/new">New quiz</a>

{#if recent.length}
  <section>
    <div class="head">
      <h2>Recent quizzes</h2>
      <a href="#/history">All history</a>
    </div>
    <ul>
      {#each recent as a (a.id)}
        <HistoryRow attempt={a} actions={false} />
      {/each}
    </ul>
  </section>
{/if}

<style>
  .new {
    width: 100%;
    margin: 4px 0 24px;
  }
  .head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  h2 {
    font-size: 1rem;
  }
  ul {
    padding: 0;
    margin: 0;
  }
</style>
