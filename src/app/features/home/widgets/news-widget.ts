import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NewsWidgetConfig } from '../home.model';

@Component({
  selector: 'tb-news-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './news-widget.html',
  styleUrl: './news-widget.scss',
})
export class NewsWidget {
  readonly widget = input.required<NewsWidgetConfig>();
}
