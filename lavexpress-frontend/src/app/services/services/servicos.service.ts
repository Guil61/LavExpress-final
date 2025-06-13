import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Servico {
  id: number;
  descricao: string;
  valor: number;
  lavajatoId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServicosService {

  private readonly API_URL = 'http://localhost:8090/servicos';

  constructor(private http: HttpClient) { }

  getServicosPorLavajato(lavajatoId: number): Observable<Servico[]> {
    return this.http.get<Servico[]>(`${this.API_URL}/lavajato/${lavajatoId}`)
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar serviços do lavajato:', error);
          return throwError(() => error);
        })
      );
  }

  getServicoPorId(id: number): Observable<Servico> {
    return this.http.get<Servico>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar serviço por ID:', error);
          return throwError(() => error);
        })
      );
  }
}
