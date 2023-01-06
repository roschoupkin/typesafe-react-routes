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

export type RoutePart<TParam extends string> = RouteParam<TParam> | string;
export type RouteParts<TParams extends string> = Array<RoutePart<TParams>>;

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

export type RouteCreateParams<TParts extends RouteParts<string>> = TParts extends RouteParts<
  infer TParams
>
  ? Record<TParams, string>
  : never;

export type RouteTemplate<
  TParts extends RouteParts<string>,
  TTemplate extends string = ''
> = TParts extends []
  ? TTemplate
  : TParts extends [infer TPart, ...infer TRest]
  ? TRest extends RouteParts<string>
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
