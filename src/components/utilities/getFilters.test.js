import { init } from '@folio/stripes/core';
import getFilters from './getFilters';

jest.mock('jsonpath-plus', () => ({
  JSONPath: jest.fn(),
}));

describe('getFilters', () => {
  test('returns correct filter mapping, names, and options from config', () => {
    const filters = getFilters();

    expect(filters).toEqual({
      filterMap: {
        type: 'componentType',
      },
      filterNames: ['type'],
      filterOptions: {
        type: [
          { label: 'all', value: 'Title' },
          { label: 'book', value: 'Book' },
          { label: 'database', value: 'Database' },
          { label: 'journal', value: 'Journal' },
          { label: 'other', value: 'Other' },
        ]
      },
      initialFilterState: {
        type: ['Title'],
      },
    });
  });
});
