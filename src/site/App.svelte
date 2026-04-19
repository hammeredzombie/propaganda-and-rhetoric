<script>
  import Masthead from './components/Masthead.svelte';
  import Nav from './components/Nav.svelte';
  import Footer from './components/Footer.svelte';
  import FrontPage from './pages/FrontPage.svelte';
  import SectionPage from './pages/SectionPage.svelte';
  import UnauthorizedPage from './pages/UnauthorizedPage.svelte';
  import { route } from './game/router.js';
  import { sections } from './game/sections.js';
</script>

<a class="skip-link" href="#main">Skip to content</a>

<Masthead />
<Nav />

<main id="main" class="site-main" tabindex="-1">
  {#if $route === 'home'}
    <FrontPage />
  {:else if sections[$route]}
    <SectionPage section={sections[$route]} />
  {:else}
    <UnauthorizedPage />
  {/if}
</main>

<Footer />

<style>
  /* No top padding — the first content rule sits flush against the nav's
     bottom border to preserve broadsheet convention. */
  .site-main {
    max-width: 912px;
    margin: 0 auto;
    padding: 0 var(--space-5) var(--space-7);
  }

  @media (min-width: 1280px) {
    .site-main {
      max-width: 1120px;
      padding: 0 var(--space-6) var(--space-8);
    }
  }
</style>
