import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  /**
   * Cria o formulário reativo
   */
  private createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Getters para facilitar acesso aos campos
   */
  get email() { return this.loginForm.get('email'); }
  get senha() { return this.loginForm.get('senha'); }

  /**
   * Realiza o login
   */
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginData = this.loginForm.value;

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login realizado com sucesso:', response);
        this.isLoading = false;
        this.router.navigate(['/inicio']);
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage = 'Email ou senha incorretos';
        } else if (error.status === 0) {
          this.errorMessage = 'Erro de conexão. Tente novamente.';
        } else {
          this.errorMessage = 'Erro interno. Tente novamente mais tarde.';
        }
      }
    });
  }

  /**
   * Navega para a tela de cadastro
   */
  goToRegister(): void {
    this.router.navigate(['/registro']);
  }

  /**
   * Limpa mensagem de erro
   */
  clearError(): void {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  /**
   * Marca todos os campos como tocados para mostrar erros
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Verifica se um campo tem erro específico
   */
  hasError(field: string, error: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  /**
   * Retorna mensagem de erro para um campo
   */
  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);

    if (control?.hasError('required')) {
      return `${field === 'email' ? 'Email' : 'Senha'} é obrigatório`;
    }

    if (control?.hasError('email')) {
      return 'Email inválido';
    }

    if (control?.hasError('minlength')) {
      return 'Senha deve ter pelo menos 6 caracteres';
    }

    return '';
  }
}
