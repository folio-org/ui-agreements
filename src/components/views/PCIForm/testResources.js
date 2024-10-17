const handlers = {
  isSuppressFromDiscoveryEnabled: jest.fn(),
  onClose: jest.fn(),
};

const initialValues = {
  id: '04a31da6-b9da-4a46-8194-8da3b9971024',
  accessStart: '2008-01-01',
  dateCreated: '2021-11-15T01:58:30Z',
  tags: [],
  lastUpdated: '2021-11-15T01:58:59Z',
  depth: 'Fulltext',
  coverage: [],
  pti: {
    id: '680ae940-affc-453f-bac6-b6b15dcb3d29',
    dateCreated: '2021-11-15T01:58:30Z',
    tags: [],
    lastUpdated: '2021-11-15T01:58:30Z',
    platform: {
      id: 'e68ceadb-fae6-4308-8406-082a3e27eff9',
      dateCreated: '2021-11-15T01:58:26Z',
      lastUpdated: '2021-11-15T01:58:26Z',
      name: 'Elgaronline',
      locators: [
        {
          id: '5753a366-138b-4e23-943a-ad3896b7139a',
          domainName: 'www.elgaronline.com'
        }
      ]
    },
    templatedUrls: [
      {
        id: 'b9fbc316-177b-4aec-9337-38223bafd25e',
        url: 'https://doi.org/10.4337/9781845425678',
        name: 'defaultUrl',
        resource: {
          id: '680ae940-affc-453f-bac6-b6b15dcb3d29'
        }
      }
    ],
    coverage: [],
    titleInstance: {
      id: 'db1d6e39-59d6-443e-bf29-0be53b0843fa',
      subType: {
        id: '2c91809c7d2144a7017d214c00380026',
        value: 'electronic',
        label: 'Electronic'
      },
      dateCreated: '2021-11-15T01:58:30Z',
      tags: [],
      lastUpdated: '2021-11-15T01:58:30Z',
      normalizedName: "\"institutions, industrial upgrading, and economic performance in japan: the 'flying-geese' paradigm of catch-up growth\"",
      publicationType: {
        id: '2c91809c7d2144a7017d214c3c750046',
        value: 'book',
        label: 'Book'
      },
      identifiers: [
        {
          title: {
            id: 'db1d6e39-59d6-443e-bf29-0be53b0843fa'
          },
          status: {
            id: '2c91809c7d2144a7017d214c0a8c0045',
            value: 'approved',
            label: 'approved'
          },
          identifier: {
            value: '9781845425678',
            ns: {
              value: 'isbn'
            }
          }
        }
      ],
      coverage: [],
      name: "\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"",
      type: {
        id: '2c91809c7d2144a7017d214c003e0028',
        value: 'monograph',
        label: 'Monograph'
      },
      suppressFromDiscovery: false,
      work: {
        id: '98ccdf9e-3159-40f8-ae62-33d6d66cb510'
      },
      class: 'org.olf.kb.TitleInstance',
      longName: "\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"",
      relatedTitles: []
    },
    url: 'https://doi.org/10.4337/9781845425678',
    name: "'\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catc...' on Platform 'Elgaronline'",
    suppressFromDiscovery: false,
    class: 'org.olf.kb.PlatformTitleInstance',
    longName: "'\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"' on Platform 'Elgaronline'"
  },
  pkg: {
    id: '103d50d4-118a-4f72-a761-1696226c74c6',
    dateCreated: '2021-11-15T01:58:29Z',
    lastUpdated: '2021-11-15T01:58:29Z',
    normalizedName: 'edward elgar:edward elgar e-book archive in business & management, economics and finance:nationallizenz',
    vendor: {
      id: '18fc1a19-a08b-4a2b-8bc5-fa5f0c9d74a4',
      name: 'Edward Elgar',
      orgsUuid_object: {
        error: 400,
        message: 'Bad Request'
      }
    },
    source: 'GOKb',
    remoteKb: {
      id: '2d9011bf-d372-4144-a51c-6662016e2368',
      cursor: '2021-11-12T14:01:01Z',
      active: true,
      trustedSourceTI: false,
      activationEnabled: false,
      readonly: false,
      syncStatus: 'idle',
      lastCheck: 1637001957886,
      name: 'GOKb_TEST',
      type: 'org.olf.kb.adapters.GOKbOAIAdapter',
      fullPrefix: 'gokb',
      uri: 'https://gokbt.gbv.de/gokb/oai/index',
      supportsHarvesting: true,
      rectype: 1
    },
    name: 'Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz',
    suppressFromDiscovery: false,
    reference: 'Edward_Elgar:Edward_Elgar_E-Book_Archive_in_Business_&_Management,_Economics_and_Finance:Nationalliz',
    resourceCount: 2540,
    class: 'org.olf.kb.Pkg'
  },
  addedTimestamp: 1636941509381,
  accessEnd: '2021-03-31',
  name: "'\"Institutions, industrial upgrading, and economic performance in Ja...' on Platform 'Elgaronline' in Package Edward Elgar:Edward Elgar E-Book Archive in Business & Management, ...",
  lastSeenTimestamp: 1636941509381,
  suppressFromDiscovery: false,
  longName: "'\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"' on Platform 'Elgaronline' in Package Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz",
  class: 'org.olf.kb.PackageContentItem'
};

export { handlers, initialValues };
