<script>
  import ArticleCard from '../components/ArticleCard.svelte';
  import AdSlot from '../components/AdSlot.svelte';
  import { articles } from '../game/articles.js';
  import { ads } from '../game/ads.js';

  const hero = articles[0];
  const lead = articles.slice(1, 3);
  const features = articles.slice(3);
</script>

<div class="front">
  <!-- Civic-notice strip above the hero fold ­— sets the tone immediately. -->
  <AdSlot ad={ads.civilDefence} />

  <section class="front__hero" aria-label="Lead story">
    <ArticleCard article={hero} size="hero" withLede={true} />
  </section>

  <!-- Lead + rail poster.  At 948px the rail stacks below the lead columns;
       at ≥ 1100px it sits to the right as a proper standing column. -->
  <section class="front__lead">
    <div class="front__lead-articles">
      {#each lead as article, i}
        <div class="front__lead-article" class:front__lead-article--split={i > 0}>
          <ArticleCard {article} size="large" />
        </div>
      {/each}
    </div>
    <aside class="front__rail">
      <AdSlot ad={ads.warBondsPoster} />
    </aside>
  </section>

  <AdSlot ad={ads.ration} />

  <!-- Footer band of minor stories.  Column rules, no cards, no gaps. -->
  <section class="front__features" aria-label="Inside this edition">
    <h2 class="front__features-heading">Lorem Ipsum Dolor Sit Amet</h2>
    <div class="front__features-grid">
      {#each features as article, i}
        <div class="front__feature" class:front__feature--split={i > 0}>
          <ArticleCard {article} size="medium" />
        </div>
      {/each}
    </div>
  </section>

  <!-- A dense pair of commercial blocks: patent medicine + classifieds. -->
  <section class="front__duo">
    <AdSlot ad={ads.nervaton} />
    <AdSlot ad={ads.classifieds} />
  </section>

  <AdSlot ad={ads.odeon} />

  <!-- A civic notice sits beside a subscription coupon.  Two distinct
       official-voice ad forms in dialogue with each other. -->
  <section class="front__duo">
    <AdSlot ad={ads.notice} />
    <AdSlot ad={ads.subscription} />
  </section>

  <!-- Inline "advertisement" that aims to pass as editorial copy. -->
  <section class="front__inline-ad">
    <AdSlot ad={ads.goldenSalts} />
  </section>

  <AdSlot ad={ads.volunteer} />

  <!-- Close with the full-width liberty-bond banner. -->
  <AdSlot ad={ads.bondsBanner} />
</div>

<style>
  /* Broadsheet rhythm: keep sections tight, let the rules do the talking.
     No card gutters — adjacent elements touch, separated only by rules.
     The first element (civic-defence strip) sits flush against the nav
     band so the top-of-page reads as doubled rule, not as a web gap. */
  .front {
    display: grid;
    gap: var(--space-5);
  }

  /* Override default card border-top under the hero — the hero band
     carries its own top rule in accent red. */
  .front__hero :global(.hero) {
    margin: 0;
  }

  /* ── Lead row ─────────────────────────────────────────────────────────
     Two lead stories live in columns on the left, rail poster to the
     right on fullscreen. Below 1100px the rail drops into flow. */
  .front__lead {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }

  .front__lead-articles {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  .front__lead-article {
    padding-right: var(--space-5);
  }

  .front__lead-article--split {
    border-left: 1px solid var(--color-rule);
    padding-left: var(--space-5);
    padding-right: 0;
  }

  .front__rail {
    /* Align rail poster flush with the lead cards above. */
  }

  @media (min-width: 1100px) {
    .front__lead {
      grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
      gap: var(--space-6);
    }
  }

  /* ── Features band ────────────────────────────────────────────────────
     Three minor stories across, divided by hairline rules, with a
     letterspaced small-caps heading that sits on the top rule. */
  .front__features {
    border-top: 2px solid var(--color-ink-strong);
    padding-top: var(--space-3);
  }

  .front__features-heading {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xs);
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--color-ink-strong);
    margin: 0 0 var(--space-4);
    font-feature-settings: "lnum", "kern";
  }

  .front__features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
  }

  .front__feature {
    padding-right: var(--space-4);
  }

  .front__feature :global(.card) {
    border-top: none;
    padding-top: 0;
  }

  .front__feature--split {
    border-left: 1px solid var(--color-rule);
    padding-left: var(--space-4);
    padding-right: var(--space-4);
  }

  .front__features-grid .front__feature:last-child {
    padding-right: 0;
  }

  /* ── Duo rows ─────────────────────────────────────────────────────────
     Two ad blocks side by side — patent+classifieds, notice+coupon. */
  .front__duo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-5);
  }

  @media (max-width: 820px) {
    .front__duo {
      grid-template-columns: 1fr;
    }
  }

  /* ── Inline "editorial" ad ────────────────────────────────────────────
     The goldenSalts column ad is meant to pass for an article — give it
     a narrow measure to match the rest of the single-column body copy. */
  .front__inline-ad {
    max-width: 72ch;
    margin: 0 auto;
  }

  /* ── 948 fold adjustments ─────────────────────────────────────────────
     At the Ludum Dare embedded viewport we don't have room for a
     two-column lead — stack them but keep the hairline between. */
  @media (max-width: 720px) {
    .front__lead-articles {
      grid-template-columns: 1fr;
    }
    .front__lead-article {
      padding-right: 0;
    }
    .front__lead-article--split {
      border-left: none;
      border-top: 1px solid var(--color-rule);
      padding-left: 0;
      padding-top: var(--space-4);
      margin-top: var(--space-2);
    }

    .front__features-grid {
      grid-template-columns: 1fr;
    }
    .front__feature {
      padding-right: 0;
    }
    .front__feature--split {
      border-left: none;
      border-top: 1px solid var(--color-rule);
      padding-left: 0;
      padding-top: var(--space-4);
    }
  }
</style>
