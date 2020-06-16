import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-make',
  templateUrl: './make.component.html',
  styleUrls: ['./make.component.css'],
})
export class MakeComponent implements OnInit {
  sayHello() {
    console.log('hello lionel');
  }

  onlyShowResultBox = false; // dev switch

  makeCrosswordForm = this.fb.group({
    shape: this.fb.group({
      shapeName: ['5x5'],
    }),
    mand: [''],
    forb: [''],
    desi: [''],
    desiSeparator: [' '],
    desiThreshold: [''],
  });
  constructor(private fb: FormBuilder) {}

  onSubmit() {
    console.log('onSubmit fxn');
    // console.dir(this.makeCrosswordForm.value);
    console.log(`ooo${this.makeCrosswordForm.value.desiSeparator}ooo`);
  }

  startButtonActive = false;

  updateDesiPlaceholderText(sepName) {
    // console.log(this.makeCrosswordForm.controls.desiSeparator.value);

    const ref = {
      space: 'eg spoke azure',
      marks: 'eg "SPOKE" part of a wheel. "azure" - Shade of blue.',
    };

    this.desiPlaceholderText = ref[sepName];

    // this.desiPlaceholderText =
    //   this.makeCrosswordForm.controls.desiSeparator.value === ' '
    //     ? 'spaaace'
    //     : 'marrrks';
  }

  desiPlaceholderText = 'eg parts reset';

  justStop() {
    this.startButtonActive = false;
  }

