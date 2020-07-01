import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { SocketioService } from '../services/socketio.service';
import * as Util from '../shared/utils';

let deactivateSocket = 0; // dev switch
let onlyShowResultBox = 0; // dev switch
let padWithExampleResults = 0; // dev switch
let timeOfBuild = 949; // dev note

@Component({
  selector: 'app-make',
  templateUrl: './make.component.html',
  styleUrls: ['./make.component.css'],
})
export class MakeComponent implements OnInit {
  onlyShowResultBox = onlyShowResultBox;
  timeOfBuild = timeOfBuild;
  startButtonActive = { value: false };
  serverIsIndeedWorking = { value: false };
  desiPlaceholderText = 'eg spoke azure';
  gridLayout = 'two rows';
  resultsIndex = 0;
  results = padWithExampleResults ? Util.results : [];
  socketIsReady = { value: false };
  helpDisplay = {
    box1: false,
    box2: true,
    box3: false,
    MandLeng:
      'Your mandatory words must be the same length as the grid specifications.',
    DesiLeng:
      'Your mandatory words must be the same length as the grid specifications.',
    DesiThre:
      'Your required number of desired words has been set higher than the number of desired words.',
    DesiQuot: `You've selected to separate desired words by speechmarks, but I can't find any in the box. Remember, use the doublequote character. (")`,
  };

  makeCrosswordForm = this.fb.group({
    shape: this.fb.group({
      shapeName: '5x5',
    }),
    mandatory_words: [''],
    banned_words: [''],
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

  devEvent() {
    console.log(this.results);
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
    if (code == 'MandLeng') {
      console.log('FAIL', code);
    } else if (code == 'DesiThre') {
      console.log('FAIL', code);
    } else if (code == 'DesiLeng') {
      console.log('FAIL', code);
    } else if (code == 'DesiQuot') {
      console.log('FAIL', code);
    }
  }

  socketEmit() {
    let form = this.makeCrosswordForm.value;
    let gridSpecs = {};
    console.log(111);
    gridSpecs['desirable_words_unfiltered'] = Util.makeDesiList(form);
    gridSpecs['threshold'] = parseInt(form['threshold']) || 0;
    let dimensions = form.shape.shapeName
      .split('x')
      .map((num) => parseInt(num));
    console.log(222);
    gridSpecs['mandatory_words'] = Util.normalizeArray(
      form['mandatory_words'].split(' ').filter((str) => str.length)
    );

    if (
      gridSpecs['mandatory_words'].some(
        (word) => !dimensions.includes(word.length)
      )
    ) {
      this.failedValidation('MandLeng');
      return;
    }
    console.log(333);
    if (!gridSpecs['desirable_words_unfiltered']) {
      this.failedValidation('DesiQuot');
      return;
    } else if (
      gridSpecs['desirable_words_unfiltered'].length < gridSpecs['threshold']
    ) {
      this.failedValidation('DesiThre');
      return;
    } else if (
      gridSpecs['desirable_words_unfiltered'].some(
        (word) => !dimensions.includes(word.length)
      )
    ) {
      this.failedValidation('DesiLeng');
      return;
    }
    console.log(444);
    gridSpecs['grid_width'] =
      Util.findModalLength(gridSpecs['mandatory_words']) ||
      dimensions.sort((a, b) => b - a)[0];
    dimensions.splice(dimensions.indexOf(gridSpecs['grid_width']), 1);
    gridSpecs['grid_height'] = dimensions[0];
    console.log(555);
    gridSpecs['banned_words'] = Util.normalizeArray(
      form['banned_words'].split(' ').filter((str) => str.length)
    );
    console.log(666);
    this.startButtonActive.value = true;
    gridSpecs['time'] = Date.now() / 1000;
    console.log('Emitting grid specs!', Date.now() / 1000 - 1593360000);

    console.log(gridSpecs);
    console.log(777);
    this.wipeResultState();
    console.log(888);
    this.socketService.emitGridSpecs(gridSpecs);
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
    console.log('STOP fxn in make.comp.ts');
    this.socketService.stop();
    setTimeout(() => {
      this.startButtonActive.value = false;
      this.serverIsIndeedWorking.value = false;
    }, 0);
    setTimeout(() => {
      this.socketService.stop();
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

  // onChanges(): void {
  //   console.log('on changes');
  //   this.makeCrosswordForm.valueChanges.subscribe((val) => {
  //     console.log('ON CHANGES', val);
  //   });
  // }
}
