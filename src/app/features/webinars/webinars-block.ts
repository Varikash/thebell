import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { today } from '../../core/today';
import { WebinarsConfig } from '../home/home.model';
import { ProductsData } from '../product-showcase/products-data';
import { SubscriptionFlow } from '../subscription/subscription-flow';
import { WebinarsData } from './webinars-data';
import { scheduleWebinars } from './webinars-schedule';

/** Блок вебинаров: предстоящие с регистрацией, затем записи прошедших. */
@Component({
  selector: 'tb-webinars-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './webinars-block.html',
  styleUrl: './webinars-block.scss',
})
export class WebinarsBlock {
  readonly widget = input.required<WebinarsConfig>();

  private readonly webinarsData = inject(WebinarsData);
  private readonly productsData = inject(ProductsData);
  private readonly subscription = inject(SubscriptionFlow);

  /** Карточки вебинаров с названием продукта, в который каждый входит. */
  protected readonly cards = computed(() => {
    const names = new Map(this.productsData.products().map((p) => [p.id, p.name]));
    return scheduleWebinars(this.webinarsData.webinars(), this.widget().config, today()).map(
      (card) => ({ ...card, productName: names.get(card.productId) }),
    );
  });

  protected subscribe(productId: string): void {
    this.subscription.open(productId);
  }
}
