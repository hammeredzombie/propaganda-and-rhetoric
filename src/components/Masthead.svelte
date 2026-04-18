<script>
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
</script>

<header class="masthead">
  <div class="masthead__meta masthead__meta--left">
    <span>Vol. CXLVII · No. 2,318</span>
  </div>
  <div class="masthead__title">
    <a href="./" on:click|preventDefault={() => history.pushState({}, '', './')}>
      <h1>The Daily Record</h1>
    </a>
    <p class="masthead__tagline">All the news that stays on-message.</p>
  </div>
  <div class="masthead__meta masthead__meta--right">
    <span>{today}</span>
  </div>
</header>

<style>
  .masthead {
    border-bottom: 3px double var(--color-rule-strong);
    padding: var(--space-5) var(--space-5) var(--space-4);
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: end;
    gap: var(--space-4);
  }

  .masthead__title {
    text-align: center;
  }

  .masthead__title h1 {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 900;
    margin: 0;
    letter-spacing: -0.01em;
    font-style: italic;
  }

  .masthead__title a {
    color: inherit;
    border-bottom: none;
  }

  .masthead__tagline {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: var(--text-sm);
    color: var(--color-ink-muted);
    margin: var(--space-1) 0 0;
  }

  .masthead__meta {
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: var(--text-xs);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
  }

  .masthead__meta--left {
    text-align: left;
  }

  .masthead__meta--right {
    text-align: right;
  }

  @media (max-width: 720px) {
    .masthead {
      grid-template-columns: 1fr;
      text-align: center;
    }
    .masthead__meta--left,
    .masthead__meta--right {
      text-align: center;
    }
  }
</style>
