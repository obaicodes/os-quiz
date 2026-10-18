<script lang="ts">
  import type { Question } from '../lib/types'

  let { q }: { q: Question } = $props()
</script>

<p class="read text">{q.question}</p>
{#if q.table}
  <div class="table-wrap">
    <table class="read">
      <thead>
        <tr>
          {#each q.table.headers as h, i (i)}<th>{h}</th>{/each}
        </tr>
      </thead>
      <tbody>
        {#each q.table.rows as row, r (r)}
          <tr>
            {#each row as cell, c (c)}<td>{cell}</td>{/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
{#if q.code}
  <pre class="code">{q.code}</pre>
{/if}

<style>
  .text {
    margin: 0 0 12px;
    font-size: 1.125rem;
  }
  .table-wrap {
    overflow-x: auto;
    margin-bottom: 12px;
  }
  table {
    border-collapse: collapse;
    min-width: 60%;
  }
  th,
  td {
    border: 1px solid var(--line);
    padding: 6px 12px;
    text-align: center;
  }
  th {
    background: var(--surface-2);
  }
  .code {
    background: var(--bg);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 12px;
    overflow-x: auto;
    margin: 0 0 12px;
  }
</style>
