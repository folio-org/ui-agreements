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

const kbKey = 'gokb';

describe('getFilterConfig', () => {
  test('returns correct filterMap', () => {
    const { filterMap } = getFilterConfig(mockConfig, kbKey);

    expect(filterMap).toEqual({
      type: 'componentType',
      dummy: 'dummy',
    });
  });

  test('returns correct filterNames', () => {
    const { filterNames } = getFilterConfig(mockConfig, kbKey);

    expect(filterNames).toEqual(['type', 'dummy']);
  });

  test('returns correct filterTypes', () => {
    const { filterTypes } = getFilterConfig(mockConfig, kbKey);

    expect(filterTypes).toEqual({
      type: 'singleSelect',
      dummy: 'multiSelect',
    });
  });

  test('returns correct filterOptions', () => {
    const { filterOptions } = getFilterConfig(mockConfig, kbKey);

    const getLabelIds = (options) => options.map(opt => opt.label.props.id);

    expect(getLabelIds(filterOptions.type)).toEqual([
      'ui-agreements.gokb.filters.type.all',
      'ui-agreements.gokb.filters.type.book',
      'ui-agreements.gokb.filters.type.journal',
    ]);

    expect(getLabelIds(filterOptions.dummy)).toEqual([
      'ui-agreements.gokb.filters.dummy.dummy1',
      'ui-agreements.gokb.filters.dummy.dummy2',
      'ui-agreements.gokb.filters.dummy.dummy3',
    ]);
  });

  test('returns correct initialFilterState', () => {
    const { initialFilterState } = getFilterConfig(mockConfig, kbKey);

    expect(initialFilterState).toEqual({
      type: ['Title'],
      dummy: ['one', 'three'],
    });
  });
});
