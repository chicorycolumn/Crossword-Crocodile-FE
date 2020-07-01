export function sayHi() {
  console.log('hi from util');
}

export function normalizeArray(arr: any[]) {
  return arr.map((str) => {
    let newStr = str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z]/g, '')
      .toLowerCase();
    return newStr;
  });
}

export function makeDesiList(form: { desiSeparator; desi }) {
  let desiSeparated;
  let sep = form.desiSeparator;
  if (sep === ' ') {
    desiSeparated = form.desi
      .split(form.desiSeparator)
      .filter((str) => str.length);
  } else {
    let desiFormatted = form.desi.replace('“', '"').replace('”', '"');
    let desiSeparatedUnformatted = desiFormatted.match(/".+?"/g);
    if (!desiSeparatedUnformatted) {
      return false;
    } else {
      desiSeparated = desiSeparatedUnformatted
        .map((str) => {
          let newStr = str.replace(/"/g, '');
          return newStr;
        })
        .filter((str) => str.length);
    }
  }
  return normalizeArray(desiSeparated);
}

export function findModalLength(arr: string[]) {
  let tally = {};

  arr.forEach((str) => {
    if (tally[str.length]) {
      tally[str.length]++;
    } else {
      tally[str.length] = 1;
    }
  });

  let highestTally = Object.values(tally).sort((a, b) => +b - +a)[0];

  let modalLength = 0;

  Object.keys(tally)
    .sort((a, b) => +a - +b)
    .forEach((key) => {
      if (tally[key] === highestTally) {
        modalLength = parseInt(key);
      }
    });
  return modalLength;
}

export const results = [
  {
    grid: [
      [
        '1ac',
        [
          'seeds',
          'seeks',
          'seems',
          'seeps',
          'seers',
          'sheds',
          'skews',
          'sleds',
          'specs',
          'spews',
          'stems',
          'steps',
          'stews',
        ],
      ],
      [
        '2ac',
        [
          'mates',
          'maths',
          'mites',
          'mitts',
          'motes',
          'moths',
          'mutes',
          'mutts',
          'myths',
        ],
      ],
    ],
  },
  {
    summary: ['NTD', 'SMC', 'LOS'],
    grid: [
      [
        '1ac',
        [
          'scabs',
          'scams',
          'scans',
          'scars',
          'seals',
          'seams',
          'sears',
          'seats',
          'shags',
          'shahs',
          'shams',
          'slabs',
          'slags',
          'slams',
          'slaps',
          'slats',
          'slavs',
          'slays',
          'snags',
          'snaps',
          'soaks',
          'soaps',
          'soars',
          'spans',
          'spars',
          'spats',
          'stabs',
          'stags',
          'stars',
          'stats',
          'stays',
          'swabs',
          'swans',
          'swaps',
          'swats',
          'sways',
        ],
      ],
      ['2ac', ['devil']],
      ['3ac', ['devil']],
      ['4ac', ['shell', 'smell', 'spell', 'steal', 'steel', 'swell']],
      ['5ac', ['devil']],
      ['6ac', ['devil']],
    ],
  },
  {
    grid: [
      ['1ac', ['devil']],
      ['2ac', ['devil']],
      ['3ac', ['devil']],
      ['4ac', ['shell', 'smell', 'spell', 'steal', 'steel', 'swell']],
      ['5ac', ['devil']],
      ['6ac', ['devil']],
    ],
  },
];
