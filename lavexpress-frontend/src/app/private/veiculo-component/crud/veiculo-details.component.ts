import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { VeiculoService, VeiculoResponse } from '../../../services/services/veiculo.service';
import { AuthService } from '../../../services/services/auth.service';
import {ToastComponent, ToastService} from '../../../shared/message-component/message.component';
import {ConfirmModalComponent} from '../../../shared/confirm-dialog-component/confirm-modal.component';

@Component({
  selector: 'app-veiculo-details',
  templateUrl: './veiculo-details.component.html',
  styleUrls: ['./veiculo-details.component.scss'],
  standalone: true,
  imports: [CommonModule, ToastComponent, ConfirmModalComponent]
})
export class VeiculoDetailsComponent implements OnInit, OnDestroy {
  veiculo: VeiculoResponse | null = null;
  loading = false;
  error = false;
  errorMessage = '';
  veiculoId: number | null = null;

  // Controle do modal de confirmação
  showConfirmModal = false;
  confirmModalTitle = '';
  confirmModalMessage = '';
  confirmModalLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private veiculoService: VeiculoService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.veiculoId = +params['id'];
        this.carregarVeiculo();
      } else {
        this.router.navigate(['/veiculos']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private carregarVeiculo(): void {
    if (!this.veiculoId) return;

    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    this.veiculoService.buscarPorId(this.veiculoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (veiculo) => {
          this.veiculo = veiculo;
          this.loading = false;
        },
        error: (erro) => {
          this.error = true;
          this.errorMessage = erro;
          this.loading = false;
          this.toastService.error('Erro', 'Não foi possível carregar os detalhes do veículo');
        }
      });
  }

  formatarPlaca(placa: string): string {
    return this.veiculoService.formatarPlaca(placa);
  }

  getCorHex(cor: string): string {
    const coresMap: { [key: string]: string } = {
      'Azul': '#3b82f6',
      'Bege': '#d4a574',
      'Branco': '#f8fafc',
      'Cinza': '#6b7280',
      'Dourado': '#fbbf24',
      'Laranja': '#f97316',
      'Marrom': '#8b4513',
      'Prata': '#c0c0c0',
      'Preto': '#1f2937',
      'Rosa': '#ec4899',
      'Roxo': '#8b5cf6',
      'Verde': '#10b981',
      'Vermelho': '#ef4444',
      'Outras': '#64748b'
    };
    return coresMap[cor] || '#64748b';
  }

  editarVeiculo(): void {
    this.router.navigate(['/veiculos', this.veiculoId, 'editar']);
  }

  agendarVeiculo(): void {
    this.router.navigate(['/inicio'], {
    });
  }

  confirmarExclusao(): void {
    if (!this.veiculo) return;

    this.confirmModalTitle = 'Confirmar Exclusão';
    this.confirmModalMessage = `Tem certeza que deseja excluir o veículo ${this.veiculo.marca} ${this.veiculo.modelo} com placa ${this.veiculo.placa}?`;
    this.showConfirmModal = true;
  }

  onConfirmExclusao(): void {
    if (!this.veiculoId) return;

    this.confirmModalLoading = true;

    this.veiculoService.deletar(this.veiculoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.confirmModalLoading = false;
          this.showConfirmModal = false;

          const nomeVeiculo = this.veiculo ? `${this.veiculo.marca} ${this.veiculo.modelo}` : 'Veículo';
          this.toastService.success('Sucesso!', `${nomeVeiculo} foi excluído com sucesso`);

          setTimeout(() => {
            this.router.navigate(['/veiculos']);
          }, 1500);
        },
        error: (erro) => {
          this.confirmModalLoading = false;
          this.toastService.error('Erro', 'Não foi possível excluir o veículo');
        }
      });
  }

  onCancelExclusao(): void {
    this.showConfirmModal = false;
    this.confirmModalLoading = false;
  }

  recarregar(): void {
    this.carregarVeiculo();
  }

  voltar(): void {
    this.router.navigate(['/veiculos']);
  }
}
