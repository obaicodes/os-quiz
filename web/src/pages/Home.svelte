<script lang="ts">
  import { QUESTIONS, UNITS, questionsInUnit } from '../lib/bank'
</script>

<section class="card">
  <h1>Operating Systems — Midterm 1 practice</h1>
  <p class="muted">Question bank: {QUESTIONS.length} questions.</p>
  <ul>
    {#each UNITS as unit (unit.id)}
      <li>Unit {unit.id}: {unit.title} — {questionsInUnit(unit.id).length} questions</li>
    {/each}
  </ul>
</section>
