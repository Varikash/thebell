/** Типы ответов API thebell.io: только те поля, что мы запрашиваем. */

export interface ApiLayoutLine {
  id: string;
  slug: string;
  widgets: { id: string; basis: number }[];
}

export interface ApiLayoutTheme {
  items: { sort: number; layoutItem: ApiLayoutLine | null }[];
}

export interface LayoutResponse {
  getLayoutThemesByRoute: ApiLayoutTheme[];
}

export interface ApiPost {
  id: string;
  slug: string;
  title: string;
  published_at: number;
  categories: { title: string }[];
  assets: { src: string; role: number }[];
}

export interface PostsResponse {
  getLayoutData: { position: number; contentItem: ApiPost }[];
}
