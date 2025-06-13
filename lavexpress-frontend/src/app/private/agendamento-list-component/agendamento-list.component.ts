import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';


import {LavajatosService} from '../../services/lavajatos.service';
import {VeiculoService} from '../../services/services/veiculo.service';
import {AgendamentoResponse, AgendamentoService} from '../../services/services/agendamento.service';
import {ToastService} from '../../shared/message-component/message.component';

interface AgendamentoListItem {
  id: number;
  dataHorario: string;
  statusAgendamento: string;
  lavajatoNome: string;
  lavajatoImagem: string;
  veiculoInfo: string;
  servicoDescricao: string;
  servicoValor: number;
}

@Component({
  selector: 'app-agendamentos-list',
  templateUrl: './agendamento-list.component.html',
  styleUrls: ['./agendamento-list.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class AgendamentosListComponent implements OnInit {

  agendamentos: AgendamentoListItem[] = [];

  isLoading = true;
  hasError = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private agendamentoService: AgendamentoService,
    private lavajatosService: LavajatosService,
    private veiculoService: VeiculoService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAgendamentos();
  }

  loadAgendamentos(): void {
    this.isLoading = true;
    this.hasError = false;

    this.agendamentoService.listarAgendamentosUsuario()
      .subscribe({
        next: (agendamentos: AgendamentoResponse[]) => {
          console.log('Agendamentos carregados:', agendamentos);
          this.processAgendamentos(agendamentos);
        },
        error: (error) => {
          console.error('Erro ao carregar agendamentos:', error);
          this.handleError('Não foi possível carregar seus agendamentos.');
        }
      });
  }

  processAgendamentos(agendamentos: AgendamentoResponse[]): void {
    if (agendamentos.length === 0) {
      this.agendamentos = [];
      this.isLoading = false;
      return;
    }

    const promises = agendamentos.map(agendamento => this.enrichAgendamento(agendamento));

    Promise.all(promises)
      .then((enrichedAgendamentos) => {
        this.agendamentos = enrichedAgendamentos
          .sort((a, b) => new Date(b.dataHorario).getTime() - new Date(a.dataHorario).getTime());
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Erro ao processar agendamentos:', error);
        this.handleError('Erro ao processar dados dos agendamentos.');
      });
  }

  async enrichAgendamento(agendamento: AgendamentoResponse): Promise<AgendamentoListItem> {
    try {
      const [lavajato, veiculo, servico] = await Promise.all([
        this.getLavajatoInfo(agendamento.lavaJatoId),
        this.getVeiculoInfo(agendamento.veiculoId),
        this.getServicoInfo(agendamento.servicoId)
      ]);

      return {
        id: agendamento.id,
        dataHorario: agendamento.dataHorario,
        statusAgendamento: agendamento.statusAgendamento,
        lavajatoNome: lavajato.nome,
        lavajatoImagem: lavajato.imagem,
        veiculoInfo: veiculo.info,
        servicoDescricao: servico.descricao,
        servicoValor: servico.valor
      };
    } catch (error) {
      console.error('Erro ao enriquecer agendamento:', error);
      return {
        id: agendamento.id,
        dataHorario: agendamento.dataHorario,
        statusAgendamento: agendamento.statusAgendamento,
        lavajatoNome: 'Lavajato não encontrado',
        lavajatoImagem: 'assets/images/lavajato-default.jpg',
        veiculoInfo: 'Veículo não encontrado',
        servicoDescricao: 'Serviço não encontrado',
        servicoValor: 0
      };
    }
  }

  getLavajatoInfo(lavajatoId: number): Promise<{nome: string, imagem: string}> {
    return new Promise((resolve, reject) => {
      this.lavajatosService.getLavajatoById(lavajatoId)
        .subscribe({
          next: (lavajato: any) => {
            resolve({
              nome: lavajato.nome,
              imagem: lavajato.photoPath || 'assets/images/lavajato-default.jpg'
            });
          },
          error: (error) => reject(error)
        });
    });
  }

  getVeiculoInfo(veiculoId: number): Promise<{info: string}> {
    return new Promise((resolve, reject) => {
      this.veiculoService.buscarPorId(veiculoId)
        .subscribe({
          next: (veiculo: any) => {
            resolve({
              info: `${veiculo.marca} ${veiculo.modelo} - ${veiculo.placa}`
            });
          },
          error: (error) => reject(error)
        });
    });
  }

  getServicoInfo(servicoId: number): Promise<{descricao: string, valor: number}> {
    return new Promise((resolve, reject) => {
      // Como não temos um método direto, vamos simular ou você pode implementar
      // Por enquanto, vou retornar dados mock
      resolve({
        descricao: 'Serviço de lavagem',
        valor: 50.00
      });
    });
  }

  private handleError(message: string): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = message;
    this.toastService.error('Erro', message);
  }

  verDetalhes(agendamento: AgendamentoListItem): void {
    this.router.navigate(['/agendamento', agendamento.id]);
  }

  novoAgendamento(): void {
    this.router.navigate(['/inicio']);
  }

  onRefresh(): void {
    this.loadAgendamentos();
  }

  formatarDataHora(dataHora: string): string {
    if (!dataHora) return '';

    const data = new Date(dataHora);
    const agora = new Date();
    const amanha = new Date(agora);
    amanha.setDate(amanha.getDate() + 1);

    const isToday = data.toDateString() === agora.toDateString();
    const isTomorrow = data.toDateString() === amanha.toDateString();

    if (isToday) {
      return `Hoje às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isTomorrow) {
      return `Amanhã às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  formatarPreco(preco: number): string {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  getStatusColor(status: string): string {
    return this.agendamentoService.getStatusColor(status);
  }

  getStatusLabel(status: string): string {
    return this.agendamentoService.getStatusLabel(status);
  }

  getStatusIcon(status: string): string {
    const icons = {
      'AGENDADO': 'pi pi-calendar',
      'SERVICO_EM_ANDAMENTO': 'pi pi-cog',
      'FINALIZADO': 'pi pi-check-circle',
      'CANCELADO': 'pi pi-times-circle'
    };
    return icons[status as keyof typeof icons] || 'pi-calendar';
  }

  isAgendamentoAtivo(status: string): boolean {
    return status === 'AGENDADO' || status === 'SERVICO_EM_ANDAMENTO';
  }

  trackByAgendamentoId(index: number, agendamento: AgendamentoListItem): number {
    return agendamento.id;
  }
}
