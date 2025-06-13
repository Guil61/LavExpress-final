import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthResponse, AuthService } from './auth.service';

export interface ProfileUpdateRequest {
  nome: string;
  email: string;
  telefone: string;
}

export interface PasswordChangeRequest {
  senhaAtual: string;
  novaSenha: string;
}

export interface PhotoUploadRequest {
  photoPath: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:8090/auth';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  updateProfile(data: ProfileUpdateRequest): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.API_URL}/profile`, data, { headers: this.getAuthHeaders() })
      .pipe(
        tap(response => {
          this.authService.updateCurrentUser(response);
        }),
        catchError(error => {
          console.error('Erro ao atualizar perfil:', error);
          return throwError(error.error?.message || 'Erro ao atualizar perfil');
        })
      );
  }

  changePassword(data: PasswordChangeRequest): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/password`, data, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(error => {
          console.error('Erro ao alterar senha:', error);
          return throwError(error.error?.message || 'Erro ao alterar senha');
        })
      );
  }

  uploadProfileImage(file: File): Observable<AuthResponse> {
    const reader = new FileReader();
    return new Observable<AuthResponse>(observer => {
      reader.onload = () => {
        const base64String = reader.result as string;
        const request: PhotoUploadRequest = { photoPath: base64String };
        this.http.put<AuthResponse>(`${this.API_URL}/profile/photo`, request, { headers: this.getAuthHeaders() })
          .pipe(
            tap(response => {
              this.authService.updateCurrentUser(response);
            }),
            catchError(error => {
              console.error('Erro ao fazer upload da imagem:', error);
              return throwError(error.error?.message || 'Erro ao fazer upload da imagem');
            })
          )
          .subscribe({
            next: response => {
              observer.next(response);
              observer.complete();
            },
            error: err => observer.error(err)
          });
      };
      reader.onerror = () => observer.error('Erro ao ler o arquivo');
      reader.readAsDataURL(file);
    });
  }

  removeProfileImage(): Observable<AuthResponse> {
    return this.http.delete<AuthResponse>(`${this.API_URL}/profile/photo`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(response => {
          this.authService.updateCurrentUser(response);
        }),
        catchError(error => {
          console.error('Erro ao remover imagem:', error);
          return throwError(error.error?.message || 'Erro ao remover imagem');
        })
      );
  }

  getCurrentUser(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.API_URL}/profile`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(response => {
          this.authService.updateCurrentUser(response);
        }),
        catchError(error => {
          console.error('Erro ao obter usuário:', error);
          return throwError(error.error?.message || 'Erro ao obter usuário');
        })
      );
  }
}
