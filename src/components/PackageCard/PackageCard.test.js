
import { StaticRouter as Router } from 'react-router-dom';
import { KeyValue, renderWithIntl } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/helpers';
import PackageCard from './PackageCard';

const pkg = {
  id: 'd01a73b8-2978-40dc-88bb-820e96794b4a',
  vendor: {
    id: '5bb9ab56-2833-45e5-bca0-25445b23758f',
    name: 'JSTOR',
  },
  source: 'GOKb',
  name: 'JSTOR : Arts & Sciences III Collection : NK',
  reference: 'JSTOR_:_Arts_&_Sciences_III_Collection_:_NK',
  resourceCount: 228,
  class: 'org.olf.kb.Pkg',
  availabilityScope: {
    id: 'ff8081817fd0b47d017fd0b5b6810001',
    value: 'global',
    label: 'Global'
  },
  lifecycleStatus: {
    id: 'ff8081817fd0b47d017fd0b5b6d20006',
    value: 'current',
    label: 'Current'
  },
  syncContentsFromSource: true,
};

const pkgWithObject = {
  _object: {
    id: '1f6258cc-fe0e-4279-b16a-ebacc6390ade',
    dateCreated: '2021-10-18T02:17:11Z',
    tags: [],
    lastUpdated: '2021-10-18T02:17:11Z',
    coverage: [{
      id: 'fa4fb3ef-2423-46c8-9409-1aefc3e44e30',
      startDate: '1974-01-01',
      endDate: '1983-12-31',
      startVolume: '1',
      startIssue: '1',
      endVolume: '9',
      endIssue: '4',
      summary: 'v1/i1/1974-01-01 - v9/i4/1983-12-31'
    }],
    pti: {
      id: '9970fedc-e063-4182-bbd4-8b6ee4ea5630',
      dateCreated: '2021-10-18T02:17:11Z',
      tags: [],
      lastUpdated: '2021-10-18T02:17:12Z',
      platform: {
        id: 'e09e1f24-f64c-47ec-9f76-3fb8bce4a34e',
        dateCreated: '2021-10-18T02:16:37Z',
        lastUpdated: '2021-10-18T02:16:37Z',
        name: 'JSTOR',
        locators: [{
          id: 'd8a89e5c-2611-45dc-8a72-e3e0e8d943b6',
          domainName: 'www.jstor.org'
        }]
      },
      templatedUrls: [{
        id: '253550e9-a8c9-4528-92f5-509e089cf234',
        url: 'https://www.jstor.org/action/showPublication?journalCode=14centengmystnew',
        name: 'defaultUrl',
        resource: {
          id: '9970fedc-e063-4182-bbd4-8b6ee4ea5630'
        }
      }],
      coverage: [{
        id: 'a422aa75-0849-4813-8a5b-c2df18d00694',
        startDate: '1974-01-01',
        endDate: '1983-12-31',
        summary: 'v*/i*/1974-01-01 - v*/i*/1983-12-31'
      }],
      titleInstance: {
        id: 'db5b8efd-4bad-4245-8a67-77ecda61bec9',
        subType: {
          id: '2c91809c7c9112ac017c911abb520002',
          value: 'electronic',
          label: 'Electronic'
        },
        dateCreated: '2021-10-18T02:17:11Z',
        tags: [],
        lastUpdated: '2021-10-18T02:17:12Z',
        publicationType: {
          id: '2c91809c7c9112ac017c911ac5690043',
          value: 'journal',
          label: 'Journal'
        },
        identifiers: [{
          title: {
            id: 'db5b8efd-4bad-4245-8a67-77ecda61bec9'
          },
          status: {
            id: '2c91809c7c9112ac017c911ac5a90045',
            value: 'approved',
            label: 'approved'
          },
          identifier: {
            value: '148228',
            ns: {
              value: 'ezb'
            }
          }
        },
        {
          title: {
            id: 'db5b8efd-4bad-4245-8a67-77ecda61bec9'
          },
          status: {
            id: '2c91809c7c9112ac017c911ac5a90045',
            value: 'approved',
            label: 'approved'
          },
          identifier: {
            value: '2581465-5',
            ns: {
              value: 'zdb'
            }
          }
        }
        ],
        coverage: [{
          id: 'bfbd4100-d956-4055-a3ee-c8b966cf4d84',
          startDate: '1974-01-01',
          endDate: '1983-12-31',
          summary: 'v*/i*/1974-01-01 - v*/i*/1983-12-31'
        }],
        name: '14th century English mystics newsletter',
        type: {
          id: '2c91809c7c9112ac017c911abb7a0005',
          value: 'serial',
          label: 'Serial'
        },
        suppressFromDiscovery: false,
        work: {
          id: 'a247cba3-58bc-4d40-a5ea-fd8e117a1b37'
        },
        class: 'org.olf.kb.TitleInstance',
        longName: '14th century English mystics newsletter',
        relatedTitles: [{
          id: '3b052a9e-b62e-45aa-9d2f-8ddaa43dd4c3',
          subType: {
            id: '2c91809c7c9112ac017c911abb4b0001',
            value: 'print',
            label: 'Print'
          },
          publicationType: {
            id: '2c91809c7c9112ac017c911ac5690043',
            value: 'journal',
            label: 'Journal'
          },
          identifiers: [{
            title: {
              id: '3b052a9e-b62e-45aa-9d2f-8ddaa43dd4c3'
            },
            status: {
              id: '2c91809c7c9112ac017c911ac5a90045',
              value: 'approved',
              label: 'approved'
            },
            identifier: {
              value: '0737-5840',
              ns: {
                value: 'issn'
              }
            }
          }],
          name: '14th century English mystics newsletter',
          type: {
            id: '2c91809c7c9112ac017c911abb7a0005',
            value: 'serial',
            label: 'Serial'
          },
          longName: '14th century English mystics newsletter'
        }]
      },
      url: 'https://www.jstor.org/action/showPublication?journalCode=14centengmystnew',
      name: "'14th century English mystics newsletter' on Platform 'JSTOR'",
      suppressFromDiscovery: false,
      class: 'org.olf.kb.PlatformTitleInstance',
      longName: "'14th century English mystics newsletter' on Platform 'JSTOR'"
    },
    pkg: {
      id: '5deb1f31-b627-4426-bddb-43f25479b3ab',
      dateCreated: '2021-10-18T02:16:37Z',
      lastUpdated: '2021-10-18T02:16:37Z',
      vendor: {
        id: '7947dfce-ca40-437b-9c3c-f1bb17453515',
        name: 'JSTOR',
        orgsUuid_object: {
          error: 400,
          message: 'Bad Request'
        }
      },
      source: 'GOKb',
      remoteKb: {
        id: '7b76e499-ba21-4538-9c69-b26d8cadfa85',
        cursor: '2021-09-14T08:22:05Z',
        active: true,
        trustedSourceTI: false,
        activationEnabled: false,
        readonly: false,
        syncStatus: 'idle',
        lastCheck: 1634571964178,
        name: 'GOKb_TEST',
        type: 'org.olf.kb.adapters.GOKbOAIAdapter',
        fullPrefix: 'gokb',
        uri: 'https://gokbt.gbv.de/gokb/oai/index',
        supportsHarvesting: true,
        rectype: 1
      },
      name: 'JSTOR : Arts & Sciences V Collection : NK',
      suppressFromDiscovery: false,
      reference: 'JSTOR_:_Arts_&_Sciences_V_Collection_:_NK',
      resourceCount: 211,
      class: 'org.olf.kb.Pkg'
    },
    source: 'GOKb',
    reference: 'JSTOR_:_Arts_&_Sciences_V_Collection_:_NK',
    resourceCount: 211,
    addedTimestamp: 1634523397622,
    name: "'14th century English mystics newsletter' on Platform 'JSTOR' in Package JSTOR : Arts & Sciences V Collection : NK",
    lastSeenTimestamp: 1634523397622,
    suppressFromDiscovery: false,
    longName: "'14th century English mystics newsletter' on Platform 'JSTOR' in Package JSTOR : Arts & Sciences V Collection : NK",
    class: 'org.olf.kb.PackageContentItem'
  }
};

