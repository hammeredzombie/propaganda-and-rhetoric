<script>
  export let author = '';
  export let role = 'Staff Writer';
  export let date = '';
  export let readTime = '';
</script>

<div class="byline">
  <div class="byline__primary">
    <span class="byline__label">By</span>
    <strong class="byline__author">{author}</strong>
    {#if role}<span class="byline__role">{role}</span>{/if}
  </div>
  <div class="byline__meta">
    {#if date}<time>{date}</time>{/if}
    {#if date && readTime}<span class="byline__sep">—</span>{/if}
    {#if readTime}<span>{readTime}</span>{/if}
  </div>
</div>

<style>
  .byline {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: stretch;
    gap: var(--space-3);
    margin-bottom: var(--space-5);
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.16em;
    font-feature-settings: "lnum", "kern";
  }

  .byline__primary {
    background: var(--color-navy);
    color: var(--color-paper);
    padding: var(--space-2) var(--space-4);
  }

  .byline__label {
    color: var(--color-paper);
    opacity: 0.75;
    font-weight: 400;
  }

  .byline__author {
    color: var(--color-paper);
    font-weight: 700;
    margin: 0 var(--space-2) 0 var(--space-1);
  }

  .byline__role {
    color: var(--color-paper);
    opacity: 0.75;
    font-weight: 400;
  }

  .byline__meta {
    display: flex;
    gap: var(--space-2);
    align-items: center;
    color: var(--color-ink-soft);
    padding: var(--space-2) 0;
  }

  .byline__sep {
    opacity: 0.5;
  }
</style>
