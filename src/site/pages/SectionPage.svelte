<script>
  import ArticleCard from '../components/ArticleCard.svelte';
  import AdSlot from '../components/AdSlot.svelte';

  export let section;

  $: hero = section.articles[0];
  $: features = section.articles.slice(1);
</script>

<div class="section">
  <header class="section__masthead">
    <p class="section__eyebrow">Lorem Ipsum Dolor</p>
    <h1 class="section__title">{section.name}</h1>
    <p class="section__dek">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </header>

  {#if section.ads[0]}
    <AdSlot ad={section.ads[0]} />
  {/if}

  <section class="section__hero" aria-label="Lead story">
    <ArticleCard article={hero} size="hero" withLede={true} />
  </section>

  <section class="section__features" aria-label="More stories">
    <h2 class="section__features-heading">Lorem Ipsum Dolor Sit Amet</h2>
    <div class="section__features-grid">
      {#each features as article, i}
        <div class="section__feature" class:section__feature--split={i > 0}>
          <ArticleCard {article} size="medium" />
        </div>
      {/each}
    </div>
  </section>

  {#if section.ads[1]}
    <AdSlot ad={section.ads[1]} />
  {/if}
</div>

<style>
  .section {
    display: grid;
    gap: var(--space-5);
  }

  .section__masthead {
    border-top: 4px solid var(--color-accent);
    border-bottom: 2px solid var(--color-ink-strong);
    padding: var(--space-3) 0 var(--space-4);
  }

  .section__eyebrow {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xxs);
    text-transform: uppercase;
    letter-spacing: 0.32em;
    color: var(--color-ink-soft);
    margin: 0 0 var(--space-2);
    font-feature-settings: "lnum", "kern";
  }

  .section__title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-2xl);
    line-height: var(--leading-tight);
    color: var(--color-ink-strong);
    margin: 0 0 var(--space-2);
    letter-spacing: 0.01em;
    font-feature-settings: "lnum", "kern";
  }

  .section__dek {
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--text-md);
    line-height: var(--leading-snug);
    color: var(--color-ink-soft);
    margin: 0;
    max-width: 64ch;
  }

  .section__hero :global(.hero) {
    margin: 0;
  }

  .section__features {
    border-top: 2px solid var(--color-ink-strong);
    padding-top: var(--space-3);
  }

  .section__features-heading {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xs);
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--color-ink-strong);
    margin: 0 0 var(--space-4);
    font-feature-settings: "lnum", "kern";
  }

  .section__features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
  }

  .section__feature {
    padding-right: var(--space-4);
  }

  .section__feature :global(.card) {
    border-top: none;
    padding-top: 0;
  }

  .section__feature--split {
    border-left: 1px solid var(--color-rule);
    padding-left: var(--space-4);
    padding-right: var(--space-4);
  }

  .section__features-grid .section__feature:last-child {
    padding-right: 0;
  }

  @media (max-width: 720px) {
    .section__features-grid {
      grid-template-columns: 1fr;
    }
    .section__feature {
      padding-right: 0;
    }
    .section__feature--split {
      border-left: none;
      border-top: 1px solid var(--color-rule);
      padding-left: 0;
      padding-top: var(--space-4);
    }
  }
</style>
