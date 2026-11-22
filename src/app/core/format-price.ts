import { Currency } from '../features/product-showcase/product.model';

/** Цена как на сайте The Bell: «$14,90», «$149», «12 800 ₽». */
export function formatPrice(value: number, currency: Currency): string {
  const hasCents = value % 1 !== 0;
  const number = value.toLocaleString('ru-RU', {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return currency === 'USD' ? `$${number}` : `${number} ₽`;
}
