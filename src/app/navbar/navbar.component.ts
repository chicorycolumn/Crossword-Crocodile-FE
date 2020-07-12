import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router) {}

  currentUrl = '/make';
  logoRotate = { value: true };
  selectedElements = {};
  isMobile = false;

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if (val['url']) {
        this.currentUrl = val['url'];
      }
    });

    setTimeout(() => {
      this.currentUrl = this.router.url;
    }, 1);

    let mobileWidth = 450;
    if (
      window.matchMedia(`only screen and (max-width: ${mobileWidth}px)`).matches
    ) {
      this.isMobile = true;
    }
  }

  makeElementSelected(id, bool) {
    this.selectedElements[id] = bool;

    if (this.selectedElements['logo']) {
      this.logoRotate.value = false;
      setTimeout(() => {
        this.logoRotate.value = true;
      }, 500);
    }
  }
}
