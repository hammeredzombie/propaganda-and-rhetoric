// Per-section data for the seven standing-section pages.
//
// Each section draws from the shared lorem ipsum article and ad pools.
// When real per-section content lands later, swap the `articles` and `ads`
// arrays here without touching the SectionPage component.  Per CLAUDE.md,
// all prose on these pages is intentional Lorem Ipsum placeholder.

import { articles } from './articles.js';
import { ads } from './ads.js';

function rotate(leadIndex, count = 4) {
  const n = articles.length;
  return Array.from({ length: count }, (_, i) => articles[(leadIndex + i) % n]);
}

export const sections = {
  politics: {
    name: 'Politics',
    articles: rotate(0),
    ads: [ads.notice, ads.civilDefence]
  },
  world: {
    name: 'World',
    articles: rotate(2),
    ads: [ads.warBondsPoster, ads.grocer]
  },
  business: {
    name: 'Business',
    articles: rotate(1),
    ads: [ads.classifieds, ads.ration]
  },
  opinion: {
    name: 'Opinion',
    articles: rotate(3),
    ads: [ads.nervaton, ads.subscription]
  },
  culture: {
    name: 'Culture',
    articles: rotate(4),
    ads: [ads.odeon, ads.goldenSalts]
  },
  science: {
    name: 'Science',
    articles: rotate(3),
    ads: [ads.volunteer, ads.nervaton]
  },
  obituaries: {
    name: 'Obituaries',
    articles: rotate(5),
    ads: [ads.notice, ads.subscription]
  }
};
