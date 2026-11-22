import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PricePipe } from '../../../shared/price.pipe';
import { SubscriptionFlow } from '../subscription-flow';

/** Шаг 3: подписка оформлена. */
@Component({
  selector: 'tb-success-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PricePipe],
  templateUrl: './success-step.html',
  styleUrl: './success-step.scss',
})
export class SuccessStep {
  protected readonly flow = inject(SubscriptionFlow);
}
