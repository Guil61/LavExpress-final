import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private addMessage(type: ToastMessage['type'], title: string, message: string, duration = 4000): void {
    const toast: ToastMessage = {
      id: this.generateId(),
      type,
      title,
      message,
      duration
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.removeMessage(toast.id);
      }, duration);
    }
  }

  success(title: string, message: string, duration?: number): void {
    this.addMessage('success', title, message, duration);
  }

  error(title: string, message: string, duration?: number): void {
    this.addMessage('error', title, message, duration);
  }

  warning(title: string, message: string, duration?: number): void {
    this.addMessage('warning', title, message, duration);
  }

  info(title: string, message: string, duration?: number): void {
    this.addMessage('info', title, message, duration);
  }

  removeMessage(id: string): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next(currentMessages.filter(msg => msg.id !== id));
  }

  clear(): void {
    this.messagesSubject.next([]);
  }
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let message of messages$ | async; trackBy: trackByFn"
        class="toast-item"
        [ngClass]="'toast-' + message.type">

        <div class="toast-icon">
          <i [ngClass]="getIcon(message.type)"></i>
        </div>

        <div class="toast-content">
          <div class="toast-title">{{ message.title }}</div>
          <div class="toast-message">{{ message.message }}</div>
        </div>

        <button
          class="toast-close"
          (click)="closeMessage(message.id)"
          aria-label="Fechar">
          <i class="pi pi-times"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1000;
      max-width: 400px;
      width: 100%;
    }

    .toast-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      margin-bottom: 0.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
      animation: slideIn 0.3s ease-out;
      position: relative;
      border-left: 4px solid;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast-success {
      background: rgba(16, 185, 129, 0.95);
      color: white;
      border-left-color: #10b981;
    }

    .toast-error {
      background: rgba(239, 68, 68, 0.95);
      color: white;
      border-left-color: #ef4444;
    }

    .toast-warning {
      background: rgba(245, 158, 11, 0.95);
      color: white;
      border-left-color: #f59e0b;
    }

    .toast-info {
      background: rgba(59, 130, 246, 0.95);
      color: white;
      border-left-color: #3b82f6;
    }

    .toast-icon {
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    .toast-icon i {
      font-size: 1.25rem;
    }

    .toast-content {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-weight: 600;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .toast-message {
      font-size: 0.875rem;
      opacity: 0.9;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      opacity: 0.7;
      transition: opacity 0.2s ease;
      flex-shrink: 0;
    }

    .toast-close:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.1);
    }

    .toast-close i {
      font-size: 0.875rem;
    }

    @media (max-width: 480px) {
      .toast-container {
        top: 0.5rem;
        right: 0.5rem;
        left: 0.5rem;
        max-width: none;
      }

      .toast-item {
        margin-bottom: 0.25rem;
      }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  get messages$() {
    return this.toastService.messages$;
  }

  trackByFn(index: number, item: ToastMessage): string {
    return item.id;
  }

  getIcon(type: string): string {
    const icons = {
      success: 'pi pi-check-circle',
      error: 'pi pi-times-circle',
      warning: 'pi pi-exclamation-triangle',
      info: 'pi pi-info-circle'
    };
    return icons[type as keyof typeof icons] || 'pi pi-info-circle';
  }

  closeMessage(id: string): void {
    this.toastService.removeMessage(id);
  }
}
