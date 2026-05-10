import { Injectable, signal } from '@angular/core';

type ToastType = 'success' | 'error' | 'info';

export interface UiToast {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class UiFeedbackService {
  private _pendingCount = signal(0);
  private _loadingMessage = signal<string | null>(null);
  private _toasts = signal<UiToast[]>([]);
  private toastId = 0;

  readonly pendingCount = this._pendingCount.asReadonly();
  readonly loadingMessage = this._loadingMessage.asReadonly();
  readonly toasts = this._toasts.asReadonly();

  begin(message: string): void {
    this._pendingCount.update((count) => count + 1);
    this._loadingMessage.set(message);
  }

  end(): void {
    this._pendingCount.update((count) => Math.max(0, count - 1));
    if (this._pendingCount() === 0) {
      this._loadingMessage.set(null);
    }
  }

  async track<T>(message: string, task: Promise<T>): Promise<T> {
    this.begin(message);
    try {
      return await task;
    } finally {
      this.end();
    }
  }

  success(message: string): void {
    this.pushToast('success', message);
  }

  error(message: string): void {
    this.pushToast('error', message);
  }

  info(message: string): void {
    this.pushToast('info', message);
  }

  dismiss(id: number): void {
    this._toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private pushToast(type: ToastType, message: string): void {
    const id = ++this.toastId;
    this._toasts.update((toasts) => [...toasts, { id, type, message }]);
    setTimeout(() => this.dismiss(id), 3400);
  }
}
