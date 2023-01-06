import { param } from '../param';
import { route } from '../route';

describe('template', () => {
  test('without param', () => {
    expect(route('path', 'anywhere').template()).toBe('/path/anywhere');
  });

  test('with param', () => {
    expect(route('path', param('id')).template()).toBe('/path/:id');
  });
});

describe('create', () => {
  test('without param', () => {
    expect(route('path', 'anywhere').create({})).toBe('/path/anywhere');
  });

  test('with param', () => {
    expect(route('path', param('id')).create({ id: '1' })).toBe('/path/1');
  });

  test('with empty query', () => {
    expect(route('path', 'anywhere').create({}, {})).toBe('/path/anywhere');
    expect(route('path', 'anywhere').create({}, { empty: '' })).toBe('/path/anywhere');
  });
});

describe('withQueryParams', () => {
  test('with one query and one call', () => {
    const path = route('path', 'anywhere').withQueryParams('param');

    expect(path.create({}, { param: 'param' })).toBe('/path/anywhere?param=param');
  });

  test('with several queries and one call', () => {
    const path = route('path', 'anywhere').withQueryParams('param', 'param1');

    expect(path.create({}, { param: 'param', param1: 'param1' })).toBe(
      '/path/anywhere?param=param&param1=param1'
    );
  });

  test('with several queries and several calls', () => {
    const path = route('path', 'anywhere')
      .withQueryParams('param', 'param1')
      .withQueryParams('param2');

    expect(path.create({}, { param: 'param', param1: 'param1', param2: 'param2' })).toBe(
      '/path/anywhere?param=param&param1=param1&param2=param2'
    );
  });

  test('with param and with one query and one call', () => {
    const path = route('path', param('id')).withQueryParams('param');

    expect(path.create({ id: '1' }, { param: 'param' })).toBe('/path/1?param=param');
  });

  test('with param and with several queries and one call', () => {
    const path = route('path', param('id')).withQueryParams('param', 'param1');

    expect(path.create({ id: '1' }, { param: 'param', param1: 'param1' })).toBe(
      '/path/1?param=param&param1=param1'
    );
  });

  test('with param and with several queries and several calls', () => {
    const path = route('path', param('id'))
      .withQueryParams('param', 'param1')
      .withQueryParams('param2');

    expect(path.create({ id: '1' }, { param: 'param', param1: 'param1', param2: 'param2' })).toBe(
      '/path/1?param=param&param1=param1&param2=param2'
    );
  });
});

describe('withAddParts', () => {
  test('with string part', () => {
    const path = route('path').withAddParts('anywhere');

    expect(path.template()).toBe('/path/anywhere');
    expect(path.create({})).toBe('/path/anywhere');
  });

  test('with param part', () => {
    const path = route('path').withAddParts(param('id'));

    expect(path.template()).toBe('/path/:id');
    expect(path.create({ id: '1' })).toBe('/path/1');
  });

  test('with mixed parts', () => {
    const path = route('path').withAddParts(param('id'), 'do');

    expect(path.template()).toBe('/path/:id/do');
    expect(path.create({ id: '1' })).toBe('/path/1/do');
  });
});
