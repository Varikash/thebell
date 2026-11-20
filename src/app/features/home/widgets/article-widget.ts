import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ArticleWidgetConfig } from '../home.model';

@Component({
  selector: 'tb-article-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './article-widget.html',
  styleUrl: './article-widget.scss',
})
export class ArticleWidget {
  readonly widget = input.required<ArticleWidgetConfig>();
}
