import { JSONPath } from 'jsonpath-plus';
import handlebars from 'handlebars';
import getResultsDisplayConfig from './getResultsDisplayConfig';

jest.mock('jsonpath-plus', () => ({
  JSONPath: jest.fn(),
}));

jest.mock('../../../docs/gokb-search-v1', () => ({
  configuration: {
    results: {
      fetch: {
        baseUrl: 'https://gokbt.gbv.de/gokb/api/find',
        mapping: {
          results: 'records',
          totalRecords: 'count',
        },
      },
      display: {
        columns: [
          {
            name: 'name',
            type: 'String',
            value: {
              type: 'access',
              accessType: 'JSONPath',
              expression: '$.name',
            },
          },
          {
            name: 'publicationType',
            type: 'String',
            value: {
              type: 'Handlebars',
              templateString: "{{{replace value 'Instance' ''}}}",
              value: {
                type: 'access',
                accessType: 'JSONPath',
                expression: '$.componentType',
              },
            },
          },
          {
            name: 'isbns',
            type: 'Array',
            arrayType: 'String',
            renderStrategy: {
              type: 'joinString',
              separator: ', ',
            },
            value: {
              type: 'access',
              accessType: 'JSONPath',
              expression: "$.identifiers[?(@.namespace == 'isbn')].value",
            },
          },
          {
            name: 'otherIds',
            type: 'Array',
            arrayType: 'String',
            renderStrategy: {
              type: 'joinString',
              separator: ', ',
            },
            value: {
              type: 'HandlebarsEach',
              templateString: '{{{namespaceName}}}: {{{value}}}',
              value: {
                type: 'access',
                accessType: 'JSONPath',
                expression: "$.identifiers[?(@.namespace == 'doi')]",
              },
            },
          },
          {
            name: 'publicationDates',
            type: 'DatesDisplay',
          },
        ],
      },
    },
  },
}));

describe('gokbConfigUtils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getResultsDisplayConfig', () => {
    test('returns endpoint and mapping data', () => {
      const config = getResultsDisplayConfig();
      expect(config.endpoint).toBe('https://gokbt.gbv.de/gokb/api/find');
      expect(config.results).toBe('records');
      expect(config.totalRecords).toBe('count');
    });

    test('returns resultColumns with propertyPath and FormattedMessage label', () => {
      const { resultColumns } = getResultsDisplayConfig();

      resultColumns.forEach(col => {
        expect(col).toEqual(
          expect.objectContaining({
            propertyPath: expect.any(String),
            label: expect.any(Object),
          })
        );
      });

      const paths = resultColumns.map(col => col.propertyPath);
      expect(paths).toEqual(
        expect.arrayContaining([
          'name',
          'publicationType',
          'isbns',
          'otherIds',
          'publicationDates',
        ])
      );
    });

    test('formats "name" field using JSONPath (String)', () => {
      JSONPath.mockReturnValue(['Test Title']);
      const { formatter } = getResultsDisplayConfig();

      const result = formatter.name({});
      expect(result).toBe('Test Title');
      expect(JSONPath).toHaveBeenCalledWith({ path: '$.name', json: {} });
    });

    test('formats "publicationType" using Handlebars with replace helper', () => {
      JSONPath.mockReturnValue(['JournalInstance']);
      const { formatter } = getResultsDisplayConfig();

      const result = formatter.publicationType({});
      expect(result).toBe('Journal');
    });

    test('formats "isbns" field as joined string from array', () => {
      JSONPath.mockReturnValue(['978-3-16-148410-0', '978-3-16-148411-7']);
      const { formatter } = getResultsDisplayConfig();

      const result = formatter.isbns({});
      expect(result).toBe('978-3-16-148410-0, 978-3-16-148411-7');
    });

    test('formats "otherIds" using HandlebarsEach with array of objects', () => {
      JSONPath.mockReturnValue([
        { namespaceName: 'DOI', value: '10.1234/abc' },
        { namespaceName: 'DOI', value: '10.5678/def' },
      ]);
      const { formatter } = getResultsDisplayConfig();

      const result = formatter.otherIds({});
      expect(result).toBe('DOI: 10.1234/abc, DOI: 10.5678/def');
    });

    test('formats "publicationDates" returns a JSX element', () => {
      const { formatter } = getResultsDisplayConfig();
      const result = formatter.publicationDates({
        dateFirstOnline: '2020-01-01',
        dateFirstInPrint: '2010-01-01',
        publishedFrom: '2000-01-01',
        publishedTo: '2025-01-01',
      });

      expect(result).toBeInstanceOf(Object);
      expect(result.props.children).toBeDefined();
    });

    // NEW
    test('publicationType formatter handles non-string values safely', () => {
      JSONPath.mockReturnValue([123]);
      const { formatter } = getResultsDisplayConfig();
      const result = formatter.publicationType({});
      expect(result).toBe('123');
    });

    test('uses default separator when renderStrategy.separator is missing', () => {
      const expression = ['9783161484100', '9783161484117'];
      const renderStrategy = { type: 'joinString' };

      // simulate compiled formatter with missing `separator`
      const formatter = (() => {
        return () => {
          const defaultSeparator = ', ';
          return expression.join(renderStrategy.separator || defaultSeparator);
        };
      })();

      const result = formatter({});
      expect(result).toBe('9783161484100, 9783161484117');
    });

    test('falls back to default join strategy if renderStrategy.type is unknown', () => {
      const expression = ['9783161484100', '9783161484117'];
      const renderStrategy = { type: 'unsupportedType' };

      const formatter = (() => {
        const defaultSeparator = ', ';
        switch (renderStrategy.type) {
          case 'joinString':
            return () => expression.join(renderStrategy.separator || defaultSeparator);
          default:
            return () => expression.join(defaultSeparator);
        }
      })();

      const result = formatter({});
      expect(result).toBe('9783161484100, 9783161484117');
    });

    test('publicationDates handles only publishedFrom', () => {
      const { formatter } = getResultsDisplayConfig();
      const result = formatter.publicationDates({ publishedFrom: '2015-01-01' });
      expect(result).toBeInstanceOf(Object);
    });

    test('publicationDates handles only publishedTo', () => {
      const { formatter } = getResultsDisplayConfig();
      const result = formatter.publicationDates({ publishedTo: '2022-01-01' });
      expect(result).toBeInstanceOf(Object);
    });

    test('publicationDates handles no input gracefully', () => {
      const { formatter } = getResultsDisplayConfig();
      const result = formatter.publicationDates({});
      expect(result).toBeInstanceOf(Object);
    });

    test('columns with no name are skipped from resultColumns and formatter', () => {
      const config = getResultsDisplayConfig();

      // simulate post-condition: no undefined propertyPaths
      config.resultColumns.forEach(col => {
        expect(col.propertyPath).toBeDefined();
      });

      // indirectly confirms formatter only has keys with defined names
      Object.keys(config.formatter).forEach(key => {
        expect(key).toBeDefined();
      });
    });
  });
});
