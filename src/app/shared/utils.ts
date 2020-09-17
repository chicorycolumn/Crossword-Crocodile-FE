export function socketEmit(
  helpDisplay,
  makeCrosswordForm,
  failedValidation,
  startButtonActive,
  wipeResultState,
  socketService,
  results,
  slideToElement,
  DEV_deactivateSocket,
  DEV_hard9x5,
  millionPermsRecord
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

  if (DEV_deactivateSocket) {
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

    if (DEV_hard9x5.value) {
      gridSpecsFormatted['grid_width'] = 9;
      gridSpecsFormatted['grid_height'] = 5;
    }

    socketService.emitGridSpecs(gridSpecsFormatted, true, millionPermsRecord);
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
    desiSeparated = form.desi.split(/\s/).filter((str) => str.length);
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

export const exampleResultsArray = [
  {
    margin: 1,
    marginUnset: true,
    summary: ['ABC', 'DEF', 'GHI', 'JKL'],
    grid: [
      ['1ac', ['seeds']],
      ['1ac', ['brented', 'breeted', 'brelted', 'breated', 'bralted']],
      ['1ac', ['seeds']],
      ['1ac', ['scented', 'sheeted', 'smelted', 'sweated', 'swalted']],
      ['1ac', ['seeds']],
      ['1ac', ['seeds']],
      ['1ac', ['lineage']],
      ['1ac', ['overeat']],
      ['1ac', ['samoyed']],
    ],
  },

  {
    margin: 2,
    marginUnset: true,
    summary: ['ABC', 'DEF', 'GHI', 'JKL'],
    grid: [
      ['1ac', ['seeds']],
      ['1ac', ['brented']],
      ['1ac', ['seeds']],
      ['1ac', ['scented']],
      ['1ac', ['seeds']],
      ['1ac', ['seeds']],
      ['1ac', ['lineage']],
      ['1ac', ['overeat']],
      ['1ac', ['samoyed']],
    ],
  },

  {
    margin: 3,
    marginUnset: true,
    summary: ['ABC', 'DEF', 'GHI', 'JKL', 'MNO'],
    grid: [['1ac', ['seeds']]],
  },
  {
    margin: 1,
    marginUnset: false,
    summary: ['AAA', 'BBB', 'CCC', 'DDD'],
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
    margin: 1,
    marginUnset: false,
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
    margin: 1,
    marginUnset: false,
    summary: ['XXX', 'YYY', 'ZZZ'],
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
    text: 'Your minimum number of desired words has been set too high.',
  },
  DesiQuot: {
    id: 'box3',
    show: false,
    text: `You've selected to detect by speechmarks, but I can't find any in the box. Remember, use the doublequote character. (")`,
  },
  null: {
    id: '',
    show: false,
    text: ``,
  },
  current: null,
};

export const rotateCarousel = (object, direction) => {
  let savedValue;
  let middlemanSaved;
  let objKeys;

  if (direction) {
    objKeys = Object.keys(object);
  } else {
    objKeys = Object.keys(object).reverse();
  }

  for (let i = 0; i < objKeys.length; i++) {
    let key = objKeys[i];

    if (i === 0) {
      savedValue = object[key];
    } else if (i < objKeys.length) {
      savedValue = object[key];
      object[key] = middlemanSaved;
    }
    if (i + 1 === objKeys.length) {
      object[objKeys[0]] = savedValue;
    }
    middlemanSaved = savedValue;
  }
};

export const rotateCarouselArray = (array, direction) => {
  let classValues = array.map((obj) => obj.class);

  if (direction) {
    classValues.push(classValues.shift());
  } else {
    classValues.unshift(classValues.pop());
  }

  classValues.forEach((newClass, index) => {
    array[index].class = newClass;
  });
};

export const asciiArt =
  "Thank you for using Crossword Crocodile!\n\n           .-._   _ _ _ _ _ _ _ _\n.-''-.__.-'00  '-' ' ' ' ' ' ' ' '-.\n'.___ '    .   .--_'-' '-' '-' _'-' '._\n V: V 'vv-'   '_   '.       .'  _..' '.'.\n   '=.____.=_.--'   :_.__.__:_   '.   : :\n           (((____.-'        '-.  /   : :\n                               (((-' .' /\n                            _____..'  .'\nart by Shanaka Dias        '-._____.-'\n\n\n" +
  '------------------------';
+'\n';

export const slidesData = [
  {
    id: 's0',
    class: 'carouselItemA',
    src: '../../assets/Crossword 5x5.png',
    srcMobile: '../../assets/Crossword 5x5 MOB.png',
    alt: 'A five letter by five letter blank crossword',
    value: '5x5',
    text: 'Six 5-letter words',
    checked: true,
  },
  {
    id: 's1',
    class: 'carouselItemB',
    src: '../../assets/Crossword 7x5.png',
    srcMobile: '../../assets/Crossword 7x5 MOB.png',
    alt: 'A seven letter by five letter blank crossword',
    value: '5x7',
    text: 'Three 7-letter words\nFour 5-letter words',
    checked: false,
  },
  {
    id: 's2',
    class: 'carouselItemC',
    src: '../../assets/Crossword 9x5.png',
    srcMobile: '../../assets/Crossword 9x5 MOB.png',
    alt: 'A nine letter by five letter blank crossword',
    value: '5x9',
    text: 'Eight 7-letter words',
    checked: false,
  },
  {
    id: 's3',
    class: 'carouselItemOffRight',
    src: '../../assets/Crossword 7x7.png',
    srcMobile: '../../assets/Crossword 7x7 MOB.png',
    alt: 'A seven letter by seven letter blank crossword',
    value: '7x7',
    text: 'Three 9-letter words\nFive 5-letter words',
    checked: false,
  },

  {
    id: 's4',
    class: 'carouselItemHidden',
    src: '../../assets/Crossword 9x7.png',
    srcMobile: '../../assets/Crossword 9x7 MOB.png',
    alt: 'A nine letter by seven letter blank crossword',
    value: '7x9',
    text: 'Four 9-letter words\nFive 7-letter words',
    checked: false,
  },
  {
    id: 's5',
    class: 'carouselItemOffLeft',
    src: '../../assets/Crossword 9x9.png',
    srcMobile: '../../assets/Crossword 9x9 MOB.png',
    alt: 'A nine letter by nine letter blank crossword',
    value: '9x9',
    text: 'Eight 9-letter words',
    checked: false,
  },
];

export const formatResultsForCopyingOrDownloading = (
  results,
  border,
  shallJustGiveCurrent
) => {
  let resultsTxt = '';
  let gridTxt = '';
  let summaryTxt = '';
  let resultsCopy = { array: [] };

  if (shallJustGiveCurrent) {
    resultsCopy = {
      array: [
        {
          summary: results.array[results.index].summary,
          grid: results.array[results.index].grid,
        },
      ],
    };
  } else {
    resultsCopy = results;
  }

  resultsCopy.array.forEach((resObj) => {
    resObj['summary'].forEach((summaryLine) => {
      summaryTxt += '\n' + summaryLine;
    });
    resObj['grid'].forEach((gridLine) => {
      let arr = (<string>gridLine[0]).split(/(\d+)/);
      let num = arr[1];
      let word = arr[2].toLowerCase();
      const ref = { ac: 'Across', do: 'Down' };
      let formattedCoord = `${num} ${ref[word]}`;
      let wordsToFormat = gridLine.slice(1);
      let formattedWords =
        typeof wordsToFormat[0] === 'string'
          ? wordsToFormat[0]
          : (<string[]>wordsToFormat[0]).join(', ');
      gridTxt +=
        '\n' +
        formattedCoord +
        (/a/i.test(formattedCoord) ? ':  ' : ':    ') +
        formattedWords;
    });

    resultsTxt +=
      summaryTxt +
      '\n' +
      gridTxt +
      (shallJustGiveCurrent ? '' : '\n\n' + border + '\n');

    gridTxt = '';
    summaryTxt = '';
  });

  if (/\s/.test(resultsTxt[0])) {
    resultsTxt = resultsTxt.slice(1);
  }

  return resultsTxt;
};
