import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomePage } from './features/home/home-page';
import { SiteHeader } from './layout/site-header';

@Component({
  selector: 'tb-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeader, HomePage],
  templateUrl: './app.html',
})
export class App {}
