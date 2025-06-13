import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class BottomNavigationComponent implements OnInit {

  currentRoute: string = '';

  navItems = [
    {
      route: '/inicio',
      icon: 'pi-home',
      label: 'Início',
      key: 'home'
    },
    {
      route: '/veiculos',
      icon: 'pi-car',
      label: 'Meus veículos',
      key: 'search'
    },
    {
      route: '/agendamentos',
      icon: 'pi-calendar',
      label: 'Agendamentos',
      key: 'appointments'
    },
    {
      route: '/profile',
      icon: 'pi-user',
      label: 'Perfil',
      key: 'profile'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
    this.currentRoute = this.router.url;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }
}
