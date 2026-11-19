import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ArticleWidgetConfig } from '../home.model';

@Component({
  selector: 'tb-article-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="card" [href]="widget().url" target="_blank" rel="noopener">
      @if (widget().image; as image) {
        <img class="bg" [src]="image" alt="" loading="lazy" />
      }
      <span class="tb-chip">{{ widget().rubric }}</span>
      <span class="bottom">
        <span class="title">{{ widget().title }}</span>
        @if (widget().meta) {
          <span class="tb-meta meta">{{ widget().meta }}</span>
        }
      </span>
    </a>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      height: 100%;
      min-height: 300px;
      padding: 20px;
      border-radius: var(--tb-radius);
      overflow: hidden;
      color: var(--tb-white);
      background: #333;
      isolation: isolate;
    }
    .bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -2;
    }
    .card::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 30%, rgba(0, 0, 0, 0.75));
    }
    .bottom {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .title {
      font-size: 25px;
      font-weight: 600;
      line-height: 30px;
    }
    :host-context(.basis-33) .title {
      font-size: 18px;
      line-height: 23px;
    }
    .meta {
      color: rgba(255, 255, 255, 0.8);
    }
    @media (max-width: 640px) {
      .title,
      :host-context(.basis-33) .title {
        font-size: 20px;
        line-height: 25px;
      }
    }
  `,
})
export class ArticleWidget {
  readonly widget = input.required<ArticleWidgetConfig>();
}
