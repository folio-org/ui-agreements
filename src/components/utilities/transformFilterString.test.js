import transformFilterString from './transformFilterString';

jest.mock('../../../docs/gokb-search-v1', () => ({
  configuration: {
    results: {
      fetch: {
        filters: {
          group: true,
          prefix: 'filters',
          filterString: {
            type: 'Handlebars',
            templateString: '{{filter}}.value=={{value}}'
          },
          renderStrategy: {
            type: 'joinString',
            separator: '||'
          },
          options: [
            { name: 'type', filterPath: 'componentType', type: 'singleSelect' },
            { name: 'dummy', filterPath: 'dummy', type: 'multiSelect' }
          ]
        }
      }
    }
  }
}));

describe('transformFilterString', () => {
  let configMock;

  beforeEach(() => {
    configMock = jest.requireMock('../../../docs/gokb-search-v1');
  });

  test('returns grouped filter strings with prefix when group is true', () => {
    configMock.configuration.results.fetch.filters.group = true;

    const input = 'type.Book,dummy.d1,dummy.d2';
    const result = transformFilterString(input);

    expect(result).toBe(
      'filters=componentType.value==Book&filters=dummy.value==d1||dummy.value==d2'
    );
  });

  test('returns flat filter string with single prefix when group is false', () => {
    configMock.configuration.results.fetch.filters.group = false;

    const input = 'type.Book,dummy.d1,dummy.d2';
    const result = transformFilterString(input);

    expect(result).toBe(
      'filters=componentType.value==Book||dummy.value==d1||dummy.value==d2'
    );
  });

  test('returns flat filter string without prefix when group is false and prefix is empty', () => {
    configMock.configuration.results.fetch.filters.group = false;
    configMock.configuration.results.fetch.filters.prefix = '';

    const input = 'type.Book,dummy.d1,dummy.d2';
    const result = transformFilterString(input);

    expect(result).toBe(
      'componentType.value==Book||dummy.value==d1||dummy.value==d2'
    );
  });
});
