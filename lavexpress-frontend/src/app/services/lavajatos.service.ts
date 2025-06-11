import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interface atualizada para corresponder ao backend
export interface Lavajato {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  cnpj: string;
  latLong: string;
  proprietarioId: number;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  status: string;
  tipos: string[];
  photoPath?: string;
}

// Interface para os filtros
export interface LavajatoFilter {
  avaliacao: number;
  latLong: string;
}

// Interface para paginação
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LavajatosService {

  private readonly API_URL = 'http://localhost:8090/lava-jato';

  constructor(private http: HttpClient) { }

  /**
   * Lista todos os lava-jatos com paginação
   */
  getLavajatos(page: number = 0, size: number = 10, sortBy?: string): Observable<PageResponse<Lavajato>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }

    return this.http.get<PageResponse<Lavajato>>(`${this.API_URL}`, { params })
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar lava-jatos:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Busca lava-jatos por nome
   */
  buscarPorNome(nome: string, page: number = 0, size: number = 10): Observable<PageResponse<Lavajato>> {
    let params = new HttpParams()
      .set('nome', nome)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<Lavajato>>(`${this.API_URL}/buscar`, { params })
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar por nome:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Aplica filtros de avaliação e/ou localização
   */
  filtrarLavajatos(filter: LavajatoFilter, page: number = 0, size: number = 10): Observable<PageResponse<Lavajato>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.post<PageResponse<Lavajato>>(`${this.API_URL}/filtrar`, filter, { params })
      .pipe(
        catchError(error => {
          console.error('Erro ao filtrar lava-jatos:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Busca lava-jatos próximos a uma localização
   */
  buscarProximos(latLong: string, raio?: number): Observable<Lavajato[]> {
    let params = new HttpParams().set('latLong', latLong);

    if (raio) {
      params = params.set('raio', raio.toString());
    }

    return this.http.get<Lavajato[]>(`${this.API_URL}/proximos`, { params })
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar próximos:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Busca lava-jato por ID
   */
  getLavajatoById(id: number): Observable<Lavajato> {
    return this.http.get<Lavajato>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar lava-jato por ID:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Testa se a API está funcionando
   */
  testarConexao(): Observable<string> {
    return this.http.get(`${this.API_URL}/health`, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Erro ao testar conexão:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtém localização do usuário (usando geolocalização do navegador)
   */
  obterLocalizacaoUsuario(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            resolve(`${lat},${lng}`);
          },
          (error) => {
            console.error('Erro ao obter localização:', error);
            // Coordenadas padrão de Brasília
            resolve('-15.7942,-47.8825');
          }
        );
      } else {
        console.error('Geolocalização não suportada');
        // Coordenadas padrão de Brasília
        resolve('-15.7942,-47.8825');
      }
    });
  }
}
