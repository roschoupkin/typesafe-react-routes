/**
 * Utils types
 */

export type URLQueryObjectArrayValue = boolean[] | number[] | string[];
export type URLQueryObjectBaseValue = boolean | number | string | null | undefined;
export type URLQueryObjectValue = URLQueryObjectArrayValue | URLQueryObjectBaseValue;
export type URLQueryObject = Record<string, URLQueryObjectValue>;

/**
 * Route params
 */

export interface RouteParam<TParam extends string> {
  param: TParam;
}

export type RoutePart<TParam extends string, TPart extends string> = RouteParam<TParam> | TPart;
export type RouteParts<TParams extends string, TPart extends string> = Array<
  RoutePart<TParams, TPart>
>;

/**
 * Query params
 */

export type QueryParamsKeys<TQuery extends string[]> = {
  [TIndex in keyof TQuery]: TQuery[TIndex];
}[number];

export type QueryParamsObject<TQuery extends string[]> = Record<
  QueryParamsKeys<TQuery>,
  URLQueryObjectValue
>;

export type QueryParams<TQuery extends string[]> = QueryParamsObject<TQuery> & URLQueryObject;

/**
 * Route methods types
 */

export type RouteCreateParams<TParts extends RouteParts<string, string>> =
  TParts extends RouteParts<infer TParams, string> ? Record<TParams, string> : never;

export type RouteCreateQuery<TQuery extends string[] = []> = TQuery extends []
  ? [query?: QueryParams<[]>]
  : [query: QueryParams<TQuery>];

export type RouteTemplate<
  TParts extends RouteParts<string, string>,
  TTemplate extends string = ''
> = TParts extends []
  ? TTemplate
  : TParts extends [infer TPart, ...infer TRest]
  ? TRest extends RouteParts<string, string>
    ? RouteTemplate<
        TRest,
        TPart extends RouteParam<infer TParam>
          ? `${TTemplate}/:${TParam}`
          : TPart extends string
          ? `${TTemplate}/${TPart}`
          : never
      >
    : never
  : never;
