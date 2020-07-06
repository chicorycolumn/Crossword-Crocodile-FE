import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { SocketioService } from '../services/socketio.service';
import * as Util from '../shared/utils';

let DEV_allToTrue = 0; // dev switch
let DEV_deactivateSocket = 0; // dev switch
let DEV_onlyShowResultBox = 0; // dev switch
let DEV_padWithExampleResults = 0; // dev switch
let DEV_timeOfBuild = 1201; // dev note

@Component({
  selector: 'app-make',
  templateUrl: './make.component.html',
  styleUrls: ['./make.component.css'],
})
export class MakeComponent implements OnInit {
  slidesData = Util.slidesData;

  devButtonsShowing = { value: false };
  disconnectedByServer = { value: false };
  transparentResults = { value: false };
  selectedElements = {};
  resultsMargin = { value: 1 };
  DEV_onlyShowResultBox = DEV_allToTrue || DEV_onlyShowResultBox;
  DEV_deactivateSocket = DEV_allToTrue || DEV_deactivateSocket;
  DEV_timeOfBuild = DEV_timeOfBuild;
  startButtonActive = { value: false };
  DEV_socketUsingLocal = { value: false };
  DEV_hard9x5 = { value: false };
  serverIsIndeedWorking = { value: false };
  desiPlaceholderText = 'eg spoke azure';
  gridLayout = 'two rows';
  results = {
    index: 0,
    array:
      DEV_allToTrue || DEV_padWithExampleResults
        ? Util.exampleResultsArray
        : [],
  };
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
    document.addEventListener('keydown', (e) => {
      this.keydownEvent(e, this.results, this.selectedElements);
    });
    document.getElementById('box4').addEventListener('wheel', (e) => {
      this.wheelEvent(e, this.results);
    });

    let body = document.getElementById('body');
    // console.log(el);

    // console.log('********************');
    // let isMobile = window.matchMedia('only screen and (max-width: 568px)')
    //   .matches;
    // console.log(isMobile);
    // console.log('********************');
    // if (isMobile) {
    //   document.body.style.zoom = '0.6';
    // }

    // [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].forEach((maxWidth) => {
    //   console.log(
    //     maxWidth,
    //     window.matchMedia(`only screen and (max-width: ${maxWidth}px)`).matches
    //   );
    // });
    if (window.matchMedia(`only screen and (max-width: 500px)`).matches) {
      document.body.style.zoom = '0.6';
    }
    // if (window.matchMedia(`only screen and (max-width: 400px)`).matches) {
    //   document.body.style.zoom = '0.8';
    // }
    console.log('############', document.body.style.zoom);

    // while (
    //   body.scrollWidth > body.clientWidth &&
    //   parseInt(document.body.style.zoom) > 0.5
    // ) {
    //   console.log(`was ${document.body.style.zoom}`);
    //   document.body.style.zoom = (
    //     parseInt(document.body.style.zoom) - 0.1
    //   ).toString();
    //   console.log(`now ${document.body.style.zoom}`);
    // }

