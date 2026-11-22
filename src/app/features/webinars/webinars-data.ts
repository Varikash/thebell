import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { WebinarsCatalog } from './webinar.model';

/** Список вебинаров. У the-chat.io (Tilda) нет API, поэтому это наш JSON. */
@Injectable({ providedIn: 'root' })
export class WebinarsData {
  private readonly catalog = httpResource<WebinarsCatalog>(() => 'api/webinars.json');

  readonly webinars = computed(() =>
    this.catalog.hasValue() ? this.catalog.value().webinars : [],
  );
}
