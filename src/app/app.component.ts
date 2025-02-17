import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SW-Info';
  showNavbar = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateNavbarVisibility();
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('URL Atual:', event.url);
      this.updateNavbarVisibility();
    });
  }

  private updateNavbarVisibility() {
    const currentUrl = this.router.url;
    this.showNavbar = !(currentUrl.includes('pagina-nao-encontrada') || currentUrl.includes('filmes/') || currentUrl.includes('nave-detalhe/'));
    console.log('showNavbar:', this.showNavbar);
  }
}