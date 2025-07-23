import { buildSearchComponent, searchComponentConstructors, processSearchOptions } from './searchComponentBuilder';
import { transformSearchParameter } from './searchTransformation';

// Mock the transformation function
jest.mock('./searchTransformation', () => ({
  transformSearchParameter: jest.fn(),
  buildSearchOptions: jest.fn(() => [
    { key: 'keyword', value: 'keyword', label: 'Keyword' },
    { key: 'name', value: 'name', label: 'Name' }
  ])
}));

describe('searchComponentBuilder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchComponentConstructors', () => {
    describe('queryDropdown', () => {
      it('should create a queryDropdown component configuration', () => {
        const config = {
          type: 'queryDropdown',
          options: [
            { name: 'keyword', type: 'Handlebars', parameter: 'q={{string}}' }
          ]
        };

        const options = {
          onChange: jest.fn(),
          value: 'keyword',
          id: 'test-dropdown'
        };

        const result = searchComponentConstructors.queryDropdown(config, options);

        expect(result.type).toBe('queryDropdown');
        expect(result.component).toBeDefined();
        expect(result.options).toBeDefined();
        expect(result.handleSearchTransformation).toBeInstanceOf(Function);
        expect(result.getSASQMapUpdate).toBeInstanceOf(Function);
      });

      it('should handle search transformation correctly', () => {
        const config = {
          type: 'queryDropdown',
          options: [
            { name: 'keyword', type: 'Handlebars', parameter: 'q={{string}}' }
          ]
        };

        transformSearchParameter.mockReturnValue('q=test');

        const result = searchComponentConstructors.queryDropdown(config);
        const transformResult = result.handleSearchTransformation('keyword', 'test');

        expect(transformSearchParameter).toHaveBeenCalledWith(config, 'keyword', 'test');
        expect(transformResult).toBe('q=test');
      });

      it('should return correct SASQ map update', () => {
        const config = { type: 'queryDropdown' };
        const result = searchComponentConstructors.queryDropdown(config);
        const sasqUpdate = result.getSASQMapUpdate('name');

        expect(sasqUpdate).toEqual({ searchKey: 'name' });
      });
    });

    describe('static', () => {
      it('should create a static component configuration', () => {
        const config = { type: 'static' };
        const options = { searchKey: 'customKey' };

        const result = searchComponentConstructors.static(config, options);

        expect(result.type).toBe('static');
        expect(result.component).toBeNull();
        expect(result.getSASQMapUpdate()).toEqual({ searchKey: 'customKey' });
      });
    });
  });

  describe('buildSearchComponent', () => {
    it('should build component using the correct constructor', () => {
      const config = {
        type: 'queryDropdown',
        options: []
      };

      const result = buildSearchComponent(config);

      expect(result).toBeDefined();
      expect(result.type).toBe('queryDropdown');
    });

    it('should return null for invalid config', () => {
      const result = buildSearchComponent(null);
      expect(result).toBeNull();
    });

    it('should return null for unknown component type', () => {
      const config = { type: 'unknown' };
      const result = buildSearchComponent(config);
      expect(result).toBeNull();
    });
  });

  describe('processSearchOptions', () => {
    it('should process Handlebars options correctly', () => {
      const options = [
        { name: 'keyword', type: 'Handlebars', parameter: 'q={{string}}' },
        { name: 'name', type: 'Static', parameter: 'name=test' }
      ];

      const result = processSearchOptions(options);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('processor');
      expect(result[0].processor).toBeInstanceOf(Function);
      expect(result[1]).not.toHaveProperty('processor');
    });

    it('should handle empty options array', () => {
      const result = processSearchOptions([]);
      expect(result).toEqual([]);
    });
  });
});
