<script lang="ts">
  import { seen, startQuiz } from '../lib/app.svelte'
  import { newAttempt } from '../lib/attempt'
  import { QUESTIONS, questionsInUnit, UNITS } from '../lib/bank'
  import { MAX_COUNT, MIN_COUNT } from '../lib/select'
  import type { UnitId } from '../lib/types'

  let units = $state<UnitId[]>([])
  let count = $state(10)

  const available = $derived(units.reduce((n, u) => n + questionsInUnit(u).length, 0))
  const allSelected = $derived(units.length === UNITS.length)

  function toggleAll() {
    units = allSelected ? [] : UNITS.map((u) => u.id)
  }

  function setCount(n: number) {
    count = Math.min(MAX_COUNT, Math.max(MIN_COUNT, Math.round(n) || MIN_COUNT))
  }

  function start() {
    startQuiz(
      newAttempt({ pool: QUESTIONS, units, count: Math.min(count, available), seen: seen() }),
    )
  }
</script>

<h1>New quiz</h1>

<section class="card">
  <h2>Type</h2>
  <div class="row">
    <label class="choice"><input type="radio" name="type" checked /> Multiple choice</label>
    <label class="choice disabled">
      <input type="radio" name="type" disabled /> Essay <span class="muted">(coming soon)</span>
    </label>
  </div>
</section>

<section class="card">
  <div class="head">
    <h2>Units</h2>
    <button onclick={toggleAll}>{allSelected ? 'Clear all' : 'Select all'}</button>
  </div>
  {#each UNITS as u (u.id)}
    <label class="choice unit">
      <input type="checkbox" value={u.id} bind:group={units} />
      <span>Unit {u.id}: {u.title}</span>
      <span class="muted count">{questionsInUnit(u.id).length}</span>
    </label>
  {/each}
</section>

<section class="card">
  <h2><label for="count">Number of questions</label></h2>
  <div class="stepper">
    <button
      aria-label="Fewer questions"
      onclick={() => setCount(count - 1)}
      disabled={count <= MIN_COUNT}>−</button
    >
    <input
      id="count"
      type="number"
      inputmode="numeric"
      min={MIN_COUNT}
      max={MAX_COUNT}
      value={count}
      onchange={(e) => setCount(Number(e.currentTarget.value))}
    />
    <button
      aria-label="More questions"
      onclick={() => setCount(count + 1)}
      disabled={count >= MAX_COUNT}>+</button
    >
    <span class="muted">{MIN_COUNT}–{MAX_COUNT}</span>
  </div>
  {#if units.length && available < count}
    <p class="warn" role="status">
      Only {available} questions are available in the selected units. The quiz will have {available}
      questions.
    </p>
  {/if}
</section>

<button class="primary start" onclick={start} disabled={units.length === 0}>Start quiz</button>
{#if units.length === 0}
  <p class="muted">Choose at least one unit.</p>
{/if}

<style>
  section {
    margin-bottom: 12px;
  }
  h2 {
    font-size: 1rem;
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .head h2 {
    margin: 0;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 24px;
  }
  .choice {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    cursor: pointer;
  }
  .choice.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  .unit {
    border-top: 1px solid var(--line);
  }
  .count {
    margin-left: auto;
    font-size: 0.875rem;
  }
  input[type='checkbox'],
  input[type='radio'] {
    width: 20px;
    height: 20px;
    accent-color: var(--accent);
    margin: 0;
  }
  .stepper {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .stepper button {
    width: 44px;
    padding: 0;
    font-size: 1.25rem;
  }
  .stepper input {
    width: 72px;
    min-height: 44px;
    text-align: center;
    font: inherit;
    font-size: 1.125rem;
    color: var(--text);
    background: var(--bg);
    border: 1px solid var(--line);
    border-radius: var(--radius);
  }
  .warn {
    color: var(--flag);
    margin: 12px 0 0;
  }
  .start {
    width: 100%;
  }
</style>
