import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  // Rotas públicas
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

  // Rotas privadas
  {
    path: 'inicio',
    loadComponent: () => import('./private/inicio-component/inicio-component').then(c => c.InicioComponent),
    canActivate: [AuthGuard]
  },

  // Veículos
  {
    path: 'veiculos',
    loadComponent: () => import('./private/veiculo-component/list/veiculo-list.component').then(c => c.VeiculoListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'veiculos/novo',
    loadComponent: () => import('./private/veiculo-component/crud/veiculo-form.component').then(c => c.VeiculoFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'veiculos/:id',
    loadComponent: () => import('./private/veiculo-component/crud/veiculo-details.component').then(c => c.VeiculoDetailsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'veiculos/:id/editar',
    loadComponent: () => import('./private/veiculo-component/crud/veiculo-form.component').then(c => c.VeiculoFormComponent),
    canActivate: [AuthGuard]
  },

  // Lavajatos
  {
    path: 'lavajato/:id',
    loadComponent: () => import('./private/lava-jato-details-component/lava-jato.details.component').then(c => c.LavajatoDetailsComponent),
    canActivate: [AuthGuard]
  },


  // agendar

  {
    path: 'agendar',
    loadComponent: () => import('./private/agendar-component/agendar.component').then(c => c.AgendarComponent),
    canActivate: [AuthGuard]
  },

  //agendamento

  {
    path: 'agendamento/:id',
    loadComponent: () => import('./private/agendamento-details-component/agendamento-details.component').then(c => c.AgendamentoDetailsComponent),
    canActivate: [AuthGuard]
  },

  //agendamento list

  {
    path: 'agendamentos',
    loadComponent: () => import('./private/agendamento-list-component/agendamento-list.component').then(c => c.AgendamentosListComponent),
    canActivate: [AuthGuard]
  },

  // User profile
  {
    path: 'profile',
    loadComponent: () => import('./private/user-profile-component/user-profile.component').then(c => c.UserProfileComponent),
    canActivate: [AuthGuard]
  },

  // Rota padrão (404)
  {
    path: '**',
    redirectTo: ''
  }
];
