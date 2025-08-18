import transformFilterString from './transformFilterString';

const mockConfig = {
  configuration: {
    results: {
      fetch: {
        filters: [
          {
            name: 'type',
            filterPath: 'componentType',
            type: 'singleSelect',
            filterString: {
              type: 'Handlebars',
              templateString: "{{{buildFilterString valuesArray 'componentType' '=' '&&'}}}"
            }
          },
          {
            name: 'dummy',
            filterPath: 'dummy',
            type: 'multiSelect',
            filterString: {
              type: 'Handlebars',
              templateString: "({{{buildFilterString valuesArray 'dummy' '==' '||'}}})"
            }
          }
        ]

      }
    }
  }
};

describe('transformFilterString', () => {
  test('returns expected filter string', () => {
    const input = 'type.Book,dummy.d1,dummy.d2';
    const result = transformFilterString(input, mockConfig);

    expect(result).toBe(
      'componentType=Book&(dummy==d1||dummy==d2)'
    );
  });
});
