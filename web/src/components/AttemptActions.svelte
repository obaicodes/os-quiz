<script lang="ts">
  import { app, seen, startQuiz } from '../lib/app.svelte'
  import { retakeNew, retakeSame } from '../lib/attempt'
  import { getQuestion, QUESTIONS } from '../lib/bank'
  import { go } from '../lib/router.svelte'
  import type { Attempt } from '../lib/types'

  let { attempt, review = true }: { attempt: Attempt; review?: boolean } = $props()
</script>

<div class="actions">
  {#if review}
    <button onclick={() => go(`review/${attempt.id}`)}>Review</button>
  {/if}
  <button onclick={() => startQuiz(retakeSame(attempt, getQuestion))} disabled={!!app.pending}>
    Retake (same questions)
  </button>
  <button
    onclick={() => startQuiz(retakeNew(attempt, { pool: QUESTIONS, seen: seen() }))}
    disabled={!!app.pending}
  >
    Retake (new questions)
  </button>
</div>

<style>
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
</style>
