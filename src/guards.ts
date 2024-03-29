import type { RoutePart, RouteParam } from './types';

export function isPathParam<TParam extends string>(
  part: RoutePart<TParam, string>
): part is RouteParam<TParam> {
  return typeof part !== 'string' && Boolean(part.param);
}