    setTimeout(this.checkIfFlexWrap, 0);
    if (!DEV_deactivateSocket) {
      this.socketService.setupSocketConnection(
        true,
        this.startButtonActive,
        this.serverIsIndeedWorking,
        this.results,
        this.socketIsReady,
        this.disconnectedByServer,
        this.shrinkTextIfOverflowing,
        this.firstResultsAreIn,
        this.transparentResults,
        document
      );
    }
  }

  rotateCarousel(direction) {
    Util.rotateCarouselArray(this.slidesData, direction);
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

  checkShapeRadio(id) {
    this.slidesData.forEach((slideData) => {
      if (slideData.id === id) {
        slideData.checked = true;
      } else {
        slideData.checked = false;
      }
    });
  }

  setHard5x9() {
    this.DEV_hard9x5.value = true;
  }

  exitErrorBubble(key) {
    this.helpDisplay[key].show = false;
    // this.helpDisplay.current = null;
  }

  devEvent() {
    this.socketService.verifyOff();
  }

  clearInputBox(id) {
    this.makeCrosswordForm.controls['threshold'].setValue('');
  }

  plusSlides(direction) {}

  devEvent2() {
    this.socketService.stop('Client used dev button to request disconnect.');
  }

  socketToLocalHost() {
    if (!DEV_deactivateSocket) {
      this.socketService.setupSocketConnection(
        false,
        this.startButtonActive,
        this.serverIsIndeedWorking,
        this.results,
        this.socketIsReady,
        this.disconnectedByServer,
        this.shrinkTextIfOverflowing,
        this.firstResultsAreIn,
        this.transparentResults,
        document
      );
      this.DEV_socketUsingLocal.value = true;
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
    let resultsTxt = Util.asciiArt;

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

  shrinkTextIfOverflowing(transparentResults, results) {
    transparentResults.value = true;

    const isOverflown = (element) => {
      return (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
      );
    };

    let timeout = 0;

    setTimeout(() => {
      if (isOverflown(document.getElementById('resultLeftieInner1'))) {
        results.array[results.index].margin = 2;
        results.array[results.index].marginUnset = false;

        setTimeout(() => {
          if (isOverflown(document.getElementById('resultLeftieInner1'))) {
            results.array[results.index].margin = 3;
            results.array[results.index].marginUnset = false;

            setTimeout(() => {
              if (isOverflown(document.getElementById('resultLeftieInner1'))) {
                results.array[results.index].margin = 4;
                results.array[results.index].marginUnset = false;
              }
            }, timeout);
          }
        }, timeout);

        transparentResults.value = false;
      } else {
        results.array[results.index].margin = 1;
        results.array[results.index].marginUnset = false;
        transparentResults.value = false;
      }
    }, timeout);
  }

  changeResultsIndex(direction) {
    if (this.results.array.length) {
      // this.resultsMargin.value = 1;

      if (direction === 'up' && this.results.index > 0) {
        this.results.index--;
        if (this.results.array[this.results.index].marginUnset) {
          this.shrinkTextIfOverflowing(this.transparentResults, this.results);
        }
      } else if (
        direction === 'down' &&
        this.results.index < this.results.array.length - 1
      ) {
        this.results.index++;
        if (this.results.array[this.results.index].marginUnset) {
          this.shrinkTextIfOverflowing(this.transparentResults, this.results);
        }
      }
    }
  }

  failedValidation(code, helpDisplay, slideToElement) {
    helpDisplay[code].show = true;
    helpDisplay.current = code;
    slideToElement(helpDisplay[code].id);
  }

  socketStop() {
    console.log(
      'MCT STOP says serverIsIndeedWorking.value is',
      this.serverIsIndeedWorking.value,
      'and startButtonActive.value is',
      this.startButtonActive.value
    );

    let timestamp = Date.now() / 1000;

    !this.DEV_deactivateSocket &&
      this.socketService.stop(`Client clicked STOP button at ${timestamp}`);
    setTimeout(() => {
      this.startButtonActive.value = false;
      this.serverIsIndeedWorking.value = false;
    }, 0);
    setTimeout(() => {
      !this.DEV_deactivateSocket &&
        this.socketService.stop(
          `10ms delayed redundancy-repeat of client clicking STOP button at  at ${timestamp}`
        );
    }, 10);
  }

  showDevButtons() {
    if (this.makeCrosswordForm.value['bann'] === 'ved') {
      this.devButtonsShowing.value = true;
      this.makeCrosswordForm.controls['bann'].setValue('');
    }
  }

  makeElementSelected(id, mouse) {
    this.selectedElements[id] = mouse;
  }

  wheelEvent(e, results) {
    if (results.array.length) {
      e.preventDefault();
      console.log(e.deltaY);

      if (e.deltaY < 0) {
        this.changeResultsIndex('up');
      } else if (e.deltaY > 0) {
        this.changeResultsIndex('down');
      }
    }
  }

  keydownEvent(e, results, selectedElements) {
    if (results.array.length && selectedElements['box4']) {
      e.preventDefault();
      if (e.charCode == 38 || e.keyCode == 38) {
        this.changeResultsIndex('up');
      } else if (e.charCode == 40 || e.keyCode == 40) {
        this.changeResultsIndex('down');
      }
    }
  }

  firstResultsAreIn(document) {}

  socketEmit() {
    this.disconnectedByServer.value = false;

    console.log(
      'MCT EMIT says serverIsIndeedWorking.value is',
      this.serverIsIndeedWorking.value,
      'and startButtonActive.value is',
      this.startButtonActive.value
    );

    // document.removeEventListener('keydown');

    Util.socketEmit(
      this.helpDisplay,
      this.makeCrosswordForm,
      this.failedValidation,
      this.startButtonActive,
      this.wipeResultState,
      this.socketService,
      this.results,
      this.slideToElement,
      this.DEV_deactivateSocket,
      this.DEV_hard9x5
    );
  }

  wipeResultState(results) {
    let len = results.array.length;
    for (let i = 0; i < len; i++) {
      results.array.pop();
    }
    results.index = 0;
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
