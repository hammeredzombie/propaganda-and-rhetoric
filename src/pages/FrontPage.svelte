<script>
  import ArticleCard from '../components/ArticleCard.svelte';
  import AdSlot from '../components/AdSlot.svelte';
  import { articles } from '../game/articles.js';
  import { goToArticle } from '../game/router.js';
  import { state } from '../game/state.js';
  import { cutscene } from '../game/cutscene.js';
  import { fx } from '../game/fx.js';
  import { onMount } from 'svelte';

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

  let seenIntro = false;
  state.subscribe((s) => {
    seenIntro = s.cutscenesSeen?.includes('intro');
  });

  onMount(() => {
    if (!seenIntro) {
      setTimeout(() => cutscene.playById('intro'), 800);
    }
  });

  async function openArticle(article, event) {
    if (event) {
      fx.inkSplash({ x: event.clientX, y: event.clientY });
    }
    state.markArticleRead(article.id);
    goToArticle(article.id);
    let openCount = 0;
    state.subscribe((s) => (openCount = s.articleOpenCount))();
    if (openCount === 3) {
      setTimeout(() => cutscene.playById('deeper'), 400);
    }
  }
</script>

<div class="front-grid">
  <section class="front-grid__hero">
    <ArticleCard article={hero} size="hero" onOpen={(a) => openArticle(a, window.__lastEvent)} />
  </section>

  <aside class="front-grid__rail">
    <AdSlot ad={sidebarAd} />
  </aside>

  <section class="front-grid__lead">
    {#each topTwo as a}
      <ArticleCard article={a} size="large" onOpen={(a) => openArticle(a, window.__lastEvent)} />
    {/each}
  </section>

  <section class="front-grid__list">
    {#each rest as a}
      <ArticleCard article={a} size="medium" onOpen={(a) => openArticle(a, window.__lastEvent)} />
    {/each}
  </section>

  <section class="front-grid__footer-ad">
    <AdSlot ad={footerAd} />
  </section>
</div>

<svelte:window
  on:pointerdown={(e) => (window.__lastEvent = e)}
  on:keydown={(e) => (window.__lastEvent = { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 })}
/>

<style>
  .front-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--space-6);
    margin-top: var(--space-5);
  }

  .front-grid__hero {
    grid-column: 1 / -1;
    border-top: 2px solid var(--color-rule-strong);
    padding-top: var(--space-4);
  }

  .front-grid__rail {
    grid-column: 2;
    grid-row: 2 / span 2;
  }

  .front-grid__lead {
    grid-column: 1;
    display: grid;
    gap: var(--space-5);
  }

  .front-grid__list {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
    border-top: 2px solid var(--color-rule-strong);
    padding-top: var(--space-4);
    margin-top: var(--space-4);
  }

  .front-grid__footer-ad {
    grid-column: 1 / -1;
    margin-top: var(--space-6);
  }

  @media (max-width: 900px) {
    .front-grid {
      grid-template-columns: 1fr;
    }
    .front-grid__rail,
    .front-grid__lead,
    .front-grid__list,
    .front-grid__hero,
    .front-grid__footer-ad {
      grid-column: 1;
    }
    .front-grid__rail {
      grid-row: auto;
    }
    .front-grid__list {
      grid-template-columns: 1fr;
    }
  }
</style>
