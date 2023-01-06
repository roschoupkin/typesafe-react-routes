import type { RouteParam } from './types';

export function param<TParam extends string>(p: TParam): RouteParam<TParam> {
  return { param: p };
}
