import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { VeiculoService, VeiculoResponse } from '../../../public/services/veiculo.service';
import { AuthService } from '../../../public/services/auth.service';
import {ToastComponent, ToastService} from '../../../shared/message-component/message.component';

@Component({
  selector: 'app-veiculo-form',
  templateUrl: './veiculo-form.component.html',
  styleUrls: ['./veiculo-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastComponent]
})
export class VeiculoFormComponent implements OnInit, OnDestroy {
  veiculoForm: FormGroup;
  loading = false;
  isEditMode = false;
  veiculoId: number | null = null;

  marcas: string[] = [];
  cores: string[] = [];
  anos: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private veiculoService: VeiculoService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.veiculoForm = this.createForm();
    this.initializeOptions();
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.veiculoId = +params['id'];
        this.carregarVeiculo();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      placa: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/)]],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      ano: ['', Validators.required],
      cor: ['', Validators.required]
    });
  }

  private initializeOptions(): void {
    this.marcas = this.veiculoService.getMarcasVeiculos();
    this.cores = this.veiculoService.getCoresVeiculos();

    // Gerar anos (1980 até ano atual + 1)
    const anoAtual = new Date().getFullYear();
    this.anos = [];
    for (let ano = anoAtual + 1; ano >= 1980; ano--) {
      this.anos.push(ano.toString());
    }
  }

  private carregarVeiculo(): void {
    if (!this.veiculoId) return;

    this.loading = true;
    this.veiculoService.buscarPorId(this.veiculoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (veiculo) => {
          this.veiculoForm.patchValue({
            placa: veiculo.placa,
            marca: veiculo.marca,
            modelo: veiculo.modelo,
            ano: veiculo.ano,
            cor: veiculo.cor
          });
          this.loading = false;
        },
        error: (erro) => {
          this.loading = false;
          this.toastService.error('Erro', 'Não foi possível carregar os dados do veículo');
          this.voltar();
        }
      });
  }

  formatarPlaca(): void {
    const placaControl = this.veiculoForm.get('placa');
    if (placaControl?.value) {
      const placaFormatada = this.veiculoService.formatarPlaca(placaControl.value.toUpperCase());
      placaControl.setValue(placaFormatada.replace('-', ''));
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.veiculoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.veiculoForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.veiculoForm.value;

    const request = {
      placa: formData.placa,
      marca: formData.marca,
      modelo: formData.modelo,
      ano: formData.ano,
      cor: formData.cor
    };

    const operation = this.isEditMode
      ? this.veiculoService.atualizar(this.veiculoId!, request)
      : this.veiculoService.criar(request);

    operation.pipe(takeUntil(this.destroy$)).subscribe({
      next: (veiculo) => {
        this.loading = false;
        const mensagem = this.isEditMode ? 'Veículo atualizado com sucesso!' : 'Veículo cadastrado com sucesso!';
        this.toastService.success('Sucesso!', mensagem);

        setTimeout(() => {
          this.router.navigate(['/veiculos']);
        }, 1500);
      },
      error: (erro) => {
        this.loading = false;
        const mensagem = this.isEditMode ? 'Erro ao atualizar veículo' : 'Erro ao cadastrar veículo';
        this.toastService.error('Erro', mensagem);
      }
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.veiculoForm.controls).forEach(key => {
      this.veiculoForm.get(key)?.markAsTouched();
    });
  }

  voltar(): void {
    this.router.navigate(['/veiculos']);
  }
}
