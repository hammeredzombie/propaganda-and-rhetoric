<script>
  import { goHome } from '../game/router.js';

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
    <a href="./" on:click|preventDefault={goHome}>
      <p class="masthead__nameplate">The Proper Goose</p>
    </a>
    <p class="masthead__tagline">Take a Gander at the daily News.</p>
  </div>
  <div class="masthead__meta masthead__meta--right">
    <span>{today}</span>
  </div>
</header>

<style>
  .masthead {
    border-bottom: 3px double var(--color-rule-strong);
    padding: var(--space-4) var(--space-5) var(--space-3);
    max-width: 912px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: end;
    gap: var(--space-4);
  }

  @media (min-width: 1280px) {
    .masthead {
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

  .masthead__title a {
    color: inherit;
    border-bottom: none;
    display: inline-block;
  }

  .masthead__title a:focus-visible {
    outline: 2px solid var(--color-ink-strong);
    outline-offset: 4px;
  }

  .masthead__tagline {
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--text-sm);
    color: var(--color-ink-muted);
    margin: var(--space-1) 0 0;
  }

  .masthead__meta {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xs);
    letter-spacing: 0.12em;
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
