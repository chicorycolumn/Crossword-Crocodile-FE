export function socketEmit(
  helpDisplay,
  makeCrosswordForm,
  failedValidation,
  startButtonActive,
  wipeResultState,
  socketService,
  results,
  slideToElement,
  deactivateSocket
) {
  Object.keys(helpDisplay).forEach((key) => {
    if (key !== 'current') {
      helpDisplay[key].show = false;
    }
  });

  let form = makeCrosswordForm.value;
  let gridSpecs = {};

  gridSpecs['desi'] = makeDesiList(form);

  gridSpecs['threshold'] = parseInt(form['threshold']) || 0;
  let dimensions = form.shape.shapeName.split('x').map((num) => parseInt(num));
  if (!gridSpecs['desi']) {
    failedValidation('DesiQuot', helpDisplay, slideToElement);
    return;
  } else if (gridSpecs['desi'].length < gridSpecs['threshold']) {
    failedValidation('DesiThre', helpDisplay, slideToElement);
    return;
  } else if (
    gridSpecs['desi'].some((word) => !dimensions.includes(word.length))
  ) {
    failedValidation('DesiLeng', helpDisplay, slideToElement);
    return;
  }

  if (
    parseInt(gridSpecs['threshold']) &&
    parseInt(gridSpecs['threshold']) === parseInt(gridSpecs['desi'].length)
  ) {
    let desiAllString = gridSpecs['desi'].join(' ');
    let desiPlusMand = form['mand'] + ' ' + desiAllString;
    makeCrosswordForm.controls['desi'].setValue('');
    makeCrosswordForm.controls['threshold'].setValue(0);
    gridSpecs['threshold'] = 0;
    gridSpecs['desi'] = [];
    makeCrosswordForm.controls['mand'].setValue(desiPlusMand);
  }
  form = makeCrosswordForm.value;

  gridSpecs['mand'] = normalizeArray(
    form['mand'].split(/\s/).filter((str) => str.length)
  );
  if (gridSpecs['mand'].some((word) => !dimensions.includes(word.length))) {
    failedValidation('MandLeng', helpDisplay, slideToElement);
    return;
  }
  gridSpecs['width'] =
    findModalLength(gridSpecs['mand']) || dimensions.sort((a, b) => b - a)[0];
  dimensions.splice(dimensions.indexOf(gridSpecs['width']), 1);
  gridSpecs['height'] = dimensions[0];
  gridSpecs['bann'] = normalizeArray(
    form['bann'].split(/\s/).filter((str) => str.length)
  );

  if (
    gridSpecs['width'] !== gridSpecs['height'] &&
    gridSpecs['mand'].length === 2
  ) {
    if (gridSpecs['mand'][0].length !== gridSpecs['mand'][1].length) {
      let oddLettersA = gridSpecs['mand'][0]
        .split('')
        .filter((letter, index) => {
          return !(index % 2) && letter;
        });
      let oddLettersB = gridSpecs['mand'][1]
        .split('')
        .filter((letter, index) => {
          return !(index % 2) && letter;
        });
      if (oddLettersA.every((letter) => !oddLettersB.includes(letter))) {
        failedValidation('MandPoss', helpDisplay, slideToElement);
        return;
      }
    }
  }

  if (deactivateSocket) {
    console.log(gridSpecs);
  } else {
    startButtonActive.value = true;
    gridSpecs['time'] = Date.now() / 1000;
    wipeResultState(results);

    let gridSpecsFormatted = {};
    Object.keys(gridSpecs).forEach(
      (key) => (gridSpecsFormatted[gridSpecsKey[key]] = gridSpecs[key])
    );
    console.log(gridSpecsFormatted, Date.now() / 1000 - 1593360000);
    socketService.emitGridSpecs(gridSpecsFormatted);
  }
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

export const resultsArray = [
  { summary: ['ABC', 'DEF', 'GHI', 'JKL', 'MNO'], grid: [['1ac', ['seeds']]] },
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

export const gridSpecsKey = {
  desi: 'desirable_words_unfiltered',
  threshold: 'threshold',
  mand: 'mandatory_words',
  width: 'grid_width',
  height: 'grid_height',
  bann: 'banned_words',
  time: 'time',
};

export function sayHi() {
  console.log('hi from util');
}

export let helpDisplay = {
  MandLeng: {
    id: 'box2',
    show: false,
    text:
      'Your mandatory words must be the same length as the grid specifications.',
  },
  MandExce: {
    id: 'box2',
    show: false,
    text:
      "You've entered more mandatory words than there are words in the grid!",
  },
  MandPoss: {
    id: 'box2',
    show: false,
    text:
      "I'm afraid these two mandatory words are impossible to fit together!",
  },
  DesiLeng: {
    id: 'box3',
    show: false,
    text:
      'Your desired words must be the same length as the grid specifications.',
  },
  DesiThre: {
    id: 'box3',
    show: false,
    text: 'Your required number of desired words has been set too high.',
  },
  DesiQuot: {
    id: 'box3',
    show: false,
    text: `You've selected to separate desired words by speechmarks, but I can't find any in the box. Remember, use the doublequote character. (")`,
  },
  current: null,
};
