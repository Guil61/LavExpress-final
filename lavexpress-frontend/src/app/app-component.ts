// app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {BottomNavigationComponent} from './private/bottom-navigation-component/bottom-navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, BottomNavigationComponent],
  templateUrl: './app-component.html',
  styleUrls: ['./app-component.scss']
})
export class AppComponent implements OnInit {
  title = 'lavexpress-frontend';
  showBottomNav = false;

  private privateRoutes = [
    '/inicio',
    '/busca',
    '/agendamentos',
    '/perfil',
    '/lavajato-detalhes',
    '/agendar'
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkShowBottomNav(event.url);
      });

    this.checkShowBottomNav(this.router.url);
  }

  private checkShowBottomNav(url: string): void {
    this.showBottomNav = this.privateRoutes.some(route =>
      url === route || url.startsWith(route + '/')
    );
  }
}
