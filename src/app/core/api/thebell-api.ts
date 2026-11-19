import { HttpResourceRequest } from '@angular/common/http';

const GRAPHQL_URL = 'https://thebell.io/api/v2/graphql';

/** Запрос к GraphQL API thebell.io для httpResource. Куки пользователя не отправляем. */
export function graphqlRequest(
  query: string,
  variables: Record<string, unknown>,
): HttpResourceRequest {
  return {
    url: GRAPHQL_URL,
    method: 'POST',
    body: { query, variables },
    credentials: 'omit',
  };
}

/** GraphQL отвечает 200 даже с ошибками, поэтому проверяем `errors` сами. */
export function readGraphqlData<T>(raw: unknown): T {
  const response = raw as { data?: T; errors?: { message: string }[] };
  if (response.errors?.length || !response.data) {
    throw new Error(response.errors?.[0]?.message ?? 'Пустой ответ API');
  }
  return response.data;
}
