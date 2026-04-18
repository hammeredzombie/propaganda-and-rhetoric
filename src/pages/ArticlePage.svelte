<script>
  import Headline from '../components/Headline.svelte';
  import Byline from '../components/Byline.svelte';
  import PullQuote from '../components/PullQuote.svelte';
  import AdSlot from '../components/AdSlot.svelte';
  import { articleById } from '../game/articles.js';
  import { goHome } from '../game/router.js';

  export let id;
  $: article = articleById(id);

  const inlineAd = {
    label: 'Advertisement',
    brand: 'Steady State Insurance',
    headline: 'Predictability, underwritten.',
    body: 'A new policy for a new climate.',
    size: 'small'
  };
</script>

{#if article}
  <article class="article">
    <button class="article__back" on:click={goHome}>← Back to front page</button>

    <Headline eyebrow={article.section} headline={article.headline} dek={article.dek} />
    <Byline
      author={article.byline}
      role={article.role}
      date={article.date}
      readTime={article.readTime}
    />

    {#if article.image}
      <figure class="article__lede-image" aria-hidden="true">
        <div class="article__image-placeholder">
          <span>[illustration]</span>
          <small>{article.image}</small>
        </div>
        <figcaption>Illustration to be created in Procreate during the jam.</figcaption>
      </figure>
    {/if}

    <div class="article__body">
      {#each article.body || [] as para, i}
        <p class="article__para" class:article__para--lede={i === 0}>{para}</p>
        {#if i === 1 && article.pullquote}
          <PullQuote quote={article.pullquote.quote} attribution={article.pullquote.attribution} />
        {/if}
        {#if i === 2}
          <AdSlot ad={inlineAd} />
        {/if}
      {/each}
    </div>

    <footer class="article__footer">
      <hr />
      <p class="article__end">
        The Daily Record. <em>All the news that stays on-message.</em>
      </p>
    </footer>
  </article>
{:else}
  <div class="missing">
    <p>This story is not in today’s edition.</p>
    <button class="article__back" on:click={goHome}>← Back to front page</button>
  </div>
{/if}

<style>
  .article {
    max-width: 720px;
    margin: 0 auto;
    padding-top: var(--space-4);
  }

  .article__back {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-ink-muted);
    margin-bottom: var(--space-4);
  }

  .article__back:hover {
    color: var(--color-accent);
  }

  .article__lede-image {
    margin: var(--space-5) 0;
  }

  .article__image-placeholder {
    aspect-ratio: 16 / 9;
    background: var(--color-ad-bg);
    border: 1px solid var(--color-rule);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
    color: var(--color-ink-muted);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-align: center;
    padding: var(--space-4);
  }

  .article__image-placeholder small {
    font-family: var(--font-serif);
    font-size: 11px;
    text-transform: none;
    letter-spacing: 0;
    font-style: italic;
    opacity: 0.7;
  }

  figcaption {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    color: var(--color-ink-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: var(--space-2);
    text-align: center;
  }

  .article__body {
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
  }

  .article__para {
    margin: 0 0 var(--space-4);
  }

  .article__para--lede::first-letter {
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 3.5em;
    float: left;
    line-height: 0.85;
    padding: 0.1em var(--space-3) 0 0;
    color: var(--color-accent);
  }

  .article__footer {
    margin-top: var(--space-8);
  }

  .article__end {
    text-align: center;
    font-size: var(--text-sm);
    color: var(--color-ink-muted);
  }

  .missing {
    text-align: center;
    padding: var(--space-10) var(--space-4);
    color: var(--color-ink-muted);
  }
</style>
