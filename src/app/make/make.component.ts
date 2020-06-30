import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { SocketioService } from '../services/socketio.service';
import * as Util from '../shared/utils';

let deactivateSocket = 0; // dev switch
let onlyShowResultBox = 0; // dev switch

@Component({
  selector: 'app-make',
  templateUrl: './make.component.html',
  styleUrls: ['./make.component.css'],
})
export class MakeComponent implements OnInit {
  onlyShowResultBox = onlyShowResultBox;
  startButtonActive = { value: false };
  desiPlaceholderText = 'eg spoke azure';
  gridLayout = 'two rows';
  resultsIndex = 0;
  results = [
    // {
    //   grid: [
    //     [
    //       '1ac',
    //       [
    //         'aiped',
    //         'biped',
    //         'ciped',
    //         'diped',
    //         'eiped',
    //         'fiped',
    //         'giped',
    //         'hiped',
    //         'iyped',
    //         'jiped',
    //       ],
    //     ],
    //     [
    //       '4ac',
    //       [
    //         'aiped',
    //         'biped',
    //         'ciped',
    //         'diped',
    //         'eiped',
    //         'fiped',
    //         'giped',
    //         'hiped',
    //         'iyped',
    //         'jiped',
    //       ],
    //     ],
    //     [
    //       '5ac',
    //       [
    //         'aiped',
    //         'biped',
    //         'ciped',
    //         'diped',
    //         'eiped',
    //         'fiped',
    //         'giped',
    //         'hiped',
    //         'iyped',
    //         'jiped',
    //       ],
    //     ],
    //     [
    //       '0do',
    //       [
    //         'deter',
    //         'diped',
    //         'eiped',
    //         'fiped',
    //         'giped',
    //         'hiped',
    //         'iyped',
    //         'jiped',
    //       ],
    //     ],
    //     [
    //       '0do',
    //       [
    //         'deter',
    //         'diped',
    //         'eiped',
    //         'fiped',
    //         'giped',
    //         'hiped',
    //         'iyped',
    //         'jiped',
    //       ],
    //     ],
    //     [
    //       '1do',
    //       [
    //         'aiped',
    //         'biped',
    //         'ciped',
    //         'diped',
    //         'eiped',
    //         'fiped',
    //         'giped',
    //         'hiped',
    //         'iyped',
    //         'jiped',
    //       ],
    //     ],
    //     [
    //       '2do',
    //       [
    //         'aiped',
    //         'biped',
    //         'ciped',
    //         'diped',
    //         'eiped',
    //         'fiped',
    //         'giped',
    //         'hiped',
    //         'iyped',
    //         'jiped',
    //       ],
    //     ],
    //     [
    //       '3do',
    //       [
    //         'deter',
    //         'diped',
    //         'eiped',
    //         'fiped',
    //         'giped',
    //         'hiped',
    //         'iyped',
    //         'jiped',
    //       ],
    //     ],
    //   ],
    //   summary: ['BSDEE', 'PATEE', 'DMREE'],
    // },
    // {
    //   grid: [
    //     ['1ac', 'BASED'],
    //     ['4ac', 'PLANT'],
    //     ['5ac', ['DEMUR']],
    //     [
    //       '1do',
    //       [
    //         'aiped',
    //         'biped',
    //         'ciped',
    //         'diped',
    //         'eiped',
    //         'fiped',
    //         'giped',
    //         'hiped',
    //         'iyped',
    //         'jiped',
    //       ],
    //     ],
    //     ['2do', ['SWARM']],
    //     ['3do', ['deter']],
    //   ],
    //   summary: ['BSDEE', 'PATEE', 'DMREE'],
    // },
    // {
    //   grid: [
    //     ['1ac', 'BASED'],
    //     ['4ac', 'PLANT'],
    //     ['5ac', ['DREAD']],
    //     ['1do', ['biped']],
    //     ['2do', ['STALE']],
    //     ['3do', ['dated', 'doted']],
    //   ],
    //   summary: ['BSD', 'PAT', 'DED'],
    // },
    // {
    //   grid: [
    //     ['1ac', 'BASED'],
    //     ['4ac', 'PLANT'],
    //     ['5ac', ['DEMUR']],
    //     [
    //       '1do',
    //       [
    //         'aiped',
    //         'biped',
    //         'ciped',
    //         'diped',
    //         'eiped',
    //         'fiped',
    //         'giped',
    //         'hiped',
    //         'iyped',
    //         'jiped',
    //       ],
    //     ],
    //     ['2do', ['SWARM']],
    //     [
    //       '3do',
    //       [
    //         'deter',
    //         'diped',
    //         'eiped',
    //         'fiped',
    //         'giped',
    //         'hiped',
    //         'iyped',
    //         'jiped',
    //       ],
    //     ],
    //   ],
    //   summary: ['BSDEE', 'PATEE', 'DMREE'],
    // },
    // {
    //   grid: [
    //     ['1ac', 'BASED'],
    //     ['4ac', 'PLANT'],
    //     ['5ac', ['DREAD']],
    //     ['1do', ['biped']],
    //     ['2do', ['STALE']],
    //     ['3do', ['dated', 'doted']],
    //   ],
    //   summary: ['BSD', 'PAT', 'DED'],
    // },
    // {
    //   grid: [
    //     ['1ac', 'BASED'],
    //     ['4ac', 'PLANT'],
    //     ['5ac', ['DREAM']],
    //     ['1do', ['biped']],
    //     ['2do', ['STALE']],
    //     ['3do', ['datum']],
    //   ],
    //   summary: ['BSD', 'PAT', 'DEM'],
    // },
    // {
    //   grid: [
    //     ['1ac', 'BASED'],
    //     ['4ac', 'PLANT'],
    //     ['5ac', ['DEMUR']],
    //     ['1do', ['biped']],
    //     ['2do', ['SWARM']],
    //     ['3do', ['deter']],
    //   ],
    //   summary: ['BSD', 'PAT', 'DMR'],
    // },
    // {
    //   grid: [
    //     ['1ac', 'BASED'],
    //     ['4ac', 'PLANT'],
    //     ['5ac', ['DREAD']],
    //     ['1do', ['biped']],
    //     ['2do', ['STALE']],
    //     ['3do', ['dated', 'doted']],
    //   ],
    //   summary: ['BSD', 'PAT', 'DED'],
    // },
    // {
    //   grid: [
    //     ['1ac', 'BASED'],
    //     ['4ac', 'PLANT'],
    //     ['5ac', ['DREAM']],
    //     ['1do', ['biped']],
    //     ['2do', ['STALE']],
    //     ['3do', ['datum']],
    //   ],
    //   summary: ['BSD', 'PAT', 'DEM'],
    // },
    // {
    //   grid: [
    //     ['1ac', 'BASED'],
    //     ['4ac', 'PLANT'],
    //     ['5ac', ['DEMUR']],
    //     ['1do', ['biped']],
    //     ['2do', ['SWARM']],
    //     ['3do', ['deter']],
    //   ],
    //   summary: ['BSD', 'PAT', 'DMR'],
    // },
    // {
    //   grid: [
    //     ['1ac', 'BASED'],
    //     ['4ac', 'PLANT'],
    //     ['5ac', ['DREAD']],
    //     ['1do', ['biped']],
    //     ['2do', ['STALE']],
    //     ['3do', ['dated', 'doted']],
    //   ],
    //   summary: ['BSD', 'PAT', 'DED'],
    // },
    // {
    //   grid: [
    //     ['1ac', 'BASED'],
    //     ['4ac', 'PLANT'],
    //     ['5ac', ['DREAM']],
    //     ['1do', ['biped']],
    //     ['2do', ['STALE']],
    //     ['3do', ['datum']],
    //   ],
    //   summary: ['BSD', 'PAT', 'DEM'],
    // },
  ];

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
    this.startButtonActive.value = false;
    setTimeout(this.checkIfFlexWrap, 0);
    if (!deactivateSocket) {
      this.socketService.setupSocketConnection(
        this.startButtonActive,
        this.results
      );
    }
  }

  devEvent() {
    this.socketService.verifyOff();
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
    if (code == 'mand-leng') {
      console.log('FAIL', code);
    } else if (code == 'desi-thre') {
      console.log('FAIL', code);
    } else if (code == 'desi-leng') {
      console.log('FAIL', code);
    } else if (code == 'desi-quot') {
      console.log('FAIL', code);
    }
  }

  socketEmit() {
    let form = this.makeCrosswordForm.value;
    let gridSpecs = {};

    gridSpecs['desirable_words_unfiltered'] = Util.makeDesiList(form);
    gridSpecs['threshold'] = parseInt(form['threshold']) || 0;
    let dimensions = form.shape.shapeName
      .split('x')
      .map((num) => parseInt(num));

    gridSpecs['mandatory_words'] = Util.normalizeArray(
      form['mandatory_words'].split(' ').filter((str) => str.length)
    );

    if (
      gridSpecs['mandatory_words'].some(
        (word) => !dimensions.includes(word.length)
      )
    ) {
      this.failedValidation('mand-leng');
      return;
    }

    if (!gridSpecs['desirable_words_unfiltered']) {
      this.failedValidation('desi-quot');
      return;
    } else if (
      gridSpecs['desirable_words_unfiltered'].length < gridSpecs['threshold']
    ) {
      this.failedValidation('desi-thre');
      return;
    } else if (
      gridSpecs['desirable_words_unfiltered'].some(
        (word) => !dimensions.includes(word.length)
      )
    ) {
      this.failedValidation('desi-leng');
      return;
    }

    gridSpecs['grid_width'] =
      Util.findModalLength(gridSpecs['mandatory_words']) ||
      dimensions.sort((a, b) => b - a)[0];
    dimensions.splice(dimensions.indexOf(gridSpecs['grid_width']), 1);
    gridSpecs['grid_height'] = dimensions[0];

    gridSpecs['banned_words'] = Util.normalizeArray(
      form['banned_words'].split(' ').filter((str) => str.length)
    );

    this.startButtonActive.value = true;
    gridSpecs['time'] = Date.now() / 1000;
    console.log('Emitting grid specs!', Date.now() / 1000 - 1593360000);

    console.log(gridSpecs);

    this.wipeResultState();

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
