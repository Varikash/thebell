import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HomePage } from './home-page';
import { HomeLayout } from './home.model';

describe('HomePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  async function render(response: HomeLayout | { status: number }): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(HomePage);
    TestBed.tick();

    const req = TestBed.inject(HttpTestingController).expectOne('api/home.json');
    if ('status' in response) {
      req.flush('fail', { status: response.status, statusText: 'Server Error' });
    } else {
      req.flush(response);
    }
    await fixture.whenStable();

    return fixture.nativeElement as HTMLElement;
  }

  it('renders each line with its basis class', async () => {
    const el = await render({
      lines: [
        { id: 'l1', basis: 25, widgets: [] },
        { id: 'l2', basis: 50, widgets: [] },
      ],
    });

    expect(el.querySelectorAll('.line')).toHaveLength(2);
    expect(el.querySelector('.line.basis-25')).not.toBeNull();
    expect(el.querySelector('.line.basis-50')).not.toBeNull();
  });

  it('renders each widget with the component for its type', async () => {
    const el = await render({
      lines: [
        {
          id: 'l1',
          basis: 25,
          widgets: [
            { id: 'n1', type: 'news', title: 'Новость', meta: 'Час назад', url: '#' },
            {
              id: 'a1',
              type: 'article',
              rubric: 'Бизнес',
              title: 'Статья',
              image: 'img.jpg',
              url: '#',
            },
            {
              id: 'p1',
              type: 'product-showcase',
              config: { mode: 'rotation', pinnedProductId: null, excludedProductIds: [] },
            },
            { id: 'w1', type: 'webinars', config: { limit: 3, showPast: false } },
          ],
        },
      ],
    });

    const cells = Array.from(el.querySelectorAll('.line-widget'));
    expect(cells).toHaveLength(4);
    expect(cells[0].querySelector('tb-news-widget')?.textContent).toContain('Новость');
    expect(cells[1].querySelector('tb-article-widget')?.textContent).toContain('Статья');
    expect(cells[2].querySelector('tb-block-placeholder')?.textContent).toContain(
      'Витрина продуктов',
    );
    expect(cells[3].querySelector('tb-block-placeholder')?.textContent).toContain('Вебинары');
  });

  it('shows an error when the layout fails to load', async () => {
    const el = await render({ status: 500 });

    expect(el.querySelector('.line')).toBeNull();
    expect(el.textContent).toContain('Не удалось загрузить главную');
  });
});
