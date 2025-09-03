// RemoteKbResource.test.js
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import RemoteKbResource from './RemoteKbResource';
import translationsProperties from '../../../../test/helpers';

let resource;

// --- Mocks ---

// stripes core: expose iconKey so we can assert it
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  AppIcon: ({ iconKey }) => <span>AppIcon:{iconKey}</span>,
}));

// stripes components: keep very light shims
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Pane: ({ paneTitle, appIcon, children }) => (
    <div>
      <div data-testid="pane-title">{typeof paneTitle === 'string' ? paneTitle : (paneTitle?.props?.children || '')}</div>
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
  Accordion: ({ children, label }) => <div data-testid={`accordion-${label}`}>{children}</div>,
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

// utilities used inside the component
jest.mock('../../utilities', () => ({
  // minimal handlebars compiler to satisfy the replace template
  handlebarsCompile: (tpl) => (ctx) => {
    if (tpl.includes("{{{replace this 'Instance' ''}}}")) {
      return String(ctx || '').replace('Instance', '');
    }
    return String(ctx || '');
  },
  renderPublicationDates: (obj = {}) => {
    // when any date is present, return a span (truthy); else null (to trigger <NoValue/>)
    const hasAny = Object.keys(obj || {}).length > 0;
    return hasAny ? <span>Coverage</span> : null;
  },
  stableKeyFrom: (v) => `k${(JSON.stringify(v) || '').length}`,
}));

// the table case calls getResultsDisplayConfig for inner columns
jest.mock('../../../routes/utilities/getResultsDisplayConfig', () => jest.fn((cols) => ({
  resultColumns: cols.map(c => ({ propertyPath: c.name, label: <span>{c.name}</span> })),
  sortableColumns: [],
  formatter: cols.reduce((acc, c) => {
    // simple identity-ish formatters for table rows
    acc[c.name] = (row) => row[c.name] ?? row.namespaceName ?? row.value ?? row.altNames ?? '';
    return acc;
  }, {}),
})));

// JSONPath mapping used throughout the component
jest.mock('jsonpath-plus', () => ({
  JSONPath: jest.fn(({ path, json }) => {
    // use the provided resource (json)
    const r = json;
    switch (path) {
      case '$.name': return [r.name];
      case '$.dateCreated': return [r.dateCreated];
      case '$.lastUpdatedDisplay': return [r.lastUpdatedDisplay];
      case '$.componentType': return [r.componentType];
      case '$.publishedFrom': return [r.publishedFrom];
      case '$.publishedTo': return [r.publishedTo];
      case '$.publisherName': return [r.publisherName];
      case '$.id': return [r.id];
      case '$.uuid': return [r.uuid];
      case '$.volumeNumber': return []; // not present
      case '$.editionStatement': return []; // not present
      case '$.firstAuthor': return []; // not present
      case '$.firstEditor': return []; // not present
      // list resources for tables
      case '$.altname[*]': return r.altname;
      case '$.identifiers[*]': return r.identifiers;
      // identifier family selections
      default: {
        if (path.includes("$.identifiers[?(@.namespace == 'zdb')]")) {
          return r.identifiers.filter(i => i.namespace === 'zdb').map(i => i.value);
        }
        if (path.includes("$.identifiers[?(@.namespace == 'issn") || path.includes("@.namespace == 'eissn") || path.includes("@.namespace == 'pissn")) {
          return r.identifiers
            .filter(i => ['issn', 'eissn', 'pissn'].includes(i.namespace))
            .map(i => i.value);
        }
        if (path.includes("$.identifiers[?(@.namespace == 'isbn") || path.includes("@.namespace == 'eisbn") || path.includes("@.namespace == 'pisbn")) {
          return r.identifiers
            .filter(i => ['isbn', 'eisbn', 'pisbn'].includes(i.namespace))
            .map(i => i.value);
        }
        if (path.includes("$.identifiers[?(@.namespace == 'ezb'")) return [];
        if (path.includes("$.identifiers[?(@.namespace == 'doi'")) return [];
        // table inner column access (not used because we mock getResultsDisplayConfig),
        // but keep a safe default:
        if (path === '$.altNames') return [r.name];
        if (path === '$.namespaceName') return r.identifiers.map(i => i.namespaceName);
        if (path === '$.value') return r.identifiers.map(i => i.value);
        return [];
      }
    }
  }),
}));

// --- Shared fixtures from your prompt ---

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
              type: 'row',
              colCount: '1',
              values: [
                { type: 'heading', value: { type: 'access', accessType: 'JSONPath', expression: '$.name' } },
              ],
            },
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
              colCount: '3',
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
                {
                  name: 'firstAuthor',
                  type: 'keyValue',
                  value: { type: 'access', accessType: 'JSONPath', expression: '$.firstAuthor' },
                },
                {
                  name: 'firstEditor',
                  type: 'keyValue',
                  value: { type: 'access', accessType: 'JSONPath', expression: '$.firstEditor' },
                },
              ],
            },
            {
              type: 'row',
              colCount: '4',
              values: [
                {
                  name: 'publicationDates',
                  type: 'keyValue',
                  value: {
                    type: 'displayDates',
                    value: [
                      { type: 'access', accessType: 'JSONPath', expression: '$.dateFirstOnline', key: 'dateFirstOnline' },
                      { type: 'access', accessType: 'JSONPath', expression: '$.dateFirstInPrint', key: 'dateFirstInPrint' },
                      { type: 'access', accessType: 'JSONPath', expression: '$.publishedFrom', key: 'publishedFrom' },
                      { type: 'access', accessType: 'JSONPath', expression: '$.publishedTo', key: 'publishedTo' },
                    ],
                  },
                },
                { name: 'volume', type: 'keyValue', value: { type: 'access', accessType: 'JSONPath', expression: '$.volumeNumber' } },
                { name: 'edition', type: 'keyValue', value: { type: 'access', accessType: 'JSONPath', expression: '$.editionStatement' } },
                { name: 'publisher', type: 'keyValue', value: { type: 'access', accessType: 'JSONPath', expression: '$.publisherName' } },
              ],
            },
            {
              type: 'row',
              colCount: '2',
              values: [
                { name: 'gokbid', type: 'keyValue', value: { type: 'access', accessType: 'JSONPath', expression: '$.id' } },
                { name: 'gokbuuid', type: 'keyValue', value: { type: 'access', accessType: 'JSONPath', expression: '$.uuid' } },
              ],
            },
            {
              type: 'row',
              colCount: '5',
              values: [
                { name: 'issns', type: 'keyValue', value: { type: 'access', accessType: 'JSONPath', expression: "$.identifiers[?(@.namespace == 'issn' || @.namespace == 'eissn' || @.namespace == 'pissn')].value" } },
                { name: 'isbns', type: 'keyValue', value: { type: 'access', accessType: 'JSONPath', expression: "$.identifiers[?(@.namespace == 'isbn' || @.namespace == 'eisbn' || @.namespace == 'pisbn')].value" } },
                { name: 'zdbids', type: 'keyValue', value: { type: 'access', accessType: 'JSONPath', expression: "$.identifiers[?(@.namespace == 'zdb')].value" } },
                { name: 'ezbids', type: 'keyValue', value: { type: 'access', accessType: 'JSONPath', expression: "$.identifiers[?(@.namespace == 'ezb')].value" } },
                { name: 'dois', type: 'keyValue', value: { type: 'access', accessType: 'JSONPath', expression: "$.identifiers[?(@.namespace == 'doi')].value" } },
              ],
            },
          ],
        },
      },
      {
        name: 'accordions',
        collapsable: true,
        renderStrategy: {
          type: 'accordionset',
          values: [
            {
              name: 'extendedTitleInformation',
              collapsable: true,
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
                  {
                    type: 'table',
                    resource: { type: 'access', accessType: 'JSONPath', expression: '$.identifiers[*]' },
                    columns: [
                      { name: 'type', type: 'String', value: { type: 'access', accessType: 'JSONPath', expression: '$.namespaceName' } },
                      { name: 'identifier', type: 'String', value: { type: 'access', accessType: 'JSONPath', expression: '$.value' } },
                    ],
                  },
                  {
                    type: 'table',
                    resource: { type: 'access', accessType: 'JSONPath', expression: '$.subjects[*]' },
                    columns: [
                      { name: 'scheme', type: 'String', value: { type: 'access', accessType: 'JSONPath', expression: '$.scheme' } },
                      { name: 'heading', type: 'String', value: { type: 'access', accessType: 'JSONPath', expression: '$.heading' } },
                    ],
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

const baseResource = {
  id: 828955,
  componentType: 'JournalInstance',
  publisherUuid: 'b2b18279-261c-4653-be6c-d8ec2f2d8573',
  lastUpdatedDisplay: '2019-09-02T08:41:38Z',
  identifiers: [
    { baseUrl: 'https://ld.zdb-services.de/resource/', namespace: 'zdb', type: '', value: '2010543-5', namespaceName: 'ZDB-ID' },
    { baseUrl: 'https://portal.issn.org/resource/ISSN/', namespace: 'issn', type: 'isxn', value: '0160-9335', namespaceName: 'p-ISSN' },
  ],
  subjects: [],
  altname: [' The journal of philosophy, psychology, and scientific methods'],
  shortcode: 'The_@journal_of_philosophy,_psychology,_and_scientific_methods',
  uuid: 'e2a8df5b-4d2c-4f65-82f4-fbd96f43538c',
  publishedTo: '1920-12-31',
  updater: 'journal',
  sortname: ' The journal of philosophy, psychology, and scientific methods',
  publishedFrom: '1904-01-01',
  dateCreated: '2018-05-07T10:16:18Z',
  publisherName: 'Science Press',
  name: ' The journal of philosophy, psychology, and scientific methods',
  publisher: 'org.gokb.cred.Org:50620',
  status: 'Current',
};

// --- Tests ---

describe('RemoteKbResource', () => {
  const renderComp = (props = {}) => renderWithIntl(
    <MemoryRouter>
      <RemoteKbResource
        displayConfig={displayConfig}
        onClose={jest.fn()}
        queryProps={{ isLoading: false }}
        resource={resource}
        {...props}
      />
    </MemoryRouter>,
    translationsProperties
  );

  beforeEach(() => {
    resource = { ...baseResource };
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

  test('renders pane title from JSONPath and AppIcon with iconKey "title"', () => {
    const { getByTestId, getAllByText } = renderComp();
    expect(getByTestId('pane-icon')).toHaveTextContent('AppIcon:title'); // displayConfig.icon
    // title comes from $.name; we just check a distinctive substring
    expect(getByTestId('pane-title').textContent).toContain('journal of philosophy');
    // heading also rendered from $.name (appears in multiple places)
    const matches = getAllByText(/journal of philosophy/i);
    expect(matches.length).toBeGreaterThanOrEqual(2);
    expect(matches.some(n => n.tagName === 'H2')).toBe(true);
  });

  test('renders key values: publicationType (handlebars) and publisher name', () => {
    const { container, getByText } = renderComp();
    // handlebars replace "JournalInstance" -> "Journal"
    expect(container.querySelector('.kv-value')?.textContent).toContain('Journal');
    expect(getByText('Science Press')).toBeInTheDocument();
  });

  test('renders IDs via JSONPath: ZDB and ISSN; missing ISBN shows <NoValue/>', () => {
    const { getAllByText, getByText } = renderComp();
    expect(getByText('2010543-5')).toBeInTheDocument(); // zdbids
    expect(getByText('0160-9335')).toBeInTheDocument(); // issns
    // isbns not present -> NoValue rendered at least once
    expect(getAllByText('NoValue').length).toBeGreaterThan(0);
  });

  test('renders publication dates via renderPublicationDates', () => {
    const { getByText } = renderComp();
    // mocked renderPublicationDates returns a <span>Coverage</span> when any date is present
    expect(getByText('Coverage')).toBeInTheDocument();
  });

  test('renders two tables (altname, identifiers) and omits empty subjects table', () => {
    const { getByTestId, queryByTestId } = renderComp();
    // altNames table
    expect(getByTestId('mcl-altNames')).toHaveAttribute('data-rows', '1');
    // identifiers table
    expect(getByTestId('mcl-type-identifier')).toHaveAttribute('data-rows', '2');
    // subjects empty -> no MCL rendered
    expect(queryByTestId('mcl-scheme-heading')).not.toBeInTheDocument();
  });
});
