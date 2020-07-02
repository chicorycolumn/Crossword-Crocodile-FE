import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css'],
})
export class LearnComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  slideToElement(id) {
    setTimeout(() => {
      // let el = document.getElementById(id);
      // el.scrollTop += 5000;
      // el.scrollIntoView({
      //   behavior: 'smooth',
      // });
      const yOffset = -50;
      const element = document.getElementById(id);
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, 100);
  }
}
