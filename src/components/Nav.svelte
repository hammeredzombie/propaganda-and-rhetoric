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

<nav class="site-nav" aria-label="Primary sections">
  <ul>
    {#each sections as section}
      <li>
        <a href="#{section.toLowerCase()}" on:click|preventDefault>{section}</a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .site-nav {
    border-bottom: 1px solid var(--color-rule);
    background: var(--color-paper);
  }

  ul {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-2) var(--space-5);
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-5);
    justify-content: center;
  }

  a {
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-ink);
    border-bottom: none;
  }

  a:hover,
  a:focus-visible {
    color: var(--color-accent);
  }

  @media (max-width: 720px) {
    ul {
      gap: var(--space-3);
      padding: var(--space-2);
    }
  }
</style>
