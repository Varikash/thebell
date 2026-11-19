import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HomeApi } from './home-api';
import { ArticleWidgetComponent } from './widgets/article-widget';
import { BlockPlaceholder } from './widgets/block-placeholder';
import { NewsWidgetComponent } from './widgets/news-widget';

/**
 * Главная, собранная из линий конструктора.
 * Каждая линия делится на колонки по basis, каждый виджет рисуется по своему type.
 */
@Component({
  selector: 'tb-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NewsWidgetComponent, ArticleWidgetComponent, BlockPlaceholder],
  template: `
    <main class="tb-container lines">
      @for (line of page()?.lines; track line.id) {
        <section class="line" [class]="'line basis-' + line.basis">
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
                  <tb-block-placeholder label="Витрина продуктов" [type]="widget.type" />
                }
                @case ('webinars') {
                  <tb-block-placeholder label="Вебинары" [type]="widget.type" />
                }
              }
            </div>
          }
        </section>
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
export class HomePageComponent {
  protected readonly page = toSignal(inject(HomeApi).getHomePage());
}
