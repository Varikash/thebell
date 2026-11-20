import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { ProductsCatalog } from './product.model';

/** Каталог продуктов. У страниц подписки на Tilda нет API, поэтому это наш JSON. */
@Injectable({ providedIn: 'root' })
export class ProductsData {
  private readonly catalog = httpResource<ProductsCatalog>(() => 'api/products.json');

  readonly products = computed(() =>
    this.catalog.hasValue() ? this.catalog.value().products : [],
  );
}
