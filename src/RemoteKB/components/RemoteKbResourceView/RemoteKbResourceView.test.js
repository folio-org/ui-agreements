import React from 'react';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Registry } from '@folio/handler-stripes-registry';
import RemoteKbResourceView from './RemoteKbResourceView';
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
  Pane: (props) => {
    const { paneTitle, appIcon, children } = props;
    const menu =
      typeof props.actionMenu === 'function' ? props.actionMenu() : null;
    return (
      <div>
        <div data-testid="pane-title">
          {typeof paneTitle === 'string'
            ? paneTitle
            : paneTitle?.props?.children || ''}
        </div>
        <div data-testid="pane-icon">{appIcon}</div>
        <div data-testid="action-menu">{menu}</div>
        {children}
      </div>
    );
  },
  // Pane: ({ paneTitle, appIcon, children }) => (
  //   <div>
  //     <div data-testid="pane-title">{typeof paneTitle === 'string' ? paneTitle : (paneTitle?.props?.children || '')}</div>
  //     <div data-testid="pane-icon">{appIcon}</div>
  //     <div data-testid="action-menu">{typeof actionMenu === 'function' ? actionMenu() : null}</div>
  //     {children}
  //   </div>
  // ),
  LoadingPane: () => <div>LoadingPane</div>,
  NoValue: () => <span>NoValue</span>,
  Headline: ({ children }) => <h2>{children}</h2>,
  KeyValue: ({ label, value }) => (
    <div className="kv">
      <span className="kv-label">{label?.props?.id || ''}</span>
      <span className="kv-value">
        {typeof value === 'string' ? value : value}
      </span>
    </div>
  ),
  MetaSection: () => <div>Meta</div>,
  MultiColumnList: ({ visibleColumns = [], contentData = [] }) => (
    <div
      data-rows={contentData.length}
      data-testid={`mcl-${visibleColumns.join('-')}`}
    >
      MCL
    </div>
  ),
  Badge: ({ children }) => <span data-testid="badge">{children}</span>,
  Accordion: ({ id, label, displayWhenClosed, displayWhenOpen, children }) => (
    <div data-testid={`accordion-${id || label}`}>
      {displayWhenClosed}
      {displayWhenOpen}
      {children}
    </div>
  ),
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

