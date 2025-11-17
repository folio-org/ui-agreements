import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import ky from 'ky';
import RemoteKBRoute from './RemoteKBRoute';
import translationsProperties from '../../../test/helpers';

let capturedProps = {};

/** Mocks */

jest.mock('@k-int/stripes-kint-components', () => ({
  ...jest.requireActual('@k-int/stripes-kint-components'),
  SASQRoute: (props) => {
    capturedProps = props;
    return <div>SASQRoute</div>;
  },
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  AppIcon: () => <span>AppIcon</span>,
}));

jest.mock('@folio/stripes/smart-components', () => ({
  ColumnManagerMenu: () => <div>ColumnManagerMenu</div>,
  useColumnManager: () => ({
    visibleColumns: ['name', 'publicationType'],
    toggleColumn: jest.fn(),
  }),
}));

jest.mock('../../../docs/gokb-search-v1', () => ({
  configuration: {
    results: {
      fetch: {
        baseUrl: 'https://example.org/find',
        mapping: { results: 'records', totalRecords: 'count' },
        search: { type: 'basic' },
        sort: { type: 'simple' },
      },
      display: { columns: [{ name: 'name' }, { name: 'publicationType' }, { name: 'publicationDates' }] },
    },
    view: {
      fetch: {
        baseUrl: 'https://example.org/resource',
        mapping: { data: 'records' },
        viewQueryUrl: {
          type: 'Handlebars',
          templateString: '{{endpoint}}?uuid={{resourceId}}'
        },
        viewQueryIdentifierKey: 'uuid'
      },
      display: { icon: 'titles' },
    },
  },
}));

jest.mock('../utilities/adjustments/searchConfigConstructor', () => ({
  searchConfigTypeHandler: jest.fn(() => ({
    searchParameterParse: (q) => ({ key: 'q', string: `q=${q}` }),
    HeaderComponent: () => <div>Header</div>,
  })),
}));

jest.mock('../../components/utilities', () => ({
  getFilterConfig: jest.fn(() => ({
    filterMap: { type: 'componentType' },
    initialFilterState: { pre: 'set' },
  })),
  transformFilterString: jest.fn((filters, _config) => (filters === 'type.Book' ? 'componentType=Book' : '')),
  handlebarsCompile: jest.fn((tpl) => (ctx) => tpl
    .replace('{{endpoint}}', ctx.endpoint)
    .replace('{{resourceId}}', ctx.resourceId)),
}));

jest.mock('../utilities/getSortConfig', () => jest.fn(() => ({
  sortQueryFunction: () => 'sort=title',
})));

jest.mock('../utilities/getResultsDisplayConfig', () => jest.fn(() => ({
  resultColumns: [
    { propertyPath: 'name', label: <span>Name</span> },
    { propertyPath: 'publicationType', label: <span>Type</span> },
    { propertyPath: 'publicationDates', label: <span>Dates</span> },
  ],
  sortableColumns: ['name'],
  formatter: {
    name: () => 'NAME',
    publicationType: () => 'TYPE',
    publicationDates: () => 'DATES',
  },
})));

// ky fetches
jest.mock('ky', () => ({
  get: jest.fn(() => ({
    json: jest.fn(() => Promise.resolve({
      count: 5,
      records: ['test-data'],
    })),
  })),
}));

/** Tests */

describe('RemoteKBRoute', () => {
  beforeEach(() => {
    capturedProps = {};
    ky.get.mockClear();
  });

  const renderComponent = () => renderWithIntl(
    <MemoryRouter>
      <RemoteKBRoute />
    </MemoryRouter>,
    translationsProperties
  );

  test('renders SASQRoute', () => {
    const { getByText } = renderComponent();
    expect(getByText('SASQRoute')).toBeInTheDocument();
  });

  test('passes resultColumns/formatter/sortableColumns to SASQRoute', () => {
    renderComponent();
    expect(capturedProps.resultColumns.map(c => c.propertyPath)).toEqual([
      'name',
      'publicationType',
      'publicationDates',
    ]);
    expect(capturedProps.mclProps.formatter.name()).toBe('NAME');
    expect(capturedProps.sasqProps.sortableColumns).toEqual(['name']);
  });

  test('mclProps.columnWidths includes publicationDates width', () => {
    renderComponent();
    expect(capturedProps.mclProps.columnWidths).toEqual({ publicationDates: 300 });
  });

  test('lookupQueryPromise fetches via ky', async () => {
    renderComponent();
    await capturedProps.lookupQueryPromise({
      _ky: {},
      queryParams: '',
      endpoint: 'https://example.org/find',
    });
    expect(ky.get).toHaveBeenCalled();
  });

  test('viewQueryPromise fetches via ky with uuid param (template branch)', async () => {
    renderComponent();
    await capturedProps.viewQueryPromise({
      _ky: {},
      resourceId: '123',
      endpoint: 'https://example.org/resource',
    });
    expect(ky.get).toHaveBeenCalledWith('https://example.org/resource?uuid=123');
  });

  test('lookupResponseTransform maps results and totalRecords from config mapping', () => {
    renderComponent();
    const transformed = capturedProps.lookupResponseTransform({
      count: 5,
      records: ['test-data'],
    });
    expect(transformed.totalRecords).toBe(5);
    expect(transformed.results).toEqual(['test-data']);
  });

  test('viewResponseTransform returns first element if array, otherwise object', () => {
    renderComponent();
    const arr = capturedProps.viewResponseTransform({ records: [{ id: 1 }, { id: 2 }] });
    expect(arr).toEqual({ id: 1 });

    const obj = capturedProps.viewResponseTransform({ records: { id: 9 } });
    expect(obj).toEqual({ id: 9 });
  });

  test('queryParameterGenerator builds expected query string (q, sort, filters, paging)', () => {
    renderComponent();
    const result = capturedProps.queryParameterGenerator(
      { page: 2, perPage: 10 },
      { query: 'foo', filters: 'type.Book' }
    );

    expect(result).toContain('q=foo');
    expect(result).toContain('sort=title');
    expect(result).toContain('componentType=Book');
    expect(result).toContain('max=10');
    expect(result).toContain('offset=10');
  });

  test('actionMenu renders ColumnManagerMenu', () => {
    renderComponent();
    const { actionMenu } = capturedProps.mainPaneProps;
    const { getByText } = renderWithIntl(actionMenu(), translationsProperties);
    expect(getByText('ColumnManagerMenu')).toBeInTheDocument();
  });

  test('initialFilterState is passed to SASQ via sasqProps', () => {
    renderComponent();
    expect(capturedProps.sasqProps.initialFilterState).toEqual({ pre: 'set' });
  });

  test('passes getNavigationIdentifier to SASQRoute as function', () => {
    renderComponent();
    expect(typeof capturedProps.getNavigationIdentifier).toBe('function');
    expect(capturedProps.getNavigationIdentifier({ uuid: 'abc' })).toBe('abc');
  });
});
