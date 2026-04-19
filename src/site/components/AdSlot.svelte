<script>
  export let ad = {
    variant: 'strip',
    kicker: 'Advertisement',
    body: 'Your message here.'
  };

  $: variant = ad?.variant || 'strip';
</script>

<aside class="ad ad--{variant}" aria-label="Advertisement">
  {#if variant === 'strip'}
    <span class="ad__kicker">{ad.kicker}</span>
    <span class="ad__body">{ad.body}</span>

  {:else if variant === 'poster'}
    <div class="ad__kicker">{ad.kicker}</div>
    <h3 class="ad__headline">{ad.headline}</h3>
    {#if ad.body}<p class="ad__body">{ad.body}</p>{/if}
    {#if ad.cta}<div class="ad__cta">{ad.cta}</div>{/if}

  {:else if variant === 'patent'}
    <div class="ad__kicker">{ad.kicker}</div>
    <p class="ad__brand">{ad.brand}</p>
    {#if ad.ornament}<div class="ad__ornament">{ad.ornament}</div>{/if}
    <p class="ad__headline">{ad.headline}</p>
    {#if ad.attribution}<p class="ad__attribution">— {ad.attribution}</p>{/if}
    <div class="ad__copy">
      {#each ad.body as para}<p>{para}</p>{/each}
    </div>
    {#if ad.footnote}<p class="ad__footnote">{ad.footnote}</p>{/if}

  {:else if variant === 'classifieds'}
    <div class="ad__kicker">{ad.kicker}</div>
    <div class="ad__items">
      {#each ad.items as item}
        <p class="ad__item">
          <span class="ad__item-tag">{item.tag}</span>
          <span class="ad__item-body">{item.body}</span>
        </p>
      {/each}
    </div>

  {:else if variant === 'notice'}
    <div class="ad__kicker">{ad.kicker}</div>
    <div class="ad__body">
      {#each ad.body as para, i}
        <p class="ad__para" class:ad__para--first={i === 0}>{para}</p>
      {/each}
      {#if ad.signature}<p class="ad__signature">{ad.signature}</p>{/if}
    </div>

  {:else if variant === 'coupon'}
    <span class="ad__kicker">{ad.kicker}</span>
    <h3 class="ad__headline">{ad.headline}</h3>
    {#if ad.body}<p class="ad__body">{ad.body}</p>{/if}
    {#if ad.fields}
      <div class="ad__fields">
        {#each ad.fields as field}
          <div class="ad__field">
            <span class="ad__field-label">{field}</span>
            <span class="ad__field-line" aria-hidden="true"></span>
          </div>
        {/each}
      </div>
    {/if}

  {:else if variant === 'column'}
    <div class="ad__label">{ad.label}</div>
    <p class="ad__body">{ad.body}</p>

  {:else if variant === 'banner'}
    <div class="ad__kicker"><span>{ad.kicker}</span></div>
    <div class="ad__content">
      <p class="ad__headline">{ad.headline}</p>
      {#if ad.body}<p class="ad__body">{ad.body}</p>{/if}
    </div>
  {/if}
</aside>

<style>
  .ad {
    font-family: var(--font-body);
    color: var(--color-ink);
  }

  /* ─────────────────────────────── STRIP ───────────────────────────────
     Horizontal row: accent tile + deadpan body in letterspaced display. */
  .ad--strip {
    display: flex;
    align-items: stretch;
    border-top: 1px solid var(--color-ink-strong);
    border-bottom: 1px solid var(--color-ink-strong);
    background: var(--color-paper);
  }

  .ad--strip .ad__kicker {
    font-family: var(--font-display);
    font-size: var(--text-xxs);
    font-weight: 700;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    background: var(--color-accent);
    color: var(--color-paper);
    /* asymmetric padding — press misregistration tell */
    padding: 5px var(--space-4) 4px;
    display: flex;
    align-items: center;
    white-space: nowrap;
    font-feature-settings: "lnum", "kern";
  }

  .ad--strip .ad__body {
    font-family: var(--font-display);
    font-style: italic;
    font-size: var(--text-sm);
    padding: var(--space-2) var(--space-4) 3px;
    flex: 1;
    display: flex;
    align-items: center;
    color: var(--color-ink-soft);
    border-left: none; /* explicit: no accent stripe */
  }

  /* ─────────────────────────────── POSTER ───────────────────────────────
     Tall recruitment poster. Gold kicker cap → navy ground with
     reversed-cream serif headline → red CTA foot. */
  .ad--poster {
    background: var(--color-navy);
    color: var(--color-paper);
    display: flex;
    flex-direction: column;
    border: 2px solid var(--color-ink-strong);
    min-height: 320px;
  }

  .ad--poster .ad__kicker {
    background: var(--color-gold);
    color: var(--color-ink-strong);
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xxs);
    letter-spacing: 0.28em;
    text-transform: uppercase;
    text-align: center;
    padding: 6px var(--space-3) 4px;
    border-bottom: 2px solid var(--color-ink-strong);
    font-feature-settings: "lnum", "kern";
  }

  .ad--poster .ad__headline {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xl);
    line-height: var(--leading-tight);
    color: var(--color-paper);
    text-align: center;
    padding: var(--space-6) var(--space-4) var(--space-4);
    margin: 0;
    white-space: pre-line;
    font-feature-settings: "lnum", "kern";
    letter-spacing: 0.01em;
  }

  .ad--poster .ad__body {
    padding: 0 var(--space-5) var(--space-5);
    text-align: center;
    font-family: var(--font-body);
    font-size: var(--text-sm);
    font-style: italic;
    line-height: var(--leading-snug);
    color: color-mix(in oklch, var(--color-paper) 88%, var(--color-ink) 12%);
    margin: 0 0 auto;
    max-width: 26ch;
    margin-inline: auto;
  }

  .ad--poster .ad__cta {
    background: var(--color-accent);
    color: var(--color-paper);
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xxs);
    letter-spacing: 0.28em;
    text-transform: uppercase;
    text-align: center;
    padding: var(--space-3) var(--space-3) var(--space-2);
    border-top: 2px solid var(--color-ink-strong);
    font-feature-settings: "lnum", "kern";
  }

  /* ─────────────────────────────── PATENT ───────────────────────────────
     Patent-medicine ad. Double-rule frame, display wordmark, italic
     testimonial, two-column justified body, paranoid fine print. */
  .ad--patent {
    background: var(--color-paper);
    border-top: 3px double var(--color-ink-strong);
    border-bottom: 3px double var(--color-ink-strong);
    border-left: 1px solid var(--color-ink-strong);
    border-right: 1px solid var(--color-ink-strong);
    padding: var(--space-4) var(--space-5) var(--space-4);
    text-align: center;
  }

  .ad--patent .ad__kicker {
    font-family: var(--font-display);
    font-size: var(--text-xxs);
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--color-ink-muted);
    margin-bottom: var(--space-2);
  }

  .ad--patent .ad__brand {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-2xl);
    letter-spacing: 0.12em;
    color: var(--color-ink-strong);
    margin: 0 0 var(--space-1);
    line-height: 1;
  }

  .ad--patent .ad__ornament {
    color: var(--color-gold-deep);
    font-size: var(--text-sm);
    letter-spacing: 0.5em;
    margin-bottom: var(--space-3);
    padding-left: 0.5em;
  }

  .ad--patent .ad__headline {
    font-family: var(--font-display);
    font-style: italic;
    font-weight: 400;
    font-size: var(--text-lg);
    line-height: var(--leading-snug);
    color: var(--color-ink);
    margin: 0 0 var(--space-2);
  }

  .ad--patent .ad__attribution {
    font-family: var(--font-display);
    font-size: var(--text-xxs);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--color-ink-muted);
    margin: 0 0 var(--space-4);
  }

  .ad--patent .ad__copy {
    text-align: justify;
    hyphens: auto;
    columns: 2;
    column-gap: var(--space-5);
    column-rule: 0.5px solid var(--color-rule);
    font-size: var(--text-sm);
    line-height: var(--leading-snug);
    color: var(--color-ink);
    margin: 0 0 var(--space-3);
  }

  .ad--patent .ad__copy p {
    margin: 0 0 var(--space-2);
  }
  .ad--patent .ad__copy p:last-child { margin-bottom: 0; }

  .ad--patent .ad__footnote {
    font-size: var(--text-xxs);
    font-style: italic;
    color: var(--color-ink-muted);
    border-top: 1px solid var(--color-rule);
    padding-top: var(--space-2);
    margin: 0;
    line-height: 1.35;
  }

  /* ───────────────────────────── CLASSIFIEDS ─────────────────────────────
     Tight two-column agate grid under a solid black bar, like a real
     classifieds block on page three. */
  .ad--classifieds {
    background: var(--color-paper);
    border-top: 2px solid var(--color-ink-strong);
    border-bottom: 2px solid var(--color-ink-strong);
  }

  .ad--classifieds .ad__kicker {
    background: var(--color-ink-strong);
    color: var(--color-paper);
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xs);
    letter-spacing: 0.32em;
    text-transform: uppercase;
    text-align: center;
    padding: 5px var(--space-4) 4px;
    font-feature-settings: "lnum", "kern";
  }

  .ad--classifieds .ad__items {
    padding: var(--space-4) var(--space-4);
    columns: 2;
    column-gap: var(--space-5);
    column-rule: 0.5px solid var(--color-rule);
    font-size: var(--text-xs);
    line-height: 1.4;
  }

  .ad--classifieds .ad__item {
    break-inside: avoid;
    margin: 0 0 var(--space-3);
    color: var(--color-ink);
    text-align: justify;
    hyphens: auto;
  }

  .ad--classifieds .ad__item-tag {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xxs);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-ink-strong);
  }

  .ad--classifieds .ad__item-tag::after {
    content: ' — ';
    font-weight: 400;
    letter-spacing: 0;
  }

  /* ─────────────────────────────── NOTICE ───────────────────────────────
     Government notice: navy kicker bar, justified body, a single
     red initial cap, italic signature aligned right. */
  .ad--notice {
    background: var(--color-paper);
    border: 1px solid var(--color-ink-strong);
  }

  .ad--notice .ad__kicker {
    background: var(--color-navy);
    color: var(--color-paper);
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xxs);
    letter-spacing: 0.24em;
    text-transform: uppercase;
    text-align: center;
    padding: 5px var(--space-3) 4px;
    border-bottom: 1px solid var(--color-ink-strong);
    font-feature-settings: "lnum", "kern";
  }

  .ad--notice .ad__body {
    padding: var(--space-4) var(--space-5) var(--space-4);
    font-size: var(--text-sm);
    line-height: var(--leading-snug);
    color: var(--color-ink);
  }

  .ad--notice .ad__para {
    margin: 0 0 var(--space-3);
    text-align: justify;
    hyphens: auto;
  }

  .ad--notice .ad__para--first::first-letter {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 2.6em;
    float: left;
    line-height: 0.85;
    padding: 0.08em 0.12em 0;
    margin: 0.08em 0.15em 0 0;
    color: var(--color-accent);
  }

  .ad--notice .ad__signature {
    margin: var(--space-3) 0 0;
    font-style: italic;
    text-align: right;
    color: var(--color-ink-soft);
    font-size: var(--text-xs);
  }

  /* ─────────────────────────────── COUPON ───────────────────────────────
     Dashed border on all sides (tear-line), gold kicker tile at top-left,
     old-fashioned address lines. */
  .ad--coupon {
    border: 1.5px dashed var(--color-ink-strong);
    background: var(--color-paper);
    padding: var(--space-4);
    position: relative;
    display: grid;
    gap: var(--space-3);
  }

  .ad--coupon .ad__kicker {
    font-family: var(--font-display);
    font-size: var(--text-xxs);
    font-weight: 700;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    background: var(--color-gold);
    color: var(--color-ink-strong);
    padding: 4px var(--space-3) 3px;
    justify-self: start;
    font-feature-settings: "lnum", "kern";
  }

  .ad--coupon .ad__headline {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-md);
    margin: 0;
    color: var(--color-ink);
    line-height: var(--leading-snug);
  }

  .ad--coupon .ad__body {
    font-size: var(--text-sm);
    line-height: var(--leading-snug);
    color: var(--color-ink-soft);
    margin: 0;
    font-style: italic;
  }

  .ad--coupon .ad__fields {
    display: grid;
    gap: var(--space-3);
    margin-top: var(--space-2);
  }

  .ad--coupon .ad__field {
    display: grid;
    grid-template-columns: minmax(56px, auto) 1fr;
    align-items: end;
    gap: var(--space-3);
  }

  .ad--coupon .ad__field-label {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xxs);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--color-ink-soft);
  }

  .ad--coupon .ad__field-line {
    border-bottom: 1px solid var(--color-ink-strong);
    height: 1em;
    display: block;
  }

  /* ────────────────────────── COLUMN (inline text) ──────────────────────
     Meant to pass for editorial. Just a thin "ADVERTISEMENT" header bar
     above a paragraph of justified italic body copy. */
  .ad--column {
    padding: 0;
    background: transparent;
  }

  .ad--column .ad__label {
    font-family: var(--font-display);
    font-size: var(--text-xxs);
    text-transform: uppercase;
    letter-spacing: 0.36em;
    color: var(--color-ink-muted);
    border-top: 1px solid var(--color-ink-strong);
    border-bottom: 1px solid var(--color-ink-strong);
    text-align: center;
    padding: 4px 0 3px;
    margin: 0 0 var(--space-3);
    font-feature-settings: "lnum", "kern";
  }

  .ad--column .ad__body {
    font-family: var(--font-body);
    font-size: var(--text-sm);
    line-height: var(--leading-normal);
    text-align: justify;
    hyphens: auto;
    color: var(--color-ink);
    font-style: italic;
    margin: 0;
  }

  /* ─────────────────────────────── BANNER ───────────────────────────────
     Full-width red ground with a vertical gold kicker, reversed cream
     serif headline, and an italic sub-line. Used once a page at most. */
  .ad--banner {
    background: var(--color-accent);
    color: var(--color-paper);
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: stretch;
    border-top: 3px solid var(--color-ink-strong);
    border-bottom: 3px solid var(--color-ink-strong);
  }

  .ad--banner .ad__kicker {
    background: var(--color-gold);
    color: var(--color-ink-strong);
    border-right: 2px solid var(--color-ink-strong);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-3) 10px;
  }

  .ad--banner .ad__kicker span {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xs);
    letter-spacing: 0.32em;
    text-transform: uppercase;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-feature-settings: "lnum", "kern";
  }

  .ad--banner .ad__content {
    padding: var(--space-4) var(--space-6);
    display: grid;
    gap: var(--space-2);
    align-content: center;
  }

  .ad--banner .ad__headline {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xl);
    line-height: 1.05;
    margin: 0;
    color: var(--color-paper);
    letter-spacing: 0.01em;
    /* slight vertical nudge inside the filled ground — press tell */
    transform: translateY(-0.5px);
  }

  .ad--banner .ad__body {
    font-family: var(--font-body);
    font-size: var(--text-sm);
    font-style: italic;
    color: color-mix(in oklch, var(--color-paper) 92%, var(--color-ink) 8%);
    margin: 0;
  }

  /* ────────────────────────── Small-viewport adjust ─────────────────────
     Collapse any multi-column ad to a single column below 720px. */
  @media (max-width: 720px) {
    .ad--patent .ad__copy,
    .ad--classifieds .ad__items {
      columns: 1;
      column-rule: none;
    }
    .ad--banner {
      grid-template-columns: 1fr;
    }
    .ad--banner .ad__kicker {
      border-right: none;
      border-bottom: 2px solid var(--color-ink-strong);
    }
    .ad--banner .ad__kicker span {
      writing-mode: horizontal-tb;
      transform: none;
    }
  }
</style>
