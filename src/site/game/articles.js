export const articles = [
  {
    id: 'cabinet-shuffle',
    section: 'Politics',
    headline:
      'Cabinet Shuffle Leaves Observers Reassured, Alarmed, And Everything Between',
    dek:
      'Sources close to the administration describe the reorganization as either routine housekeeping or a quiet purge, depending who is asked.',
    byline: 'M. Delacroix',
    role: 'Capitol Correspondent',
    date: 'April 18',
    readTime: '4 min read',
    image: 'front steps of a government building at dusk',
    body: [
      'The shakeup came without warning and, according to three officials who asked not to be named because they were not authorized to speak, without the usual internal vetting.',
      'By midday, the usual channels had begun to align. One statement praised the incoming ministers as “seasoned and steady.” Another, issued from a rival faction, described them as “acceptable under the circumstances.”',
      '“The public will notice nothing,” said one observer, whose office overlooks the main avenue. “Which is always the point.”',
      'Analysts remain divided on whether the changes represent consolidation or drift. In practice, they note, the distinction rarely matters to anyone outside the building.'
    ],
    pullquote: {
      quote: '“The public will notice nothing. Which is always the point.”',
      attribution: 'A senior observer, speaking on background'
    }
  },
  {
    id: 'harvest-numbers',
    section: 'Business',
    headline: 'Harvest Numbers Are Up. The Food Is Not.',
    dek:
      'Official yields beat the five-year average. Grocery aisles tell a different story. A regulator weighs in.',
    byline: 'P. Okafor',
    role: 'Staff Writer',
    date: 'April 18',
    readTime: '6 min read',
    image: 'wide overhead of a combine harvester in wheat',
    body: [
      'For the fourth straight quarter, agricultural output has exceeded published projections. For the fourth straight quarter, shelves in urban centers have remained thin.',
      'A spokesperson for the regulatory office called the gap “a logistical signal, not a supply signal.” Asked what the distinction meant in practice, the spokesperson declined to elaborate.',
      'Farmers interviewed on three separate routes described paperwork that had grown in length and ambiguity. None would attach their name to the observation.'
    ],
    pullquote: {
      quote: '“A logistical signal, not a supply signal.”',
      attribution: 'Regulatory office spokesperson'
    }
  },
  {
    id: 'neighbor-dispute',
    section: 'World',
    headline: 'Border Exchange Described As “Cordial,” Then “Tense,” Then Again “Cordial”',
    dek:
      'In the space of six hours, three foreign ministries issued statements whose tone tracked the news cycle with unusual precision.',
    byline: 'V. Bellamy',
    role: 'Foreign Desk',
    date: 'April 18',
    readTime: '5 min read',
    image: 'two flags on adjacent poles in still air',
    body: [
      'The morning statement called the exchange “constructive.” The afternoon statement called it “frank and direct.” By evening, after a wire story to the contrary, the original language returned.',
      'Observers in both capitals declined to interpret the shifts, noting that the original document had not, in their view, changed.'
    ]
  },
  {
    id: 'weather-patterns',
    section: 'Science',
    headline: 'Unseasonable Weather Is Now Seasonal, Climatologists Concede',
    dek:
      'A quiet revision to a long-standing baseline will change what counts as normal in next year’s forecasts.',
    byline: 'Dr. L. Haines',
    role: 'Science Contributor',
    date: 'April 18',
    readTime: '3 min read',
    image: 'cracked field under a pale orange sky',
    body: [
      'The update, buried in an appendix, redefines “average rainfall” for the region using the most recent two decades as the reference period, rather than the previous century.',
      'Under the new baseline, this spring’s drought is no longer a drought. It is, technically, a typical spring.'
    ]
  },
  {
    id: 'culture-feature',
    section: 'Culture',
    headline: 'A Popular Novelist Rewrites Her Own Early Work, Quietly',
    dek:
      'Later editions of three of her books have undergone changes that were neither advertised nor, in the publisher’s view, necessary to disclose.',
    byline: 'R. Ivanov',
    role: 'Arts Editor',
    date: 'April 18',
    readTime: '7 min read',
    image: 'two editions of a book side by side, one open',
    body: [
      'The changes are small: a character’s occupation, a city’s name, a paragraph about a protest that was, in the earlier edition, described as “brave.”',
      '“Language moves,” the novelist said, when reached for comment. “A writer has to move with it.”'
    ]
  },
  {
    id: 'obit-professor',
    section: 'Obituaries',
    headline: 'Professor Who Taught Students To Ask “Who Benefits?” Has Died',
    dek:
      'In forty years of lectures, she reduced the syllabus to a single question and asked it of everything.',
    byline: 'Staff Report',
    role: '',
    date: 'April 18',
    readTime: '4 min read',
    image: 'an empty lecture hall with worn wooden seats',
    body: [
      'Generations of students left her classroom unable to read a headline the same way again. She considered this the whole point.',
      'She is survived by her partner, a dog, and a filing cabinet of annotated newspapers.'
    ],
    pullquote: {
      quote: '“Who benefits from you believing this?”',
      attribution: 'A question she asked, reportedly, of everything'
    }
  }
];

export function articleById(id) {
  return articles.find((a) => a.id === id);
}
