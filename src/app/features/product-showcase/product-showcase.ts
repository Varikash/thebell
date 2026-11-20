import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { today } from '../../core/today';
import { ProductShowcaseConfig } from '../home/home.model';
import { SubscriptionFlow } from '../subscription/subscription-flow';
import { formatUsd, lowestMonthlyPrice, pickProductOfDay } from './product-rotation';
import { ProductsData } from './products-data';

/** Витрина: один продукт The Bell в ротации, смена раз в сутки. */
@Component({
  selector: 'tb-product-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (product(); as product) {
      <article class="card">
        <span class="tb-chip">Продукт The Bell</span>

        <div class="body">
          <h2 class="name">{{ product.name }}</h2>
          <p class="tagline">{{ product.tagline }}</p>
          <ul class="features">
            @for (feature of features(); track feature) {
              <li>{{ feature }}</li>
            }
          </ul>
        </div>

        <div class="footer">
          <span class="price">{{ price() }}</span>
          <button class="cta" type="button" (click)="subscribe(product.id)">
            {{ product.trial ? 'Попробовать за $1' : 'Подписаться' }}
          </button>
        </div>
      </article>
    }
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
    .card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
      min-height: 300px;
      padding: 20px;
      border-radius: var(--tb-radius);
      background: var(--tb-red);
      color: var(--tb-white);
    }
    .tb-chip {
      align-self: flex-start;
    }
    .body {
      flex: 1;
    }
    .name {
      margin: 0 0 6px;
      font-size: 25px;
      font-weight: 600;
      line-height: 30px;
    }
    .tagline {
      margin: 0 0 12px;
      font-size: 15px;
      line-height: 1.35;
      opacity: 0.9;
    }
    .features {
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 14px;
      line-height: 1.4;
    }
    .features li {
      position: relative;
      padding-left: 20px;
    }
    .features li + li {
      margin-top: 4px;
    }
    .features li::before {
      content: '✓';
      position: absolute;
      left: 0;
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .price {
      font-size: 16px;
      font-weight: 600;
    }
    .cta {
      height: 40px;
      padding: 0 20px;
      border: 0;
      border-radius: var(--tb-radius);
      background: var(--tb-white);
      color: var(--tb-red);
      font: 600 14px/1 var(--tb-font);
      cursor: pointer;
    }
    .cta:hover {
      background: rgba(255, 255, 255, 0.9);
    }
  `,
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
      : `от ${formatUsd(lowestMonthlyPrice(product))}/мес`;
  });

  protected subscribe(productId: string): void {
    this.subscription.open(productId);
  }
}
