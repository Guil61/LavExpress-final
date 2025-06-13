import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, NgClass, CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { VeiculoService, VeiculoResponse } from '../../../public/services/veiculo.service';
import { AuthService } from '../../../public/services/auth.service';
import {ConfirmModalComponent} from '../../../shared/confirm-dialog-component/confirm-modal.component';
import {ToastComponent, ToastService} from '../../../shared/message-component/message.component';

@Component({
  selector: 'app-veiculo-list',
  templateUrl: './veiculo-list.component.html',
  styleUrls: ['./veiculo-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ConfirmModalComponent,
    ToastComponent
  ]
})
export class VeiculoListComponent implements OnInit, OnDestroy {
  veiculosList: VeiculoResponse[] = [];
  loading = false;
  error = false;
  errorMessage = '';

  // Controle do modal de confirmação
  showConfirmModal = false;
  confirmModalTitle = '';
  confirmModalMessage = '';
  confirmModalLoading = false;
  veiculoParaExcluir: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private veiculoService: VeiculoService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.carregarVeiculos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private carregarVeiculos(): void {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    this.veiculoService.listarVeiculos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (veiculos) => {
          this.veiculosList = veiculos;
          this.loading = false;
        },
        error: (erro) => {
          this.error = true;
          this.errorMessage = erro;
          this.loading = false;
          this.toastService.error('Erro', 'Não foi possível carregar os veículos');
        }
      });
  }

  voltar(): void {
    this.router.navigate(['/inicio']);
  }

  novoVeiculo(): void {
    this.router.navigate(['/veiculos/novo']);
  }

  verDetalhes(veiculoId: number): void {
    this.router.navigate(['/veiculos', veiculoId]);
  }

  editarVeiculo(veiculoId: number): void {
    this.router.navigate(['/veiculos', veiculoId, 'editar']);
  }

  agendarVeiculo(veiculoId: number): void {
    this.router.navigate(['/inicio'], {
    });
  }

  confirmarExclusao(veiculoId: number): void {
    const veiculo = this.veiculosList.find(v => v.id === veiculoId);

    if (!veiculo) {
      this.toastService.error('Erro', 'Veículo não encontrado');
      return;
    }

    this.veiculoParaExcluir = veiculoId;
    this.confirmModalTitle = 'Confirmar Exclusão';
    this.confirmModalMessage = `Tem certeza que deseja excluir o veículo ${veiculo.marca} ${veiculo.modelo} com placa ${veiculo.placa}?`;
    this.showConfirmModal = true;
  }

  onConfirmExclusao(): void {
    if (this.veiculoParaExcluir) {
      this.excluirVeiculo(this.veiculoParaExcluir);
    }
  }

  onCancelExclusao(): void {
    this.showConfirmModal = false;
    this.veiculoParaExcluir = null;
    this.confirmModalLoading = false;
  }

  private excluirVeiculo(veiculoId: number): void {
    const veiculo = this.veiculosList.find(v => v.id === veiculoId);
    this.confirmModalLoading = true;

    this.veiculoService.deletar(veiculoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.veiculosList = this.veiculosList.filter(v => v.id !== veiculoId);
          this.confirmModalLoading = false;
          this.showConfirmModal = false;
          this.veiculoParaExcluir = null;

          const nomeVeiculo = veiculo ? `${veiculo.marca} ${veiculo.modelo}` : 'Veículo';
          this.toastService.success('Sucesso!', `${nomeVeiculo} foi excluído com sucesso`);
        },
        error: (erro) => {
          this.confirmModalLoading = false;
          this.toastService.error('Erro', 'Não foi possível excluir o veículo');
          console.error('Erro ao excluir veículo:', erro);
        }
      });
  }

  recarregar(): void {
    this.carregarVeiculos();
  }

  /**
   * Método para obter informações do usuário logado
   */
  get usuarioLogado() {
    return this.authService.getCurrentUser();
  }
}
