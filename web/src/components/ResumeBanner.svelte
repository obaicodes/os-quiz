<script lang="ts">
  import { app } from '../lib/app.svelte'
  import { formatUnits } from '../lib/format'
  import { formatDuration } from '../lib/timer'

  const answered = $derived(app.active?.items.filter((i) => i.answer !== null).length ?? 0)
</script>

{#if app.active}
  <section class="card banner">
    <div>
      <strong>Unfinished quiz</strong>
      <p class="muted">
        {formatUnits(app.active.units)} · {answered}/{app.active.items.length} answered · {formatDuration(
          app.active.elapsedMs,
        )}
      </p>
    </div>
    <a class="button" href="#/quiz">Resume</a>
  </section>
{/if}

<style>
  .banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
    border-color: var(--flag);
  }
  p {
    margin: 0;
    font-size: 0.875rem;
  }
</style>
