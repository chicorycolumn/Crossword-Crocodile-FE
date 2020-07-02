import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { SocketioService } from '../services/socketio.service';
import * as Util from '../shared/utils';

let deactivateSocket = 0; // dev switch
let onlyShowResultBox = 0; // dev switch
let padWithExampleResults = 0; // dev switch
let timeOfBuild = 1000; // dev note

@Component({
  selector: 'app-make',
  templateUrl: './make.component.html',
  styleUrls: ['./make.component.css'],
})
export class MakeComponent implements OnInit {
  onlyShowResultBox = onlyShowResultBox;
  deactivateSocket = deactivateSocket;
  timeOfBuild = timeOfBuild;
  startButtonActive = { value: false };
  serverIsIndeedWorking = { value: false };
  desiPlaceholderText = 'eg spoke azure';
  gridLayout = 'two rows';
  resultsIndex = 0;
  results = padWithExampleResults ? Util.results : [];
  socketIsReady = { value: false };
  helpDisplay = {
    MandLeng: {
      show: false,
      text:
        'Your mandatory words must be the same length as the grid specifications.',
    },
    MandExce: {
      show: false,
      text:
        "You've entered more mandatory words than there are words in the grid!",
    },
    MandPoss: {
      show: false,
      text:
        "I'm afraid these two mandatory words are impossible to fit together!",
    },
    DesiLeng: {
      show: false,
      text:
        'Your desired words must be the same length as the grid specifications.',
    },
    DesiThre: {
      show: false,
      text: 'Your required number of desired words has been set too high.',
    },
    DesiQuot: {
      show: false,
      text: `You've selected to separate desired words by speechmarks, but I can't find any in the box. Remember, use the doublequote character. (")`,
    },
    current: null,
  };

  makeCrosswordForm = this.fb.group({
    shape: this.fb.group({
      shapeName: '5x5',
    }),
    mand: [''],
    bann: [''],
    desi: [''],
    desiSeparator: [' '],
    threshold: [''],
  });

  constructor(
    private fb: FormBuilder,
    private socketService: SocketioService
  ) {}

  ngOnInit(): void {
    this.startButtonActive.value = false; //delete?
    this.serverIsIndeedWorking.value = false; //delete?

    setTimeout(this.checkIfFlexWrap, 0);
    if (!deactivateSocket) {
      this.socketService.setupSocketConnection(
        true,
        this.startButtonActive,
        this.serverIsIndeedWorking,
        this.results,
        this.socketIsReady
      );
    }
  }

  fruit = 'apple';

  exitErrorBubble(key) {
    this.helpDisplay[key].show = false;
    // this.helpDisplay.current = null;
  }

  devEvent() {
    this.socketService.verifyOff();
  }
  socketToLocalHost() {
    if (!deactivateSocket) {
      this.socketService.setupSocketConnection(
        false,
        this.startButtonActive,
        this.serverIsIndeedWorking,
        this.results,
        this.socketIsReady
      );
    }
  }

  updateDesiPlaceholderText(sepName) {
    const ref = {
      space: 'eg spoke azure',
      marks: 'eg "SPOKE" part of a wheel. "azure" - Shade of blue.',
    };
    this.desiPlaceholderText = ref[sepName];
  }

  changeResultsIndex(direction) {
    if (direction === 'up' && this.resultsIndex > 0) {
      this.resultsIndex--;
    } else if (
      direction === 'down' &&
      this.resultsIndex < this.results.length - 1
    ) {
      this.resultsIndex++;
    }
  }

  failedValidation(code) {
    this.helpDisplay[code].show = true;
    this.helpDisplay.current = code;
  }

  socketEmit() {
    Object.keys(this.helpDisplay).forEach((key) => {
      if (key !== 'current') {
        this.helpDisplay[key].show = false;
      }
    });

    let form = this.makeCrosswordForm.value;
    let gridSpecs = {};

    gridSpecs['desi'] = Util.makeDesiList(form);
    gridSpecs['threshold'] = parseInt(form['threshold']) || 0;
    let dimensions = form.shape.shapeName
      .split('x')
      .map((num) => parseInt(num));
    if (!gridSpecs['desi']) {
      this.failedValidation('DesiQuot');
      return;
    } else if (gridSpecs['desi'].length < gridSpecs['threshold']) {
      this.failedValidation('DesiThre');
      return;
    } else if (
      gridSpecs['desi'].some((word) => !dimensions.includes(word.length))
    ) {
      this.failedValidation('DesiLeng');
      return;
    }

    if (
      parseInt(gridSpecs['threshold']) &&
      parseInt(gridSpecs['threshold']) === parseInt(gridSpecs['desi'].length)
    ) {
      let desiAllString = gridSpecs['desi'].join(' ');
      let desiPlusMand = form['mand'] + ' ' + desiAllString;
      this.makeCrosswordForm.controls['desi'].setValue('');
      this.makeCrosswordForm.controls['threshold'].setValue(0);
      gridSpecs['threshold'] = 0;
      gridSpecs['desi'] = [];
      this.makeCrosswordForm.controls['mand'].setValue(desiPlusMand);
    }
    form = this.makeCrosswordForm.value;

    gridSpecs['mand'] = Util.normalizeArray(
      form['mand'].split(' ').filter((str) => str.length)
    );
    if (gridSpecs['mand'].some((word) => !dimensions.includes(word.length))) {
      this.failedValidation('MandLeng');
      return;
    }
    gridSpecs['width'] =
      Util.findModalLength(gridSpecs['mand']) ||
      dimensions.sort((a, b) => b - a)[0];
    dimensions.splice(dimensions.indexOf(gridSpecs['width']), 1);
    gridSpecs['height'] = dimensions[0];
    gridSpecs['bann'] = Util.normalizeArray(
      form['bann'].split(' ').filter((str) => str.length)
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
        console.log(oddLettersA, oddLettersB);
        if (oddLettersA.every((letter) => !oddLettersB.includes(letter))) {
          this.failedValidation('MandPoss');
        }
      }
    }

    this.startButtonActive.value = true;
    gridSpecs['time'] = Date.now() / 1000;

    this.wipeResultState();

    if (!this.deactivateSocket) {
      let gridSpecsFormatted = {};
      Object.keys(gridSpecs).forEach(
        (key) => (gridSpecsFormatted[Util.gridSpecsKey[key]] = gridSpecs[key])
      );
      console.log(gridSpecsFormatted, Date.now() / 1000 - 1593360000);
      this.socketService.emitGridSpecs(gridSpecsFormatted);
    }
  }

  wipeResultState() {
    let len = this.results.length;
    for (let i = 0; i < len; i++) {
      this.results.pop();
    }
    this.resultsIndex = 0;
  }

  message() {
    this.socketService.message();
  }

  socketStop() {
    !this.deactivateSocket && this.socketService.stop();
    setTimeout(() => {
      this.startButtonActive.value = false;
      this.serverIsIndeedWorking.value = false;
    }, 0);
    setTimeout(() => {
      !this.deactivateSocket && this.socketService.stop();
    }, 10);
  }

  verifyOff() {
    this.socketService.verifyOff();
  }

  formChanged() {
    if (this.startButtonActive.value) {
      this.socketStop();
    }
  }

  onResize(e) {
    this.checkIfFlexWrap();
  }

  checkIfFlexWrap() {
    let boxes = {
      box1: document.getElementById('box1'),
      box2: document.getElementById('box2'),
    };

    if (boxes['box1'].offsetTop < boxes['box2'].offsetTop) {
      this.gridLayout = 'one column';
    } else {
      this.gridLayout = 'two rows';
    }
  }
}
