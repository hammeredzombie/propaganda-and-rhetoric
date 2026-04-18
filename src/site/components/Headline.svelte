<script>
  export let eyebrow = '';
  export let headline = '';
  export let dek = '';
</script>

<header class="article-headline">
  {#if eyebrow}<div class="eyebrow">{eyebrow}</div>{/if}
  <h1>{headline}</h1>
  {#if dek}<p class="article-headline__dek">{dek}</p>{/if}
</header>

<style>
  .article-headline {
    margin: 0 0 var(--space-5);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-rule);
  }

  h1 {
    font-family: var(--font-display);
    font-size: clamp(1.75rem, 4vw, var(--text-2xl));
    font-weight: 700;
    line-height: var(--leading-tight);
    margin: var(--space-2) 0 var(--space-3);
  }

  .article-headline__dek {
    font-family: var(--font-body);
    font-size: var(--text-md);
    font-style: italic;
    color: var(--color-ink-soft);
    line-height: var(--leading-snug);
    margin: 0;
  }
</style>
