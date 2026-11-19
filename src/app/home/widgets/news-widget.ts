import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NewsWidget } from '../home.model';

@Component({
  selector: 'tb-news-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="card" [href]="widget().url" target="_blank" rel="noopener">
      <span class="title">{{ widget().title }}</span>
      <span class="tb-meta">{{ widget().meta }}</span>
    </a>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
    .card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 20px;
      height: 100%;
      min-height: 174px;
      padding: 20px;
      border-radius: var(--tb-radius);
      background: var(--tb-white);
    }
    .title {
      font-size: 18px;
      line-height: 1.3;
    }
    .card:hover .title {
      color: var(--tb-red);
    }
    @media (max-width: 640px) {
      .card {
        min-height: 0;
      }
    }
  `,
})
export class NewsWidgetComponent {
  readonly widget = input.required<NewsWidget>();
}
