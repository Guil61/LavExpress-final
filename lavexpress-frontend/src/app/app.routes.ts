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
    path: 'lavajatos',
    loadComponent: () => import('./public/lavajatos-list/lavajatos-list.component').then(c => c.LavajatosListComponent)
  },
  {
    path: 'lavajato/:id',
    loadComponent: () => import('./public/lavajato-detail/lavajato-detail.component').then(m => m.LavajatoDetailComponent)
  },

  {
    path: 'inicio',
    loadComponent: () => import('./private/inicio-component/inicio-component').then(c => c.InicioComponent),
    canActivate: [AuthGuard] // 👈 Protege a rota
  },
  { path: '**', redirectTo: '' }
];
