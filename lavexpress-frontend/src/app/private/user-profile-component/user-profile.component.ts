import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ToastComponent, ToastService } from '../../shared/message-component/message.component';
import { ConfirmModalComponent } from '../../shared/confirm-dialog-component/confirm-modal.component';
import { AuthService } from '../../public/services/auth.service';
import { UserService, ProfileUpdateRequest, PasswordChangeRequest } from '../../public/services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastComponent,
    ConfirmModalComponent
  ]
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  profileForm: FormGroup;

  editingBasicInfo = false;
  editingPassword = false;
  uploadingImage = false;
  savingBasicInfo = false;
  savingPassword = false;

  userProfile: any = null;
  profileImage = '';
  showDefaultAvatar = true;

  showConfirmModal = false;
  confirmModalTitle = '';
  confirmModalMessage = '';
  confirmModalLoading = false;
  confirmAction: (() => void) | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadUserData();

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.updateUserData(user);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nome: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      telefone: [{ value: '', disabled: true }, [Validators.pattern(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/)]],
      senhaAtual: [{ value: '', disabled: true }, Validators.required],
      novaSenha: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(6)]],
      confirmarSenha: [{ value: '', disabled: true }, Validators.required]
    });
  }

  private loadUserData(): void {
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.updateUserData(user);
        },
        error: (error) => {
          this.toastService.error('Erro', 'Não foi possível carregar os dados do usuário');
        }
      });
  }

  private updateUserData(user: any): void {
    this.userProfile = user;
    this.profileForm.patchValue({
      nome: user.nome,
      email: user.email,
      telefone: user.telefone || ''
    });

    if (user.photoPath) {
      this.profileImage = user.photoPath;
      this.showDefaultAvatar = false;
    } else {
      this.profileImage = '';
      this.showDefaultAvatar = true;
    }
  }

  triggerFileUpload(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        this.toastService.error('Erro', 'Selecione apenas arquivos de imagem');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.toastService.error('Erro', 'A imagem deve ter no máximo 5MB');
        return;
      }

      this.uploadImage(file);
    }
  }

  private uploadImage(file: File): void {
    this.uploadingImage = true;

    this.userService.uploadProfileImage(file)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.profileImage = response.photoPath || '';
          this.showDefaultAvatar = false;
          this.uploadingImage = false;
          this.toastService.success('Sucesso!', 'Foto atualizada com sucesso');
        },
        error: (error) => {
          this.uploadingImage = false;
          this.toastService.error('Erro', error || 'Erro ao enviar imagem');
        }
      });
  }

  removePhoto(): void {
    this.confirmModalTitle = 'Remover Foto';
    this.confirmModalMessage = 'Tem certeza que deseja remover sua foto de perfil?';
    this.confirmAction = () => this.executeRemovePhoto();
    this.showConfirmModal = true;
  }

  private executeRemovePhoto(): void {
    this.confirmModalLoading = true;

    this.userService.removeProfileImage()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.profileImage = '';
          this.showDefaultAvatar = true;
          this.confirmModalLoading = false;
          this.showConfirmModal = false;
          this.toastService.success('Sucesso!', 'Foto removida com sucesso');
        },
        error: (error) => {
          this.confirmModalLoading = false;
          this.showConfirmModal = false;
          this.toastService.error('Erro', error || 'Erro ao remover foto');
        }
      });
  }

  toggleBasicInfoEdit(): void {
    this.editingBasicInfo = !this.editingBasicInfo;

    if (this.editingBasicInfo) {
      this.profileForm.get('nome')?.enable();
      this.profileForm.get('email')?.enable();
      this.profileForm.get('telefone')?.enable();
    } else {
      this.profileForm.get('nome')?.disable();
      this.profileForm.get('email')?.disable();
      this.profileForm.get('telefone')?.disable();
      this.loadUserData();
    }
  }

  saveBasicInfo(): void {
    if (this.profileForm.get('nome')?.invalid || this.profileForm.get('email')?.invalid) {
      this.markBasicFieldsAsTouched();
      return;
    }

    this.savingBasicInfo = true;
    const formData = this.profileForm.value;

    const updateData: ProfileUpdateRequest = {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone
    };

    this.userService.updateProfile(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.savingBasicInfo = false;
          this.editingBasicInfo = false;

          this.profileForm.get('nome')?.disable();
          this.profileForm.get('email')?.disable();
          this.profileForm.get('telefone')?.disable();

          this.toastService.success('Sucesso!', 'Por segurança, faça o login novamente. ');

          setTimeout(() => {
            this.authService.logout();
          }, 2000);

        },
        error: (error) => {
          this.savingBasicInfo = false;
          this.toastService.error('Erro', error || 'Erro ao atualizar informações');
        }
      });
  }

  private markBasicFieldsAsTouched(): void {
    this.profileForm.get('nome')?.markAsTouched();
    this.profileForm.get('email')?.markAsTouched();
    this.profileForm.get('telefone')?.markAsTouched();
  }

  togglePasswordEdit(): void {
    this.editingPassword = !this.editingPassword;

    if (this.editingPassword) {
      this.profileForm.get('senhaAtual')?.enable();
      this.profileForm.get('novaSenha')?.enable();
      this.profileForm.get('confirmarSenha')?.enable();
      this.profileForm.patchValue({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      });
    } else {
      this.profileForm.get('senhaAtual')?.disable();
      this.profileForm.get('novaSenha')?.disable();
      this.profileForm.get('confirmarSenha')?.disable();
      this.profileForm.patchValue({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      });
    }
  }

  savePassword(): void {
    if (this.passwordFormInvalid()) {
      this.markPasswordFieldsAsTouched();
      return;
    }

    this.savingPassword = true;

    const passwordData: PasswordChangeRequest = {
      senhaAtual: this.profileForm.get('senhaAtual')?.value,
      novaSenha: this.profileForm.get('novaSenha')?.value
    };

    this.userService.changePassword(passwordData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.savingPassword = false;
          this.editingPassword = false;

          this.profileForm.get('senhaAtual')?.disable();
          this.profileForm.get('novaSenha')?.disable();
          this.profileForm.get('confirmarSenha')?.disable();

          this.profileForm.patchValue({
            senhaAtual: '',
            novaSenha: '',
            confirmarSenha: ''
          });

          this.toastService.success('Sucesso!', 'Por segurança, faça o login novamente. ');

          setTimeout(() => {
            this.authService.logout();
          }, 2000);
        },
        error: (error) => {
          this.savingPassword = false;
          this.toastService.error('Erro', error || 'Erro ao alterar senha');
        }
      });
  }

  passwordFormInvalid(): boolean {
    const senhaAtual = this.profileForm.get('senhaAtual')?.value;
    const novaSenha = this.profileForm.get('novaSenha')?.value;
    const confirmarSenha = this.profileForm.get('confirmarSenha')?.value;

    return !senhaAtual ||
      !novaSenha ||
      novaSenha.length < 6 ||
      novaSenha !== confirmarSenha;
  }

  get passwordMismatch(): boolean {
    const novaSenha = this.profileForm.get('novaSenha')?.value;
    const confirmarSenha = this.profileForm.get('confirmarSenha')?.value;
    const confirmarSenhaTouched = this.profileForm.get('confirmarSenha')?.touched;

    return novaSenha !== confirmarSenha && (confirmarSenhaTouched ?? false);
  }

  private markPasswordFieldsAsTouched(): void {
    this.profileForm.get('senhaAtual')?.markAsTouched();
    this.profileForm.get('novaSenha')?.markAsTouched();
    this.profileForm.get('confirmarSenha')?.markAsTouched();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onConfirmAction(): void {
    if (this.confirmAction) {
      this.confirmAction();
    }
  }

  onCancelConfirm(): void {
    this.showConfirmModal = false;
    this.confirmAction = null;
    this.confirmModalLoading = false;
  }

  onImageError(): void {
    this.showDefaultAvatar = true;
  }

  get userName(): string {
    return this.userProfile?.nome || 'Usuário';
  }

  get userInitials(): string {
    if (!this.userProfile?.nome) return 'U';
    return this.userProfile.nome
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  voltar(){
    this.router.navigate(['/inicio']);
  }
  sair() {
    this.authService.logout()
  }


  formatTelefone(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      this.profileForm.patchValue({ telefone: value });
    }
  }
}
