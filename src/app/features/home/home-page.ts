import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductShowcase } from '../product-showcase/product-showcase';
import { HomeData } from './home-data';
import { ArticleWidget } from './widgets/article-widget';
import { BlockPlaceholder } from './widgets/block-placeholder';
import { NewsWidget } from './widgets/news-widget';

/**
 * Главная, собранная из линий конструктора.
 * Каждая линия делится на колонки по basis, каждый виджет рисуется по своему type.
 */
@Component({
  selector: 'tb-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NewsWidget, ArticleWidget, BlockPlaceholder, ProductShowcase],
  template: `
    @let layout = homeData.layout();
    <main class="tb-container lines">
      @if (layout) {
        @for (line of layout.lines; track line.id) {
          <section [class]="'line basis-' + line.basis">
            @for (widget of line.widgets; track widget.id) {
              <div class="line-widget">
                @switch (widget.type) {
                  @case ('news') {
                    <tb-news-widget [widget]="widget" />
                  }
                  @case ('article') {
                    <tb-article-widget [widget]="widget" />
                  }
                  @case ('product-showcase') {
                    <tb-product-showcase [widget]="widget" />
                  }
                  @case ('webinars') {
                    <tb-block-placeholder label="Вебинары" [type]="widget.type" />
                  }
                }
              </div>
            }
          </section>
        }
      } @else if (homeData.error()) {
        <p class="status">Не удалось загрузить главную. Обновите страницу.</p>
      } @else {
        <p class="status">Загружаем главную…</p>
      }
    </main>
  `,
  styles: `
    .lines {
      display: flex;
      flex-direction: column;
      gap: var(--tb-gap);
      padding-bottom: 40px;
    }
    .line {
      display: grid;
      gap: var(--tb-gap);
    }
    .basis-25 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .basis-33 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .basis-50 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .basis-100 {
      grid-template-columns: minmax(0, 1fr);
    }
    .line-widget {
      min-width: 0;
    }
    .status {
      padding: 40px 0;
      color: var(--tb-grey-text);
      text-align: center;
    }

    @media (max-width: 1024px) {
      .basis-25 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media (max-width: 640px) {
      .basis-25,
      .basis-33,
      .basis-50 {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `,
})
export class HomePage {
  protected readonly homeData = inject(HomeData);
}
