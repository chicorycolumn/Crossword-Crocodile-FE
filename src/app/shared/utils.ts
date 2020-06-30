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
  return this.normalizeArray(desiSeparated);
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
