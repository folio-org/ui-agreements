import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Registry } from '@folio/handler-stripes-registry';
import RemoteKbResource from './RemoteKbResource';
import translationsProperties from '../../../../test/helpers';

jest.mock('@folio/handler-stripes-registry', () => ({
  Registry: {
    getResource: jest.fn(),
  },
}));

let resource;

jest.mock('@folio/stripes/core', () => {
  const actual = jest.requireActual('@folio/stripes/core');
  return {
    ...actual,
    AppIcon: ({ iconKey }) => <span>AppIcon:{iconKey}</span>,
  };
});

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Pane: ({ paneTitle, appIcon, children }) => (
    <div>
      <div data-testid="pane-title">
        {typeof paneTitle === 'string' ? paneTitle : (paneTitle?.props?.children || '')}
      </div>
      <div data-testid="pane-icon">{appIcon}</div>
      {children}
    </div>
  ),
  LoadingPane: () => <div>LoadingPane</div>,
  NoValue: () => <span>NoValue</span>,
  Headline: ({ children }) => <h2>{children}</h2>,
  KeyValue: ({ label, value }) => (
    <div className="kv">
      <span className="kv-label">{label?.props?.id || ''}</span>
      <span className="kv-value">{typeof value === 'string' ? value : value}</span>
    </div>
  ),
  MetaSection: () => <div>Meta</div>,
  MultiColumnList: ({ visibleColumns = [], contentData = [] }) => (
    <div data-rows={contentData.length} data-testid={`mcl-${visibleColumns.join('-')}`}>MCL</div>
  ),
  Accordion: ({ id, children, label }) => <div data-testid={`accordion-${id || label}`}>{children}</div>,
  AccordionStatus: ({ children }) => <div>{children}</div>,
  AccordionSet: ({ children }) => <div>{children}</div>,
  ExpandAllButton: () => <button type="button">ExpandAll</button>,
  Row: ({ children }) => <div className="row">{children}</div>,
  Col: ({ children }) => <div className="col">{children}</div>,
  HasCommand: ({ children }) => <div>{children}</div>,
  checkScope: () => true,
  collapseAllSections: jest.fn(),
  expandAllSections: jest.fn(),
}));

jest.mock('../../utilities', () => ({
  handlebarsCompile: (tpl) => (ctx) => {
    if (tpl.includes("{{{replace this 'Instance' ''}}}")) {
      return String(ctx || '').replace('Instance', '');
    }
    return String(ctx || '');
  },
  renderPublicationDates: (obj = {}) => {
    const hasAny = Object.keys(obj || {}).length > 0;
    return hasAny ? <span>Coverage</span> : null;
  },
  stableKeyFrom: (v) => `k${(JSON.stringify(v) || '').length}`,
}));

jest.mock('../../../routes/utilities/getResultsDisplayConfig', () => jest.fn((cols) => ({
  resultColumns: cols.map(c => ({ propertyPath: c.name, label: <span>{c.name}</span> })),
  sortableColumns: [],
  formatter: cols.reduce((acc, c) => {
    acc[c.name] = (row) => row[c.name] ?? row.namespaceName ?? row.value ?? row.altNames ?? '';
    return acc;
  }, {}),
})));

jest.mock('jsonpath-plus', () => ({
  JSONPath: jest.fn(({ path, json }) => {
    const r = json || {};
    switch (path) {
      case '$.name': return r.name != null ? [r.name] : [];
      case '$.dateCreated': return r.dateCreated != null ? [r.dateCreated] : [];
      case '$.lastUpdatedDisplay': return r.lastUpdatedDisplay != null ? [r.lastUpdatedDisplay] : [];
      case '$.componentType': return r.componentType != null ? [r.componentType] : []; // important for handlebars NoValue
      case '$.publishedFrom': return r.publishedFrom != null ? [r.publishedFrom] : [];
      case '$.publishedTo': return r.publishedTo != null ? [r.publishedTo] : [];
      case '$.publisherName': return r.publisherName != null ? [r.publisherName] : [];
      case '$.id': return r.id != null ? [r.id] : [];
      case '$.uuid': return r.uuid != null ? [r.uuid] : [];
      case '$.altname[*]': return Array.isArray(r.altname) ? r.altname : [];
      case '$.identifiers[*]': return Array.isArray(r.identifiers) ? r.identifiers : [];
      case '$.altNames': return [r.name].filter(Boolean);
      case '$.namespaceName': return (r.identifiers || []).map(i => i.namespaceName);
      case '$.value': return (r.identifiers || []).map(i => i.value);
      default: return [];
    }
  }),
}));

// --- Fixtures ---

const displayConfig = {
  title: { type: 'access', accessType: 'JSONPath', expression: '$.name' },
  icon: 'title',
  renderStrategy: {
    type: 'sections',
    values: [
      {
        name: 'info',
        collapsable: false,
        renderStrategy: {
          type: 'rows',
          values: [
            { type: 'heading', value: { type: 'access', accessType: 'JSONPath', expression: '$.name' } },
            {
              type: 'row',
              colCount: '1',
              values: [
                {
                  type: 'metadata',
                  createdDate: { type: 'access', accessType: 'JSONPath', expression: '$.dateCreated' },
                  lastUpdatedDate: { type: 'access', accessType: 'JSONPath', expression: '$.lastUpdatedDisplay' },
                },
              ],
            },
            {
              type: 'row',
              colCount: '1',
              values: [
                {
                  type: 'keyValue',
                  name: 'publicationType',
                  value: {
                    type: 'handlebars',
                    templateString: "{{{replace this 'Instance' ''}}}",
                    value: { type: 'access', accessType: 'JSONPath', expression: '$.componentType' },
                  },
                },
              ],
            },
            {
              type: 'row',
              colCount: '1',
              values: [
                {
                  name: 'publisher',
                  type: 'keyValue',
                  value: { type: 'access', accessType: 'JSONPath', expression: '$.publisherName' },
                },
              ],
            },
          ],
        },
      },
    ],
  },
};

