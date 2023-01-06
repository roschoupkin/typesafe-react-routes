import { isPathParam } from '../guards';
import { param } from '../param';

describe('guards', () => {
  test('returns correct result', () => {
    expect(isPathParam('path')).toBeFalsy();
    expect(isPathParam(param('param'))).toBeTruthy();
  });
});
