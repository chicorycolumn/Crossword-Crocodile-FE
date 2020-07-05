import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router) {}

  // currentPage = Router.url;

  currentUrl = '/make';

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if (val['url']) {
        this.currentUrl = val['url'];
      }
    });

    setTimeout(() => {
      this.currentUrl = this.router.url;
    }, 1);
  }
}
