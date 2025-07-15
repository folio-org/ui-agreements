import { JSONPath } from 'jsonpath-plus';
import {
  getResultColumns,
  getStringFormatter,
  getArrayFormatter,
  getSpecialFormatter,
  getFormatter
} from './gokbConfigUtils';


jest.mock('jsonpath-plus', () => ({
  JSONPath: jest.fn(() => ['mocked-result']),
}));

describe('gokbConfigUtils', () => {
  describe('getResultColumns', () => {
    test('returns columns with propertyPath and FormattedMessage label', () => {
      const columns = getResultColumns();
      expect(columns).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ propertyPath: expect.any(String), label: expect.any(Object) })
        ])
      );
    });
  });

  describe('getStringFormatter', () => {
    test('returns formatter with functions that call JSONPath', () => {
      const formatter = getStringFormatter();
      Object.values(formatter).forEach(fn => {
        fn({});
      });
      expect(JSONPath).toHaveBeenCalled();
    });
  });

  describe('getArrayFormatter', () => {
    test('returns formatter with functions that call JSONPath and join results', () => {
      JSONPath.mockReturnValue(['one', 'two']);
      const formatter = getArrayFormatter();
      const result = Object.values(formatter)[0]({});
      expect(result).toEqual('one, two');
    });
  });

  describe('getSpecialFormatter', () => {
    test('otherids formatter formats JSONPath results', () => {
      JSONPath.mockReturnValue([
        { namespace: { name: 'ns1' }, value: 'val1' },
        { namespace: { value: 'ns2' }, value: 'val2' }
      ]);
      const formatter = getSpecialFormatter();
      const result = formatter.otherids({});
      expect(result).toBe('ns1: val1, ns2: val2');
    });

    test('subjects formatter formats JSONPath results', () => {
      JSONPath.mockReturnValue([
        { scheme: 'scheme1', heading: 'heading1' },
        { scheme: 'scheme2', heading: 'heading2' }
      ]);
      const formatter = getSpecialFormatter();
      const result = formatter.subjects({});
      expect(result).toBe('scheme1: heading1, scheme2: heading2');
    });

    test('publicationDates formatter returns a JSX element', () => {
      const formatter = getSpecialFormatter();
      const result = formatter.publicationDates({
        dateFirstOnline: '2020-01-01',
        dateFirstInPrint: '2010-01-01',
        publishedFrom: '2000-01-01',
        publishedTo: '2025-01-01',
      });
      expect(result).toBeInstanceOf(Object);
    });
  });

  describe('getFormatter', () => {
    test('merges string, array, and special formatters into a single object', () => {
      const formatter = getFormatter();
      expect(Object.keys(formatter).length).toBeGreaterThan(0);
      expect(typeof Object.values(formatter)[0]).toBe('function');
    });
  });
});
