<script>
  export let article;
  export let size = 'medium';
  export let onOpen = () => {};

  function open() {
    onOpen(article);
  }
</script>

<article class="card card--{size}" on:click={open} on:keydown={(e) => e.key === 'Enter' && open()} role="button" tabindex="0">
  {#if article.section}
    <div class="eyebrow">{article.section}</div>
  {/if}
  {#if article.image}
    <div class="card__image" aria-hidden="true">
      <div class="card__image-placeholder">
        <span>[illustration]</span>
        <small>{article.image}</small>
      </div>
    </div>
  {/if}
  <h2 class="card__headline">{article.headline}</h2>
  {#if article.dek}
    <p class="card__dek">{article.dek}</p>
  {/if}
  {#if article.byline}
    <p class="card__byline">By <strong>{article.byline}</strong></p>
  {/if}
</article>

<style>
  .card {
    cursor: pointer;
    padding: var(--space-4) 0;
    border-top: 1px solid var(--color-rule);
    transition: transform 180ms ease;
  }

  .card:hover,
  .card:focus-visible {
    outline: none;
    transform: translateY(-1px);
  }

  .card:hover .card__headline {
    color: var(--color-accent);
  }

  .card__image {
    margin: 0 0 var(--space-3);
    aspect-ratio: 3 / 2;
    background: var(--color-ad-bg);
    border: 1px solid var(--color-rule);
    position: relative;
    overflow: hidden;
  }

  .card__image-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--color-ink-muted);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    gap: var(--space-1);
    padding: var(--space-3);
    text-align: center;
  }

  .card__image-placeholder small {
    font-family: var(--font-serif);
    font-size: 11px;
    text-transform: none;
    letter-spacing: 0;
    font-style: italic;
    opacity: 0.65;
    max-width: 100%;
  }

  .card__headline {
    font-family: var(--font-display);
    font-weight: 900;
    color: var(--color-ink);
    transition: color 150ms ease;
  }

  .card--hero .card__headline {
    font-size: var(--text-4xl);
    line-height: var(--leading-tight);
  }

  .card--large .card__headline {
    font-size: var(--text-3xl);
  }

  .card--medium .card__headline {
    font-size: var(--text-xl);
  }

  .card--small .card__headline {
    font-size: var(--text-lg);
  }

  .card__dek {
    font-size: var(--text-base);
    color: var(--color-ink-soft);
    line-height: var(--leading-snug);
    margin: var(--space-2) 0 var(--space-3);
  }

  .card--hero .card__dek,
  .card--large .card__dek {
    font-size: var(--text-lg);
  }

  .card__byline {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-ink-muted);
    margin: 0;
  }

  .card__byline strong {
    color: var(--color-ink-soft);
  }
</style>
