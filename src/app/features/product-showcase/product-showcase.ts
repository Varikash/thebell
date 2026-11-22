import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { today } from '../../core/today';
import { ProductShowcaseConfig } from '../home/home.model';
import { SubscriptionFlow } from '../subscription/subscription-flow';
import { formatPrice } from '../../core/format-price';
import { lowestMonthlyPrice, pickProductOfDay } from './product-rotation';
import { ProductsData } from './products-data';

/** Витрина: один продукт The Bell в ротации, смена раз в сутки. */
@Component({
  selector: 'tb-product-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-showcase.html',
  styleUrl: './product-showcase.scss',
})
export class ProductShowcase {
  readonly widget = input.required<ProductShowcaseConfig>();

  private readonly productsData = inject(ProductsData);
  private readonly subscription = inject(SubscriptionFlow);

  protected readonly product = computed(() =>
    pickProductOfDay(this.productsData.products(), this.widget().config, today()),
  );

  protected readonly features = computed(() => this.product()?.features.slice(0, 3) ?? []);

  protected readonly price = computed(() => {
    const product = this.product();
    if (!product) return '';
    return product.trial
      ? '$1 за первый месяц'
      : `от ${formatPrice(lowestMonthlyPrice(product), 'USD')}/мес`;
  });

  protected subscribe(productId: string): void {
    this.subscription.open(productId, 'showcase');
  }
}
