import { httpResource, HttpResourceRef, HttpResourceRequest } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';

/** Адрес GraphQL API thebell.io. Вынесен в токен, чтобы подменять в тестах и окружениях. */
export const THEBELL_GRAPHQL_URL = new InjectionToken<string>('THEBELL_GRAPHQL_URL', {
  providedIn: 'root',
  factory: () => 'https://thebell.io/api/v2/graphql',
});

export type GraphqlVariables = Record<string, unknown>;

export interface GraphqlErrorItem {
  message: string;
  path?: (string | number)[];
}

/** Сервер ответил 200, но в теле лежат GraphQL-ошибки. */
export class GraphqlError extends Error {
  constructor(readonly errors: GraphqlErrorItem[]) {
    super(errors.map((e) => e.message).join('; ') || 'GraphQL error');
    this.name = 'GraphqlError';
  }
}

/**
 * Достаёт `data` из ответа GraphQL. GraphQL отдаёт ошибки со статусом 200,
 * поэтому `errors` в теле превращаем в исключение, иначе ресурс посчитает ответ успешным.
 */
export function unwrapGraphqlResponse<T>(raw: unknown): T {
  const response = raw as { data?: T | null; errors?: GraphqlErrorItem[] } | null;
  if (response?.errors?.length) {
    throw new GraphqlError(response.errors);
  }
  if (response?.data === undefined || response.data === null) {
    throw new GraphqlError([{ message: 'Пустой ответ GraphQL' }]);
  }
  return response.data;
}

/**
 * Транспорт до GraphQL API thebell.io. Умеет одно: выполнить переданный запрос
 * и вернуть его `data` как signal-ресурс. Какие запросы слать и как раскладывать
 * ответ, решают сервисы данных и мапперы.
 */
@Injectable({ providedIn: 'root' })
export class ThebellGraphql {
  private readonly url = inject(THEBELL_GRAPHQL_URL);

  /**
   * Создаёт ресурс для запроса на чтение. Вызывать в контексте инъекции
   * (в поле сервиса или компонента).
   *
   * @param query текст GraphQL-запроса
   * @param variables функция переменных; если она вернёт `undefined`, запрос не отправится
   *   (так строятся зависимые запросы)
   */
  resource<T, V extends GraphqlVariables = GraphqlVariables>(
    query: string,
    variables: () => V | undefined = () => ({}) as V,
  ): HttpResourceRef<T | undefined> {
    return httpResource<T>(
      () => {
        const vars = variables();
        return vars === undefined ? undefined : this.request(query, vars);
      },
      { parse: (raw) => unwrapGraphqlResponse<T>(raw) },
    );
  }

  private request(query: string, variables: GraphqlVariables): HttpResourceRequest {
    return {
      url: this.url,
      method: 'POST',
      body: { query, variables },
      // Куки пользователя в чужой API не отправляем.
      credentials: 'omit',
    };
  }
}
