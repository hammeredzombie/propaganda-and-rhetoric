<script>
  const year = new Date().getFullYear();
</script>

<footer class="site-footer">
  <div class="site-footer__inner">
    <div class="site-footer__cols">
      <section>
        <h5>The Daily Record</h5>
        <ul>
          <li><a href="#about" on:click|preventDefault>About Us</a></li>
          <li><a href="#masthead" on:click|preventDefault>Masthead</a></li>
          <li><a href="#corrections" on:click|preventDefault>Corrections</a></li>
          <li><a href="#careers" on:click|preventDefault>Careers</a></li>
        </ul>
      </section>
      <section>
        <h5>Subscribe</h5>
        <ul>
          <li><a href="#print" on:click|preventDefault>Home Delivery</a></li>
          <li><a href="#digital" on:click|preventDefault>Digital Access</a></li>
          <li><a href="#gift" on:click|preventDefault>Gift a Subscription</a></li>
        </ul>
      </section>
      <section>
        <h5>Policy</h5>
        <ul>
          <li><a href="#terms" on:click|preventDefault>Terms of Service</a></li>
          <li><a href="#privacy" on:click|preventDefault>Privacy</a></li>
          <li><a href="#contact" on:click|preventDefault>Contact</a></li>
        </ul>
      </section>
    </div>
    <p class="site-footer__fineprint">
      © {year} The Daily Record. A work of fiction. All articles and imagery
      are made up for the purposes of a Ludum Dare Compo entry.
    </p>
  </div>
</footer>

<style>
  .site-footer {
    border-top: 3px double var(--color-rule-strong);
    margin-top: var(--space-10);
    background: var(--color-paper);
    padding: var(--space-8) 0 var(--space-6);
  }

  .site-footer__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-5);
  }

  .site-footer__cols {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
    margin-bottom: var(--space-6);
  }

  h5 {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
    color: var(--color-ink);
    margin: 0 0 var(--space-3);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: var(--space-2);
  }

  a {
    font-size: var(--text-sm);
    color: var(--color-ink-soft);
    border-bottom: none;
  }

  a:hover,
  a:focus-visible {
    color: var(--color-accent);
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
