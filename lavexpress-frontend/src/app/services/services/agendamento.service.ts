import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface AgendamentoRequest {
  dataHorario: string;
  servicoId: number;
  veiculoId: number;
  usuarioId: number;
  lavaJatoId: number;
  statusAgendamento?: string;
}

export interface AgendamentoResponse {
  id: number;
  dataHorario: string;
  statusAgendamento: string;
  servicoId: number;
  veiculoId: number;
  lavaJatoId: number;
  usuarioId: number;
  servicoDescricao?: string;
  servicoValor?: number;
  veiculoModelo?: string;
  veiculoPlaca?: string;
  lavajatoNome?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {

  private readonly API_URL = 'http://localhost:8090/agendamento';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  criarAgendamento(agendamento: Omit<AgendamentoRequest, 'statusAgendamento' | 'usuarioId'>): Observable<AgendamentoResponse> {
    const usuario = this.authService.getCurrentUser();

    if (!usuario) {
      return throwError(() => 'Usuário não está logado');
    }

    const agendamentoCompleto = {
      dataHorario: agendamento.dataHorario,
      servicoId: agendamento.servicoId,
      veiculoId: agendamento.veiculoId,
      lavaJatoId: agendamento.lavaJatoId,
      usuarioId: usuario.id,
      statusAgendamento: 'AGENDADO'
    };

    console.log('Dados sendo enviados para API:', agendamentoCompleto);

    return this.http.post<AgendamentoResponse>(`${this.API_URL}/new`, agendamentoCompleto)
      .pipe(
        catchError(this.handleError)
      );
  }

  buscarPorId(id: number): Observable<AgendamentoResponse> {
    return this.http.get<AgendamentoResponse>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  listarAgendamentosUsuario(): Observable<AgendamentoResponse[]> {
    const usuario = this.authService.getCurrentUser();

    if (!usuario) {
      return throwError(() => 'Usuário não está logado');
    }

    return this.http.get<AgendamentoResponse[]>(`${this.API_URL}/usuario/${usuario.id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  listarAgendamentosPorUsuario(usuarioId: number): Observable<AgendamentoResponse[]> {
    return this.http.get<AgendamentoResponse[]>(`${this.API_URL}/usuario/${usuarioId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  listarAgendamentosPorVeiculo(veiculoId: number): Observable<AgendamentoResponse[]> {
    return this.http.get<AgendamentoResponse[]>(`${this.API_URL}/veiculo/${veiculoId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  listarAgendamentosPorLavajato(lavajatoId: number): Observable<AgendamentoResponse[]> {
    return this.http.get<AgendamentoResponse[]>(`${this.API_URL}/lavajato/${lavajatoId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  atualizarAgendamento(id: number, agendamento: Partial<AgendamentoRequest>): Observable<AgendamentoResponse> {
    return this.http.put<AgendamentoResponse>(`${this.API_URL}/${id}`, agendamento)
      .pipe(
        catchError(this.handleError)
      );
  }

  atualizarStatus(id: number, status: string): Observable<AgendamentoResponse> {
    return this.http.put<AgendamentoResponse>(`${this.API_URL}/${id}`, { statusAgendamento: status })
      .pipe(
        catchError(this.handleError)
      );
  }

  cancelarAgendamento(id: number): Observable<string> {
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
          errorMessage = 'Dados inválidos para o agendamento';
          break;
        case 401:
          errorMessage = 'Usuário não autorizado';
          break;
        case 404:
          errorMessage = 'Agendamento não encontrado';
          break;
        case 409:
          errorMessage = 'Conflito de horário - já existe agendamento neste horário';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }

    console.error('Erro na API de agendamento:', error);
    return throwError(() => errorMessage);
  }

  formatarDataHorario(data: Date): string {
    return data.toISOString().slice(0, 16);
  }

  validarDataHorario(dataHorario: string): boolean {
    const agora = new Date();
    const dataAgendamento = new Date(dataHorario);

    return dataAgendamento > agora;
  }

  getStatusDisponiveis(): { value: string; label: string }[] {
    return [
      { value: 'AGENDADO', label: 'Agendamento confirmado' },
      { value: 'SERVICO_EM_ANDAMENTO', label: 'Serviço em andamento' },
      { value: 'FINALIZADO', label: 'Serviço finalizado' },
      { value: 'CANCELADO', label: 'Agendamento cancelado' }
    ];
  }

  getStatusLabel(status: string): string {
    const statusMap = {
      'AGENDADO': 'Agendamento confirmado',
      'SERVICO_EM_ANDAMENTO': 'Serviço em andamento',
      'FINALIZADO': 'Serviço finalizado',
      'CANCELADO': 'Agendamento cancelado'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  }

  getStatusColor(status: string): string {
    const colorMap = {
      'AGENDADO': '#4A90E2',
      'SERVICO_EM_ANDAMENTO': '#F39C12',
      'FINALIZADO': '#27AE60',
      'CANCELADO': '#E74C3C'
    };
    return colorMap[status as keyof typeof colorMap] || '#7F8C8D';
  }
}
