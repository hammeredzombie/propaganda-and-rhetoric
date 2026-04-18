<script>
  export let ad = {
    label: 'Advertisement',
    brand: 'SPONSOR',
    headline: 'Your message here.',
    body: '',
    size: 'medium'
  };
</script>

<aside class="ad ad--{ad.size || 'medium'}" aria-label="Advertisement">
  <div class="ad__label">{ad.label || 'Advertisement'}</div>
  <div class="ad__body">
    <div class="ad__brand">{ad.brand}</div>
    <div class="ad__headline">{ad.headline}</div>
    {#if ad.body}<p class="ad__copy">{ad.body}</p>{/if}
  </div>
</aside>

<style>
  .ad {
    background: var(--color-ad-bg);
    border: 1px solid var(--color-rule);
    padding: var(--space-3);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .ad__label {
    font-family: var(--font-sans);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-ink-muted);
    text-align: center;
    border-bottom: 1px solid var(--color-rule);
    padding-bottom: var(--space-2);
  }

  .ad__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--space-4) var(--space-3);
  }

  .ad__brand {
    font-family: var(--font-sans);
    font-weight: 700;
    font-size: var(--text-xs);
    letter-spacing: 0.15em;
    color: var(--color-accent);
    text-transform: uppercase;
    margin-bottom: var(--space-2);
  }

  .ad__headline {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xl);
    line-height: var(--leading-snug);
    font-style: italic;
    margin-bottom: var(--space-2);
  }

  .ad__copy {
    font-size: var(--text-sm);
    color: var(--color-ink-soft);
    line-height: var(--leading-snug);
    margin: 0;
  }

  .ad--small {
    min-height: 120px;
  }

  .ad--medium {
    min-height: 260px;
  }

  .ad--large {
    min-height: 400px;
  }
</style>
