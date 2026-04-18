<script>
  import Masthead from './components/Masthead.svelte';
  import Nav from './components/Nav.svelte';
  import Footer from './components/Footer.svelte';
  import FrontPage from './pages/FrontPage.svelte';
  import ArticlePage from './pages/ArticlePage.svelte';
  import { route } from './game/router.js';
</script>

<Masthead />
<Nav />

<main class="site-main">
  {#if $route.name === 'article'}
    <ArticlePage id={$route.params.id} />
  {:else}
    <FrontPage />
  {/if}
</main>

<Footer />

<canvas id="fx-overlay" aria-hidden="true"></canvas>

<style>
  .site-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
  }

  #fx-overlay {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  }
</style>
