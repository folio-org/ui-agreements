import getFilterConfig from './getFilterConfig';

const mockConfig = {
  configuration: {
    results: {
      fetch: {
        filters: [
          {
            name: 'type',
            filterPath: 'componentType',
            type: 'singleSelect',
            values: [
              { name: 'all', value: 'Title', default: true },
              { name: 'book', value: 'Book' },
              { name: 'journal', value: 'Journal' }
            ]
          },
          {
            name: 'dummy',
            filterPath: 'dummy',
            type: 'multiSelect',
            values: [
              { name: 'dummy1', value: 'one', default: true },
              { name: 'dummy2', value: 'two' },
              { name: 'dummy3', value: 'three', default: true }
            ]
          }
        ]

      }
    }
  }
};

describe('getFilterConfig', () => {
  test('returns correct filterMap', () => {
    const { filterMap } = getFilterConfig(mockConfig);

    expect(filterMap).toEqual({
      type: 'componentType',
      dummy: 'dummy',
    });
  });

  test('returns correct filterNames', () => {
    const { filterNames } = getFilterConfig(mockConfig);

    expect(filterNames).toEqual(['type', 'dummy']);
  });

  test('returns correct filterTypes', () => {
    const { filterTypes } = getFilterConfig(mockConfig);

    expect(filterTypes).toEqual({
      type: 'singleSelect',
      dummy: 'multiSelect',
    });
  });

  test('returns correct filterOptions', () => {
    const { filterOptions } = getFilterConfig(mockConfig);

    const getLabelIds = (options) => options.map(opt => opt.label.props.id);

    expect(getLabelIds(filterOptions.type)).toEqual([
      'ui-agreements.remoteKb.filters.type.all',
      'ui-agreements.remoteKb.filters.type.book',
      'ui-agreements.remoteKb.filters.type.journal',
    ]);

    expect(getLabelIds(filterOptions.dummy)).toEqual([
      'ui-agreements.remoteKb.filters.dummy.dummy1',
      'ui-agreements.remoteKb.filters.dummy.dummy2',
      'ui-agreements.remoteKb.filters.dummy.dummy3',
    ]);
  });

  test('returns correct initialFilterState', () => {
    const { initialFilterState } = getFilterConfig(mockConfig);

    expect(initialFilterState).toEqual({
      type: ['Title'],
      dummy: ['one', 'three'],
    });
  });
});
