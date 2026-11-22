import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PricePipe } from '../../../shared/price.pipe';
import { Currency } from '../../product-showcase/product.model';
import { SubscriptionFlow } from '../subscription-flow';

/** Шаг 1: выбор валюты и тарифа. */
@Component({
  selector: 'tb-plans-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PricePipe],
  templateUrl: './plans-step.html',
  styleUrl: './plans-step.scss',
})
export class PlansStep {
  protected readonly flow = inject(SubscriptionFlow);
  protected readonly currencies: { value: Currency; label: string }[] = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'RUB', label: 'RUB (₽)' },
  ];
}
