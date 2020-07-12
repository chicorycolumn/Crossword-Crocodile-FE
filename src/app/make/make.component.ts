import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { SocketioService } from '../services/socketio.service';
import * as Util from '../shared/utils';

let DEV_allToTrue = 0;
let DEV_deactivateSocket = 0;
let DEV_onlyShowResultBox = 0;
let DEV_padWithExampleResults = 0;

@Component({
  selector: 'app-make',
  templateUrl: './make.component.html',
  styleUrls: ['./make.component.css'],
})
export class MakeComponent implements OnInit {
  slidesData = Util.slidesData;
  isMobile = false;
  devButtonsShowing = { value: false };
  disconnectedByServer = { value: false };
  transparentResults = { value: false };
  copyNotification = { value: false };
  selectedElements = { alt: {}, occupied: {} };
  resultsMargin = { value: 1 };
  DEV_onlyShowResultBox = DEV_allToTrue || DEV_onlyShowResultBox;
  DEV_deactivateSocket = DEV_allToTrue || DEV_deactivateSocket;
  startButtonActive = { value: false };
  DEV_socketUsingLocal = { value: false };
  DEV_hard9x5 = { value: false };
  serverIsIndeedWorking = { value: false };
  desiPlaceholderText = 'azure spoke';
  gridLayout = 'two rows';
  invisibleTextarea = { value: '' };
  millionPermsRecord = { value: 0.00666 };
  elementToFlash = { resultLeftie: false };
  pseudoTooltip = {
    current: 0,
    disabled: false,
    showExitText: false,
  };

  tooltipData = {
    keys: ['download', 'copy', 'editor', 'report'],
    download: {
      text: 'Download all results',
      image: '../../assets/download icon ZEUS.png',
      function: () => {
        if (!this.results.array.length) {
          return;
        }

        let border = '------------------------';

        let resultsTxt = Util.formatResultsForCopyingOrDownloading(
          this.results,
          border,
          false
        );

        resultsTxt = Util.asciiArt + '\n\n' + resultsTxt;

        let myblob = new Blob([resultsTxt], {
          type: 'text/plain',
        });

        const url = URL.createObjectURL(myblob);
        const link = document.createElement('a');
        link.download = `Grid-Results-${Date.now()}.txt`;
        link.href = url;
        link.click();
      },
    },
    copy: {
      text: 'Copy current result',
      image: '../../assets/copy icon ZEUS.png',
      function: () => {
        if (!this.results.array.length) {
          return;
        }

        this.invisibleTextarea.value = Util.formatResultsForCopyingOrDownloading(
          this.results,
          '',
          true
        );

        this.elementToFlash.resultLeftie = true;
        setTimeout(() => {
          this.copyNotification.value = true;
        }, 100);

        setTimeout(() => {
          let el = document.getElementById(
            'invisibleTextarea'
          ) as HTMLInputElement;
          el.select();
          el.setSelectionRange(0, 99999);
          document.execCommand('copy');
        }, 500);

        setTimeout(() => {
          this.elementToFlash.resultLeftie = false;
        }, 1000);

        setTimeout(() => {
          this.copyNotification.value = false;
        }, 750);
      },
    },
    editor: {
      text: 'Open in editor',
      image: '../../assets/editor icon ZEUS.png',
      function: () => {
        alert('Editor feature pending');
      },
    },
    report: {
      text: 'Report a problem',
      image: '../../assets/report icon ZEUS.png',
      function: () => {
        window.open(
          'mailto:c.matus.contact@gmail.com?subject=Crossword Feedback',
          '_blank'
        );
      },
    },
  };

  loadingText = {
    sorry: {
      text: 'Sorry, none yet, but please try again!',
      image: '../../assets/croc-book.png',
    },
    sending: {
      text: 'Sending to server...',
      image: '../../assets/sending icon ZEUS.png',
    },
    working: {
      text: null,
      image: '../../assets/working icon ZEUS.png',
    },
  };
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
    this.startButtonActive.value = false;
    this.serverIsIndeedWorking.value = false;

    this.slidesData.forEach((slideObj) => {
      slideObj.checked = slideObj.value === '5x5';
    });

    document.addEventListener('keydown', (e) => {
      this.keydownEvent(e, this.results, this.selectedElements);
    });
    document.getElementById('box4').addEventListener('wheel', (e) => {
      this.wheelEvent(e, this.results);
    });

    let mobileWidth = 450;
    if (
      window.matchMedia(`only screen and (max-width: ${mobileWidth}px)`).matches
    ) {
      this.isMobile = true;
    }

