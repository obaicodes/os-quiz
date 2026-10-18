<script lang="ts">
  import ConfirmDialog from '../components/ConfirmDialog.svelte'
  import QuestionBody from '../components/QuestionBody.svelte'
  import { app, cancelActive, saveActive, submitActive } from '../lib/app.svelte'
  import { choose, flaggedCount, goTo, showHint, toggleFlag, unansweredCount } from '../lib/attempt'
  import { getQuestion, unitLabel } from '../lib/bank'
  import { go } from '../lib/router.svelte'
  import { store } from '../lib/storage'
  import { advance, Clock, formatDuration, hintRemainingMs } from '../lib/timer'

  const LETTERS = 'ABCD'
  const clock = new Clock()
  let confirm = $state<'submit' | 'cancel' | null>(null)
  let questionTop: HTMLElement | undefined = $state()

  const attempt = $derived(app.active)
  const item = $derived(attempt?.items[attempt.current])
  const q = $derived(item && getQuestion(item.qid))

  /** Adds the time since the last tick to the quiz and to the question on screen. */
  function tick() {
    if (app.active) advance(app.active, clock.take())
  }

  $effect(() => {
    const a = app.active
    if (!a) return
    clock.start()
    let lastSave = Date.now()
    const id = setInterval(() => {
      tick()
      if (Date.now() - lastSave >= 1000) {
        saveActive()
        lastSave = Date.now()
      }
    }, 250)
    const flush = () => {
      tick()
      saveActive()
    }
    document.addEventListener('visibilitychange', flush)
    window.addEventListener('pagehide', flush)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', flush)
      window.removeEventListener('pagehide', flush)
      // Teardown sees state from before the change, so app.active may still hold a quiz that was
      // just submitted or cancelled. Only save if storage still has this quiz (e.g. the user
      // left through the header links).
      if (store.getActive()?.id === a.id) {
        advance(a, clock.take())
        saveActive()
      }
      clock.stop()
    }
  })

  function act(fn: () => void) {
    tick()
    fn()
    saveActive()
  }

  function move(index: number) {
    act(() => goTo(attempt!, index))
    questionTop?.scrollIntoView({ block: 'start' })
  }

  function saveAndExit() {
    act(() => {})
    go('/')
  }

  function cancel() {
    confirm = null
    cancelActive()
    go('/')
  }

  function submit() {
    confirm = null
    tick()
    submitActive()
  }

  function status(i: number) {
    const it = attempt!.items[i]
    return [it.answer !== null ? 'answered' : 'not answered', it.flagged ? 'flagged' : '']
      .filter(Boolean)
      .join(', ')
  }
</script>

