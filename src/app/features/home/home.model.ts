/** Ширина виджета в линии в процентах, как классы basis-* на thebell.io. */
export type LineBasis = 25 | 33 | 50 | 100;

export interface NewsWidgetConfig {
  id: string;
  type: 'news';
  title: string;
  meta: string;
  url: string;
}

export interface ArticleWidgetConfig {
  id: string;
  type: 'article';
  rubric: string;
  title: string;
  meta?: string;
  image: string;
  url: string;
}

export interface ProductShowcaseConfig {
  id: string;
  type: 'product-showcase';
  config: {
    mode: 'rotation' | 'pinned';
    pinnedProductId: string | null;
    excludedProductIds: string[];
  };
}

export interface WebinarsConfig {
  id: string;
  type: 'webinars';
  config: {
    limit: number;
    showPast: boolean;
  };
}

export type HomeWidgetConfig =
  NewsWidgetConfig | ArticleWidgetConfig | ProductShowcaseConfig | WebinarsConfig;

export interface HomeLine {
  id: string;
  basis: LineBasis;
  widgets: HomeWidgetConfig[];
}

/** Раскладка главной из конструктора: линии с виджетами. */
export interface HomeLayout {
  lines: HomeLine[];
}
