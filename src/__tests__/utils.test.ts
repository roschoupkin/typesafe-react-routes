import { param } from '../param';
import {
  convertQueryValue,
  createTemplatePart,
  ensureArray,
  stringifyQuery,
  typedObjectKeys,
} from '../utils';

describe('createTemplatePart', () => {
  test('returns correct template part', () => {
    expect(createTemplatePart('path')).toBe('path');
    expect(createTemplatePart(param('id'))).toBe(':id');
  });
});

describe('typedObjectKeys', () => {
  test('return object keys', () => {
    expect(typedObjectKeys({ a: 1, b: 2 })).toStrictEqual(['a', 'b']);
  });
});

describe('ensureArray', () => {
  test('always return array', () => {
    expect(ensureArray(['value'])).toStrictEqual(['value']);
    expect(ensureArray('value')).toStrictEqual(['value']);
  });
});

describe('convertQueryValue', () => {
  test('boolean', () => {
    expect(convertQueryValue(true)).toBe('1');
    expect(convertQueryValue(false)).toBe('0');
  });

  test('number', () => {
    expect(convertQueryValue(Number.NaN)).toBe('');
    expect(convertQueryValue(1)).toBe('1');
    expect(convertQueryValue(2)).toBe('2');
  });

  test('other', () => {
    expect(convertQueryValue(null)).toBe('');
    expect(convertQueryValue(undefined)).toBe('');
    expect(convertQueryValue('string')).toBe('string');
  });
});

describe('stringifyQuery', () => {
  const cyrillicStr = 'кириллица';
  const encodedStr = encodeURIComponent(cyrillicStr);

  test.each([
    ['number', 0, 'number=0'],
    ['number', 1234, 'number=1234'],
    ['number', 12.34, 'number=12.34'],
    ['number', -1234, 'number=-1234'],
    ['boolean', true, 'boolean=1'],
    ['boolean', false, 'boolean=0'],
    ['string', 'value', 'string=value'],
    [cyrillicStr, 'value', `${encodedStr}=value`],
    ['string', cyrillicStr, `string=${encodedStr}`],
  ])('stringify %s with value %s to %s', (key, value, expected) => {
    expect(stringifyQuery({ [key]: value })).toBe(expected);
  });

  test.each([[''], [null], [undefined], [Number.NaN]])('%s should be empty string', (value) => {
    expect(stringifyQuery({ param: value })).toBe('');
  });

  test.each([
    ['boolean', [true, false], 'boolean=1&boolean=0'],
    ['number', [0, 1, 2, Number.NaN], 'number=0&number=1&number=2'],
    ['string', ['value', cyrillicStr], `string=value&string=${encodedStr}`],
  ])('%s with value %s should convert to %s', (key, value, expected) => {
    expect(stringifyQuery({ [key]: value })).toBe(expected);
  });

  test('do not stringify empty items in an array', () => {
    const query = {
      string: ['1', '', null, undefined, '0'] as string[],
      number: [1, Number.NaN, null, undefined, 0] as number[],
      boolean: [true, null, undefined, false] as boolean[],
    };

    expect(stringifyQuery(query)).toBe('string=1&string=0&number=1&number=0&boolean=1&boolean=0');
  });
});
