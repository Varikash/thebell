import { HOME_BLOCKS } from '../../features/home/home-blocks.config';
import { HomeLayout, HomeLine, HomeWidgetConfig, LineBasis } from '../../features/home/home.model';
import { ApiLayoutTheme, ApiPost } from './thebell-api.model';

const SITE_URL = 'https://thebell.io';

const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Moscow',
});

/**
 * Собирает нашу модель главной из живой раскладки и постов thebell.io.
 * Посты раскладываются по слотам подряд, маленькие слоты (25%) становятся новостями,
 * остальные — карточками с картинкой. Наши блоки встают по HOME_BLOCKS.
 */
export function toHomeLayout(theme: ApiLayoutTheme, posts: ApiPost[]): HomeLayout {
  const apiLines = [...theme.items]
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item.layoutItem)
    .filter((line) => line !== null);

  const { productShowcase, webinars } = HOME_BLOCKS;
  const lines: HomeLine[] = [];
  let postIndex = 0;

  apiLines.forEach((apiLine, lineIndex) => {
    const basis = apiLine.widgets[0]?.basis as LineBasis;
    const widgets: HomeWidgetConfig[] = [];

    apiLine.widgets.forEach((slot, slotIndex) => {
      if (lineIndex === productShowcase.lineIndex && slotIndex === productShowcase.slotIndex) {
        widgets.push(productShowcase.widget);
        return;
      }
      const post = posts[postIndex++];
      if (post) {
        widgets.push(toWidget(post, slot.id, basis));
      }
    });

    if (widgets.length) {
      lines.push({ id: apiLine.id, basis, widgets });
    }
    if (lineIndex === webinars.afterLineIndex) {
      lines.push({ id: 'webinars-line', basis: 100, widgets: [webinars.widget] });
    }
  });

  return { lines };
}

function toWidget(post: ApiPost, slotId: string, basis: LineBasis): HomeWidgetConfig {
  const common = {
    id: `${slotId}-${post.id}`,
    title: post.title,
    url: `${SITE_URL}/${post.slug}`,
    meta: dateFormat.format(post.published_at),
  };

  if (basis === 25) {
    return { ...common, type: 'news' };
  }
  return {
    ...common,
    type: 'article',
    rubric: post.categories[0]?.title ?? 'The Bell',
    image: pickImage(post),
  };
}

/** Основная картинка поста: роль 2, иначе 8, иначе любая. */
function pickImage(post: ApiPost): string {
  const byRole = (role: number) => post.assets.find((a) => a.role === role)?.src;
  return byRole(2) ?? byRole(8) ?? post.assets[0]?.src ?? '';
}
