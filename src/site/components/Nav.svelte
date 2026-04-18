<script>
  const sections = [
    'Home',
    'Politics',
    'World',
    'Business',
    'Opinion',
    'Culture',
    'Science',
    'Obituaries'
  ];
</script>

<div class="site-nav" aria-hidden="true">
  <ul>
    {#each sections as section}
      <li>
        <span class="site-nav__item">{section}</span>
      </li>
    {/each}
  </ul>
</div>

<style>
  .site-nav {
    border-bottom: 1px solid var(--color-rule);
    background: var(--color-paper);
  }

  ul {
    max-width: 912px;
    margin: 0 auto;
    padding: var(--space-2) var(--space-5);
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    justify-content: center;
  }

  @media (min-width: 1280px) {
    ul {
      max-width: 1120px;
      padding: var(--space-3) var(--space-6);
      gap: var(--space-5);
    }
  }

  .site-nav__item {
    display: inline-block;
    padding: var(--space-2) var(--space-3);
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--color-ink);
  }

  @media (max-width: 720px) {
    ul {
      gap: var(--space-1);
      padding: var(--space-2);
    }
  }
</style>
