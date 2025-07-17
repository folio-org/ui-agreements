import { JSONPath } from 'jsonpath-plus';
import {
  getEndpointData,
  getResultColumns,
  getStringFormatter,
  getArrayFormatter,
  getArrayOfObjectsFormatter,
  getSpecialFormatter,
  getFormatter
} from './gokbConfigUtils';

jest.mock('jsonpath-plus', () => ({
  JSONPath: jest.fn(),
}));

describe('gokbConfigUtils', () => {
  describe('getEndpointData', () => {
    test('returns endpoint and mapping keys', () => {
      const data = getEndpointData();
      expect(data).toEqual({
        endpoint: 'https://gokbt.gbv.de/gokb/api/find',
        results: 'records',
        totalRecords: 'count',
      });
    });
  });

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
      const result = formatter.isbns({});
      expect(result).toEqual('one, two');
    });
  });

  describe('getArrayOfObjectsFormatter', () => {
    test('formats otherids array of objects correctly', () => {
      JSONPath.mockReturnValue([
        { namespaceName: 'ns1', value: 'v1' },
        { namespaceName: 'ns2', value: 'v2' },
      ]);

      const formatter = getArrayOfObjectsFormatter();
      const result = formatter.otherids({});
      expect(result).toBe('ns1: v1, ns2: v2');
    });

    test('formats subjects array of objects correctly', () => {
      JSONPath.mockReturnValue([
        { scheme: 'scheme1', heading: 'heading1' },
        { scheme: 'scheme2', heading: 'heading2' },
      ]);

      const formatter = getArrayOfObjectsFormatter();
      const result = formatter.subjects({});
      expect(result).toBe('scheme1: heading1, scheme2: heading2');
    });
  });

  describe('getSpecialFormatter', () => {
    test('publicationType formatter removes "Instance" suffix', () => {
      JSONPath.mockReturnValue(['BookInstance']);

      const formatter = getSpecialFormatter();
      const result = formatter.publicationType({});
      expect(result).toEqual(['Book']);
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
    test('merges string, array, array-of-objects, and special formatters into a single object', () => {
      const formatter = getFormatter();
      expect(Object.keys(formatter).length).toBeGreaterThan(0);
      expect(typeof Object.values(formatter)[0]).toBe('function');
    });
  });
});
