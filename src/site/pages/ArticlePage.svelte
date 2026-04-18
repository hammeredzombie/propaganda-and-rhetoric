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

  function splitLede(text) {
    const idx = text.search(/\p{L}/u);
    if (idx < 0) return { pre: '', drop: '', rest: text };
    return {
      pre: text.slice(0, idx),
      drop: text.slice(idx, idx + 1),
      rest: text.slice(idx + 1)
    };
  }
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
          <span class="article__image-mark">§</span>
        </div>
      </figure>
    {/if}

    <div class="article__body">
      {#each article.body || [] as para, i}
        {#if i === 0}
          {@const lede = splitLede(para)}
          <p class="article__para article__para--lede">{lede.pre}<span class="article__drop">{lede.drop}</span>{lede.rest}</p>
        {:else}
          <p class="article__para">{para}</p>
        {/if}
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
        The Proper Goose. <em>Take a Gander at the daily News.</em>
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
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--color-ink-muted);
    padding: var(--space-2) 0;
    margin-bottom: var(--space-3);
  }

  .article__back:hover {
    color: var(--color-ink-strong);
  }

  .article__back:focus-visible {
    outline: 2px solid var(--color-ink-strong);
    outline-offset: 2px;
    color: var(--color-ink-strong);
  }

  .article__lede-image {
    margin: var(--space-5) 0;
  }

  .article__image-placeholder {
    aspect-ratio: 16 / 9;
    background: var(--color-ad-bg);
    border: 1px solid var(--color-rule);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .article__image-mark {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    color: var(--color-ink-muted);
    line-height: 1;
  }

  .article__body {
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    text-align: justify;
    hyphens: auto;
    -webkit-hyphens: auto;
  }

  .article__para {
    margin: 0 0 var(--space-4);
  }

  .article__drop {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 3.5em;
    float: left;
    line-height: 0.85;
    padding: 0.1em var(--space-3) 0 0;
    color: var(--color-ink);
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
    padding: var(--space-7) var(--space-4);
    color: var(--color-ink-muted);
  }
</style>
