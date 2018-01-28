import { defaultRenderer } from './default_renderer';

describe('Value Renderer', () => {
  describe('defaultRenderer', () => {

    test('boolean value', () => {
      expect(defaultRenderer(true)).toMatchSnapshot();
      expect(defaultRenderer(false)).toMatchSnapshot();
    });

    test('numeric value', () => {
      expect(defaultRenderer(1234.567)).toMatchSnapshot();
    });

    test('string value', () => {
      expect(defaultRenderer('value')).toMatchSnapshot();
    });

    test('date value', () => {
      const value = new Date(1999, 0, 1, 2, 3, 4, 5);
      expect(defaultRenderer(value)).toMatchSnapshot();
    });

    test('array of dates', () => {
      const dates = [ new Date(1999, 0, 1, 2, 3, 4, 5) ];
      expect(defaultRenderer(dates)).toMatchSnapshot();
    });

    test('object value', () => {
      const obj = { key: 'value' };
      expect(defaultRenderer(obj)).toMatchSnapshot();
    });

  });
});
