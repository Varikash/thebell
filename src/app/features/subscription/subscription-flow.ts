import { Injectable, signal } from '@angular/core';

/**
 * Какой продукт сейчас оформляют. Блоки на главной вызывают open(),
 * модалка подписки (следующий шаг) читает productId.
 */
@Injectable({ providedIn: 'root' })
export class SubscriptionFlow {
  readonly productId = signal<string | null>(null);

  open(productId: string): void {
    this.productId.set(productId);
  }

  close(): void {
    this.productId.set(null);
  }
}
