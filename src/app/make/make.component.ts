import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { SocketioService } from '../services/socketio.service';
import * as Util from '../shared/utils';

let deactivateSocket = 0; // dev switch
let onlyShowResultBox = 0; // dev switch
let padWithExampleResults = 0; // dev switch
let timeOfBuild = 818; // dev note

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
  socketUsingLocal = { value: false };
  serverIsIndeedWorking = { value: false };
  desiPlaceholderText = 'eg spoke azure';
  gridLayout = 'two rows';
  results = { index: 0, array: padWithExampleResults ? Util.resultsArray : [] };
  socketIsReady = { value: false };
  helpDisplay = Util.helpDisplay;

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

  slideToElement(id) {
    setTimeout(() => {
      const yOffset = -75;
      const element = document.getElementById(id);
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, 100);
  }

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
      this.socketUsingLocal.value = true;
    }
  }

  updateDesiPlaceholderText(sepName) {
    const ref = {
      space: 'eg spoke azure',
      marks: 'eg "SPOKE" part of a wheel. "azure" - Shade of blue.',
    };
    this.desiPlaceholderText = ref[sepName];
  }

  clickToDownload() {
    let border = '------------------------';
    let resultsTxt =
      "Thank you for using Crossword Crocodile!\n\n           .-._   _ _ _ _ _ _ _ _\n.-''-.__.-'00  '-' ' ' ' ' ' ' ' '-.\n'.___ '    .   .--_'-' '-' '-' _'-' '._\n V: V 'vv-'   '_   '.       .'  _..' '.'.\n   '=.____.=_.--'   :_.__.__:_   '.   : :\n           (((____.-'        '-.  /   : :\n                               (((-' .' /\n                            _____..'  .'\nart by Shanaka Dias        '-._____.-'\n\n\n" +
      border +
      '\n';
    let gridTxt = '';
    let summaryTxt = '';

    this.results.array.forEach((resObj) => {
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
      resultsTxt += summaryTxt + '\n' + gridTxt + '\n\n' + border + '\n';
      gridTxt = '';
      summaryTxt = '';
    });

    let myblob = new Blob([resultsTxt], {
      type: 'text/plain',
    });

    const url = URL.createObjectURL(myblob);
    const link = document.createElement('a');
    link.download = `Grid-Results-${Date.now()}.txt`;
    link.href = url;
    link.click();
  }
  clickToReport() {
    window.open(
      'mailto:c.matus.contact@gmail.com?subject=Crossword Feedback',
      '_blank'
    );
  }

  changeResultsIndex(direction) {
    if (direction === 'up' && this.results.index > 0) {
      this.results.index--;
    } else if (
      direction === 'down' &&
      this.results.index < this.results.array.length - 1
    ) {
      this.results.index++;
    }
  }

  failedValidation(code, helpDisplay, slideToElement) {
    helpDisplay[code].show = true;
    helpDisplay.current = code;
    slideToElement(helpDisplay[code].id);
  }

  socketEmit() {
    Util.socketEmit(
      this.helpDisplay,
      this.makeCrosswordForm,
      this.failedValidation,
      this.startButtonActive,
      this.wipeResultState,
      this.socketService,
      this.results,
      this.slideToElement,
      this.deactivateSocket
    );
  }

  wipeResultState(results) {
    let len = results.array.length;
    for (let i = 0; i < len; i++) {
      results.array.pop();
    }
    results.index = 0;
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
