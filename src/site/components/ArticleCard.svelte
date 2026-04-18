<script>
  export let article;
  export let size = 'medium';
  export let onOpen = () => {};

  function open(event) {
    onOpen(article, event);
  }
</script>

<article class="card card--{size}">
  <button class="card__hit" type="button" on:click={open}>
    {#if article.section}
      <div class="eyebrow">{article.section}</div>
    {/if}
    {#if article.image}
      <div class="card__image" aria-hidden="true">
        <span class="card__image-mark">§</span>
      </div>
    {/if}
    {#if size === 'hero'}
      <h1 class="card__headline">{article.headline}</h1>
    {:else}
      <h2 class="card__headline">{article.headline}</h2>
    {/if}
    {#if article.dek}
      <p class="card__dek">{article.dek}</p>
    {/if}
    {#if article.byline}
      <p class="card__byline">By <strong>{article.byline}</strong></p>
    {/if}
  </button>
</article>

<style>
  .card {
    padding: var(--space-4) 0;
    border-top: 1px solid var(--color-rule);
  }

  .card--hero {
    border-top: none;
    padding-top: 0;
  }

  .card--hero .card__image {
    display: none;
  }

  .card__hit {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0;
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  .card__hit:focus-visible {
    outline: 2px solid var(--color-ink-strong);
    outline-offset: 2px;
  }

  .card__hit:hover .card__headline,
  .card__hit:focus-visible .card__headline {
    color: var(--color-ink-strong);
  }

  .card__image {
    margin: 0 0 var(--space-3);
    aspect-ratio: 3 / 2;
    background: var(--color-ad-bg);
    border: 1px solid var(--color-rule);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .card__image-mark {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--color-ink-muted);
    line-height: 1;
  }

  .card__headline {
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--color-ink);
    margin: 0 0 var(--space-2);
  }

  .card--hero .card__headline {
    font-size: var(--text-2xl);
    line-height: var(--leading-tight);
  }

  .card--large .card__headline {
    font-size: var(--text-xl);
  }

  .card--medium .card__headline {
    font-size: var(--text-lg);
  }

  .card--small .card__headline {
    font-size: var(--text-md);
  }

  .card__dek {
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--text-base);
    color: var(--color-ink-soft);
    line-height: var(--leading-snug);
    margin: var(--space-2) 0 var(--space-3);
  }

  .card--hero .card__dek,
  .card--large .card__dek {
    font-size: var(--text-md);
  }

  .card__byline {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-ink-muted);
    margin: 0;
  }

  .card__byline strong {
    color: var(--color-ink-soft);
  }
</style>