{#if attempt && item && q}
  <div class="bar" bind:this={questionTop}>
    <strong>Question {attempt.current + 1} of {attempt.items.length}</strong>
    <span class="time" aria-label="Time elapsed">⏱ {formatDuration(attempt.elapsedMs)}</span>
  </div>

  <nav class="nav" aria-label="Questions">
    {#each attempt.items as it, i (it.qid)}
      <button
        class="num"
        class:answered={it.answer !== null}
        class:flagged={it.flagged}
        aria-current={i === attempt.current ? 'step' : undefined}
        aria-label="Question {i + 1}, {status(i)}"
        onclick={() => move(i)}>{i + 1}</button
      >
    {/each}
  </nav>

  <section class="card question">
    <QuestionBody {q} />

    <div class="options" role="radiogroup" aria-label="Options">
      {#each item.order as stored, d (stored)}
        <button
          class="option read"
          role="radio"
          aria-checked={item.answer === stored}
          onclick={() => act(() => choose(attempt, d))}
        >
          <span class="letter">{LETTERS[d]}</span>
          <span>{q.options[stored]}</span>
        </button>
      {/each}
    </div>
    {#if item.answer !== null}
      <button class="link" onclick={() => act(() => (item.answer = null))}>Clear answer</button>
    {/if}

    <div class="hint" aria-live="polite">
      {#if item.hintShown}
        <p class="unit">{unitLabel(q.unit)}</p>
        <p class="read"><strong>Hint:</strong> {q.hint}</p>
      {:else}
        <span class="muted">Hint in {formatDuration(hintRemainingMs(item))}</span>
        <button onclick={() => act(() => showHint(attempt))}>Show hint now</button>
      {/if}
    </div>
  </section>

  <div class="row">
    <button onclick={() => move(attempt.current - 1)} disabled={attempt.current === 0}>
      Previous
    </button>
    <button
      class="flag"
      class:on={item.flagged}
      aria-pressed={item.flagged}
      onclick={() => act(() => toggleFlag(attempt))}
    >
      {item.flagged ? 'Flagged' : 'Flag for review'}
    </button>
    <button
      class="primary"
      onclick={() => move(attempt.current + 1)}
      disabled={attempt.current === attempt.items.length - 1}
    >
      Next →
    </button>
  </div>

  <!-- Kept apart from Previous/Next, and green rather than blue, so Submit is not hit by mistake. -->
  <section class="finish" aria-label="Finish">
    <button class="submit" onclick={() => (confirm = 'submit')}>✓ Submit quiz</button>
    <div class="secondary">
      <button onclick={saveAndExit}>Save & Exit</button>
      <button class="danger" onclick={() => (confirm = 'cancel')}>Cancel quiz</button>
    </div>
  </section>

  <ConfirmDialog
    open={confirm === 'submit'}
    title="Submit the quiz?"
    onclose={() => (confirm = null)}
  >
    <p>
      Unanswered: <strong>{unansweredCount(attempt)}</strong> · Flagged for review:
      <strong>{flaggedCount(attempt)}</strong>
    </p>
    {#snippet actions()}
      <button onclick={() => (confirm = null)}>Keep going</button>
      <button class="submit" onclick={submit}>Submit</button>
    {/snippet}
  </ConfirmDialog>

  <ConfirmDialog
    open={confirm === 'cancel'}
    title="Cancel this quiz?"
    onclose={() => (confirm = null)}
  >
    <p>The quiz and its answers will be deleted. This cannot be undone.</p>
    {#snippet actions()}
      <button onclick={() => (confirm = null)}>Keep quiz</button>
      <button class="danger" onclick={cancel}>Delete quiz</button>
    {/snippet}
  </ConfirmDialog>
{:else}
  <section class="card">
    <h1>No quiz in progress</h1>
    <a href="#/new">Start a new quiz</a>
  </section>
{/if}

<style>
  .bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    scroll-margin-top: 8px;
  }
  .time {
    font-variant-numeric: tabular-nums;
  }
  .nav {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
  }
  .num {
    min-width: 44px;
    padding: 0 6px;
    font-variant-numeric: tabular-nums;
  }
  .num.answered {
    background: var(--accent-soft);
    border-color: var(--accent);
  }
  .num.flagged {
    box-shadow: inset 0 -4px 0 var(--flag);
  }
  .num[aria-current] {
    outline: 2px solid var(--text);
    outline-offset: 1px;
    font-weight: 700;
  }
  .question {
    margin-bottom: 12px;
  }
  .options {
    display: grid;
    gap: 8px;
  }
  .option {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    text-align: left;
    width: 100%;
  }
  .option[aria-checked='true'] {
    border-color: var(--accent);
    background: var(--accent-soft);
  }
  .letter {
    font-family: var(--font-ui);
    font-weight: 700;
    color: var(--muted);
    min-width: 1ch;
  }
  .option[aria-checked='true'] .letter {
    color: var(--accent);
  }
  .link {
    background: none;
    border: none;
    color: var(--muted);
    text-decoration: underline;
    padding: 8px 0;
  }
  .hint {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid var(--line);
  }
  .hint p {
    margin: 0;
    width: 100%;
  }
  .hint .unit {
    color: var(--flag);
    font-weight: 600;
  }
  .row {
    display: grid;
    grid-template-columns: 1fr 1.4fr 1fr;
    gap: 8px;
    margin-bottom: 12px;
  }
  .finish {
    margin-top: 40px;
    padding-top: 16px;
    border-top: 1px dashed var(--line);
    display: grid;
    gap: 8px;
  }
  .submit {
    background: transparent;
    border: 2px solid var(--correct);
    color: var(--correct);
    font-weight: 700;
  }
  .secondary {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .secondary button {
    font-size: 0.875rem;
  }
  .flag.on {
    border-color: var(--flag);
    color: var(--flag);
  }
</style>
