import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

export interface CadastroRequest {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
  tipoUsuario: 'CLIENTE' | 'FUNCIONARIO';
  photoPath?: string;
}

@Component({
  selector: 'app-registro-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro-component.html',
  styleUrl: './registro-component.scss'
})
export class RegistroComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  cadastroForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  uploadingImage = false;
  profileImagePreview: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      tipoUsuario: ['CLIENTE', [Validators.required]],
      photoPath: ['']
    }, { validators: this.passwordMatchValidator });

    // Limpar mensagem de erro quando o usuário modificar qualquer campo
    this.cadastroForm.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });
  }

  // Validador customizado para confirmar senha
  passwordMatchValidator(form: FormGroup) {
    const senha = form.get('senha');
    const confirmarSenha = form.get('confirmarSenha');

    if (senha && confirmarSenha && senha.value !== confirmarSenha.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Formatação automática do CPF
  formatCPF(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      this.cadastroForm.patchValue({ cpf: value });
    }
  }

  // Formatação automática do telefone
  formatTelefone(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      this.cadastroForm.patchValue({ telefone: value });
    }
  }

  // Seleção de arquivo de imagem
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validar se é imagem
      if (!file.type.includes('image/')) {
        this.errorMessage = 'Por favor, selecione apenas arquivos de imagem.';
        this.clearErrorAfterDelay();
        return;
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'O tamanho máximo permitido é 5MB.';
        this.clearErrorAfterDelay();
        return;
      }

      // Validar tipos permitidos
      const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!tiposPermitidos.includes(file.type.toLowerCase())) {
        this.errorMessage = 'Tipo de arquivo não suportado. Use apenas JPG ou PNG.';
        this.clearErrorAfterDelay();
        return;
      }

      this.selectedFile = file;
      this.processImagePreview(file);
    }
  }

  // Processar preview da imagem
  private processImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        this.profileImagePreview = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  // Remover foto selecionada
  removeSelectedPhoto(): void {
    this.selectedFile = null;
    this.profileImagePreview = null;
    this.cadastroForm.patchValue({ photoPath: '' });
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error('Erro ao converter arquivo'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  }

  private clearErrorAfterDelay(): void {
    setTimeout(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    }, 5000);
  }

  clearError(): void {
    this.errorMessage = '';
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.uploadingImage = false;

      this.processRegistration();
    } else {
      this.markFormGroupTouched();
      this.isLoading = false;
      this.uploadingImage = false;
    }
  }

  private async processRegistration(): Promise<void> {
    try {
      let photoBase64 = '';

      if (this.selectedFile) {
        this.uploadingImage = true;
        photoBase64 = await this.convertFileToBase64(this.selectedFile);
      }

      const cadastroData: CadastroRequest = {
        nome: this.cadastroForm.value.nome,
        email: this.cadastroForm.value.email,
        senha: this.cadastroForm.value.senha,
        cpf: this.cadastroForm.value.cpf,
        telefone: this.cadastroForm.value.telefone,
        tipoUsuario: this.cadastroForm.value.tipoUsuario,
        photoPath: photoBase64 || undefined
      };

      this.authService.register(cadastroData).subscribe({
        next: (response) => {
          console.log('Cadastro realizado com sucesso:', response);
          this.router.navigate(['/inicio']);
        },
        error: (error) => {
          console.error('Erro no cadastro:', error);
          this.errorMessage = error.error?.message || 'Erro ao realizar cadastro. Tente novamente.';
          this.isLoading = false
        },
        complete: () => {
          this.isLoading = false;
          this.uploadingImage = false;
        }
      });

    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      this.errorMessage = 'Erro ao processar imagem. Tente novamente.';
      this.isLoading = false;
      this.uploadingImage = false;
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.cadastroForm.controls).forEach(key => {
      const control = this.cadastroForm.get(key);
      control?.markAsTouched();
    });
  }

  // Métodos auxiliares para validação no template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.cadastroForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.cadastroForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} é obrigatório`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return `${this.getFieldLabel(fieldName)} está em formato inválido`;
    }

    if (fieldName === 'confirmarSenha' && this.cadastroForm.errors?.['passwordMismatch']) {
      return 'As senhas não coincidem';
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nome: 'Nome',
      email: 'Email',
      senha: 'Senha',
      confirmarSenha: 'Confirmação de senha',
      cpf: 'CPF',
      telefone: 'Telefone',
      tipoUsuario: 'Tipo de usuário'
    };
    return labels[fieldName] || fieldName;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
