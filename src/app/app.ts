import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HomePage } from './features/home/home-page';
import { SubscriptionFlow } from './features/subscription/subscription-flow';
import { SubscriptionModal } from './features/subscription/subscription-modal';
import { SiteHeader } from './layout/site-header';

@Component({
  selector: 'tb-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeader, HomePage, SubscriptionModal],
  templateUrl: './app.html',
})
export class App {
  protected readonly subscription = inject(SubscriptionFlow);
}
