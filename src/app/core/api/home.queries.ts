/** Раскладка страницы из конструктора: линии и виджеты с шириной. */
export const LAYOUT_QUERY = `
  query getLayoutThemesByRoute($routeSlug: String!, $ignoreCache: Boolean!) {
    getLayoutThemesByRoute(routeSlug: $routeSlug, ignoreCache: $ignoreCache) {
      items {
        sort
        layoutItem {
          ... on LayoutLine {
            id
            slug
            widgets { id basis }
          }
        }
      }
    }
  }
`;

/** Свежие посты для главной, по одному на позицию в раскладке. */
export const POSTS_QUERY = `
  query getLayoutData($input: GetLayoutDataInput!) {
    getLayoutData(input: $input) {
      position
      contentItem {
        ... on Post {
          id
          slug
          title
          published_at
          categories { title }
          assets { src role }
        }
      }
    }
  }
`;
