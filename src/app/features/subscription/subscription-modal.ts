import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { PaymentStep } from './steps/payment-step';
import { PlansStep } from './steps/plans-step';
import { SuccessStep } from './steps/success-step';
import { SubscriptionFlow } from './subscription-flow';

/** Модалка подписки: тарифы → оплата → успех. Закрывается по Esc, крестику и клику на фон. */
@Component({
  selector: 'tb-subscription-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PlansStep, PaymentStep, SuccessStep],
  templateUrl: './subscription-modal.html',
  styleUrl: './subscription-modal.scss',
  host: { '(document:keydown.escape)': 'flow.close()' },
})
export class SubscriptionModal {
  protected readonly flow = inject(SubscriptionFlow);
  private readonly dialog = viewChild.required<ElementRef<HTMLElement>>('dialog');

  protected readonly title = computed(() => {
    switch (this.flow.step()) {
      case 'plans':
        return this.flow.product()?.name ?? 'Подписка';
      case 'payment':
        return 'Оплата';
      case 'success':
        return 'Готово';
    }
  });

  constructor() {
    // Пока модалка открыта, страница под ней не прокручивается.
    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    inject(DestroyRef).onDestroy(() => (body.style.overflow = previousOverflow));

    // Фокус в модалку, чтобы с клавиатуры и скринридера сразу попасть внутрь.
    afterNextRender(() => this.dialog().nativeElement.focus());
  }
}
