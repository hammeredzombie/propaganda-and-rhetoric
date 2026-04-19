<script>
  import PullQuote from './PullQuote.svelte';

  export let article;
  export let size = 'medium';
  export let withLede = false;
</script>

{#if size === 'hero'}
  <article class="hero">
    <div class="hero__head">
      {#if article.kicker}
        <div class="hero__kicker">{article.kicker}</div>
      {/if}
      <h1 class="hero__headline">{article.headline}</h1>
      {#if article.dek}
        <p class="hero__dek">{article.dek}</p>
      {/if}
      <div class="hero__byline">
        <span class="hero__byline-cartouche">
          <span class="hero__byline-label">By</span>
          <strong class="hero__byline-name">{article.byline}</strong>
          {#if article.role}
            <span class="hero__byline-role">— {article.role}</span>
          {/if}
        </span>
        <span class="hero__byline-meta">
          {#if article.date}<time>{article.date}</time>{/if}
          {#if article.date && article.readTime}<span class="hero__byline-dot">·</span>{/if}
          {#if article.readTime}<span>{article.readTime}</span>{/if}
        </span>
      </div>
    </div>

    {#if withLede && article.lede}
      <div class="hero__body">
        <p class="hero__lede">
          {#if article.dateline}<span class="hero__dropcap" aria-hidden="true">{article.dateline[0]}</span><span class="hero__dateline">{article.dateline.slice(1)}</span><span class="hero__dateline-dash"> — </span>{article.lede}{:else}<span class="hero__dropcap" aria-hidden="true">{article.lede[0]}</span>{article.lede.slice(1)}{/if}
        </p>
        {#if article.pullquote}
          <div class="hero__pullquote">
            <PullQuote quote={article.pullquote.quote} attribution={article.pullquote.attribution} />
          </div>
        {/if}
        {#if article.continued}
          <p class="hero__continued">{article.continued}</p>
        {/if}
      </div>
    {/if}
  </article>
{:else}
  <article class="card card--{size}">
    {#if article.section}
      <div class="card__eyebrow">{article.section}</div>
    {/if}
    <h2 class="card__headline">{article.headline}</h2>
    {#if article.dek}
      <p class="card__dek">{#if article.dateline}<span class="card__dateline">{article.dateline}</span><span class="card__dateline-dash"> — </span>{/if}{article.dek}</p>
    {:else if article.dateline}
      <p class="card__dateline-line"><span class="card__dateline">{article.dateline}</span></p>
    {/if}
    {#if article.byline}
      <p class="card__byline">
        <span class="card__byline-label">By</span>
        <strong>{article.byline}</strong>
      </p>
    {/if}
  </article>
{/if}

<style>
  /* ══════════════════════════════════ HERO ══════════════════════════════
     The above-the-fold lede story. Multi-deck treatment with a red
     kicker-ribbon above the headline, a filled navy byline cartouche, a
     two-column justified lede, a gold-ground dropcap, a pull quote that
     spans the columns, and an italic continuation marker. */
  .hero {
    border-top: 4px solid var(--color-accent);
    padding-top: 0;
  }

  .hero__head {
    border-bottom: 1px solid var(--color-ink-strong);
    padding-bottom: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .hero__kicker {
    display: inline-block;
    background: var(--color-accent);
    color: var(--color-paper);
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xxs);
    letter-spacing: 0.3em;
    text-transform: uppercase;
    /* asymmetric vertical padding — press misregistration tell */
    padding: 4px var(--space-4) 3px;
    margin: var(--space-3) 0 var(--space-3);
    line-height: 1.4;
    font-feature-settings: "lnum", "kern";
  }

  .hero__headline {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-2xl);
    line-height: var(--leading-tight);
    color: var(--color-ink-strong);
    margin: 0 0 var(--space-3);
    letter-spacing: 0.005em;
    font-feature-settings: "lnum", "kern";
    max-width: 28ch;
  }

  .hero__dek {
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--text-md);
    line-height: var(--leading-snug);
    color: var(--color-ink-soft);
    margin: 0 0 var(--space-4);
    max-width: 58ch;
  }

  .hero__byline {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    gap: var(--space-3);
    font-family: var(--font-display);
    font-size: var(--text-xxs);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-feature-settings: "lnum", "kern";
  }

  .hero__byline-cartouche {
    background: var(--color-navy);
    color: var(--color-paper);
    padding: 4px var(--space-3) 3px;
    display: inline-flex;
    align-items: baseline;
    gap: 0.35em;
  }

  .hero__byline-label {
    opacity: 0.7;
    font-weight: 400;
  }

  .hero__byline-name {
    font-weight: 700;
    letter-spacing: 0.14em;
  }

  .hero__byline-role {
    opacity: 0.8;
    font-weight: 400;
    font-style: italic;
    text-transform: none;
    letter-spacing: 0.02em;
  }

  .hero__byline-meta {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-ink-soft);
    padding: 4px 0 3px;
  }

  .hero__byline-dot {
    color: var(--color-ink-muted);
    opacity: 0.8;
  }

  .hero__body {
    columns: 2;
    column-gap: var(--space-6);
    column-rule: 0.5px solid var(--color-rule);
  }

  .hero__lede {
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    text-align: justify;
    hyphens: auto;
    color: var(--color-ink);
    margin: 0 0 var(--space-4);
    font-feature-settings: "onum", "kern";
  }

  .hero__dateline {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.92em;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-ink-strong);
    font-feature-settings: "lnum", "kern";
  }

  .hero__dateline-dash {
    color: var(--color-ink-strong);
  }

  /* 3-line gold-ground dropcap in the display face, reversed on a flat
     gold tile. Poster-initial, not editorial-initial. */
  .hero__dropcap {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 3.2em;
    line-height: 0.82;
    float: left;
    padding: 0.1em 0.16em 0.08em;
    margin: 0.06em 0.12em -0.02em 0;
    background: var(--color-gold);
    color: var(--color-ink-strong);
    font-feature-settings: "lnum", "kern";
  }

  .hero__pullquote {
    column-span: all;
    margin: var(--space-4) 0 var(--space-4);
  }

  /* Let PullQuote be a little more compact when living inside the hero. */
  .hero__pullquote :global(.pullquote) {
    margin: 0;
    padding: var(--space-4) var(--space-5);
  }
  .hero__pullquote :global(.pullquote p) {
    font-size: var(--text-lg);
  }

  .hero__continued {
    margin: 0;
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--text-xs);
    color: var(--color-ink-soft);
    text-align: right;
    break-before: avoid;
  }

  /* Primary LD viewport (~948px) and below — keep two columns until
     the column width becomes uncomfortably narrow. */
  @media (max-width: 720px) {
    .hero__body {
      columns: 1;
      column-rule: none;
    }
    .hero__headline {
      font-size: var(--text-xl);
    }
  }

  /* ══════════════════════════════════ CARDS ═════════════════════════════
     Secondary and feature cards. Kept deliberately plain so the hero
     and the ad chrome carry all the visual weight. */
  .card {
    padding: var(--space-4) 0 0;
    border-top: 1px solid var(--color-rule);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .card__eyebrow {
    display: inline-block;
    align-self: start;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xxs);
    text-transform: uppercase;
    letter-spacing: 0.22em;
    color: var(--color-navy);
    font-feature-settings: "lnum", "kern";
    margin-bottom: 2px;
  }

  .card--large .card__eyebrow {
    color: var(--color-paper);
    background: var(--color-navy);
    padding: 3px var(--space-3) 2px;
  }

  .card__headline {
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--color-ink-strong);
    margin: 0;
    line-height: var(--leading-tight);
    font-feature-settings: "lnum", "kern";
    letter-spacing: 0.002em;
  }

  .card--large .card__headline {
    font-size: var(--text-lg);
  }

  .card--medium .card__headline {
    font-size: var(--text-md);
  }

  .card--small .card__headline {
    font-size: var(--text-base);
  }

  .card__dek {
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--text-sm);
    color: var(--color-ink-soft);
    line-height: var(--leading-snug);
    margin: 0;
  }

  .card--large .card__dek {
    font-size: var(--text-base);
  }

  /* Dateline opener — "LOREM IPSUM, APR. 18 — " in small caps display face,
     set upright even when embedded inside the italic deck. */
  .card__dateline {
    font-family: var(--font-display);
    font-weight: 700;
    font-style: normal;
    font-size: 0.92em;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-ink-strong);
    font-feature-settings: "lnum", "kern";
  }

  .card__dateline-dash {
    font-style: normal;
    color: var(--color-ink-strong);
  }

  .card__dateline-line {
    font-family: var(--font-body);
    font-size: var(--text-sm);
    line-height: var(--leading-snug);
    margin: 0;
  }

  .card__byline {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: var(--text-xxs);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--color-ink-muted);
    margin: var(--space-1) 0 0;
    font-feature-settings: "lnum", "kern";
  }

  .card__byline-label {
    opacity: 0.7;
  }

  .card__byline strong {
    color: var(--color-ink-soft);
    font-weight: 700;
  }
</style>
