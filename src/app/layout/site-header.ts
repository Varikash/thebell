import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Упрощённая шапка thebell.io: нужна только как контекст для блоков. */
@Component({
  selector: 'tb-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="header">
      <div class="tb-container bar">
        <button class="icon burger" type="button" aria-label="Меню">
          <span></span><span></span><span></span>
        </button>
        <a class="logo" href="#">THE BELL.</a>
        <nav class="nav" aria-label="Рубрики">
          @for (item of nav; track item) {
            <a href="#">{{ item }}</a>
          }
        </nav>
        <a class="tb-button subscribe" href="#">Подписаться</a>
        <button class="icon user" type="button" aria-label="Войти">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.6" />
            <path
              d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
            />
          </svg>
        </button>
      </div>
      <div class="tb-container mobile-subscribe">
        <a class="tb-button" href="#">Подписаться</a>
      </div>
    </header>
  `,
  styles: `
    .header {
      background: var(--tb-white);
      border-bottom: 1px solid var(--tb-grey-line);
      margin-bottom: var(--tb-gap);
    }
    .bar {
      display: flex;
      align-items: center;
      gap: 24px;
      height: 64px;
    }
    .logo {
      color: var(--tb-red);
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .nav {
      display: flex;
      gap: 20px;
      flex: 1;
      font-size: 14px;
    }
    .nav a:hover {
      color: var(--tb-red);
    }
    .icon {
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: 0;
      background: none;
      cursor: pointer;
      color: var(--tb-black);
    }
    .burger {
      display: none;
      gap: 4px;
      align-content: center;
    }
    .burger span {
      display: block;
      width: 18px;
      height: 2px;
      background: currentColor;
    }
    .mobile-subscribe {
      display: none;
    }

    @media (max-width: 900px) {
      .bar {
        justify-content: space-between;
        height: 56px;
      }
      .nav,
      .subscribe {
        display: none;
      }
      .burger {
        display: grid;
      }
      .mobile-subscribe {
        display: block;
        padding-bottom: 12px;
      }
      .mobile-subscribe .tb-button {
        width: 100%;
        background: var(--tb-white);
        color: var(--tb-red);
        border: 1px solid var(--tb-red);
      }
    }
  `,
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
