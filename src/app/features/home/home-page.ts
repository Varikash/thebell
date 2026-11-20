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
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  protected readonly homeData = inject(HomeData);
}
