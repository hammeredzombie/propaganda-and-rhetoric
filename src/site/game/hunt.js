// Word-hunt DOM helpers.
//
// Given a root element (the site's <main>), pick one random word inside
// eligible Lorem Ipsum copy and wrap it in a <span class="hunt-target">
// so it can be animated and clicked.  English functional copy (bylines,
// ad disclosures, continued markers, anything tagged [data-no-hunt])
// is excluded so the target always lands on placeholder prose.

const EXCLUDE_SELECTOR = [
  '[data-no-hunt]',
  '.byline',
  '.ad__disclosure',
  '.continued-marker',
  'label',
  'input',
  'button',
  'a',
  'script',
  'style'
].join(',');

const WORD_RE = /[A-Za-z]{4,}/g;

function isEligibleTextNode(node) {
  const value = node.nodeValue;
  if (!value || !WORD_RE.test(value)) return false;
  WORD_RE.lastIndex = 0;
  const parent = node.parentElement;
  if (!parent) return false;
  if (!parent.closest('p')) return false;
  if (parent.closest(EXCLUDE_SELECTOR)) return false;
  return true;
}

function collectEligibleTextNodes(root) {
  const results = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return isEligibleTextNode(node)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    }
  });
  let current;
  while ((current = walker.nextNode())) results.push(current);
  return results;
}

function pickWordMatch(textValue) {
  const matches = [...textValue.matchAll(WORD_RE)];
  if (!matches.length) return null;
  return matches[Math.floor(Math.random() * matches.length)];
}

// Wraps the chosen word in a span by splitting the text node into
// before / span / after.  Returns the span plus a cleanup function
// that restores the original text node if the span is still attached.
function wrapWord(textNode, match) {
  const { index, 0: word } = match;
  const raw = textNode.nodeValue;
  const parent = textNode.parentNode;

  const before = document.createTextNode(raw.slice(0, index));
  const after = document.createTextNode(raw.slice(index + word.length));
  const span = document.createElement('span');
  span.className = 'hunt-target';
  span.textContent = word;
  span.setAttribute('role', 'button');
  span.setAttribute('tabindex', '0');
  span.setAttribute('aria-label', 'Hidden hint — activate to reveal');

  parent.insertBefore(before, textNode);
  parent.insertBefore(span, textNode);
  parent.insertBefore(after, textNode);
  parent.removeChild(textNode);

  const cleanup = () => {
    if (!span.isConnected) return;
    const restored = document.createTextNode(raw);
    parent.insertBefore(restored, before);
    parent.removeChild(before);
    parent.removeChild(span);
    parent.removeChild(after);
  };

  return { span, cleanup };
}

export function selectRandomWord(root) {
  if (!root) return null;
  const candidates = collectEligibleTextNodes(root);
  if (!candidates.length) return null;
  // Shuffle-pick: if the first choice has no valid word match, fall
  // through to the next candidate rather than giving up entirely.
  const order = [...candidates].sort(() => Math.random() - 0.5);
  for (const node of order) {
    const match = pickWordMatch(node.nodeValue);
    if (match) return wrapWord(node, match);
  }
  return null;
}
