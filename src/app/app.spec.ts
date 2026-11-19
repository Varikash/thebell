import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { HomeLayout } from './features/home/home.model';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('renders home lines with widgets by type', async () => {
    const fixture = TestBed.createComponent(App);
    TestBed.tick();

    const layout: HomeLayout = {
      lines: [
        {
          id: 'l1',
          basis: 50,
          widgets: [
            { id: 'n1', type: 'news', title: 'Новость', meta: 'Час назад', url: '#' },
            {
              id: 'p1',
              type: 'product-showcase',
              config: { mode: 'rotation', pinnedProductId: null, excludedProductIds: [] },
            },
          ],
        },
      ],
    };
    TestBed.inject(HttpTestingController).expectOne('api/home.json').flush(layout);
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.line.basis-50')).toHaveLength(1);
    expect(el.querySelector('tb-news-widget')?.textContent).toContain('Новость');
    expect(el.querySelector('tb-block-placeholder')).not.toBeNull();
  });

  it('shows an error when the layout fails to load', async () => {
    const fixture = TestBed.createComponent(App);
    TestBed.tick();

    TestBed.inject(HttpTestingController)
      .expectOne('api/home.json')
      .flush('fail', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Не удалось загрузить главную',
    );
  });
});
