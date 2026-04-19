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
    margin: var(--space-6) 0 var(--space-7);
    padding: var(--space-5) var(--space-6);
    background: var(--color-gold);
    border-top: 4px solid var(--color-ink-strong);
    border-bottom: 4px solid var(--color-ink-strong);
  }

  blockquote {
    margin: 0;
  }

  p {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xl);
    line-height: var(--leading-snug);
    color: var(--color-ink);
    margin: 0 0 var(--space-3);
    text-align: left;
  }

  cite {
    display: block;
    font-family: var(--font-display);
    font-weight: 700;
    font-style: normal;
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--color-navy-deep);
    text-align: left;
  }
</style>
