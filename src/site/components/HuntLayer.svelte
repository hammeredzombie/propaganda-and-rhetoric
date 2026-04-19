<script>
  import { onDestroy, tick } from 'svelte';
  import { route } from '../game/router.js';
  import { selectRandomWord } from '../game/hunt.js';
  import { hints } from '../game/hints.js';
  import { openHint, activeHint } from '../game/huntStore.js';

  let current = null;
  let wasOpen = false;

  $: reseed($route);

  const unsubscribe = activeHint.subscribe((value) => {
    const nowOpen = value !== null;
    if (wasOpen && !nowOpen) reseed($route);
    wasOpen = nowOpen;
  });

  async function reseed(activeRoute) {
    if (typeof document === 'undefined') return;
    await tick();
    if (current) {
      current.cleanup();
      current = null;
    }
    const main = document.getElementById('main');
    if (!main) return;
    const picked = selectRandomWord(main);
    if (!picked) return;

    const onActivate = (event) => {
      event.preventDefault();
      openHint(activeRoute, hints[activeRoute] ?? hints.home);
    };
    picked.span.addEventListener('click', onActivate);
    picked.span.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') onActivate(event);
    });
    current = picked;
  }

  onDestroy(() => {
    unsubscribe();
    if (current) current.cleanup();
  });
</script>
