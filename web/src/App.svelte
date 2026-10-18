<script lang="ts">
  import ConfirmDialog from './components/ConfirmDialog.svelte'
  import { app, discardAndStartPending, resumeInstead } from './lib/app.svelte'
  import { route } from './lib/router.svelte'
  import History from './pages/History.svelte'
  import Home from './pages/Home.svelte'
  import NewQuiz from './pages/NewQuiz.svelte'
  import Quiz from './pages/Quiz.svelte'
  import Result from './pages/Result.svelte'
  import Review from './pages/Review.svelte'

  const PAGES = {
    home: Home,
    new: NewQuiz,
    quiz: Quiz,
    result: Result,
    review: Review,
    history: History,
  }
  const Page = $derived(PAGES[route.name as keyof typeof PAGES])

  $effect(() => {
    void route.name
    void route.param
    window.scrollTo(0, 0)
  })
</script>

<header class="top">
  <a href="#/" class="brand">OS Quiz</a>
  <nav>
    <a href="#/new">New quiz</a>
    <a href="#/history">History</a>
  </nav>
</header>

{#if !app.storageOk}
  <p class="warn" role="alert">
    Your browser is blocking storage, so progress and history will not be saved.
  </p>
{/if}

<main>
  {#if Page}
    <Page />
  {:else}
    <section class="card">
      <h1>Page not found</h1>
      <a href="#/">Back to home</a>
    </section>
  {/if}
</main>

<ConfirmDialog
  open={!!app.pending}
  title="You have an unfinished quiz"
  onclose={() => (app.pending = null)}
>
  <p>Only one quiz can be in progress. Resume it, or delete it and start the new one.</p>
  {#snippet actions()}
    <button onclick={resumeInstead}>Resume unfinished</button>
    <button class="danger" onclick={discardAndStartPending}>Delete it & start new</button>
  {/snippet}
</ConfirmDialog>

<style>
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .brand {
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--text);
    text-decoration: none;
  }
  nav {
    display: flex;
    gap: 16px;
  }
  nav a {
    color: var(--muted);
    text-decoration: none;
    padding: 10px 0;
  }
  nav a:hover {
    color: var(--text);
  }
  .warn {
    border: 1px solid var(--flag);
    color: var(--flag);
    border-radius: var(--radius);
    padding: 8px 12px;
  }
</style>
