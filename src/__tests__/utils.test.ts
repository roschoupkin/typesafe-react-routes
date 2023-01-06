import { param } from '../param';
import { createTemplatePart } from '../utils';

describe('createTemplatePart', () => {
  test('returns correct template part', () => {
    expect(createTemplatePart('path')).toBe('path');
    expect(createTemplatePart(param('id'))).toBe(':id');
  });
});
