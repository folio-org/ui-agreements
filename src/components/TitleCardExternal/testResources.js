const title = {
  accessStatusType: 'an access status type',
  name: 'The Astronomical Journal',
  type: 'Journal',
  provider: 'IOP Publishing Limited',
  publicationType: 'Journal',
  url: 'https://iopscience.iop.org/journal/1538-3881',
  identifiers: [{
    identifier: {
      value: '0004-6256',
      ns: {
        value: 'pissn'
      }
    }
  }, {
    identifier: {
      value: '1538-3881',
      ns: {
        value: 'eissn'
      }
    }
  }],
  packageData: {
    authority: 'EKB-PACKAGE',
    reference: '43-3416555',
    name: 'AAS-IOP Astronomy eJournals',
    titleCount: 6,
    selectedCount: 6,
    contentType: 'E-Journal',
    providerName: 'IOP Publishing Limited',
    isSelected: true
  },
  providerName: 'IOP Publishing Limited',
  isSelected: true
};

const titleWithReferenceObject = {
  id: '4b52ff0b-e23f-4838-9fe4-d73628d11e8f',
  type: 'external',
  description: null,
  authority: 'EKB-TITLE',
  reference: '43-2755069-23932919',
  explanation: null,
  startDate: null,
  endDate: null,
  activeFrom: null,
  activeTo: null,
  contentUpdated: null,
  haveAccess: true,
  suppressFromDiscovery: false,
  note: null,
  owner: {
    id: 'e57a054e-0b33-4bf7-923f-c86e2438a734',
    dateCreated: '2021-10-19T15:56:12Z',
    name: 'CM agreement 1',
    orgs: [],
    externalLicenseDocs: [],
    outwardRelationships: [],
    customProperties: {},
    contacts: [],
    tags: [],
    lastUpdated: '2021-10-19T16:08:37Z',
    inwardRelationships: [],
    startDate: '2021-10-01',
    linkedLicenses: [],
    docs: [],
    periods: [{
      id: '3be9133e-4284-46b5-80c9-91274a4d2a1e',
      startDate: '2021-10-01',
      owner: {
        id: 'e57a054e-0b33-4bf7-923f-c86e2438a734'
      },
      periodStatus: 'current'
    }],
    usageDataProviders: [],
    agreementStatus: {
      id: '2c91809c7c96388f017c9640d071003f',
      value: 'active',
      label: 'Active'
    },
    supplementaryDocs: [],
    endDate: null,
    cancellationDeadline: null,
    alternateNames: []
  },
  customCoverage: false,
  coverage: [{
    startDate: '2019-01-01',
    endDate: '2019-12-31',
    summary: 'v*/i*/2019-01-01 - v*/i*/2019-12-31'
  }],
  reference_object: {
    accessStatusType: 'another access status type',
    label: 'The Doppler Method for the Detection of Exoplanets',
    type: 'Book',
    provider: 'IOP Publishing Limited',
    publicationType: 'Book',
    url: 'https://iopscience.iop.org/book/978-0-7503-1689-7',
    identifiers: [{
      identifier: {
        value: '978-0-7503-1687-3',
        ns: {
          value: 'pisbn'
        }
      }
    }, {
      identifier: {
        value: '978-0-7503-1774-0',
        ns: {
          value: 'pisbn'
        }
      }
    }, {
      identifier: {
        value: '978-0-7503-1688-0',
        ns: {
          value: 'eisbn'
        }
      }
    }, {
      identifier: {
        value: '978-0-7503-1689-7',
        ns: {
          value: 'eisbn'
        }
      }
    }, {
      identifier: {
        value: '978-0-7503-4228-5',
        ns: {
          value: 'eisbn'
        }
      }
    }],
    authors: ['Professor Artie Hatzes'],
    packageData: {
      authority: 'EKB-PACKAGE',
      reference: '43-2755069',
      name: 'AAS-IOP Astronomy ebooks',
      titleCount: 30,
      selectedCount: 30,
      contentType: 'E-Book',
      providerName: 'IOP Publishing Limited',
      isSelected: true
    },
    providerName: 'IOP Publishing Limited',
    isSelected: true
  },
  poLines: []
};

export { title, titleWithReferenceObject };
