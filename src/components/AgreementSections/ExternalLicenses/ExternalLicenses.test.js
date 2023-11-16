

import { renderWithIntl, Accordion } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../../test/helpers';
import ExternalLicenses from './ExternalLicenses';

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
  lastUpdated: '2021-08-03T14:56:46Z',
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
  supplementaryDocs: [],
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

const data = {
  agreement: {
    id: '5644b8c6-561b-4f6b-95bd-b3f044918b8a',
    dateCreated: '2021-08-03T14:19:44Z',
    name: 'AM ag 1',
    orgs: [],
    externalLicenseDocs: [],
    outwardRelationships: [],
    customProperties: {},
    contacts: [],
    tags: [],
    lastUpdated: '2021-08-03T14:19:44Z',
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
    supplementaryDocs: [],
    endDate: null,
    cancellationDeadline: null,
    alternateNames: [],
    relatedAgreements: [],
    lines: [],
    agreementLinesCount: 0,
    eresources: [],
    eresourcesCount: 0,
    orderLines: []
  },
  eresourcesFilterPath: 'current',
  searchString: '?filters=agreementStatus.active%2CagreementStatus.draft%2CagreementStatus.in_negotiation%2CagreementStatus.requested&sort=name',
  supplementaryProperties: [],
  terms: [
    {
      id: '2c9180bc7b0a10ca017b0a117dbf0027',
      name: 'authorisedUsers',
      primary: true,
      defaultInternal: true,
      label: 'Definition of authorised user',
      description: 'The definition of an authorised user for a resource',
      weight: -1,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117ea10029',
      name: 'remoteAccess',
      primary: true,
      category: {
        id: '2c9180bc7b0a10ca017b0a117cce001a',
        desc: 'Yes/No/Other',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cdd001d',
            value: 'other_(see_notes)',
            label: 'Other (see notes)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cd8001c',
            value: 'no',
            label: 'No'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cd2001b',
            value: 'yes',
            label: 'Yes'
          }
        ]
      },
      defaultInternal: true,
      label: 'Access restricted to on-campus/campus network?',
      description: 'Can access to the resource be provided from outside the library or institutional location / network',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117ea5002a',
      name: 'illElectronic',
      primary: true,
      category: {
        id: '2c9180bc7b0a10ca017b0a117ce5001e',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cf90021',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d140025',
            value: 'not_applicable',
            label: 'Not applicable'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cf00020',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d0b0024',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d050023',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117ce9001f',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cff0022',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          }
        ]
      },
      defaultInternal: true,
      label: 'Electronic ILL',
      description: 'The right to provide the licensed materials via interlibrary loan by way of electronic copies',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117ecb0030',
      name: 'copyDigital',
      primary: true,
      category: {
        id: '2c9180bc7b0a10ca017b0a117ce5001e',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cf90021',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d140025',
            value: 'not_applicable',
            label: 'Not applicable'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cf00020',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d0b0024',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d050023',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117ce9001f',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cff0022',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          }
        ]
      },
      defaultInternal: true,
      label: 'Making digital copies',
      description: 'The right of the licensee and authorized users to download and digitally copy a reasonable portion of the licensed materials',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117ecf0031',
      name: 'copyPrint',
      primary: true,
      category: {
        id: '2c9180bc7b0a10ca017b0a117ce5001e',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cf90021',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d140025',
            value: 'not_applicable',
            label: 'Not applicable'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cf00020',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d0b0024',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d050023',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117ce9001f',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cff0022',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          }
        ]
      },
      defaultInternal: true,
      label: 'Making print copies',
      description: 'The right of the licensee and authorized users to print a reasonable portion of the licensed materials',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117db20026',
      name: 'concurrentAccess',
      primary: true,
      defaultInternal: true,
      label: 'Number of concurrent users allowed',
      description: 'The number of concurrent users allowed by the resource',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117eb6002c',
      name: 'illPrint',
      primary: true,
      category: {
        id: '2c9180bc7b0a10ca017b0a117ce5001e',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cf90021',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d140025',
            value: 'not_applicable',
            label: 'Not applicable'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cf00020',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d0b0024',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d050023',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117ce9001f',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cff0022',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          }
        ]
      },
      defaultInternal: true,
      label: 'Print ILL',
      description: 'The right to provide the licensed materials via interlibrary loan by way of print copies or facsimile transmission',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117eae002b',
      name: 'illSecureElectronic',
      primary: true,
      category: {
        id: '2c9180bc7b0a10ca017b0a117ce5001e',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cf90021',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d140025',
            value: 'not_applicable',
            label: 'Not applicable'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cf00020',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d0b0024',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d050023',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117ce9001f',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cff0022',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          }
        ]
      },
      defaultInternal: true,
      label: 'Secure Electronic ILL',
      description: 'The right to provide the licensed materials via interlibrary loan by way of secure electronic transmission',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117ebb002d',
      name: 'reservesElectronic',
      primary: true,
      category: {
        id: '2c9180bc7b0a10ca017b0a117ce5001e',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cf90021',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d140025',
            value: 'not_applicable',
            label: 'Not applicable'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cf00020',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d0b0024',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d050023',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117ce9001f',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cff0022',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          }
        ]
      },
      defaultInternal: true,
      label: 'Storage of electronic copies on secure network',
      description: 'The right to make electronic copies of the licensed materials and store them on a secure network',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117ec2002e',
      name: 'coursePackElectronic',
      primary: true,
      category: {
        id: '2c9180bc7b0a10ca017b0a117ce5001e',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cf90021',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d140025',
            value: 'not_applicable',
            label: 'Not applicable'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cf00020',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d0b0024',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d050023',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117ce9001f',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cff0022',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          }
        ]
      },
      defaultInternal: false,
      label: 'Use in electronic coursepacks',
      description: 'The right to use licensed materials in collections or compilations of materials assembled in an electronic format by faculty members for use by students in a class for purposes of instruction',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117ec7002f',
      name: 'coursePackPrint',
      primary: true,
      category: {
        id: '2c9180bc7b0a10ca017b0a117ce5001e',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cf90021',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d140025',
            value: 'not_applicable',
            label: 'Not applicable'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cf00020',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d0b0024',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d050023',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117ce9001f',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cff0022',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          }
        ]
      },
      defaultInternal: false,
      label: 'Use in print course packs',
      description: 'The right to use licensed materials in collections or compilations of materials assembled in a print format by faculty members for use by students in a class for purposes of instruction',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117e9b0028',
      name: 'walkInAccess',
      primary: true,
      category: {
        id: '2c9180bc7b0a10ca017b0a117cce001a',
        desc: 'Yes/No/Other',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cdd001d',
            value: 'other_(see_notes)',
            label: 'Other (see notes)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cd8001c',
            value: 'no',
            label: 'No'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cd2001b',
            value: 'yes',
            label: 'Yes'
          }
        ]
      },
      defaultInternal: false,
      label: 'Walk-in access permitted?',
      description: 'Can non-members of the library/instittuion use the resource when in the library',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117ef50037',
      name: 'authProxy',
      primary: false,
      category: {
        id: '2c9180bc7b0a10ca017b0a117cce001a',
        desc: 'Yes/No/Other',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cdd001d',
            value: 'other_(see_notes)',
            label: 'Other (see notes)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cd8001c',
            value: 'no',
            label: 'No'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cd2001b',
            value: 'yes',
            label: 'Yes'
          }
        ]
      },
      defaultInternal: true,
      label: 'Access via a proxy supported?',
      description: 'Whether authentication via a reverse proxy is supported',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117f02003a',
      name: 'annualOptOut',
      primary: false,
      category: {
        id: '2c9180bc7b0a10ca017b0a117cce001a',
        desc: 'Yes/No/Other',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cdd001d',
            value: 'other_(see_notes)',
            label: 'Other (see notes)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cd8001c',
            value: 'no',
            label: 'No'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cd2001b',
            value: 'yes',
            label: 'Yes'
          }
        ]
      },
      defaultInternal: true,
      label: 'Annual opt-out clause included?',
      description: "Whether the license includes an 'annual opt-out' clause within a multi-year agreement",
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117ef00036',
      name: 'authIP',
      primary: false,
      category: {
        id: '2c9180bc7b0a10ca017b0a117cce001a',
        desc: 'Yes/No/Other',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cdd001d',
            value: 'other_(see_notes)',
            label: 'Other (see notes)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cd8001c',
            value: 'no',
            label: 'No'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cd2001b',
            value: 'yes',
            label: 'Yes'
          }
        ]
      },
      defaultInternal: true,
      label: 'IP authentication supported?',
      description: 'Whether authentication via IP range is supported',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117eeb0035',
      name: 'metadataUsage',
      primary: false,
      defaultInternal: true,
      label: 'Metadata usage',
      description: 'Any restrictions expressed related to the use of metadata in the platforms',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117ed70033',
      name: 'otherRestrictions',
      primary: false,
      defaultInternal: true,
      label: 'Other restrictions',
      description: 'Other restrictions expressed in the license',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117efe0039',
      name: 'authSAML',
      primary: false,
      category: {
        id: '2c9180bc7b0a10ca017b0a117cce001a',
        desc: 'Yes/No/Other',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cdd001d',
            value: 'other_(see_notes)',
            label: 'Other (see notes)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cd8001c',
            value: 'no',
            label: 'No'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cd2001b',
            value: 'yes',
            label: 'Yes'
          }
        ]
      },
      defaultInternal: true,
      label: 'SAML compliant authentication supported?',
      description: 'Whether authentication via SAML compliant method is supported',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117ed40032',
      name: 'scholarlySharing',
      primary: false,
      category: {
        id: '2c9180bc7b0a10ca017b0a117ce5001e',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cf90021',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d140025',
            value: 'not_applicable',
            label: 'Not applicable'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cf00020',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d0b0024',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d050023',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117ce9001f',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cff0022',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          }
        ]
      },
      defaultInternal: true,
      label: 'Sharing for scholarly use',
      description: 'The right of authorized users and/or licensee to transmit hard copy or electronic copy of reasonable amounts of licensed materials to a third party for personal, scholarly, educational, scientific or professional use',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117ee50034',
      name: 'textAndDataMining',
      primary: false,
      category: {
        id: '2c9180bc7b0a10ca017b0a117ce5001e',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cf90021',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d140025',
            value: 'not_applicable',
            label: 'Not applicable'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cf00020',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d0b0024',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117d050023',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117ce9001f',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cff0022',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          }
        ]
      },
      defaultInternal: false,
      label: 'Text and Data mining',
      description: 'Whether it is permitted to use text and data mining processes on the content of the resource',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117f05003b',
      name: 'APCAndOffsetting',
      primary: false,
      defaultInternal: true,
      label: 'Whether the resource is subject to an APC discount or subscription cost offsetting agreement',
      description: 'Whether the resource is subject to an APC discount or subscription cost offsetting agreement',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
    },
    {
      id: '2c9180bc7b0a10ca017b0a117ef90038',
      name: 'postCancellationAccess',
      primary: false,
      category: {
        id: '2c9180bc7b0a10ca017b0a117cce001a',
        desc: 'Yes/No/Other',
        internal: false,
        values: [
          {
            id: '2c9180bc7b0a10ca017b0a117cdd001d',
            value: 'other_(see_notes)',
            label: 'Other (see notes)'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cd8001c',
            value: 'no',
            label: 'No'
          },
          {
            id: '2c9180bc7b0a10ca017b0a117cd2001b',
            value: 'yes',
            label: 'Yes'
          }
        ]
      },
      defaultInternal: true,
      label: 'Post-cancellation terms included?',
      description: 'Does the license include post-cancellation terms?',
      weight: 1,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    }
  ]
};

let renderComponent;

describe('External Licenses', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <ExternalLicenses
        agreement={agreement}
        data={data}
        handlers={handlers}
        id="externalLicenses"
      />,
      translationsProperties
    );
  });

  test('renders the external licenses Accordion', async () => {
    await Accordion('External licenses').exists();
  });

  test('renders the DocumentCard component', () => {
    const { getAllByText } = renderComponent;
    expect(getAllByText('DocumentCard'));
  });
});
