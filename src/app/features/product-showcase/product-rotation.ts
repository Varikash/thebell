import { ProductShowcaseConfig } from '../home/home.model';
import { Plan, Product } from './product.model';

const DAY_MS = 24 * 60 * 60 * 1000;
const MOSCOW_OFFSET_MS = 3 * 60 * 60 * 1000;

/**
 * Продукт дня. Если редакция закрепила продукт, показываем его.
 * Иначе берём номер дня по Москве и делим по модулю на число продуктов:
 * у всех читателей в один день один и тот же продукт, а в полночь он меняется.
 */
export function pickProductOfDay(
  products: Product[],
  config: ProductShowcaseConfig['config'],
  date: Date,
): Product | undefined {
  if (config.mode === 'pinned' && config.pinnedProductId) {
    const pinned = products.find((p) => p.id === config.pinnedProductId);
    if (pinned) return pinned;
  }

  const pool = products.filter((p) => !config.excludedProductIds.includes(p.id));
  if (!pool.length) return undefined;

  const dayNumber = Math.floor((date.getTime() + MOSCOW_OFFSET_MS) / DAY_MS);
  return pool[dayNumber % pool.length];
}

const MONTHS: Record<Plan['period'], number> = { month: 1, halfyear: 6, year: 12 };

/** Самая низкая цена в месяц среди долларовых тарифов: для подписи «от $X/мес». */
export function lowestMonthlyPrice(product: Product): number {
  return Math.min(...product.plans.USD.map((plan) => plan.price / MONTHS[plan.period]));
}
