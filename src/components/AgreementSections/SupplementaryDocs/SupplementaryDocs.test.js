import { renderWithIntl, Accordion } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../../test/helpers';
import SupplementaryDocs from './SupplementaryDocs';

const agreement = {
  id: '5644b8c6-561b-4f6b-95bd-b3f044918b8a',
  dateCreated: '2021-08-03T14:19:44Z',
  name: 'AM ag 1',
  orgs: [],
  externalLicenseDocs: [
    {
      id: 'cc884523-5064-44ec-91c8-e96d407fbcfa',
      dateCreated: '2021-08-03T14:56:46Z',
      lastUpdated: '2021-08-03T14:56:46Z',
      url: 'http://www.extlicense1.com',
      name: 'external license 2'
    },
    {
      id: '6bd6e3f8-6606-4562-9c4c-ca98893c5487',
      dateCreated: '2021-08-03T14:56:46Z',
      lastUpdated: '2021-08-03T14:56:46Z',
      url: 'http://www.extlicense1.com',
      name: 'external license 1'
    }
  ],
  outwardRelationships: [],
  customProperties: {},
  contacts: [],
  tags: [],
  lastUpdated: '2021-08-03T15:36:55Z',
  inwardRelationships: [],
  startDate: '2021-08-04',
  linkedLicenses: [
    {
      id: '2c9180bf7b0a10d8017b0c62769b004b',
      remoteId: '1c71c412-1f68-4909-9dee-c447899b77f0',
      remoteId_object: {
        id: '1c71c412-1f68-4909-9dee-c447899b77f0',
        dateCreated: '2021-08-03T14:19:05Z',
        customProperties: {},
        contacts: [],
        tags: [],
        lastUpdated: '2021-08-03T14:19:05Z',
        docs: [],
        name: 'AM license 1',
        status: {
          id: '2c9180bc7b0a10ca017b0a117bec0017',
          value: 'active',
          label: 'Active',
          owner: {
            id: '2c9180bc7b0a10ca017b0a117bdd0014',
            desc: 'License.Status',
            internal: true
          }
        },
        supplementaryDocs: [],
        openEnded: false,
        amendments: [],
        orgs: [],
        type: {
          id: '2c9180bc7b0a10ca017b0a117b8c0005',
          value: 'local',
          label: 'Local',
          owner: {
            id: '2c9180bc7b0a10ca017b0a117b890004',
            desc: 'License.Type',
            internal: false
          }
        },
        alternateNames: []
      },
      owner: {
        id: '5644b8c6-561b-4f6b-95bd-b3f044918b8a'
      },
      amendments: [],
      status: {
        id: '2c9180bf7b0a10d8017b0a11642e001e',
        value: 'controlling',
        label: 'Controlling'
      }
    },
    {
      id: '2c9180bf7b0a10d8017b0c62769b004a',
      remoteId: 'b837bb63-ee0c-40b8-bc7c-e5c5c8e433b6',
      remoteId_object: {
        id: 'b837bb63-ee0c-40b8-bc7c-e5c5c8e433b6',
        dateCreated: '2021-08-03T14:19:16Z',
        customProperties: {},
        contacts: [],
        tags: [],
        lastUpdated: '2021-08-03T14:19:16Z',
        docs: [],
        name: 'AM license 2',
        status: {
          id: '2c9180bc7b0a10ca017b0a117bec0017',
          value: 'active',
          label: 'Active',
          owner: {
            id: '2c9180bc7b0a10ca017b0a117bdd0014',
            desc: 'License.Status',
            internal: true
          }
        },
        supplementaryDocs: [],
        openEnded: false,
        amendments: [],
        orgs: [],
        type: {
          id: '2c9180bc7b0a10ca017b0a117b8c0005',
          value: 'local',
          label: 'Local',
          owner: {
            id: '2c9180bc7b0a10ca017b0a117b890004',
            desc: 'License.Type',
            internal: false
          }
        },
        alternateNames: []
      },
      owner: {
        id: '5644b8c6-561b-4f6b-95bd-b3f044918b8a'
      },
      amendments: [],
      status: {
        id: '2c9180bf7b0a10d8017b0a116432001f',
        value: 'future',
        label: 'Future'
      }
    }
  ],
  docs: [],
  periods: [
    {
      id: '2e75c736-22cd-4cba-9768-a547db3ade42',
      startDate: '2021-08-04',
      owner: {
        id: '5644b8c6-561b-4f6b-95bd-b3f044918b8a'
      },
      periodStatus: 'next'
    }
  ],
  usageDataProviders: [],
  agreementStatus: {
    id: '2c9180bf7b0a10d8017b0a1164ab0036',
    value: 'active',
    label: 'Active'
  },
  supplementaryDocs: [
    {
      id: '878ef458-5893-491b-b430-a3d9b3d596e2',
      dateCreated: '2021-08-03T15:36:55Z',
      lastUpdated: '2021-08-03T15:36:55Z',
      url: 'http://www.supplementaryDoc2.com',
      name: 'supplementary doc 2'
    },
    {
      id: '4f68ece4-3bb9-4015-bdaa-2f10a626434f',
      dateCreated: '2021-08-03T15:36:55Z',
      lastUpdated: '2021-08-03T15:36:55Z',
      url: 'http://www.supplementaryDoc.com',
      name: 'supplementary doc 1'
    }
  ],
  endDate: null,
  cancellationDeadline: null,
  alternateNames: [],
  relatedAgreements: [],
  lines: [],
  agreementLinesCount: 0,
  eresources: [],
  eresourcesCount: 0,
  orderLines: []
};

const handlers = {
  onDownloadFile: () => { }
};

let renderComponent;

describe('Supplementary Docs', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <SupplementaryDocs
        agreement={agreement}
        handlers={handlers}
        id="supplementaryDocs"
      />,
      translationsProperties
    );
  });

  test('renders the supplementary documents Accordion', async () => {
    await Accordion('Supplementary documents').exists();
  });

  test('renders the DocumentCard component', () => {
    const { getAllByText } = renderComponent;
    expect(getAllByText('DocumentCard'));
  });
});
