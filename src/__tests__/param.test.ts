import { param } from '../param';

describe('param', () => {
  test('returns correct param', () => {
    expect(param('id')).toStrictEqual({ param: 'id' });
  });
});
