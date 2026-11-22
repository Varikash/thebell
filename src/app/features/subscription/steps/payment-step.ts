import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PricePipe } from '../../../shared/price.pipe';
import { PaymentGateway } from '../payment-gateway';
import { SubscriptionFlow } from '../subscription-flow';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EXPIRY = /^(0[1-9]|1[0-2])\/\d{2}$/;

/** Шаг 2: email и карта. Оплата идёт через PaymentGateway (в демо — мок). */
@Component({
  selector: 'tb-payment-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, PricePipe],
  templateUrl: './payment-step.html',
  styleUrl: './payment-step.scss',
})
export class PaymentStep {
  protected readonly flow = inject(SubscriptionFlow);
  private readonly gateway = inject(PaymentGateway);

  protected readonly email = signal('');
  protected readonly cardNumber = signal('');
  protected readonly expiry = signal('');
  protected readonly cvc = signal('');
  protected readonly agreed = signal(false);

  protected readonly status = signal<'idle' | 'paying' | 'error'>('idle');
  protected readonly errorMessage = signal('');

  private readonly cardDigits = computed(() => this.cardNumber().replace(/\D/g, ''));

  protected readonly isValid = computed(
    () =>
      EMAIL.test(this.email().trim()) &&
      this.cardDigits().length === 16 &&
      EXPIRY.test(this.expiry().trim()) &&
      /^\d{3}$/.test(this.cvc()) &&
      this.agreed(),
  );

  /** Номер карты: только цифры, не больше 16, пробел после каждых четырёх. */
  protected onCardInput(input: HTMLInputElement): void {
    const digits = input.value.replace(/\D/g, '').slice(0, 16);
    this.setFormatted(input, this.cardNumber, digits.replace(/(\d{4})(?=\d)/g, '$1 '));
  }

  /** Срок: 4 цифры, слэш после месяца ставится сам: «1227» → «12/27». */
  protected onExpiryInput(input: HTMLInputElement): void {
    const digits = input.value.replace(/\D/g, '').slice(0, 4);
    const value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    this.setFormatted(input, this.expiry, value);
  }

  protected onCvcInput(input: HTMLInputElement): void {
    this.setFormatted(input, this.cvc, input.value.replace(/\D/g, '').slice(0, 3));
  }

  /** Пишем отформатированное значение и в сигнал, и обратно в поле (убирает лишние символы). */
  private setFormatted(
    input: HTMLInputElement,
    field: WritableSignal<string>,
    value: string,
  ): void {
    input.value = value;
    field.set(value);
  }

  protected async pay(): Promise<void> {
    const product = this.flow.product();
    const plan = this.flow.selectedPlan();
    if (!product || !plan || !this.isValid() || this.status() === 'paying') return;

    this.status.set('paying');
    const result = await this.gateway.charge({
      productId: product.id,
      planId: plan.id,
      amount: plan.price,
      currency: plan.currency,
      email: this.email().trim(),
      cardNumber: this.cardDigits(),
    });

    if (result.ok) {
      this.flow.complete(this.email().trim());
    } else {
      this.errorMessage.set(result.message);
      this.status.set('error');
    }
  }
}
