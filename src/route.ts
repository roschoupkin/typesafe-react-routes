import { isPathParam } from './guards';
import type { RouteParts, RouteTemplate } from './types';
import { createTemplatePart, typedObjectKeys, stringifyQuery } from './utils';
import { RouteCreateParams, RouteCreateQuery } from './types';

export class RouteCreator<TParts extends RouteParts<string, string>, TQuery extends string[] = []> {
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

  public readonly create = (
    params: RouteCreateParams<TParts>,
    ...[query]: RouteCreateQuery<TQuery>
  ) => {
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

  public readonly extendWith = <TPartsParams extends RouteParts<string, string>>(
    ...parts: TPartsParams
  ) =>
    new RouteCreator<[...TParts, ...TPartsParams], TQuery>([...this.parts, ...parts], this.query);
}

export function route<TParts extends RouteParts<string, string>>(...parts: TParts) {
  return new RouteCreator(parts);
}
