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
  }

  formChanged() {
    if (this.startButtonActive) {
      this.justStop();
    }
  }

  onChanges(): void {
    this.makeCrosswordForm.valueChanges.subscribe((val) => {
      console.log(val);
    });
  }
}