    const zoomRef = { 320: '0.6', 375: '0.65', 420: '0.75' };
    Object.keys(zoomRef)
      .sort((a, b) => +b - +a)
      .forEach((maxWidth) => {
        if (
          window.matchMedia(`only screen and (max-width: ${maxWidth}px)`)
            .matches
        ) {
          document.body.style.zoom = zoomRef[maxWidth];
        }
      });

    let smallerComputerHeight = 700;
    if (!this.isMobile) {
      if (
        window.matchMedia(
          `only screen and (max-height: ${smallerComputerHeight}px)`
        ).matches
      ) {
        console.log('zoom is 0.95');
        document.body.style.zoom = '0.95';
      }
    }

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
        this.transparentResults
      );
    }
    setInterval(() => {
      if (this.pseudoTooltip.current > 3) {
        this.pseudoTooltip.current = 0;
      } else {
        this.pseudoTooltip.current++;
      }
    }, 3000);
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

  disablePseudoTooltip() {
    this.pseudoTooltip.disabled = true;
  }

  highlightPseudoTooltipExit(val) {
    this.pseudoTooltip.showExitText = val;
  }

  setHard5x9() {
    this.DEV_hard9x5.value = true;
  }

  exitErrorBubble(key) {
    this.helpDisplay[key].show = false;
    this.helpDisplay.current = null;
  }

  devEvent() {
    console.log(this.millionPermsRecord);
    this.socketService.verifyOff();
  }

  clearInputBox(id) {
    this.makeCrosswordForm.controls[id].setValue('');
    if (id === 'desi') {
      this.makeCrosswordForm.controls['threshold'].setValue(0);
    }
  }

  plusSlides(direction) {}

  devEvent2() {
    this.socketService.stop('Client used dev button to request disconnect.');
  }

  makeCrocSneeze(id) {
    this.selectedElements.alt[id] = true;
    this.selectedElements.occupied[id] = true;
    setTimeout(() => {
      this.selectedElements.alt[id] = false;
    }, 500);
    setTimeout(() => {
      this.selectedElements.occupied[id] = false;
    }, 5000);
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
        this.transparentResults
      );
      this.DEV_socketUsingLocal.value = true;
    }
  }

  updateDesiPlaceholderText(sepName) {
    const ref = {
      space: 'azure spoke',
      marks: '"AZURE" blue hue. "spoke" - Part of a wheel.',
    };
    this.desiPlaceholderText = ref[sepName];
  }

  desiInputLostFocus() {
    if (!/[^\s]/g.test(this.makeCrosswordForm.value['desi'])) {
      this.makeCrosswordForm.controls['threshold'].setValue(0);
    } else if (this.makeCrosswordForm.value['threshold'] === 0) {
      this.makeCrosswordForm.controls['threshold'].setValue(1);
    }
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

  changeFruit() {
    console.log(this.makeCrosswordForm.value['bann']);
    this.socketService.changeFruit(this.makeCrosswordForm.value['bann']);
  }

  checkFruit() {
    this.socketService.checkFruit();
  }

  socketStop() {
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
    if (this.devButtonsShowing.value) {
      this.devButtonsShowing.value = false;
    } else {
      if (this.makeCrosswordForm.value['bann'] === 'ved') {
        this.devButtonsShowing.value = true;
      }
    }
  }

  makeElementSelected(id, bool) {
    if (bool && /crocSep/.test(id) && !this.selectedElements[id]) {
      setTimeout(() => {
        this.selectedElements[id] = true;
      }, 750);
      setTimeout(() => {
        this.selectedElements[id] = false;
      }, 1250);
    } else this.selectedElements[id] = bool;
  }

  wheelEvent(e, results) {
    if (results.array.length && this.selectedElements['resultRightie']) {
      e.preventDefault();

      if (e.deltaY < 0) {
        this.changeResultsIndex('up');
      } else if (e.deltaY > 0) {
        this.changeResultsIndex('down');
      }
    }
  }

  keydownEvent(e, results, selectedElements) {
    if (selectedElements['box1']) {
      if (e.charCode == 37 || e.keyCode == 37) {
        e.preventDefault();
        let el = document.getElementById('slidePrev');
        el.click();
      } else if (e.charCode == 49 || e.keyCode == 39) {
        e.preventDefault();
        let el = document.getElementById('slideNext');
        el.click();
      }
    }

    if (results.array.length && selectedElements['resultRightie']) {
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
      this.DEV_hard9x5,
      this.millionPermsRecord
    );
  }

  wipeResultState(results) {
    let len = results.array.length;
    for (let i = 0; i < len; i++) {
      results.array.pop();
    }
    results.index = 0;
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
