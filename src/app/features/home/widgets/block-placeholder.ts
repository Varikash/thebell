import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Временная заглушка для новых блоков: показывает их место в сетке. */
@Component({
  selector: 'tb-block-placeholder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './block-placeholder.html',
  styleUrl: './block-placeholder.scss',
})
export class BlockPlaceholder {
  readonly label = input.required<string>();
  readonly type = input.required<string>();
}
