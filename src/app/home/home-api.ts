import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HomePage } from './home.model';

/**
 * Конфиг главной из конструктора. В демо это статический JSON,
 * на проде меняется только URL.
 */
@Injectable({ providedIn: 'root' })
export class HomeApi {
  private readonly http = inject(HttpClient);

  getHomePage(): Observable<HomePage> {
    return this.http.get<HomePage>('api/home.json');
  }
}
