import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-make',
  templateUrl: './make.component.html',
  styleUrls: ['./make.component.css'],
})
export class MakeComponent implements OnInit {
  fruit = 'APPLES!!!';

  makeCrosswordForm = this.fb.group({
    mand: [''],
    forb: [''],
    desi: [''],
    shape: this.fb.group({
      shapeName: [''],
    }),
  });
  constructor(private fb: FormBuilder) {}

  onSubmit() {
    console.dir(this.makeCrosswordForm.value);
  }

  results = [
    ['1ac', 'BASED'],
    ['4ac', 'PLANT'],
    ['5ac', ['DEMUR']],
    [
      '11 down',
      [
        'biped',
        'biped',
        'biped',
        'biped',
        'biped',
        'biped',
        'biped',
        'biped',
        'biped',
        'biped',
        'biped',
        'biped',
        'biped',
      ],
    ],
    ['2do', ['SWARM']],
    ['3do', ['deter', 'deter', 'deter', 'deter', 'deter', 'deter', 'deter']],
  ];

  heroes = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado'];

  ngOnInit(): void {}
}
