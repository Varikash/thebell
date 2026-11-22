import { Pipe, PipeTransform } from '@angular/core';
import { formatPrice } from '../core/format-price';
import { Currency } from '../features/product-showcase/product.model';

/** `{{ 149 | price: 'USD' }}` → «$149». */
@Pipe({ name: 'price' })
export class PricePipe implements PipeTransform {
  transform(value: number, currency: Currency): string {
    return formatPrice(value, currency);
  }
}
