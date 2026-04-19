<script>
  import { tick } from 'svelte';
  import { activeHint, closeHint } from '../game/huntStore.js';

  // Section labels are functional UI — routes mapped to broadsheet-
  // register page names.  Never in-fiction prose.
  const SECTION_LABELS = {
    home: 'Front Page',
    politics: 'Politics',
    world: 'World',
    business: 'Business',
    opinion: 'Opinion',
    culture: 'Culture',
    science: 'Science',
    obituaries: 'Obituaries',
    unauthorized: 'Restricted'
  };

  let dialogEl;
  let closeButtonEl;
  let previouslyFocused = null;

  $: open = $activeHint !== null;
  $: sectionLabel = $activeHint
    ? SECTION_LABELS[$activeHint.route] ?? $activeHint.route
    : '';
  $: bodyText = $activeHint ? $activeHint.text : '';

  function handleClose() {
    const restoreTarget = previouslyFocused;
    closeHint();
    tick().then(() => {
      if (restoreTarget && typeof restoreTarget.focus === 'function') {
        restoreTarget.focus();
      }
    });
    previouslyFocused = null;
  }

  function handleKeydown(event) {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      handleClose();
      return;
    }
    if (event.key === 'Tab' && dialogEl) {
      event.preventDefault();
      closeButtonEl?.focus();
    }
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) handleClose();
  }

  function mountDispatch(node) {
    previouslyFocused =
      typeof document !== 'undefined' ? document.activeElement : null;
    tick().then(() => closeButtonEl?.focus());
    return {};
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div
    class="hint-wash"
    on:click={handleBackdropClick}
    role="presentation"
  >
    <section
      bind:this={dialogEl}
      use:mountDispatch
      class="hint-dispatch"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hint-dispatch-title"
    >
      <h2 id="hint-dispatch-title" class="hint-dispatch__heading">
        <span class="hint-dispatch__flag">Dispatch</span>
        <span class="hint-dispatch__cartouche">{sectionLabel}</span>
      </h2>

      <div class="hint-dispatch__rule" aria-hidden="true"></div>

      <div class="hint-dispatch__body">
        <p class="hint-dispatch__text">{bodyText}</p>
      </div>

      <footer class="hint-dispatch__foot">
        <span class="hint-dispatch__mark" aria-hidden="true">§ &nbsp;§ &nbsp;§</span>
        <button
          bind:this={closeButtonEl}
          type="button"
          class="hint-dispatch__close"
          on:click={handleClose}
        >
          Close
        </button>
      </footer>
    </section>
  </div>
{/if}

<style>
  .hint-wash {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: grid;
    place-items: center;
    padding: var(--space-5);
    /* Warm ink wash, no blur — poster ink does not blur. */
    background: color-mix(in oklch, var(--ink-base) 52%, transparent);
    animation: wash-in 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .hint-dispatch {
    width: min(480px, 100%);
    background: var(--color-paper);
    color: var(--color-ink);
    border: var(--rule-thick, 2px) solid var(--color-ink-strong);
    animation: dispatch-in 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
    display: flex;
    flex-direction: column;
  }

  .hint-dispatch__heading {
    margin: 0;
    display: flex;
    flex-direction: column;
    font-weight: 400;
  }

  /* Red flag banner — "DISPATCH".  Solid fill, crisp edge, translateY
     mis-registration tell per .impeccable.md realism detail #1. */
  .hint-dispatch__flag {
    background: var(--color-accent);
    color: var(--color-paper);
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-sm);
    letter-spacing: 0.28em;
    text-transform: uppercase;
    padding: var(--space-3) var(--space-5) var(--space-2);
    transform: translateY(0.5px);
    border-bottom: 1px solid var(--color-ink-strong);
  }

  /* Navy cartouche — section name.  Asymmetric vertical padding
     carries the second mis-registration tell. */
  .hint-dispatch__cartouche {
    background: var(--color-navy);
    color: var(--color-paper);
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--text-xs);
    letter-spacing: 0.12em;
    padding: 5px var(--space-5) 3px;
  }

  .hint-dispatch__rule {
    height: 0;
    border-top: var(--rule-hairline, 0.5px) solid var(--color-ink-rule);
    margin: 0;
  }

  .hint-dispatch__body {
    padding: var(--space-5) var(--space-5) var(--space-4);
  }

  .hint-dispatch__text {
    margin: 0;
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    color: var(--color-ink);
    text-align: justify;
    hyphens: auto;
    font-feature-settings: "onum", "kern";
  }

  .hint-dispatch__foot {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-4);
    padding: var(--space-3) var(--space-5) var(--space-4);
    border-top: var(--rule-hairline, 0.5px) solid var(--color-ink-rule);
  }

  .hint-dispatch__mark {
    font-family: var(--font-display);
    color: var(--color-ink-muted);
    font-size: var(--text-sm);
    letter-spacing: 0.05em;
  }

  /* Typeset close — small-caps display face, underlined, not a button. */
  .hint-dispatch__close {
    background: transparent;
    border: 0;
    margin: 0;
    padding: 0;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xs);
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--color-navy);
    text-decoration-line: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
    cursor: pointer;
  }

  .hint-dispatch__close:hover,
  .hint-dispatch__close:focus-visible {
    color: var(--color-accent);
    outline: none;
    text-decoration-color: var(--color-accent);
  }

  @keyframes wash-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes dispatch-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .hint-wash,
    .hint-dispatch {
      animation: none;
    }
  }
</style>
