import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Упрощённая шапка thebell.io: нужна только как контекст для блоков. */
@Component({
  selector: 'tb-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  protected readonly nav = [
    'Главное',
    'Новости',
    'Экономика',
    'Технологии',
    'Бизнес',
    'Инвестиции',
  ];
}
