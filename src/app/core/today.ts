/**
 * Текущая дата. Для демо её можно подменить параметром `?today=2026-12-05`:
 * так видно, как меняется продукт в витрине и статусы вебинаров.
 */
export function today(): Date {
  const param = new URLSearchParams(window.location.search).get('today');
  const date = param ? new Date(`${param}T12:00:00+03:00`) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}