const baseResource = {
  id: 828955,
  componentType: 'JournalInstance',
  name: 'The journal of philosophy',
  publisherName: 'Science Press',
  dateCreated: '2018-05-07T10:16:18Z',
  lastUpdatedDisplay: '2019-09-02T08:41:38Z',
  // used by the table test
  altname: ['Alt A', 'Alt B'],
  identifiers: [
    { namespaceName: 'p-ISSN', value: '0160-9335' },
  ],
};

// --- Tests ---

describe('RemoteKbResource', () => {
  const renderComp = (res = resource, cfg = displayConfig) => renderWithIntl(
    <MemoryRouter>
      <RemoteKbResource
        displayConfig={cfg}
        onClose={jest.fn()}
        queryProps={{ isLoading: false }}
        resource={res}
      />
    </MemoryRouter>,
    translationsProperties
  );

  beforeEach(() => {
    resource = { ...baseResource };
    jest.clearAllMocks();
  });

  test('shows LoadingPane when isLoading=true', () => {
    const { getByText } = renderWithIntl(
      <MemoryRouter>
        <RemoteKbResource
          displayConfig={displayConfig}
          onClose={jest.fn()}
          queryProps={{ isLoading: true }}
          resource={resource}
        />
      </MemoryRouter>,
      translationsProperties
    );
    expect(getByText('LoadingPane')).toBeInTheDocument();
  });

  test('renders pane title and AppIcon', () => {
    const { getByTestId } = renderComp();
    expect(getByTestId('pane-icon')).toHaveTextContent('AppIcon:title');
    expect(getByTestId('pane-title').textContent).toContain('journal of philosophy');
  });

  test('renders key values (handlebars + publisher)', () => {
    const { container, getByText } = renderComp();
    expect(container.querySelector('.kv-value')?.textContent).toContain('Journal');
    expect(getByText('Science Press')).toBeInTheDocument();
  });

  test('displayDates with no dates renders <NoValue/>', () => {
    const noDatesConfig = {
      icon: 'title',
      title: { type: 'access', accessType: 'JSONPath', expression: '$.name' },
      renderStrategy: {
        type: 'rows',
        values: [
          {
            type: 'displayDates',
            value: [
              { type: 'access', accessType: 'JSONPath', expression: '$.dateFirstOnline', key: 'dateFirstOnline' },
            ],
          },
        ],
      },
    };
    const noDatesResource = { ...baseResource, dateFirstOnline: null };
    const { getAllByText } = renderComp(noDatesResource, noDatesConfig);
    expect(getAllByText('NoValue').length).toBeGreaterThan(0);
  });

  test('handlebars with no value renders <NoValue/>', () => {
    const res = { ...baseResource, componentType: undefined };
    const { getAllByText } = renderComp(res);
    expect(getAllByText('NoValue').length).toBeGreaterThan(0);
  });

  test('collapsible rows with no visual content render accordion fallback (no rows inside)', () => {
    const cfg = {
      icon: 'title',
      title: { type: 'access', accessType: 'JSONPath', expression: '$.name' },
      renderStrategy: {
        type: 'sections',
        values: [
          {
            name: 'emptyAcc',
            collapsable: true,
            renderStrategy: {
              type: 'rows',
              values: [
                { type: 'access', accessType: 'Other', expression: '$.whatever' },
              ],
            },
          },
        ],
      },
    };

    const { getByTestId } = renderComp(baseResource, cfg);
    const acc = getByTestId('accordion-emptyAcc');
    expect(acc).toBeInTheDocument();
    expect(acc.querySelectorAll('.row').length).toBe(0);
  });

  test('registry branch calls Registry.getResource and its render function (props include setBadgeCount)', () => {
    const mockRenderFn = jest.fn(() => <div>RegistryOutput</div>);
    Registry.getResource.mockReturnValue({
      getRenderFunction: () => mockRenderFn,
    });

    const regCfg = {
      icon: 'title',
      title: { type: 'access', accessType: 'JSONPath', expression: '$.name' },
      renderStrategy: {
        type: 'rows',
        values: [
          {
            type: 'registry',
            registryResource: 'foo',
            registryRenderFunction: 'bar',
            props: [],
          },
        ],
      },
    };

    const { getByText } = renderComp(baseResource, regCfg);
    expect(mockRenderFn).toHaveBeenCalled();
    expect(mockRenderFn.mock.calls[0][0]).toHaveProperty('setBadgeCount');
    expect(getByText('RegistryOutput')).toBeInTheDocument();
  });

  test('table branch: renders MCL for primitive source array (altname)', () => {
    const tableCfg = {
      icon: 'title',
      title: { type: 'access', accessType: 'JSONPath', expression: '$.name' },
      renderStrategy: {
        type: 'rows',
        values: [
          {
            type: 'table',
            resource: { type: 'access', accessType: 'JSONPath', expression: '$.altname[*]' },
            columns: [
              { name: 'altNames', type: 'String', value: { type: 'access', accessType: 'JSONPath', expression: '$.altNames' } },
            ],
          },
        ],
      },
    };

    const { getByTestId } = renderComp(baseResource, tableCfg);
    expect(getByTestId('mcl-altNames')).toHaveAttribute('data-rows', '2');
  });
});
