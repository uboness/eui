import { defaultRenderer } from './default_renderer';

describe('Value Renderer', () => {
  describe('defaultRenderer', () => {

    test('boolean value', () => {
      expect(defaultRenderer(true)).toBe('Yes');
      expect(defaultRenderer(false)).toBe('No');
    });

    test('numeric value', () => {
      expect(defaultRenderer(1234.567)).toBe('1234.567');
    });

    test('string value', () => {
      expect(defaultRenderer('value')).toBe('value');
    });

    test('date value', () => {
      const value = new Date(1999, 0, 1, 2, 3, 4, 5);
      expect(defaultRenderer(value)).toBe('1 Jan 1999 02:03');
    });

    test('array of dates', () => {
      const dates = [ new Date(1999, 0, 1, 2, 3, 4, 5) ];
      expect(defaultRenderer(dates)).toBe('1 Jan 1999 02:03');
    });

    test('object value', () => {
      const obj = { key: 'value' };
      expect(defaultRenderer(obj)).toBe(`{\"key\":\"value\"}`);
    });

  });
});
