<script lang="ts">
  import { route } from './lib/router.svelte'
  import Home from './pages/Home.svelte'
</script>

<header class="top">
  <a href="#/" class="brand">OS Quiz</a>
</header>

<main>
  {#if route.name === 'home'}
    <Home />
  {:else}
    <section class="card">
      <h2>Not available yet</h2>
      <p class="muted">This page is built in Phase 4.</p>
      <a href="#/">Back to home</a>
    </section>
  {/if}
</main>

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
</style>
