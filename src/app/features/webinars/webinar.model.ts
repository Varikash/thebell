export interface Webinar {
  id: string;
  title: string;
  speaker: string;
  speakerRole: string;
  startsAt: string;
  endsAt: string;
  image: string;
  url: string | null;
  productId: string;
}

export interface WebinarsCatalog {
  webinars: Webinar[];
}

export type WebinarStatus = 'upcoming' | 'past';

/** Вебинар, готовый к показу: со статусом и датой в часовом поясе читателя. */
export interface WebinarCard extends Webinar {
  status: WebinarStatus;
  dateLabel: string;
  badge: string;
  ctaLabel: string;
  /** Название продукта, в который входит вебинар. Нет, пока каталог не загрузился. */
  productName?: string;
}
