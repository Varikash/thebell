import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomePageComponent } from './home/home-page';
import { SiteHeader } from './layout/site-header';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeader, HomePageComponent],
  template: `
    <tb-site-header />
    <tb-home-page />
  `,
})
export class App {}
