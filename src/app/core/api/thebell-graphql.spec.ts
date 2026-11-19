import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef, Injector, runInInjectionContext, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  GraphqlError,
  THEBELL_GRAPHQL_URL,
  ThebellGraphql,
  unwrapGraphqlResponse,
} from './thebell-graphql';

const URL = 'https://api.test/graphql';
const QUERY = 'query ping { ping }';

describe('unwrapGraphqlResponse', () => {
  it('returns data', () => {
    expect(unwrapGraphqlResponse<{ ping: string }>({ data: { ping: 'pong' } })).toEqual({
      ping: 'pong',
    });
  });

  it('throws GraphqlError when the body has errors, even with data', () => {
    expect(() =>
      unwrapGraphqlResponse({ data: null, errors: [{ message: 'Unknown field' }] }),
    ).toThrow(GraphqlError);
    expect(() => unwrapGraphqlResponse({ errors: [{ message: 'Unknown field' }] })).toThrow(
      'Unknown field',
    );
  });

  it('throws on an empty response', () => {
    expect(() => unwrapGraphqlResponse({ data: null })).toThrow(GraphqlError);
    expect(() => unwrapGraphqlResponse(null)).toThrow(GraphqlError);
  });
});

describe('ThebellGraphql', () => {
  let http: HttpTestingController;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: THEBELL_GRAPHQL_URL, useValue: URL },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    injector = TestBed.inject(Injector);
  });

  afterEach(() => http.verify());

  const create = <T>(variables?: () => Record<string, unknown> | undefined) =>
    runInInjectionContext(injector, () =>
      TestBed.inject(ThebellGraphql).resource<T>(QUERY, variables),
    );

  it('sends a POST with query and variables and exposes data', async () => {
    const res = create<{ ping: string }>(() => ({ slug: 'main' }));
    TestBed.tick();

    const req = http.expectOne(URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ query: QUERY, variables: { slug: 'main' } });
    expect(req.request.credentials).toBe('omit');
    req.flush({ data: { ping: 'pong' } });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(res.hasValue()).toBe(true);
    expect(res.value()).toEqual({ ping: 'pong' });
  });

  it('puts the resource into error state on GraphQL errors', async () => {
    const res = create();
    TestBed.tick();

    http.expectOne(URL).flush({ errors: [{ message: 'Boom' }] });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(res.error()).toBeInstanceOf(GraphqlError);
    expect(res.hasValue()).toBe(false);
  });

  it('does not send a request while variables are undefined', async () => {
    const vars = signal<Record<string, unknown> | undefined>(undefined);
    create(() => vars());
    TestBed.tick();
    http.expectNone(URL);

    vars.set({ id: 1 });
    TestBed.tick();
    http.expectOne(URL).flush({ data: {} });
  });
});
