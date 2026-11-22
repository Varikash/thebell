import { Currency, PlanPeriod, Product } from '../product-showcase/product.model';

/** Тариф в том виде, в каком его показывает модалка. */
export interface PlanOption {
  id: string;
  title: string;
  period: PlanPeriod;
  periodLabel: string;
  price: number;
  currency: Currency;
  oldPrice?: number;
  note?: string;
  isTrial: boolean;
}

const TITLES: Record<PlanPeriod, string> = {
  month: 'Ежемесячный',
  halfyear: 'Полугодовой',
  year: 'Годовой',
};

const PERIOD_LABELS: Record<PlanPeriod, string> = {
  month: 'в месяц',
  halfyear: 'за полгода',
  year: 'в год',
};

/**
 * Тарифы продукта в выбранной валюте. Пробный период за $1 есть только в долларах,
 * поэтому он добавляется первым и только при USD.
 */
export function planOptions(product: Product, currency: Currency): PlanOption[] {
  const options: PlanOption[] = product.plans[currency].map((plan) => ({
    id: plan.id,
    title: TITLES[plan.period],
    period: plan.period,
    periodLabel: PERIOD_LABELS[plan.period],
    price: plan.price,
    currency,
    oldPrice: plan.oldPrice,
    note: plan.saving,
    isTrial: false,
  }));

  if (product.trial && currency === 'USD') {
    options.unshift({
      id: `${product.id}-trial`,
      title: 'Пробный',
      period: 'month',
      periodLabel: 'за первый месяц',
      price: product.trial.price,
      currency: 'USD',
      note: product.trial.note,
      isTrial: true,
    });
  }
  return options;
}

/** Тариф по умолчанию: пробный, если он есть, иначе годовой, иначе первый. */
export function defaultPlan(options: PlanOption[]): PlanOption | undefined {
  return options.find((o) => o.isTrial) ?? options.find((o) => o.period === 'year') ?? options[0];
}
