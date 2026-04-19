<script>
  const year = new Date().getFullYear();

  const columns = [
    {
      heading: 'The Proper Goose',
      items: ['About Us', 'Masthead', 'Corrections', 'Careers']
    },
    {
      heading: 'Reader',
      items: ['Home Delivery', 'Back Issues', 'Classifieds']
    },
    {
      heading: 'Policy',
      items: ['Terms of Service', 'Privacy', 'Contact']
    }
  ];
</script>

<footer class="site-footer">
  <div class="site-footer__inner">
    <div class="site-footer__cols">
      {#each columns as col}
        <section>
          <p class="site-footer__col-heading">{col.heading}</p>
          <ul>
            {#each col.items as item}
              <li><span class="site-footer__item">{item}</span></li>
            {/each}
          </ul>
        </section>
      {/each}
    </div>
    <p class="site-footer__fineprint">
      © {year} The Proper Goose. A work of fiction. All articles and imagery
      are made up for the purposes of a Ludum Dare Compo entry.
    </p>
  </div>
</footer>

<style>
  .site-footer {
    border-top: 6px solid var(--color-accent);
    margin-top: var(--space-7);
    background: var(--color-paper);
    padding: var(--space-7) 0 var(--space-6);
  }

  .site-footer__inner {
    max-width: 912px;
    margin: 0 auto;
    padding: 0 var(--space-5);
  }

  @media (min-width: 1280px) {
    .site-footer__inner {
      max-width: 1120px;
      padding: 0 var(--space-6);
    }
  }

  .site-footer__cols {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
    margin-bottom: var(--space-6);
  }

  .site-footer__col-heading {
    display: inline-block;
    font-family: var(--font-display);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.16em;
    font-weight: 700;
    color: var(--color-paper);
    background: var(--color-navy);
    padding: 2px var(--space-3) 1px;
    margin: 0 0 var(--space-3);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: var(--space-2);
  }

  .site-footer__item {
    font-family: var(--font-body);
    font-size: var(--text-sm);
    color: var(--color-ink-soft);
  }

  .site-footer__fineprint {
    font-size: var(--text-xs);
    color: var(--color-ink-muted);
    text-align: center;
    padding-top: var(--space-5);
    border-top: 1px solid var(--color-rule);
    font-style: italic;
  }

  @media (max-width: 720px) {
    .site-footer__cols {
      grid-template-columns: 1fr;
      gap: var(--space-5);
    }
  }
</style>
