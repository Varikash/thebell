import { ProductShowcaseConfig, WebinarsConfig } from './home.model';

/**
 * Куда «редакция» поставила наши блоки на главной. В живой раскладке thebell.io
 * их ещё нет, поэтому HomeData вставляет их поверх неё по этому конфигу.
 */
export const HOME_BLOCKS = {
  /** Витрина занимает второй слот во второй линии (two_50), рядом со статьёй. */
  productShowcase: {
    lineIndex: 1,
    slotIndex: 1,
    widget: {
      id: 'product-showcase',
      type: 'product-showcase',
      config: { mode: 'rotation', pinnedProductId: null, excludedProductIds: [] },
    } satisfies ProductShowcaseConfig,
  },
  /** Вебинары — отдельная линия на всю ширину после третьей линии. */
  webinars: {
    afterLineIndex: 2,
    widget: {
      id: 'webinars',
      type: 'webinars',
      config: { limit: 4, showPast: true },
    } satisfies WebinarsConfig,
  },
};