let renderComponent;
describe('PackageCard', () => {
  describe('with pkg resource', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <PackageCard
            pkg={pkg}
          />
        </Router>,
        translationsProperties
      );
    });
    test('renders PackageCard component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('packageCard')).toBeInTheDocument();
    });

    test('renders a link with the pkg name', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('link', { name: 'JSTOR : Arts & Sciences III Collection : NK' })).toBeInTheDocument();
    });

    test('renders the expected publicationType', async () => {
      await KeyValue('Publication type').has({ value: 'Package' });
    });

    test('renders the expected resourceCount', async () => {
      await KeyValue('Count').has({ value: '228' });
    });

    test('renders the expected vendorName', async () => {
      await KeyValue('Provider').has({ value: 'JSTOR' });
    });

    test('renders the expected source', async () => {
      await KeyValue('Source').has({ value: 'GOKb' });
    });

    test('renders the expected reference', async () => {
      await KeyValue('Reference').has({ value: 'JSTOR_:_Arts_&_Sciences_III_Collection_:_NK' });
    });

    test('renders the expected lifecycle status', async () => {
      await KeyValue('Status').has({ value: 'Current' });
    });

    test('renders the expected availability scope', async () => {
      await KeyValue('Availability').has({ value: 'Global' });
    });

    test('renders the Synchronisation status field', async () => {
      await KeyValue('Synchronisation status').exists();
    });

    test('renders the expcected Synchronisation status field', async () => {
      await KeyValue('Synchronisation status').has({ value:  'Synchronising' });
    });
  });

  describe('with pkg._object resource', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <PackageCard
            pkg={pkgWithObject}
          />
        </Router>,
        translationsProperties
      );
    });
    test('renders PackageCard component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('packageCard')).toBeInTheDocument();
    });

    test('renders a link with the pkg name', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('link', { name: '14th century English mystics newsletter' })).toBeInTheDocument();
    });

    test('renders the expected publicationType', async () => {
      await KeyValue('Publication type').has({ value: 'Package' });
    });

    test('renders the expected resourceCount', async () => {
      await KeyValue('Count').has({ value: '211' });
    });

    test('renders the expected vendorName', async () => {
      await KeyValue('Provider').has({ value: 'JSTOR' });
    });

    test('renders the expected source', async () => {
      await KeyValue('Source').has({ value: 'GOKb' });
    });

    test('renders the expected reference', async () => {
      await KeyValue('Reference').has({ value: 'JSTOR_:_Arts_&_Sciences_V_Collection_:_NK' });
    });

    test('renders the expcected status', async () => {
      await KeyValue('Status').has({ value: 'No value set-' });
    });

    test('renders the expcected availability', async () => {
      await KeyValue('Availability').has({ value: 'No value set-' });
    });
  });
});
