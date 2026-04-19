<script>
  import Masthead from './components/Masthead.svelte';
  import Nav from './components/Nav.svelte';
  import Footer from './components/Footer.svelte';
  import FrontPage from './pages/FrontPage.svelte';
</script>

<a class="skip-link" href="#main">Skip to content</a>

<Masthead />
<Nav />

<main id="main" class="site-main" tabindex="-1">
  <FrontPage />
</main>

<Footer />

<style>
  .site-main {
    max-width: 912px;
    margin: 0 auto;
    padding: var(--space-5) var(--space-5) var(--space-7);
  }

  @media (min-width: 1280px) {
    .site-main {
      max-width: 1120px;
      padding: var(--space-6) var(--space-6) var(--space-8);
    }
  }
</style>
