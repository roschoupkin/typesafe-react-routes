import { isPathParam } from './guards';
import type { RouteParts, RouteCreateParams, RouteTemplate, QueryParams } from './types';
import { createTemplatePart, typedObjectKeys, stringifyQuery } from './utils';

export class RouteCreator<TParts extends RouteParts<string>, TQuery extends string[] = []> {
  private static readonly createQuery = stringifyQuery;
  private static readonly createTemplatePart = createTemplatePart;

  private readonly parts: TParts;
  private readonly query?: TQuery;

  constructor(parts: TParts, query?: TQuery) {
    this.parts = parts;
    this.query = query;
  }

  public readonly template = (): RouteTemplate<TParts> => {
    const normalized = this.parts.map(RouteCreator.createTemplatePart);
    return `/${normalized.join('/')}` as RouteTemplate<TParts>;
  };

  public readonly create = (params: RouteCreateParams<TParts>, query?: QueryParams<TQuery>) => {
    const baseParts = this.parts.map((part) => (isPathParam(part) ? params[part.param] : part));
    const baseUrl = ['', ...baseParts].join('/');

    if (query == null || typedObjectKeys(query).length === 0) {
      return baseUrl;
    }

    const queryString = RouteCreator.createQuery(query);
    return queryString !== '' ? `${baseUrl}?${queryString}` : baseUrl;
  };

  public readonly withQueryParams = <TQueryParams extends string[]>(
    ...query: Exclude<TQueryParams, TQuery>
  ) => new RouteCreator(this.parts, [...(this.query ?? []), ...query]);

  public readonly withAddParts = <TPartsParams extends RouteParts<string>>(
    ...parts: TPartsParams
  ) =>
    new RouteCreator<[...TParts, ...TPartsParams], TQuery>([...this.parts, ...parts], this.query);
}

export function route<TParts extends RouteParts<string>>(...parts: TParts) {
  return new RouteCreator(parts);
}
