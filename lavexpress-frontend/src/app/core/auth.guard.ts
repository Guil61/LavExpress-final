import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../public/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('🚨 AuthGuard.canActivate() FOI CHAMADO!');

    const isAuth = this.authService.isAuthenticated();
    console.log('🔍 isAuthenticated():', isAuth);

    if (isAuth) {
      console.log('✅ Usuário autenticado, acesso liberado');
      return true;
    } else {
      console.log('❌ Usuário não autenticado, redirecionando...');
      this.router.navigate(['/']);
      return false;
    }
  }
}