  startStop() {
    if (this.startButtonActive) {
      //tell server to stop
    } else {
      //format words and send to server
    }
    this.startButtonActive = !this.startButtonActive;
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

  resultsIndex = 0;
  results = [
    {
      grid: [
        [
          '1ac',
          [
            'aiped',
            'biped',
            'ciped',
            'diped',
            'eiped',
            'fiped',
            'giped',
            'hiped',
            'iyped',
            'jiped',
          ],
        ],
        [
          '4ac',
          [
            'aiped',
            'biped',
            'ciped',
            'diped',
            'eiped',
            'fiped',
            'giped',
            'hiped',
            'iyped',
            'jiped',
          ],
        ],
        [
          '5ac',
          [
            'aiped',
            'biped',
            'ciped',
            'diped',
            'eiped',
            'fiped',
            'giped',
            'hiped',
            'iyped',
            'jiped',
          ],
        ],
        [
          '0do',
          [
            'deter',
            'diped',
            'eiped',
            'fiped',
            'giped',
            'hiped',
            'iyped',
            'jiped',
          ],
        ],
        [
          '0do',
          [
            'deter',
            'diped',
            'eiped',
            'fiped',
            'giped',
            'hiped',
            'iyped',
            'jiped',
          ],
        ],
        [
          '1do',
          [
            'aiped',
            'biped',
            'ciped',
            'diped',
            'eiped',
            'fiped',
            'giped',
            'hiped',
            'iyped',
            'jiped',
          ],
        ],
        [
          '2do',
          [
            'aiped',
            'biped',
            'ciped',
            'diped',
            'eiped',
            'fiped',
            'giped',
            'hiped',
            'iyped',
            'jiped',
          ],
        ],
        [
          '3do',
          [
            'deter',
            'diped',
            'eiped',
            'fiped',
            'giped',
            'hiped',
            'iyped',
            'jiped',
          ],
        ],
      ],
      summary: ['BSDEE', 'PATEE', 'DMREE'],
    },
    {
      grid: [
        ['1ac', 'BASED'],
        ['4ac', 'PLANT'],
        ['5ac', ['DEMUR']],
        [
          '1do',
          [
            'aiped',
            'biped',
            'ciped',
            'diped',
            'eiped',
            'fiped',
            'giped',
            'hiped',
            'iyped',
            'jiped',
          ],
        ],
        ['2do', ['SWARM']],
        ['3do', ['deter']],
      ],
      summary: ['BSDEE', 'PATEE', 'DMREE'],
    },
    {
      grid: [
        ['1ac', 'BASED'],
        ['4ac', 'PLANT'],
        ['5ac', ['DREAD']],
        ['1do', ['biped']],
        ['2do', ['STALE']],
        ['3do', ['dated', 'doted']],
      ],
      summary: ['BSD', 'PAT', 'DED'],
    },
    {
      grid: [
        ['1ac', 'BASED'],
        ['4ac', 'PLANT'],
        ['5ac', ['DEMUR']],
        [
          '1do',
          [
            'aiped',
            'biped',
            'ciped',
            'diped',
            'eiped',
            'fiped',
            'giped',
            'hiped',
            'iyped',
            'jiped',
          ],
        ],
        ['2do', ['SWARM']],
        [
          '3do',
          [
            'deter',
            'diped',
            'eiped',
            'fiped',
            'giped',
            'hiped',
            'iyped',
            'jiped',
          ],
        ],
      ],
      summary: ['BSDEE', 'PATEE', 'DMREE'],
    },

    {
      grid: [
        ['1ac', 'BASED'],
        ['4ac', 'PLANT'],
        ['5ac', ['DREAD']],
        ['1do', ['biped']],
        ['2do', ['STALE']],
        ['3do', ['dated', 'doted']],
      ],
      summary: ['BSD', 'PAT', 'DED'],
    },
    {
      grid: [
        ['1ac', 'BASED'],
        ['4ac', 'PLANT'],
        ['5ac', ['DREAM']],
        ['1do', ['biped']],
        ['2do', ['STALE']],
        ['3do', ['datum']],
      ],
      summary: ['BSD', 'PAT', 'DEM'],
    },
    {
      grid: [
        ['1ac', 'BASED'],
        ['4ac', 'PLANT'],
        ['5ac', ['DEMUR']],
        ['1do', ['biped']],
        ['2do', ['SWARM']],
        ['3do', ['deter']],
      ],
      summary: ['BSD', 'PAT', 'DMR'],
    },
    {
      grid: [
        ['1ac', 'BASED'],
        ['4ac', 'PLANT'],
        ['5ac', ['DREAD']],
        ['1do', ['biped']],
        ['2do', ['STALE']],
        ['3do', ['dated', 'doted']],
      ],
      summary: ['BSD', 'PAT', 'DED'],
    },
    {
      grid: [
        ['1ac', 'BASED'],
        ['4ac', 'PLANT'],
        ['5ac', ['DREAM']],
        ['1do', ['biped']],
        ['2do', ['STALE']],
        ['3do', ['datum']],
      ],
      summary: ['BSD', 'PAT', 'DEM'],
    },
    {
      grid: [
        ['1ac', 'BASED'],
        ['4ac', 'PLANT'],
        ['5ac', ['DEMUR']],
        ['1do', ['biped']],
        ['2do', ['SWARM']],
        ['3do', ['deter']],
      ],
      summary: ['BSD', 'PAT', 'DMR'],
    },
    {
      grid: [
        ['1ac', 'BASED'],
        ['4ac', 'PLANT'],
        ['5ac', ['DREAD']],
        ['1do', ['biped']],
        ['2do', ['STALE']],
        ['3do', ['dated', 'doted']],
      ],
      summary: ['BSD', 'PAT', 'DED'],
    },
    {
      grid: [
        ['1ac', 'BASED'],
        ['4ac', 'PLANT'],
        ['5ac', ['DREAM']],
        ['1do', ['biped']],
        ['2do', ['STALE']],
        ['3do', ['datum']],
      ],
      summary: ['BSD', 'PAT', 'DEM'],
    },
  ];

  ngOnInit(): void {
    this.startButtonActive = false;
    setTimeout(this.checkIfFlexWrap, 0);
  }

  formChanged() {
    if (this.startButtonActive) {
      this.justStop();
    }
  }

  onResize(e) {
    this.checkIfFlexWrap();
  }

  checkIfFlexWrap() {
    // let boxes = { box1: {}, box2: {}, box3: {}, box4: {} };
    // Object.keys(boxes).forEach(
    //   (key) => (boxes[key] = document.getElementById(key))
    // );

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

  gridLayout = 'two rows';

  onChanges(): void {
    this.makeCrosswordForm.valueChanges.subscribe((val) => {
      console.log(val);
    });
  }
}
