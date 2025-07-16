import { FormattedMessage } from 'react-intl';
import {
  transformSearchParameter,
  buildSearchOptions,
  generateGokbQuery,
  getSearchableIndexes,
  searchableIndexes
} from './searchTransformation';

jest.mock('../../../docs/gokb-search-v1.json', () => ({
  configuration: {
    results: {
      fetch: {
        search: {
          options: [
            {
              name: 'keyword',
              type: 'Handlebars',
              parameter: 'q={{string}}'
            },
            {
              name: 'name',
              type: 'Handlebars',
              parameter: 'name={{string}}'
            },
            {
              name: 'altname',
              type: 'Handlebars',
              parameter: 'altname={{string}}'
            },
            {
              name: 'isbn',
              type: 'Handlebars',
              parameter: 'identifier=isbn,{{string}}'
            },
            {
              name: 'invalidType',
              type: 'SomeOtherType',
              parameter: 'invalid={{string}}'
            }
          ]
        }
      }
    }
  }
}));

jest.mock('handlebars', () => ({
  compile: jest.fn()
}));

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id }) => <span>{id}</span>
}));

describe('searchTransformation', () => {
  let mockHandlebars;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHandlebars = require('handlebars');
  });

  describe('transformSearchParameter', () => {
    it('should return empty string if searchConfig is null or undefined', () => {
      const result = transformSearchParameter(null, 'keyword', 'test');
      expect(result).toBe('');
    });

    it('should return empty string if searchConfig.options is null or undefined', () => {
      const result = transformSearchParameter({}, 'keyword', 'test');
      expect(result).toBe('');
    });

    it('should return empty string if searchString is empty', () => {
      const searchConfig = {
        options: [
          { name: 'keyword', type: 'Handlebars', parameter: 'q={{string}}' }
        ]
      };
      const result = transformSearchParameter(searchConfig, 'keyword', '');
      expect(result).toBe('');
    });

    it('should return empty string if searchOption is not found', () => {
      const searchConfig = {
        options: [
          { name: 'keyword', type: 'Handlebars', parameter: 'q={{string}}' }
        ]
      };
      const result = transformSearchParameter(searchConfig, 'nonexistent', 'test');
      expect(result).toBe('');
    });

    it('should return empty string if selectedOption type is not Handlebars', () => {
      const searchConfig = {
        options: [
          { name: 'keyword', type: 'SomeOtherType', parameter: 'q={{string}}' }
        ]
      };
      const result = transformSearchParameter(searchConfig, 'keyword', 'test');
      expect(result).toBe('');
    });

    it('should successfully compile template and return result', () => {
      const mockTemplate = jest.fn().mockReturnValue('q=test search');
      mockHandlebars.compile.mockReturnValue(mockTemplate);

      const searchConfig = {
        options: [
          { name: 'keyword', type: 'Handlebars', parameter: 'q={{string}}' }
        ]
      };

      const result = transformSearchParameter(searchConfig, 'keyword', 'test search');

      expect(mockHandlebars.compile).toHaveBeenCalledWith('q={{string}}');
      expect(mockTemplate).toHaveBeenCalledWith({ string: 'test search' });
      expect(result).toBe('q=test search');
    });

    it('should handle template compilation errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockHandlebars.compile.mockImplementation(() => {
        throw new Error('Template compilation failed');
      });

      const searchConfig = {
        options: [
          { name: 'keyword', type: 'Handlebars', parameter: 'q={{string}}' }
        ]
      };

      const result = transformSearchParameter(searchConfig, 'keyword', 'test');

      expect(consoleSpy).toHaveBeenCalledWith('Error in template compilation:', expect.any(Error));
      expect(result).toBe('');

      consoleSpy.mockRestore();
    });
  });

  describe('buildSearchOptions', () => {
    it('should return empty array if searchConfig is null or undefined', () => {
      const result = buildSearchOptions(null);
      expect(result).toEqual([]);
    });

    it('should return empty array if searchConfig.options is null or undefined', () => {
      const result = buildSearchOptions({});
      expect(result).toEqual([]);
    });

    it('should build search options with FormattedMessage labels', () => {
      const searchConfig = {
        options: [
          { name: 'keyword' },
          { name: 'name' },
          { name: 'isbn' }
        ]
      };

      const result = buildSearchOptions(searchConfig);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        key: 'keyword',
        label: <FormattedMessage id="ui-agreements.gokbSearch.searchIndex.keyword" />,
        value: 'keyword'
      });
      expect(result[1]).toEqual({
        key: 'name',
        label: <FormattedMessage id="ui-agreements.gokbSearch.searchIndex.name" />,
        value: 'name'
      });
      expect(result[2]).toEqual({
        key: 'isbn',
        label: <FormattedMessage id="ui-agreements.gokbSearch.searchIndex.isbn" />,
        value: 'isbn'
      });
    });
  });

  describe('generateGokbQuery', () => {
    beforeEach(() => {
      const mockTemplate = jest.fn().mockReturnValue('q=test search');
      mockHandlebars.compile.mockReturnValue(mockTemplate);
    });

    it('should generate basic query with default parameters', () => {
      const params = { page: 1, perPage: 25 };
      const query = {};
      const searchConfig = {
        options: [
          { name: 'keyword', type: 'Handlebars', parameter: 'q={{string}}' }
        ]
      };

      const result = generateGokbQuery(params, query, searchConfig);

      expect(result).toBe('?max=25&offset=0');
    });

    it('should include search parameter when query string is provided', () => {
      const params = { page: 1, perPage: 25 };
      const query = { query: 'test search', qindex: 'keyword' };
      const searchConfig = {
        options: [
          { name: 'keyword', type: 'Handlebars', parameter: 'q={{string}}' }
        ]
      };

      const result = generateGokbQuery(params, query, searchConfig);

      expect(result).toBe('?q=test search&max=25&offset=0');
    });

    it('should calculate correct offset for pagination', () => {
      const params = { page: 3, perPage: 50 };
      const query = {};
      const searchConfig = { options: [] };

      const result = generateGokbQuery(params, query, searchConfig);

      expect(result).toBe('?max=50&offset=100');
    });

    it('should include sort parameter when provided', () => {
      const params = { page: 1, perPage: 25 };
      const query = { sort: 'name' };
      const searchConfig = { options: [] };

      const result = generateGokbQuery(params, query, searchConfig);

      expect(result).toBe('?max=25&offset=0&sort=name');
    });

    it('should include order parameter when provided', () => {
      const params = { page: 1, perPage: 25 };
      const query = { order: 'desc' };
      const searchConfig = { options: [] };

      const result = generateGokbQuery(params, query, searchConfig);

      expect(result).toBe('?max=25&offset=0&order=desc');
    });

    it('should include both sort and order parameters when provided', () => {
      const params = { page: 1, perPage: 25 };
      const query = { sort: 'name', order: 'desc' };
      const searchConfig = { options: [] };

      const result = generateGokbQuery(params, query, searchConfig);

      expect(result).toBe('?max=25&offset=0&sort=name&order=desc');
    });

    it('should use default perPage when not provided', () => {
      const params = { page: 1 };
      const query = {};
      const searchConfig = { options: [] };

      const result = generateGokbQuery(params, query, searchConfig);

      expect(result).toBe('?max=25&offset=0');
    });
  });

  describe('getSearchableIndexes', () => {
    it('should return built search options from config', () => {
      const result = getSearchableIndexes();

      expect(result).toHaveLength(5);
      expect(result[0]).toEqual({
        key: 'keyword',
        label: <FormattedMessage id="ui-agreements.gokbSearch.searchIndex.keyword" />,
        value: 'keyword'
      });
      expect(result[1]).toEqual({
        key: 'name',
        label: <FormattedMessage id="ui-agreements.gokbSearch.searchIndex.name" />,
        value: 'name'
      });
    });
  });

  describe('searchableIndexes', () => {
    it('should export searchableIndexes constant', () => {
      expect(searchableIndexes).toBeDefined();
      expect(Array.isArray(searchableIndexes)).toBe(true);
      expect(searchableIndexes.length).toBeGreaterThan(0);
    });
  });
});
