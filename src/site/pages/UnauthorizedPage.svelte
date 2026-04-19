<script>
  // The in-fiction "restricted" page.  The site's Proper Goose seal is blown
  // up to fill the viewport, with an official-notice stamp layered over it
  // and a short government-voice dispatch underneath.  Reached via the
  // `#/unauthorized` route or any unknown hash route.
</script>

<section class="unauthorized" aria-labelledby="unauthorized-headline">
  <div class="unauthorized__stamp">
    <img
      class="unauthorized__seal"
      src="/favicon.svg"
      alt=""
      aria-hidden="true"
      draggable="false"
    />
    <div class="unauthorized__overlay" aria-hidden="true">
      <p class="unauthorized__stamp-line">Lorem Ipsum</p>
      <p class="unauthorized__stamp-title">Restricted</p>
      <p class="unauthorized__stamp-sub">Consectetur · Adipiscing</p>
    </div>
  </div>

  <div class="unauthorized__notice">
    <p class="unauthorized__eyebrow">Lorem Ipsum Dolor Sit Amet</p>
    <h1 id="unauthorized-headline" class="unauthorized__headline">Unauthorized Access</h1>
    <p class="unauthorized__body">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </p>
    <p class="unauthorized__body">
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt.
    </p>
    <p class="unauthorized__signature">— Lorem Ipsum, dolor sit amet.</p>
  </div>
</section>

<style>
  .unauthorized {
    min-height: 82vh;
    display: grid;
    place-items: center;
    gap: var(--space-5);
    padding: var(--space-5) 0;
    position: relative;
  }

  /* ── The seal ─────────────────────────────────────────────────────────
     The favicon is the page.  We let it grow to 80vmin so it truly
     dominates, capping so it never exceeds the main column. */
  .unauthorized__stamp {
    position: relative;
    width: min(80vmin, 640px);
    aspect-ratio: 1;
  }

  .unauthorized__seal {
    width: 100%;
    height: 100%;
    display: block;
    user-select: none;
  }

  .unauthorized__overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    text-align: center;
    transform: rotate(-6deg);
    color: var(--color-accent);
    pointer-events: none;
    font-feature-settings: "lnum", "kern";
  }

  .unauthorized__stamp-line,
  .unauthorized__stamp-sub {
    font-family: var(--font-display);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    font-size: clamp(0.7rem, 1.6vw, 0.95rem);
    margin: 0;
    opacity: 0.95;
  }

  .unauthorized__stamp-title {
    font-family: var(--font-display);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: clamp(2.4rem, 9vw, 5.2rem);
    margin: 0.15em 0;
    padding: 0.08em 0.4em;
    border: 5px double currentColor;
    background: rgba(249, 243, 223, 0.82);
    line-height: 1;
  }

  /* ── The notice ───────────────────────────────────────────────────────
     An official dispatch band.  Rules top and bottom, short measure. */
  .unauthorized__notice {
    max-width: 56ch;
    text-align: center;
    border-top: 2px solid var(--color-ink-strong);
    border-bottom: 2px solid var(--color-ink-strong);
    padding: var(--space-4) var(--space-5);
    background: var(--color-paper);
  }

  .unauthorized__eyebrow {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xxs);
    text-transform: uppercase;
    letter-spacing: 0.32em;
    color: var(--color-ink-soft);
    margin: 0 0 var(--space-2);
    font-feature-settings: "lnum", "kern";
  }

  .unauthorized__headline {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xl);
    line-height: var(--leading-tight);
    color: var(--color-ink-strong);
    margin: 0 0 var(--space-3);
    letter-spacing: 0.01em;
  }

  .unauthorized__body {
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    color: var(--color-ink);
    margin: 0 auto var(--space-3);
    text-align: justify;
    hyphens: auto;
  }

  .unauthorized__signature {
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--text-sm);
    color: var(--color-ink-soft);
    margin: 0;
  }

  @media (max-width: 720px) {
    .unauthorized {
      min-height: 70vh;
    }
  }
</style>
