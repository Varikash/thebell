import { computed, inject, Injectable, signal } from '@angular/core';
import { formatPrice } from '../../core/format-price';
import { Currency } from '../product-showcase/product.model';
import { ProductsData } from '../product-showcase/products-data';
import { defaultPlan, planOptions } from './plan-options';

export type SubscriptionStep = 'plans' | 'payment' | 'success';
/** Откуда открыли модалку: от этого зависит текст на экране успеха. */
export type SubscriptionSource = 'showcase' | 'webinar' | 'link';

const CURRENCY_KEY = 'tb-currency';
const UNLIMITED_ID = 'unlimited';

/**
 * Состояние оформления подписки: какой продукт, шаг, валюта, тариф, email.
 * Блоки на главной вызывают open(), модалка читает всё отсюда.
 *
 * Открытая модалка отражается в адресе: `?subscribe=tech&plan=tech-year`.
 * Такой ссылкой можно открыть тарифы из рассылки или Telegram,
 * а кнопка «Назад» в браузере закрывает модалку.
 */
@Injectable({ providedIn: 'root' })
export class SubscriptionFlow {
  private readonly productsData = inject(ProductsData);

  readonly productId = signal<string | null>(null);
  readonly source = signal<SubscriptionSource>('link');
  readonly step = signal<SubscriptionStep>('plans');
  readonly currency = signal<Currency>(readSavedCurrency());
  readonly email = signal('');
  private readonly chosenPlanId = signal<string | null>(null);
  /** Модалку открыли мы через pushState — тогда закрываем через history.back(). */
  private pushedHistory = false;

  readonly isOpen = computed(() => this.productId() !== null);

  readonly product = computed(() =>
    this.productsData.products().find((p) => p.id === this.productId()),
  );

  readonly plans = computed(() => {
    const product = this.product();
    return product ? planOptions(product, this.currency()) : [];
  });

  /** Выбранный тариф; пока ничего не выбрали — тариф по умолчанию. */
  readonly selectedPlan = computed(() => {
    const plans = this.plans();
    return plans.find((p) => p.id === this.chosenPlanId()) ?? defaultPlan(plans);
  });

  /** Предложение перейти на Unlimited: «$39 в месяц». Для самого Unlimited — нет. */
  readonly unlimitedOffer = computed(() => {
    if (this.productId() === UNLIMITED_ID) return null;
    const unlimited = this.productsData.products().find((p) => p.id === UNLIMITED_ID);
    const plan = unlimited && planOptions(unlimited, this.currency())[0];
    return plan ? `${formatPrice(plan.price, plan.currency)} ${plan.periodLabel}` : null;
  });

  constructor() {
    // Открытие по ссылке ?subscribe=...
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('subscribe');
    if (productId) {
      this.start(productId, 'link', params.get('plan'));
    }
    // «Назад» в браузере: параметра больше нет — закрываем.
    window.addEventListener('popstate', () => {
      if (!new URLSearchParams(window.location.search).has('subscribe')) {
        this.reset();
      }
    });
  }

  open(productId: string, source: SubscriptionSource): void {
    this.start(productId, source, null);
    window.history.pushState(null, '', this.urlWith(productId));
    this.pushedHistory = true;
  }

  close(): void {
    if (this.pushedHistory) {
      window.history.back(); // popstate вызовет reset()
      return;
    }
    window.history.replaceState(null, '', this.urlWith(null));
    this.reset();
  }

  /** Переключиться на другой продукт внутри модалки (апсейл на Unlimited). */
  switchProduct(productId: string): void {
    this.productId.set(productId);
    this.chosenPlanId.set(null);
    this.step.set('plans');
    window.history.replaceState(null, '', this.urlWith(productId));
  }

  selectPlan(planId: string): void {
    this.chosenPlanId.set(planId);
  }

  setCurrency(currency: Currency): void {
    this.currency.set(currency);
    try {
      localStorage.setItem(CURRENCY_KEY, currency);
    } catch {
      // Хранилище недоступно (приватный режим) — просто не запоминаем.
    }
  }

  goToPayment(): void {
    this.step.set('payment');
  }

  backToPlans(): void {
    this.step.set('plans');
  }

  complete(email: string): void {
    this.email.set(email);
    this.step.set('success');
  }

  private start(productId: string, source: SubscriptionSource, planId: string | null): void {
    this.productId.set(productId);
    this.source.set(source);
    this.chosenPlanId.set(planId);
    this.step.set('plans');
  }

  private reset(): void {
    this.productId.set(null);
    this.chosenPlanId.set(null);
    this.step.set('plans');
    this.pushedHistory = false;
  }

  private urlWith(productId: string | null): string {
    const url = new URL(window.location.href);
    url.searchParams.delete('plan');
    if (productId) {
      url.searchParams.set('subscribe', productId);
    } else {
      url.searchParams.delete('subscribe');
    }
    return url.toString();
  }
}

function readSavedCurrency(): Currency {
  try {
    return localStorage.getItem(CURRENCY_KEY) === 'RUB' ? 'RUB' : 'USD';
  } catch {
    return 'USD';
  }
}
