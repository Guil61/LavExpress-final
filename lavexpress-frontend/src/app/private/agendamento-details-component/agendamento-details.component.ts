import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {LavajatosService} from '../../services/lavajatos.service';
import {Servico, ServicosService} from '../../services/services/servicos.service';
import {VeiculoResponse, VeiculoService} from '../../services/services/veiculo.service';
import {AgendamentoResponse, AgendamentoService} from '../../services/services/agendamento.service';
import {ToastComponent, ToastService} from '../../shared/message-component/message.component';
import {ConfirmModalComponent} from '../../shared/confirm-dialog-component/confirm-modal.component';

@Component({
  selector: 'app-agendamento-details',
  templateUrl: './agendamento-details.component.html',
  styleUrls: ['./agendamento-details.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, ConfirmModalComponent, ToastComponent]
})
export class AgendamentoDetailsComponent implements OnInit {

  agendamento: AgendamentoResponse | null = null;
  agendamentoId: number = 0;

  lavajato: any = null;
  veiculo: VeiculoResponse | null = null;
  servico: Servico | null = null;

  isLoading = true;
  hasError = false;
  errorMessage = '';

  showCancelModal = false;
  isCanceling = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private agendamentoService: AgendamentoService,
    private lavajatosService: LavajatosService,
    private veiculoService: VeiculoService,
    private servicosService: ServicosService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.agendamentoId = +params['id'];
      if (this.agendamentoId) {
        this.loadAgendamentoDetails();
      } else {
        this.handleError('Agendamento não informado');
      }
    });
  }

  loadAgendamentoDetails(): void {
    this.isLoading = true;
    this.hasError = false;

    this.agendamentoService.buscarPorId(this.agendamentoId)
      .subscribe({
        next: (agendamento: AgendamentoResponse) => {
          this.agendamento = agendamento;
          this.loadRelatedData();
        },
        error: (error) => {
          console.error('Erro ao carregar agendamento:', error);
          this.handleError('Não foi possível carregar os detalhes do agendamento.');
        }
      });
  }

  loadRelatedData(): void {
    if (!this.agendamento) return;

    Promise.all([
      this.loadLavajato(),
      this.loadVeiculo(),
      this.loadServico()
    ]).then(() => {
      this.isLoading = false;
    }).catch((error) => {
      console.error('Erro ao carregar dados relacionados:', error);
      this.isLoading = false;
    });
  }

  loadLavajato(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.agendamento) {
        reject('Agendamento não encontrado');
        return;
      }

      this.lavajatosService.getLavajatoById(this.agendamento.lavaJatoId)
        .subscribe({
          next: (response: any) => {
            this.lavajato = {
              id: response.id,
              nome: response.nome,
              endereco: response.endereco,
              telefone: response.telefone,
              email: response.email,
              imagem: response.photoPath || 'assets/images/lavajato-default.jpg'
            };
            resolve();
          },
          error: (error) => reject(error)
        });
    });
  }

  loadVeiculo(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.agendamento) {
        reject('Agendamento não encontrado');
        return;
      }

      this.veiculoService.buscarPorId(this.agendamento.veiculoId)
        .subscribe({
          next: (veiculo: VeiculoResponse) => {
            this.veiculo = veiculo;
            resolve();
          },
          error: (error) => reject(error)
        });
    });
  }

  loadServico(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.agendamento) {
        reject('Agendamento não encontrado');
        return;
      }

      this.servicosService.getServicoPorId(this.agendamento.servicoId)
        .subscribe({
          next: (servico: Servico) => {
            this.servico = servico;
            resolve();
          },
          error: (error) => reject(error)
        });
    });
  }

  private handleError(message: string): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = message;
    this.toastService.error('Erro', message);
  }

  goBack(): void {
    this.router.navigate(['/agendamentos']);
  }

  editarAgendamento(): void {
    this.toastService.error(
      'Funcionalidade ainda não implementada!',
      'Aguarde por atualizações.'
    );
  }

  confirmarCancelamento(): void {
    this.showCancelModal = true;
  }

  cancelarAgendamento(): void {
    if (!this.agendamento) return;

    this.isCanceling = true;

    this.agendamentoService.atualizarStatus(this.agendamento.id, 'CANCELADO')
      .subscribe({
        next: (response) => {
          this.agendamento = response;
          this.isCanceling = false;
          this.showCancelModal = false;

          this.toastService.success(
            'Agendamento Cancelado',
            'Seu agendamento foi cancelado com sucesso.'
          );
        },
        error: (error) => {
          console.error('Erro ao cancelar agendamento:', error);
          this.isCanceling = false;
          this.showCancelModal = false;

          this.toastService.error(
            'Erro ao Cancelar',
            'Não foi possível cancelar o agendamento. Tente novamente.'
          );
        }
      });
  }

  onCancelConfirmation(): void {
    this.showCancelModal = false;
    this.isCanceling = false;
  }

  ligarLavajato(): void {
    if (this.lavajato?.telefone) {
      window.open(`tel:${this.lavajato.telefone}`, '_self');
    }
  }

  emailLavajato(): void {
    if (this.lavajato?.email) {
      window.open(`mailto:${this.lavajato.email}`, '_self');
    }
  }

  abrirMapa(): void {
    if (this.lavajato?.endereco) {
      const enderecoEncoded = encodeURIComponent(this.lavajato.endereco);
      window.open(`https://maps.google.com/maps?q=${enderecoEncoded}`, '_blank');
    }
  }

  formatarDataHora(dataHora: string): string {
    if (!dataHora) return '';

    const data = new Date(dataHora);
    return data.toLocaleString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatarPreco(preco: number): string {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  formatarVeiculo(): string {
    if (!this.veiculo) return '';
    return `${this.veiculo.marca} ${this.veiculo.modelo} (${this.veiculo.ano})`;
  }

  getStatusColor(): string {
    if (!this.agendamento) return '#7F8C8D';
    return this.agendamentoService.getStatusColor(this.agendamento.statusAgendamento);
  }

  getStatusLabel(): string {
    if (!this.agendamento) return '';
    return this.agendamentoService.getStatusLabel(this.agendamento.statusAgendamento);
  }

  canCancelAgendamento(): boolean {
    if (!this.agendamento) return false;
    return this.agendamento.statusAgendamento === 'AGENDADO';
  }

  canEditAgendamento(): boolean {
    if (!this.agendamento) return false;
    return this.agendamento.statusAgendamento === 'AGENDADO';
  }
}
