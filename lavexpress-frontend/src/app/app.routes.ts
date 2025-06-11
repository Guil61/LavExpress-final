import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./public/landing/landing-component').then(c => c.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./public/login/login-component').then(c => c.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./public/registro/registro-component').then(c => c.RegistroComponent)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./private/inicio-component/inicio-component').then(c => c.InicioComponent),
    canActivate: [AuthGuard] // 👈 Protege a rota
  },
  {
    path: 'lavajato/:id',
    loadComponent: () => import('./private/lava-jato-detail-component/lava-jato-detail-component').then(m => m.LavajatoDetailComponent),
    canActivate: [AuthGuard]

  },
  { path: '**', redirectTo: '' }
];
