<script>
  const today = new Date(3033, 3, 1).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
</script>

<header class="masthead">
  <div class="masthead__inner">
    <div class="masthead__meta masthead__meta--left">
      <span>Vol. CXLVII · No. 1,984</span>
    </div>
    <div class="masthead__title">
      <p class="masthead__nameplate">The Proper Goose</p>
      <p class="masthead__tagline">Take a Gander at the daily News.</p>
    </div>
    <div class="masthead__meta masthead__meta--right">
      <span>{today}</span>
    </div>
  </div>

  <div class="masthead__dateline" aria-hidden="true">
    <span class="masthead__dateline-item masthead__dateline-item--accent">City Edition</span>
    <span class="masthead__dateline-sep">·</span>
    <span class="masthead__dateline-item">Weather — High 62°, Fair</span>
    <span class="masthead__dateline-sep">·</span>
    <span class="masthead__dateline-item">Est. MDCCCXCVIII</span>
    <span class="masthead__dateline-sep">·</span>
    <span class="masthead__dateline-item">Price: Three Credits</span>
  </div>
</header>

<style>
  .masthead {
    border-bottom: 3px double var(--color-rule-strong);
    background: var(--color-paper);
  }

  .masthead__inner {
    padding: var(--space-4) var(--space-5) var(--space-3);
    max-width: 912px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: end;
    gap: var(--space-4);
  }

  @media (min-width: 1280px) {
    .masthead__inner {
      max-width: 1120px;
      padding: var(--space-5) var(--space-6) var(--space-4);
    }
  }

  .masthead__title {
    text-align: center;
  }

  .masthead__nameplate {
    font-family: var(--font-display);
    font-size: clamp(2rem, 5vw, var(--text-3xl));
    font-weight: 700;
    line-height: var(--leading-tight);
    margin: 0;
    letter-spacing: 0.005em;
    font-feature-settings: "lnum", "kern";
    color: var(--color-ink);
  }

  .masthead__tagline {
    font-family: var(--font-body);
    font-style: italic;
    font-weight: 400;
    font-size: var(--text-lg);
    line-height: var(--leading-tight);
    color: var(--color-ink);
    margin: var(--space-2) 0 0;
  }

  .masthead__meta {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xxs);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-paper);
    background: var(--color-navy);
    /* asymmetric padding — press misregistration */
    padding: 3px var(--space-3) 2px;
    line-height: 1.5;
    font-feature-settings: "lnum", "kern";
  }

  .masthead__meta--left {
    justify-self: start;
  }

  .masthead__meta--right {
    justify-self: end;
  }

  .masthead__dateline {
    border-top: 1px solid var(--color-ink-strong);
    border-bottom: 2px solid var(--color-accent);
    padding: 5px var(--space-5) 4px;
    max-width: 912px;
    margin: 0 auto;
    font-family: var(--font-display);
    font-size: var(--text-xxs);
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--color-ink);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-3);
    font-feature-settings: "lnum", "kern";
  }

  @media (min-width: 1280px) {
    .masthead__dateline {
      max-width: 1120px;
      padding: 6px var(--space-6) 5px;
    }
  }

  .masthead__dateline-item {
    white-space: nowrap;
  }

  .masthead__dateline-item--accent {
    color: var(--color-accent);
    font-weight: 700;
    letter-spacing: 0.26em;
  }

  .masthead__dateline-sep {
    color: var(--color-ink-muted);
    font-weight: 400;
  }

  @media (max-width: 720px) {
    .masthead__inner {
      grid-template-columns: 1fr;
      text-align: center;
    }
    .masthead__meta--left,
    .masthead__meta--right {
      justify-self: center;
    }
    .masthead__dateline {
      gap: var(--space-2);
      font-size: 10px;
      letter-spacing: 0.16em;
    }
  }
</style>