jest.mock('../../utilities/getResultsDisplayConfig', () => jest.fn((cols) => ({
  resultColumns: cols.map((c) => ({
    propertyPath: c.name,
    label: <span>{c.name}</span>,
  })),
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
      case '$.name':
        return r.name != null ? [r.name] : [];
      case '$.dateCreated':
        return r.dateCreated != null ? [r.dateCreated] : [];
      case '$.lastUpdatedDisplay':
        return r.lastUpdatedDisplay != null ? [r.lastUpdatedDisplay] : [];
      case '$.componentType':
        return r.componentType != null ? [r.componentType] : [];
      case '$.publishedFrom':
        return r.publishedFrom != null ? [r.publishedFrom] : [];
      case '$.publishedTo':
        return r.publishedTo != null ? [r.publishedTo] : [];
      case '$.publisherName':
        return r.publisherName != null ? [r.publisherName] : [];
      case '$.id':
        return r.id != null ? [r.id] : [];
      case '$.uuid':
        return r.uuid != null ? [r.uuid] : [];
      case '$.altname[*]':
        return Array.isArray(r.altname) ? r.altname : [];
      case '$.identifiers[*]':
        return Array.isArray(r.identifiers) ? r.identifiers : [];
      case '$.subjects[*]':
        return Array.isArray(r.subjects) ? r.subjects : [];
      case '$.altNames':
        return [r.name].filter(Boolean);
      case '$.namespaceName':
        return (r.identifiers || []).map((i) => i.namespaceName);
      case '$.value':
        return (r.identifiers || []).map((i) => i.value);
      default:
        return [];
    }
  }),
}));

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
            {
              type: 'heading',
              value: {
                type: 'access',
                accessType: 'JSONPath',
                expression: '$.name',
              },
            },
            {
              type: 'row',
              colCount: '1',
              values: [
                {
                  type: 'metadata',
                  createdDate: {
                    type: 'access',
                    accessType: 'JSONPath',
                    expression: '$.dateCreated',
                  },
                  lastUpdatedDate: {
                    type: 'access',
                    accessType: 'JSONPath',
                    expression: '$.lastUpdatedDisplay',
                  },
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
                    value: {
                      type: 'access',
                      accessType: 'JSONPath',
                      expression: '$.componentType',
                    },
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
                  value: {
                    type: 'access',
                    accessType: 'JSONPath',
                    expression: '$.publisherName',
                  },
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
  altname: ['Alt A', 'Alt B'],
  identifiers: [{ namespaceName: 'p-ISSN', value: '0160-9335' }],
  subjects: [],
};

describe('RemoteKbResource', () => {
  const renderComp = (res = resource, cfg = displayConfig) => {
    const cfgWithActions = { ...cfg, actions: cfg.actions ?? { values: [] } };
    return renderWithIntl(
      <MemoryRouter>
        <RemoteKbResourceView
          displayConfig={cfgWithActions}
          onClose={jest.fn()}
          queryProps={{ isLoading: false }}
          resource={res}
        />
      </MemoryRouter>,
      translationsProperties
    );
  };

  beforeEach(() => {
    resource = { ...baseResource };
    jest.clearAllMocks();
  });

  test('shows LoadingPane when isLoading=true', () => {
    const { getByText } = renderWithIntl(
      <MemoryRouter>
        <RemoteKbResourceView
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
    expect(getByTestId('pane-title').textContent).toContain(
      'journal of philosophy'
    );
  });

  test('renders key values (handlebars + publisher) and label ids', () => {
    const { container, getByText } = renderComp();
    expect(container.querySelector('.kv-value')?.textContent).toContain(
      'Journal'
    );
    expect(getByText('Science Press')).toBeInTheDocument();
    expect(getByText('ui-agreements.remoteKb.publisher')).toBeInTheDocument();
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
              {
                type: 'access',
                accessType: 'JSONPath',
                expression: '$.dateFirstOnline',
                key: 'dateFirstOnline',
              },
            ],
          },
        ],
      },
    };
    const noDatesResource = { ...baseResource, dateFirstOnline: null };
    const { getAllByText } = renderComp(noDatesResource, noDatesConfig);
    expect(getAllByText('NoValue').length).toBeGreaterThan(0);
  });

  test('handlebars with no JSONPath value (value undefined) returns <NoValue/>', () => {
    const res = { ...baseResource, componentType: undefined };
    const { getAllByText } = renderComp(res);
    expect(getAllByText('NoValue').length).toBeGreaterThan(0);
  });

  test('handlebars non-access branch returns "" and row omitted (accordion fallback path)', () => {
    const cfg = {
      icon: 'title',
      title: { type: 'access', accessType: 'JSONPath', expression: '$.name' },
      renderStrategy: {
        type: 'sections',
        values: [
          {
            name: 'hbElse',
            collapsable: true,
            renderStrategy: {
              type: 'rows',
              values: [
                { type: 'access', accessType: 'Other', expression: '$.noop' },
              ],
            },
          },
        ],
      },
    };

    const { getByTestId } = renderComp(baseResource, cfg);
    const acc = getByTestId('accordion-hbElse');
    expect(acc.querySelectorAll('.row').length).toBe(0);
  });

  test('accordionset with >1 collapsible sections renders ExpandAllButton', () => {
    const cfg = {
      icon: 'title',
      title: { type: 'access', accessType: 'JSONPath', expression: '$.name' },
      renderStrategy: {
        type: 'sections',
        values: [
          {
            name: 'accordions',
            collapsable: true,
            renderStrategy: {
              type: 'accordionset',
              values: [
                {
                  name: 'sec1',
                  collapsable: true,
                  renderStrategy: {
                    type: 'rows',
                    values: [
                      {
                        type: 'keyValue',
                        name: 'publisher',
                        value: {
                          type: 'access',
                          accessType: 'JSONPath',
                          expression: '$.publisherName',
                        },
                      },
                    ],
                  },
                },
                {
                  name: 'sec2',
                  collapsable: true,
                  renderStrategy: {
                    type: 'rows',
                    values: [
                      {
                        type: 'keyValue',
                        name: 'publisher',
                        value: {
                          type: 'access',
                          accessType: 'JSONPath',
                          expression: '$.publisherName',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    };

    const { getByText } = renderComp(baseResource, cfg);
    expect(getByText('ExpandAll')).toBeInTheDocument();
  });

  test('badge rendering via registry setBadgeCount()', () => {
    const RegistryContent = ({ setBadgeCount }) => {
      React.useEffect(() => {
        setBadgeCount(7);
      }, [setBadgeCount]);
      return <div>RegistryContent</div>;
    };

    const mockRenderFn = jest.fn((props) => <RegistryContent {...props} />);
    Registry.getResource.mockReturnValue({
      getRenderFunction: () => mockRenderFn,
    });

    const cfg = {
      icon: 'title',
      title: { type: 'access', accessType: 'JSONPath', expression: '$.name' },
      renderStrategy: {
        type: 'sections',
        values: [
          {
            name: 'accordions',
            collapsable: true,
            renderStrategy: {
              type: 'accordionset',
              values: [
                {
                  name: 'withBadge',
                  collapsable: true,
                  badge: true,
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
                },
              ],
            },
          },
        ],
      },
    };

    const { getAllByTestId, getByText } = renderComp(baseResource, cfg);
    expect(getByText('RegistryContent')).toBeInTheDocument();
    const badges = getAllByTestId('badge');
    expect(badges.length).toBeGreaterThan(0);
    expect(badges.some((b) => b.textContent === '7')).toBe(true);
  });

  test('row kept when partially visual (hasVisualContent=true)', () => {
    const cfg = {
      icon: 'title',
      title: { type: 'access', accessType: 'JSONPath', expression: '$.name' },
      renderStrategy: {
        type: 'sections',
        values: [
          {
            name: 'vis',
            collapsable: true,
            renderStrategy: {
              type: 'rows',
              values: [
                {
                  type: 'row',
                  colCount: '2',
                  values: [
                    {
                      type: 'access',
                      accessType: 'Other',
                      expression: '$.noop',
                    },
                    {
                      type: 'keyValue',
                      name: 'publisher',
                      value: {
                        type: 'access',
                        accessType: 'JSONPath',
                        expression: '$.publisherName',
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    };

    const { getByTestId } = renderComp(baseResource, cfg);
    const acc = getByTestId('accordion-vis');
    expect(acc.querySelectorAll('.row').length).toBeGreaterThan(0);
  });

  test('table empty branch: subjects array empty → no MCL rendered', () => {
    const cfg = {
      icon: 'title',
      title: { type: 'access', accessType: 'JSONPath', expression: '$.name' },
      renderStrategy: {
        type: 'rows',
        values: [
          {
            type: 'table',
            resource: {
              type: 'access',
              accessType: 'JSONPath',
              expression: '$.subjects[*]',
            },
            columns: [
              {
                name: 'scheme',
                type: 'String',
                value: {
                  type: 'access',
                  accessType: 'JSONPath',
                  expression: '$.scheme',
                },
              },
              {
                name: 'heading',
                type: 'String',
                value: {
                  type: 'access',
                  accessType: 'JSONPath',
                  expression: '$.heading',
                },
              },
            ],
          },
        ],
      },
    };

    const { queryByTestId } = renderComp(baseResource, cfg);
    expect(queryByTestId('mcl-scheme-heading')).not.toBeInTheDocument();
  });

  test('table with primitive source array: altname → rows wrapped & rendered', () => {
    const cfg = {
      icon: 'title',
      title: { type: 'access', accessType: 'JSONPath', expression: '$.name' },
      renderStrategy: {
        type: 'rows',
        values: [
          {
            type: 'table',
            resource: {
              type: 'access',
              accessType: 'JSONPath',
              expression: '$.altname[*]',
            },
            columns: [
              {
                name: 'altNames',
                type: 'String',
                value: {
                  type: 'access',
                  accessType: 'JSONPath',
                  expression: '$.altNames',
                },
              },
            ],
          },
        ],
      },
    };

    const { getByTestId } = renderComp(baseResource, cfg);
    expect(getByTestId('mcl-altNames')).toHaveAttribute('data-rows', '2');
  });

  test('registry safe null: missing resource or render fn → renders nothing gracefully', () => {
    Registry.getResource.mockReturnValueOnce(null);
    const cfg = {
      icon: 'title',
      title: { type: 'access', accessType: 'JSONPath', expression: '$.name' },
      renderStrategy: {
        type: 'rows',
        values: [
          {
            type: 'registry',
            registryResource: 'missing',
            registryRenderFunction: 'nope',
            props: [],
          },
        ],
      },
    };

    const { container } = renderComp(baseResource, cfg);
    expect(container).toBeTruthy();
  });

  test('access JSONPath with no result renders <NoValue/>', () => {
    const cfg = {
      icon: 'title',
      title: {
        type: 'access',
        accessType: 'JSONPath',
        expression: '$.missing',
      },
      renderStrategy: {
        type: 'rows',
        values: [
          { type: 'access', accessType: 'JSONPath', expression: '$.missing' },
        ],
      },
    };
    const { getAllByText } = renderWithIntl(
      <MemoryRouter>
        <RemoteKbResourceView
          displayConfig={cfg}
          onClose={jest.fn()}
          queryProps={{ isLoading: false }}
          resource={{}}
        />
      </MemoryRouter>,
      translationsProperties
    );
    expect(getAllByText('NoValue').length).toBeGreaterThan(0);
  });

  test('displayDates with values renders coverage (happy path)', () => {
    const cfg = {
      icon: 'title',
      title: { type: 'static', value: 't' },
      renderStrategy: {
        type: 'rows',
        values: [
          {
            type: 'displayDates',
            value: [
              { key: 'publishedFrom', expression: '$.publishedFrom' },
              { key: 'publishedTo', expression: '$.publishedTo' },
            ],
          },
        ],
      },
    };
    const res = { publishedFrom: '2001-01-01', publishedTo: '2002-02-02' };
    const { getByText } = renderWithIntl(
      <MemoryRouter>
        <RemoteKbResourceView
          displayConfig={cfg}
          onClose={jest.fn()}
          queryProps={{ isLoading: false }}
          resource={res}
        />
      </MemoryRouter>,
      translationsProperties
    );
    expect(getByText('Coverage')).toBeInTheDocument();
  });

  test('handlebars non-access branch renders something (keeps row visible)', () => {
    const cfg = {
      icon: 'title',
      title: { type: 'static', value: 't' },
      renderStrategy: {
        type: 'rows',
        values: [
          {
            type: 'handlebars',
            templateString: 'whatever',
            value: { type: 'static', value: 'ignored' },
          },
        ],
      },
    };
    const { container } = renderWithIntl(
      <MemoryRouter>
        <RemoteKbResourceView
          displayConfig={cfg}
          onClose={jest.fn()}
          queryProps={{ isLoading: false }}
          resource={{ foo: 'bar' }}
        />
      </MemoryRouter>,
      translationsProperties
    );
    expect(container.textContent).toContain('[object Object]');
  });

  test('action menu renders values via renderValue()', () => {
    const cfg = {
      icon: 'title',
      title: { type: 'static', value: 'Action Menu Title' },
      actions: {
        values: [
          { type: 'static', value: 'Act1' },
          { type: 'static', value: 'Act2' },
        ],
      },
      renderStrategy: { type: 'rows', values: [] },
    };

    const { getByTestId } = renderWithIntl(
      <MemoryRouter>
        <RemoteKbResourceView
          displayConfig={cfg}
          onClose={jest.fn()}
          queryProps={{ isLoading: false }}
          resource={{}}
        />
      </MemoryRouter>,
      translationsProperties
    );

    const menu = getByTestId('action-menu');
    expect(menu.textContent).toContain('Act1');
    expect(menu.textContent).toContain('Act2');
  });

  test('badge count can be cleared (setBadgeCount(null))', () => {
    const RegistryContent = ({ setBadgeCount }) => {
      React.useEffect(() => {
        setBadgeCount(7);
        setBadgeCount(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return <div>RegistryContent</div>;
    };

    Registry.getResource.mockReturnValue({
      getRenderFunction: () => (props) => <RegistryContent {...props} />,
    });

    const cfg = {
      icon: 'title',
      title: { type: 'access', accessType: 'JSONPath', expression: '$.name' },
      renderStrategy: {
        type: 'sections',
        values: [{
          name: 'accordions',
          collapsable: true,
          renderStrategy: {
            type: 'accordionset',
            values: [{
              name: 'withBadge',
              collapsable: true,
              badge: true,
              renderStrategy: {
                type: 'rows',
                values: [{
                  type: 'registry',
                  registryResource: 'foo',
                  registryRenderFunction: 'bar',
                  props: [],
                }],
              },
            }],
          },
        }],
      },
    };

    const { getAllByTestId } = renderComp(baseResource, cfg);
    const badges = getAllByTestId('badge');
    expect(badges.some((b) => b.textContent === '0')).toBe(true);
  });
});
