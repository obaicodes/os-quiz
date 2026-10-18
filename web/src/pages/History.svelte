<script lang="ts">
  import HistoryRow from '../components/HistoryRow.svelte'
  import ResumeBanner from '../components/ResumeBanner.svelte'
  import { app } from '../lib/app.svelte'
</script>

<h1>Past quizzes</h1>
<ResumeBanner />

{#if app.history.length}
  <ul>
    {#each app.history as a (a.id)}
      <HistoryRow attempt={a} />
    {/each}
  </ul>
{:else}
  <section class="card">
    <p class="muted">No finished quizzes yet.</p>
    <a class="button" href="#/new">New quiz</a>
  </section>
{/if}

<style>
  ul {
    padding: 0;
    margin: 0;
  }
</style>
