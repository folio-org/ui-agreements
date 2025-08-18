import getFilterConfig from './getFilterConfig';

const mockConfig = [
  {
    name: 'type',
    filterPath: 'componentType',
    type: 'singleSelect',
    values: [
      { name: 'all', value: 'Title', default: true },
      { name: 'book', value: 'Book' },
      { name: 'journal', value: 'Journal' },
    ],
  },
  {
    name: 'dummy',
    filterPath: 'dummy',
    type: 'multiSelect',
    values: [
      { name: 'dummy1', value: 'one', default: true },
      { name: 'dummy2', value: 'two' },
      { name: 'dummy3', value: 'three', default: true },
    ],
  },
];

const kbKey = 'gokb';

describe('getFilterConfig', () => {
  test('returns correct filterMap', () => {
    const { filterMap } = getFilterConfig(mockConfig, kbKey);

    expect(filterMap).toEqual({
      type: 'componentType',
      dummy: 'dummy',
    });
  });

  test('returns correct initialFilterState', () => {
    const { initialFilterState } = getFilterConfig(mockConfig, kbKey);

    expect(initialFilterState).toEqual({
      type: ['Title'],
      dummy: ['one', 'three'],
    });
  });
});
