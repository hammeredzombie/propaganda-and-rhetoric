<script>
  export let quote = '';
  export let attribution = '';
</script>

<aside class="pullquote">
  <blockquote>
    <p>{quote}</p>
    {#if attribution}<cite>— {attribution}</cite>{/if}
  </blockquote>
</aside>

<style>
  .pullquote {
    margin: var(--space-6) 0;
    padding: var(--space-4) var(--space-5);
    border-top: 2px solid var(--color-rule-strong);
    border-bottom: 2px solid var(--color-rule-strong);
  }

  blockquote {
    margin: 0;
  }

  p {
    font-family: var(--font-display);
    font-style: italic;
    font-size: var(--text-2xl);
    line-height: var(--leading-snug);
    color: var(--color-ink);
    margin: 0 0 var(--space-3);
    text-align: center;
  }

  cite {
    display: block;
    font-family: var(--font-sans);
    font-style: normal;
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-ink-muted);
    text-align: center;
  }
</style>
