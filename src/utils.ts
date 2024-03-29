import { isPathParam } from './guards';
import type { RoutePart, URLQueryObject, URLQueryObjectBaseValue } from './types';

export const createTemplatePart = (part: RoutePart<string, string>) =>
  isPathParam(part) ? `:${part.param}` : part;

export const typedObjectKeys = <TObj extends Record<string, unknown>>(
  obj: TObj
): Array<keyof TObj> => Object.keys(obj);

export const ensureArray = <T = unknown>(arg: T | T[]): T[] => (Array.isArray(arg) ? arg : [arg]);

export function convertQueryValue(value: URLQueryObjectBaseValue): string {
  switch (typeof value) {
    case 'boolean':
      return value ? '1' : '0';
    case 'number':
      return Number.isNaN(value) ? '' : value.toString();
    default:
      return value ?? '';
  }
}

export function stringifyQuery(query: URLQueryObject) {
  const urlSearchParams = new URLSearchParams();

  for (const [queryParamKey, queryParamValue] of Object.entries(query)) {
    const appendToSearchParams = (value: string) => {
      urlSearchParams.append(queryParamKey, value);
    };

    const valueList = ensureArray(queryParamValue)
      .map(convertQueryValue)
      .filter((value) => value !== '');

    if (valueList.length > 0) {
      valueList.forEach(appendToSearchParams);
    }
  }

  return urlSearchParams.toString();
}
