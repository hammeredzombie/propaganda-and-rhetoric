<script>
  import { route, navigate } from '../game/router.js';

  const items = [
    { label: 'Home', slug: 'home' },
    { label: 'Politics', slug: 'politics' },
    { label: 'World', slug: 'world' },
    { label: 'Business', slug: 'business' },
    { label: 'Opinion', slug: 'opinion' },
    { label: 'Culture', slug: 'culture' },
    { label: 'Science', slug: 'science' },
    { label: 'Obituaries', slug: 'obituaries' }
  ];

  function handleClick(event, slug) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(slug);
  }
</script>

<nav class="site-nav" aria-label="Sections">
  <ul>
    {#each items as item}
      {@const current = $route === item.slug}
      <li>
        <a
          href={`#/${item.slug}`}
          class="site-nav__item"
          class:site-nav__item--current={current}
          aria-current={current ? 'page' : undefined}
          on:click={(e) => handleClick(e, item.slug)}
        >{item.label}</a>
      </li>
    {/each}
  </ul>
</div>

<style>
  .site-nav {
    border-top: 2px solid var(--color-ink-strong);
    border-bottom: 2px solid var(--color-ink-strong);
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
    text-decoration: none;
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
  }

  .site-nav__item:hover {
    background: var(--color-ink-strong);
    color: var(--color-paper);
  }

  .site-nav__item:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .site-nav__item--current {
    background: var(--color-navy);
    color: var(--color-paper);
    padding-left: var(--space-4);
    padding-right: var(--space-4);
  }

  .site-nav__item--current:hover {
    background: var(--color-navy);
    color: var(--color-paper);
  }

  @media (max-width: 720px) {
    ul {
      gap: var(--space-1);
      padding: var(--space-2);
    }
  }
</style>
