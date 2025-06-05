import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  token: string;
}

export interface ApiError {
  message: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8090/auth'; // Ajuste conforme sua API
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkExistingToken();
  }


  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, loginData)
      .pipe(
        tap(response => {
          this.setAuthData(response);
        }),
        catchError(error => {
          console.error('Erro no login:', error);
          throw error;
        })
      );
  }


  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }


  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }


  getToken(): string | null {
    return this.getCookie('auth_token');
  }


  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }


  verificarToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return new Observable(observer => observer.next(false));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<boolean>(`${this.API_URL}/verificar`, { headers })
      .pipe(
        tap(isValid => {
          if (!isValid) {
            this.logout();
          }
        }),
        catchError(error => {
          console.error('Erro ao verificar token:', error);
          this.logout();
          throw error;
        })
      );
  }


  private setAuthData(response: AuthResponse): void {
    this.setCookie('auth_token', response.token, 1);

    localStorage.setItem('current_user', JSON.stringify({
      id: response.id,
      nome: response.nome,
      email: response.email,
      telefone: response.telefone
    }));

    this.currentUserSubject.next(response);
  }


  private clearAuthData(): void {
    this.deleteCookie('auth_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }


  private checkExistingToken(): void {
    const token = this.getToken();
    const userData = localStorage.getItem('current_user');

    if (token && userData && !this.isTokenExpired(token)) {
      const user = JSON.parse(userData);
      this.currentUserSubject.next({
        ...user,
        token: token
      });
    } else {
      this.clearAuthData();
    }
  }


  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (error) {
      return true;
    }
  }


  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  }


  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }


  private deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
}
