import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Временная заглушка для новых блоков: показывает их место в сетке. */
@Component({
  selector: 'tb-block-placeholder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="slot">
      <span class="tb-chip">Новый блок</span>
      <strong>{{ label() }}</strong>
      <code>type: {{ type() }}</code>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
    .slot {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 10px;
      height: 100%;
      min-height: 300px;
      padding: 20px;
      border: 2px dashed var(--tb-red);
      border-radius: var(--tb-radius);
      background: rgba(235, 51, 35, 0.04);
    }
    .tb-chip {
      background: var(--tb-red);
      color: var(--tb-white);
    }
    strong {
      font-size: 22px;
    }
    code {
      color: var(--tb-grey-text);
      font-size: 13px;
    }
  `,
})
export class BlockPlaceholder {
  readonly label = input.required<string>();
  readonly type = input.required<string>();
}
