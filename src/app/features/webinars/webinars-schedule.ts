import { WebinarsConfig } from '../home/home.model';
import { Webinar, WebinarCard, WebinarStatus } from './webinar.model';

/** Тексты карточки по статусу. Новый статус добавляется одной строкой здесь. */
const LABELS: Record<WebinarStatus, { badge: string; ctaLabel: string }> = {
  upcoming: { badge: 'Регистрация открыта', ctaLabel: 'Зарегистрироваться' },
  past: { badge: 'Запись', ctaLabel: 'Смотреть запись' },
};

// Без timeZone: дата и время показываются в часовом поясе читателя.
const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

/**
 * Что показать в блоке вебинаров. Вебинар считается предстоящим, пока не закончился.
 * Сначала идут предстоящие (ближайший первым), за ними прошедшие (свежий первым).
 */
export function scheduleWebinars(
  webinars: Webinar[],
  config: WebinarsConfig['config'],
  now: Date,
): WebinarCard[] {
  const cards: WebinarCard[] = webinars.map((webinar) => {
    const status: WebinarStatus = new Date(webinar.endsAt) > now ? 'upcoming' : 'past';
    return {
      ...webinar,
      status,
      ...LABELS[status],
      dateLabel: dateFormat.format(new Date(webinar.startsAt)),
    };
  });

  const byStart = (a: WebinarCard, b: WebinarCard) =>
    new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();

  const upcoming = cards.filter((c) => c.status === 'upcoming').sort(byStart);
  const past = config.showPast
    ? cards.filter((c) => c.status === 'past').sort((a, b) => byStart(b, a))
    : [];

  return [...upcoming, ...past].slice(0, config.limit);
}
