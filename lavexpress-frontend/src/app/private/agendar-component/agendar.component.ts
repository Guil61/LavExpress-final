import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LavajatosService } from '../../services/lavajatos.service';
import { ServicosService, Servico } from '../../services/services/servicos.service';
import { VeiculoService, VeiculoResponse } from '../../services/services/veiculo.service';
import { AgendamentoService } from '../../services/services/agendamento.service';
import {ToastComponent, ToastService} from '../../shared/message-component/message.component';
import { ConfirmModalComponent } from '../../shared/confirm-dialog-component/confirm-modal.component';

@Component({
  selector: 'app-agendar',
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, ConfirmModalComponent, ToastComponent]
})
export class AgendarComponent implements OnInit {

  agendamentoForm: FormGroup;

  lavajato: any = null;
  lavaJatoId: number = 0;
  servicoIdSelecionado: number = 0;

  servicos: Servico[] = [];
  veiculos: VeiculoResponse[] = [];

  isLoading = true;
  hasError = false;
  errorMessage = '';

  step = 1;
  maxSteps = 3;

  showConfirmModal = false;
  isConfirming = false;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private lavajatosService: LavajatosService,
    private servicosService: ServicosService,
    private veiculoService: VeiculoService,
    private agendamentoService: AgendamentoService,
    private toastService: ToastService
  ) {
    this.agendamentoForm = this.formBuilder.group({
      servicoId: ['', [Validators.required]],
      veiculoId: ['', [Validators.required]],
      dataHorario: ['', [Validators.required]],
      observacoes: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.lavaJatoId = +params['lavajatoId'] || 0;
      this.servicoIdSelecionado = +params['servicoId'] || 0;

      if (this.lavaJatoId) {
        this.loadInitialData();
      } else {
        this.handleError('Lavajato não informado');
      }
    });

    this.setupFormValidators();
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.hasError = false;

    Promise.all([
      this.loadLavajatoDetails(),
      this.loadServicos(),
      this.loadVeiculos()
    ]).then(() => {
      if (this.servicoIdSelecionado) {
        this.agendamentoForm.patchValue({ servicoId: this.servicoIdSelecionado });
      }
      this.isLoading = false;
    }).catch((error) => {
      console.error('Erro ao carregar dados iniciais:', error);
      this.handleError('Erro ao carregar dados. Tente novamente.');
    });
  }

  loadLavajatoDetails(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.lavajatosService.getLavajatoById(this.lavaJatoId)
        .subscribe({
          next: (response: any) => {
            this.lavajato = {
              id: response.id,
              nome: response.nome,
              endereco: response.endereco,
              telefone: response.telefone,
              imagem: response.photoPath || 'assets/images/lavajato-default.jpg'
            };
            resolve();
          },
          error: (error) => reject(error)
        });
    });
  }

  loadServicos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.servicosService.getServicosPorLavajato(this.lavaJatoId)
        .subscribe({
          next: (servicos: Servico[]) => {
            this.servicos = servicos;
            resolve();
          },
          error: (error: any) => reject(error)
        });
    });
  }

  loadVeiculos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.veiculoService.listarVeiculos()
        .subscribe({
          next: (veiculos: VeiculoResponse[]) => {
            this.veiculos = veiculos;
            resolve();
          },
          error: (error: any) => reject(error)
        });
    });
  }

  setupFormValidators(): void {
    this.agendamentoForm.get('dataHorario')?.setValidators([
      Validators.required,
      this.dataFuturaValidator.bind(this)
    ]);
  }

  dataFuturaValidator(control: any) {
    if (!control.value) return null;

    const agora = new Date();
    const dataAgendamento = new Date(control.value);

    if (dataAgendamento <= agora) {
      return { dataPassada: true };
    }

    return null;
  }

  nextStep(): void {
    if (this.step < this.maxSteps) {
      this.step++;
    }
  }

  prevStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  goToStep(step: number): void {
    this.step = step;
  }

  onSubmit(): void {
    if (this.agendamentoForm.invalid) {
      this.markFormGroupTouched();
      this.toastService.warning('Atenção', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    this.showConfirmModal = true;
  }

  onConfirmAgendamento(): void {
    this.isConfirming = true;

    const formData = this.agendamentoForm.value;
    const agendamento = {
      dataHorario: formData.dataHorario,
      servicoId: formData.servicoId,
      veiculoId: formData.veiculoId,
      lavaJatoId: this.lavaJatoId
    };

    console.log('Agendamento a ser criado:', agendamento);

    this.agendamentoService.criarAgendamento(agendamento)
      .subscribe({
        next: (response) => {
          console.log('Agendamento criado com sucesso:', response);
          this.isConfirming = false;
          this.showConfirmModal = false;

          this.toastService.success(
            'Agendamento Confirmado!',
            'Seu agendamento foi criado com sucesso.'
          );

          setTimeout(() => {
            this.router.navigate(['/agendamento', response.id]);
          }, 2000);
        },
        error: (error) => {
          console.error('Erro ao criar agendamento:', error);
          this.isConfirming = false;
          this.showConfirmModal = false;

          this.toastService.error(
            'Erro no Agendamento',
            'Não foi possível criar o agendamento. Tente novamente.'
          );
        }
      });
  }

  onCancelConfirmation(): void {
    this.showConfirmModal = false;
    this.isConfirming = false;
  }

  markFormGroupTouched(): void {
    Object.keys(this.agendamentoForm.controls).forEach(key => {
      const control = this.agendamentoForm.get(key);
      control?.markAsTouched();
    });
  }

  private handleError(message: string): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = message;
    this.toastService.error('Erro', message);
  }

  goBack(): void {
    this.router.navigate(['/lavajato', this.lavaJatoId]);
  }

  getServicoById(id: number): Servico | undefined {
    return this.servicos.find(s => s.id === id);
  }

  getVeiculoById(id: number): VeiculoResponse | undefined {
    return this.veiculos.find(v => v.id === id);
  }

  formatarPreco(preco: number): string {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  formatarVeiculo(veiculo: VeiculoResponse): string {
    return `${veiculo.marca} ${veiculo.modelo} - ${veiculo.placa}`;
  }

  formatarDataHora(dataHora: string): string {
    if (!dataHora) return '';

    const data = new Date(dataHora);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getMinDateTime(): string {
    const agora = new Date();
    agora.setHours(agora.getHours() + 1);
    return agora.toISOString().slice(0, 16);
  }

  isStepValid(stepNumber: number): boolean {
    switch (stepNumber) {
      case 1:
        return !!this.agendamentoForm.get('servicoId')?.value;
      case 2:
        return !!this.agendamentoForm.get('veiculoId')?.value;
      case 3:
        return !!this.agendamentoForm.get('dataHorario')?.value;
      default:
        return false;
    }
  }

  getConfirmationMessage(): string {
    const servico = this.getServicoById(this.agendamentoForm.get('servicoId')?.value);
    const veiculo = this.getVeiculoById(this.agendamentoForm.get('veiculoId')?.value);
    const dataHora = this.formatarDataHora(this.agendamentoForm.get('dataHorario')?.value);

    return `Confirmar agendamento de "${servico?.descricao}" para o veículo ${veiculo?.marca} ${veiculo?.modelo} no dia ${dataHora}?`;
  }
}
