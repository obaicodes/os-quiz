<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    open,
    title,
    onclose,
    children,
    actions,
  }: {
    open: boolean
    title: string
    /** Called when the dialog is dismissed (Escape key or a button that closes it). */
    onclose: () => void
    children?: Snippet
    actions: Snippet
  } = $props()

  let dialog: HTMLDialogElement
  const titleId = `dlg-${Math.random().toString(36).slice(2, 8)}`

  $effect(() => {
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  })
</script>

<dialog bind:this={dialog} aria-labelledby={titleId} {onclose}>
  <h2 id={titleId}>{title}</h2>
  {@render children?.()}
  <div class="actions">{@render actions()}</div>
</dialog>

<style>
  dialog {
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 20px;
    width: min(440px, calc(100vw - 32px));
  }
  dialog::backdrop {
    background: rgb(0 0 0 / 0.6);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
  }
</style>
