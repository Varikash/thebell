import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { LAYOUT_QUERY, POSTS_QUERY } from '../../core/api/home.queries';
import { graphqlRequest, readGraphqlData } from '../../core/api/thebell-api';
import { LayoutResponse, PostsResponse } from '../../core/api/thebell-api.model';
import { toHomeLayout } from './home-layout.mapper';

/**
 * Живая главная thebell.io: сначала раскладка из конструктора,
 * потом столько свежих постов, сколько в ней слотов.
 */
@Injectable({ providedIn: 'root' })
export class HomeData {
  private readonly theme = httpResource(
    () => graphqlRequest(LAYOUT_QUERY, { routeSlug: 'main', ignoreCache: false }),
    {
      parse: (raw) => {
        const theme = readGraphqlData<LayoutResponse>(raw).getLayoutThemesByRoute[0];
        if (!theme) throw new Error('В API нет раскладки главной');
        return theme;
      },
    },
  );

  /** Сколько постов нужно: все слоты раскладки, кроме того, что занимает наша витрина. */
  private readonly postCount = computed(() =>
    this.theme.hasValue()
      ? this.theme.value().items.reduce((sum, i) => sum + (i.layoutItem?.widgets.length ?? 0), 0) -
        1
      : 0,
  );

  private readonly posts = httpResource(
    () => {
      const limit = this.postCount();
      if (limit <= 0) return undefined;
      return graphqlRequest(POSTS_QUERY, {
        input: {
          routeSlug: 'main',
          layoutOffset: 0,
          dataSets: [
            {
              type: 'ENDLESS_FEED',
              offset: 0,
              limit,
              filter: { postSize: 'ANY', onlyForMain: true },
            },
          ],
        },
      });
    },
    {
      parse: (raw) => readGraphqlData<PostsResponse>(raw).getLayoutData.map((i) => i.contentItem),
    },
  );

  readonly layout = computed(() =>
    this.theme.hasValue() && this.posts.hasValue()
      ? toHomeLayout(this.theme.value(), this.posts.value())
      : undefined,
  );

  readonly error = computed(() => this.theme.error() ?? this.posts.error());
}
