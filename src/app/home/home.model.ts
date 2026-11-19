/** Ширина виджета в линии в процентах, как классы basis-* на thebell.io. */
export type LineBasis = 25 | 33 | 50 | 100;

export interface NewsWidget {
  id: string;
  type: 'news';
  title: string;
  meta: string;
  url: string;
}

export interface ArticleWidget {
  id: string;
  type: 'article';
  rubric: string;
  title: string;
  meta?: string;
  image: string;
  url: string;
}

export interface ProductShowcaseWidget {
  id: string;
  type: 'product-showcase';
  config: {
    mode: 'rotation' | 'pinned';
    pinnedProductId: string | null;
    excludedProductIds: string[];
  };
}

export interface WebinarsWidget {
  id: string;
  type: 'webinars';
  config: {
    limit: number;
    showPast: boolean;
  };
}

export type HomeWidget = NewsWidget | ArticleWidget | ProductShowcaseWidget | WebinarsWidget;

export interface HomeLine {
  id: string;
  basis: LineBasis;
  widgets: HomeWidget[];
}

export interface HomePage {
  lines: HomeLine[];
}
