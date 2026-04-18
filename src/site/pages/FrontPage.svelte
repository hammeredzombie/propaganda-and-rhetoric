<script>
  import ArticleCard from '../components/ArticleCard.svelte';
  import AdSlot from '../components/AdSlot.svelte';
  import { articles } from '../game/articles.js';
  import { goToArticle } from '../game/router.js';
  import { state } from '../game/state.js';

  const hero = articles[0];
  const topTwo = articles.slice(1, 3);
  const rest = articles.slice(3);

  const sidebarAd = {
    label: 'Advertisement',
    brand: 'Evergreen Watches',
    headline: 'Time, Trusted.',
    body: 'Precision-engineered timepieces since 1897. Available at fine retailers.',
    size: 'medium'
  };

  const footerAd = {
    label: 'Paid Partnership',
    brand: 'Public Information Bureau',
    headline: 'Stay informed. Stay orderly.',
    body: 'A message from your community outreach office.',
    size: 'small'
  };

  function openArticle(article) {
    state.markArticleRead(article.id);
    goToArticle(article.id);
  }
</script>

<div class="front-grid">
  <section class="front-grid__hero">
    <ArticleCard article={hero} size="hero" onOpen={openArticle} />
  </section>

  <aside class="front-grid__rail">
    <AdSlot ad={sidebarAd} />
  </aside>

  <section class="front-grid__lead">
    {#each topTwo as a}
      <ArticleCard article={a} size="large" onOpen={openArticle} />
    {/each}
  </section>

  <section class="front-grid__list">
    {#each rest as a}
      <ArticleCard article={a} size="medium" onOpen={openArticle} />
    {/each}
  </section>

  <section class="front-grid__footer-ad">
    <AdSlot ad={footerAd} />
  </section>
</div>

<style>
  .front-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-5);
    margin-top: var(--space-4);
  }

  .front-grid__hero {
    order: 1;
    border-top: 2px solid var(--color-rule-strong);
    padding-top: var(--space-4);
  }

  .front-grid__lead {
    order: 2;
    display: grid;
    gap: 0;
  }

  .front-grid__list {
    order: 3;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    border-top: 1px solid var(--color-rule-strong);
    padding-top: var(--space-4);
  }

  .front-grid__list :global(.card) {
    border-top: none;
    padding-top: 0;
    padding-right: var(--space-5);
  }

  .front-grid__list :global(.card:not(:first-child)) {
    border-left: 1px solid var(--color-rule);
    padding-left: var(--space-5);
  }

  .front-grid__list :global(.card:last-child) {
    padding-right: 0;
  }

  .front-grid__rail {
    order: 4;
  }

  .front-grid__footer-ad {
    order: 5;
    margin-top: var(--space-5);
  }

  @media (min-width: 1100px) {
    .front-grid {
      grid-template-columns: 2fr 1fr;
      gap: var(--space-6);
    }
    .front-grid__hero {
      grid-column: 1 / -1;
      order: unset;
    }
    .front-grid__lead {
      grid-column: 1;
      order: unset;
    }
    .front-grid__list {
      grid-column: 1 / -1;
      order: unset;
    }
    .front-grid__rail {
      grid-column: 2;
      grid-row: 2 / span 2;
      order: unset;
    }
    .front-grid__footer-ad {
      grid-column: 1 / -1;
      order: unset;
    }
  }

  @media (max-width: 720px) {
    .front-grid__list {
      grid-template-columns: 1fr;
    }
    .front-grid__list :global(.card) {
      padding-right: 0;
    }
    .front-grid__list :global(.card:not(:first-child)) {
      border-left: none;
      border-top: 1px solid var(--color-rule);
      padding-left: 0;
      padding-top: var(--space-4);
    }
  }
</style>
