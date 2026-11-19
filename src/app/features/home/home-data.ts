import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HomeLayout } from './home.model';

/**
 * Раскладка главной из конструктора. В демо это статический JSON,
 * на проде меняется только URL.
 */
@Injectable({ providedIn: 'root' })
export class HomeData {
  readonly layout = httpResource<HomeLayout>(() => 'api/home.json');
}
