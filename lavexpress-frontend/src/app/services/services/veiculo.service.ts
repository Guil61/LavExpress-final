import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface VeiculoRequest {
  placa: string;
  modelo: string;
  ano: string;
  marca: string;
  cor?: string;
  usuarioId: number;
}

export interface VeiculoResponse {
  id: number;
  placa: string;
  cor: string;
  modelo: string;
  ano: string;
  marca: string;
  usuarioId: number;
}

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {

  private readonly API_URL = 'http://localhost:8090/veiculo';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Lista todos os veículos do usuário logado
   */
  listarVeiculos(): Observable<VeiculoResponse[]> {
    const usuario = this.authService.getCurrentUser();

    if (!usuario) {
      return throwError(() => 'Usuário não está logado');
    }

    return this.http.get<VeiculoResponse[]>(`${this.API_URL}/usuario/${usuario.id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Lista veículos de um usuário específico
   */
  listarVeiculosPorUsuario(usuarioId: number): Observable<VeiculoResponse[]> {
    return this.http.get<VeiculoResponse[]>(`${this.API_URL}/usuario/${usuarioId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  buscarPorId(id: number): Observable<VeiculoResponse> {
    return this.http.get<VeiculoResponse>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  criar(veiculo: Omit<VeiculoRequest, 'usuarioId'>): Observable<VeiculoResponse> {
    const usuario = this.authService.getCurrentUser();

    if (!usuario) {
      return throwError(() => 'Usuário não está logado');
    }

    const veiculoCompleto: VeiculoRequest = {
      ...veiculo,
      usuarioId: usuario.id
    };

    return this.http.post<VeiculoResponse>(`${this.API_URL}/new`, veiculoCompleto)
      .pipe(
        catchError(this.handleError)
      );
  }

  atualizar(id: number, veiculo: Omit<VeiculoRequest, 'usuarioId'>): Observable<VeiculoResponse> {
    const usuario = this.authService.getCurrentUser();

    if (!usuario) {
      return throwError(() => 'Usuário não está logado');
    }

    const veiculoCompleto: VeiculoRequest = {
      ...veiculo,
      usuarioId: usuario.id
    };

    return this.http.put<VeiculoResponse>(`${this.API_URL}/${id}`, veiculoCompleto)
      .pipe(
        catchError(this.handleError)
      );
  }

  deletar(id: number): Observable<string> {
    return this.http.delete(`${this.API_URL}/${id}`, { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Dados inválidos enviados';
          break;
        case 401:
          errorMessage = 'Usuário não autorizado';
          break;
        case 404:
          errorMessage = 'Veículo não encontrado';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }

    console.error('Erro na API:', error);
    return throwError(() => errorMessage);
  }

  validarPlaca(placa: string): boolean {
    const regexPlaca = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/; // Formato Mercosul
    const regexPlacaAntiga = /^[A-Z]{3}[0-9]{4}$/; // Formato antigo
    return regexPlaca.test(placa) || regexPlacaAntiga.test(placa);
  }

  formatarPlaca(placa: string): string {
    const apenasLetrasNumeros = placa.replace(/[^A-Z0-9]/g, '');
    if (apenasLetrasNumeros.length === 7) {
      return `${apenasLetrasNumeros.slice(0, 3)}-${apenasLetrasNumeros.slice(3)}`;
    }
    return placa;
  }

  getMarcasVeiculos(): string[] {
    return [
      'Audi', 'BMW', 'Chevrolet', 'Citroën', 'Fiat', 'Ford', 'Honda',
      'Hyundai', 'Jeep', 'Kia', 'Mercedes-Benz', 'Mitsubishi', 'Nissan',
      'Peugeot', 'Renault', 'Toyota', 'Volkswagen', 'Volvo', 'Yamaha', 'Outras'
    ].sort();
  }

  getCoresVeiculos(): string[] {
    return [
      'Azul', 'Bege', 'Branco', 'Cinza', 'Dourado', 'Laranja',
      'Marrom', 'Prata', 'Preto', 'Rosa', 'Roxo', 'Verde', 'Vermelho', 'Outras'
    ].sort();
  }
}
