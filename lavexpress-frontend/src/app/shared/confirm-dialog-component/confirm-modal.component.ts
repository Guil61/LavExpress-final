import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" [class.show]="isVisible" (click)="onOverlayClick()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-icon">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <h3 class="modal-title">{{ title }}</h3>
        </div>

        <div class="modal-body">
          <p class="modal-message">{{ message }}</p>
        </div>

        <div class="modal-footer">
          <button
            class="btn btn-secondary"
            (click)="onCancel()"
            [disabled]="loading">
            {{ cancelLabel }}
          </button>
          <button
            class="btn btn-danger"
            (click)="onConfirm()"
            [disabled]="loading">
            <i class="pi pi-spinner pi-spin" *ngIf="loading"></i>
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .modal-overlay.show {
      opacity: 1;
      visibility: visible;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      min-width: 400px;
      max-width: 500px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
      transform: scale(0.9);
      transition: transform 0.3s ease;
    }

    .modal-overlay.show .modal-content {
      transform: scale(1);
    }

    .modal-header {
      padding: 2rem 2rem 1rem;
      text-align: center;
    }

    .modal-icon {
      margin-bottom: 1rem;
    }

    .modal-icon i {
      font-size: 3rem;
      color: #f59e0b;
    }

    .modal-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
    }

    .modal-body {
      padding: 0 2rem 1.5rem;
      text-align: center;
    }

    .modal-message {
      margin: 0;
      font-size: 1.1rem;
      color: #6b7280;
      line-height: 1.6;
    }

    .modal-footer {
      padding: 1.5rem 2rem 2rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-width: 120px;
      justify-content: center;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #dc2626;
    }

    @media (max-width: 480px) {
      .modal-content {
        min-width: 90%;
        margin: 1rem;
      }

      .modal-footer {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class ConfirmModalComponent {
  @Input() isVisible = false;
  @Input() title = 'Confirmar Ação';
  @Input() message = 'Tem certeza que deseja continuar?';
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';
  @Input() loading = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
    this.close();
  }

  onOverlayClick(): void {
    if (!this.loading) {
      this.onCancel();
    }
  }

  close(): void {
    this.isVisible = false;
    this.closed.emit();
  }
}
