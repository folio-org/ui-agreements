import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Accordion } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import Agreement from './Agreement';

const onClone = jest.fn();
const onClose = jest.fn();
const onDelete = jest.fn();
const isLoading = false;

const handlers = {
  onClone,
  onClose,
  onDelete,
};

const agreementWithAllAccordions = {
  agreement: {
    id: '37ede8a0-c864-4c85-a20b-664e0d50dc45',
    name: 'Accordion Agreement 1',
    orgs: [{
      id: 'c679cb12-2cd4-4255-9e83-207f33361e89',
      org: {
        id: '0fb6bf7b-56f7-44b8-bc02-183cb82d459e',
        orgsUuid: '11fb627a-cdf1-11e8-a8d5-f2801f1b9fd1',
        name: 'Alexander Street Press',
        orgsUuid_object: {
          id: '11fb627a-cdf1-11e8-a8d5-f2801f1b9fd1',
          name: 'Alexander Street Press',
          code: 'ALEXS',
          description: 'AV streaming services',
          exportToAccounting: false,
          status: 'Active',
          language: 'en-us',
          aliases: [{
            value: 'Alexander Street',
            description: ''
          }],
          addresses: [{
            addressLine1: '3212 Duke Street',
            addressLine2: '',
            city: 'Alexandria',
            stateRegion: 'VA',
            zipCode: '22314',
            country: 'USA',
            isPrimary: true,
            categories: [],
            language: 'English'
          }],
          phoneNumbers: [{
            phoneNumber: '1-800-889-5937',
            categories: [],
            isPrimary: true,
            language: 'English'
          }],
          emails: [{
            value: 'customerservice@alexanderstreet.com',
            description: 'main customer service email',
            isPrimary: true,
            categories: [],
            language: 'English'
          }],
          urls: [{
            value: 'https://alexanderstreet.com/',
            description: 'main website',
            language: 'en-us',
            isPrimary: true,
            categories: ['f52ceea4-8e35-404b-9ebd-5c7db6613195'],
            notes: ''
          }],
          contacts: ['11fb627a-cdf1-11e8-a8d5-f2801f1b9fd1'],
          agreements: [{
            name: 'library access',
            discount: 0,
            referenceUrl: '',
            notes: ''
          }],
          erpCode: 'G64758-74828',
          paymentMethod: 'Physical Check',
          accessProvider: true,
          governmental: false,
          licensor: true,
          materialSupplier: true,
          vendorCurrencies: ['USD'],
          claimingInterval: 0,
          discountPercent: 0,
          expectedActivationInterval: 1,
          expectedInvoiceInterval: 30,
          renewalActivationInterval: 365,
          subscriptionInterval: 365,
          expectedReceiptInterval: 30,
          taxId: '',
          liableForVat: false,
          taxPercentage: 0,
          interfaces: ['14e81009-0f98-45a0-b8e6-e25547beb22f'],
          accounts: [{
            name: 'Library account',
            accountNo: '1234',
            description: 'Main library account',
            appSystemNo: '',
            paymentMethod: 'Physical Check',
            accountStatus: 'Active',
            contactInfo: 'customerservice@alexanderstreet.com',
            libraryCode: 'COB',
            libraryEdiCode: '765987610',
            notes: '',
            acqUnitIds: []
          }],
          isVendor: true,
          sanCode: '1234567',
          changelogs: [{
            description: 'This is a sample note.',
            timestamp: '2008-05-15T10:53:00.000+00:00'
          }],
          acqUnitIds: [],
          metadata: {
            createdDate: '2021-02-07T02:51:01.131+00:00',
            updatedDate: '2021-02-07T02:51:01.131+00:00'
          }
        }
      },
      owner: {
        id: '37ede8a0-c864-4c85-a20b-664e0d50dc45'
      },
      role: {
        id: '02d31828778227be0177822a4bab0041',
        value: 'content_provider',
        label: 'Content Provider'
      },
      interfaces: [{
        id: '14e81009-0f98-45a0-b8e6-e25547beb22f',
        name: 'Academic Video Online',
        uri: 'https://search.alexanderstreet.com/avon',
        available: false,
        type: [],
        metadata: {
          createdDate: '2021-02-07T02:51:02.907+00:00',
          updatedDate: '2021-02-07T02:51:02.907+00:00'
        }
      }]
    }],
    externalLicenseDocs: [{
      id: 'd1093147-b34c-401a-9008-a11143b9590c',
      dateCreated: '2021-02-15T14:47:38Z',
      lastUpdated: '2021-02-15T14:47:38Z',
      url: 'http://external.licen.se',
      name: 'External license'
    }],
    outwardRelationships: [{
      id: '7a5933b3-e205-459f-9c3e-079850e9a6aa',
      type: {
        id: '02d31828778227be0177822a49c80004',
        value: 'related_to',
        label: 'Related to'
      },
      outward: {
        id: '37ede8a0-c864-4c85-a20b-664e0d50dc45',
        name: 'Accordion Agreement 1',
        agreementStatus: {
          id: '02d31828778227be0177822a4aee0026',
          value: 'active',
          label: 'Active'
        },
        startDate: '2021-02-01',
        endDate: null
      },
      inward: {
        id: '5aa3201c-976c-4946-96d0-a2643e28cf89',
        name: 'Active Agreement LR 002',
        agreementStatus: {
          id: '02d31828778227be0177822a4aee0026',
          value: 'active',
          label: 'Active'
        },
        startDate: '2018-01-01',
        endDate: null
      }
    }],
    customProperties: {},
    contacts: [{
      id: '34f005ab-b279-4c99-b466-ea38328db23f',
      owner: {
        id: '37ede8a0-c864-4c85-a20b-664e0d50dc45'
      },
      role: {
        id: '02d31828778227be0177822a4b4c0033',
        value: 'erm_librarian',
        label: 'ERM librarian'
      },
      user: {
        username: 'acq-admin',
        id: '37af9967-e7ce-4277-93ee-953b94f7e191',
        barcode: '1612666852641202358',
        active: true,
        type: 'patron',
        patronGroup: '3684a786-6671-4268-8ed0-9db82ebca60b',
        departments: [],
        proxyFor: [],
        personal: {
          lastName: 'Admin',
          firstName: 'acq-admin',
          addresses: []
        },
        createdDate: '2021-02-07T03:00:52.684+00:00',
        updatedDate: '2021-02-07T03:00:52.684+00:00',
        metadata: {
          createdDate: '2021-02-07T03:00:52.681+00:00',
          createdByUserId: '6fbd6825-c677-5832-811c-e5fb7960bacc',
          updatedDate: '2021-02-07T03:00:52.681+00:00',
          updatedByUserId: '6fbd6825-c677-5832-811c-e5fb7960bacc'
        }
      }
    }],
    tags: [{
      id: 11,
      normValue: 'testtag',
      value: 'testtag'
    }],
    inwardRelationships: [],
    startDate: '2021-02-01',
    linkedLicenses: [{
      id: '02d31828778227be0177aa6bfd4d004a',
      remoteId: '95ac5e06-9907-464c-9b29-b69c76e4314d',
      remoteId_object: {
        id: '95ac5e06-9907-464c-9b29-b69c76e4314d',
        dateCreated: '2021-02-15T15:06:59Z',
        customProperties: {},
        contacts: [],
        tags: [],
        lastUpdated: '2021-02-15T15:06:59Z',
        docs: [],
        name: 'Historical license',
        status: {
          id: '02d31828778227760177822ae512000f',
          value: 'active',
          label: 'Active',
          owner: {
            id: '02d31828778227760177822ae4f9000c',
            desc: 'License.Status',
            internal: true
          }
        },
        supplementaryDocs: [],
        startDate: '2019-01-01',
        endDate: '2019-12-31',
        openEnded: false,
        amendments: [],
        orgs: [],
        type: {
          id: '02d31828778227760177822ae5440013',
          value: 'local',
          label: 'Local',
          owner: {
            id: '02d31828778227760177822ae53b0012',
            desc: 'License.Type',
            internal: false
          }
        },
        alternateNames: []
      },
      owner: {
        id: '37ede8a0-c864-4c85-a20b-664e0d50dc45'
      },
      amendments: [],
      status: {
        id: '02d31828778227be0177822a4b33002f',
        value: 'historical',
        label: 'Historical'
      }
    }, {
      id: '02d31828778227be0177aa6c945f004c',
      remoteId: '18b4bffb-5949-4f68-b3f1-23ef692e1666',
      remoteId_object: {
        id: '18b4bffb-5949-4f68-b3f1-23ef692e1666',
        dateCreated: '2021-02-15T15:07:53Z',
        customProperties: {},
        contacts: [],
        tags: [],
        lastUpdated: '2021-02-15T15:07:53Z',
        docs: [],
        name: 'Future license',
        status: {
          id: '02d31828778227760177822ae512000f',
          value: 'active',
          label: 'Active',
          owner: {
            id: '02d31828778227760177822ae4f9000c',
            desc: 'License.Status',
            internal: true
          }
        },
        supplementaryDocs: [],
        startDate: '2022-01-01',
        endDate: '2022-12-31',
        openEnded: false,
        amendments: [],
        orgs: [],
        type: {
          id: '02d31828778227760177822ae5440013',
          value: 'local',
          label: 'Local',
          owner: {
            id: '02d31828778227760177822ae53b0012',
            desc: 'License.Type',
            internal: false
          }
        },
        alternateNames: []
      },
      owner: {
        id: '37ede8a0-c864-4c85-a20b-664e0d50dc45'
      },
      amendments: [],
      status: {
        id: '02d31828778227be0177822a4b2a002e',
        value: 'future',
        label: 'Future'
      }
    }, {
      id: '02d31828778227be0177aa6bfd4d004b',
      remoteId: 'd4819d9f-b99f-430c-9168-3b0b059d6579',
      remoteId_object: {
        id: 'd4819d9f-b99f-430c-9168-3b0b059d6579',
        dateCreated: '2021-02-15T15:08:43Z',
        customProperties: {},
        contacts: [],
        tags: [],
        lastUpdated: '2021-02-15T15:08:43Z',
        docs: [],
        name: 'Controlling license',
        status: {
          id: '02d31828778227760177822ae512000f',
          value: 'active',
          label: 'Active',
          owner: {
            id: '02d31828778227760177822ae4f9000c',
            desc: 'License.Status',
            internal: true
          }
        },
        supplementaryDocs: [],
        startDate: '2021-01-01',
        endDate: '2021-12-31',
        openEnded: false,
        amendments: [],
        orgs: [],
        type: {
          id: '02d31828778227760177822ae5440013',
          value: 'local',
          label: 'Local',
          owner: {
            id: '02d31828778227760177822ae53b0012',
            desc: 'License.Type',
            internal: false
          }
        },
        alternateNames: []
      },
      owner: {
        id: '37ede8a0-c864-4c85-a20b-664e0d50dc45'
      },
      amendments: [],
      status: {
        id: '02d31828778227be0177822a4b22002d',
        value: 'controlling',
        label: 'Controlling'
      }
    }],
    docs: [],
    periods: [{
      id: '7c246a46-aae9-4b78-934e-0936520471d9',
      startDate: '2021-02-01',
      owner: {
        id: '37ede8a0-c864-4c85-a20b-664e0d50dc45'
      },
      periodStatus: 'current'
    }],
    usageDataProviders: [],
    agreementStatus: {
      id: '02d31828778227be0177822a4aee0026',
      value: 'active',
      label: 'Active'
    },
    supplementaryDocs: [{
      id: '9e1cd155-2566-45af-862d-3fcc2f1bb30e',
      dateCreated: '2021-02-15T14:47:38Z',
      lastUpdated: '2021-02-16T11:06:30Z',
      atType: {
        id: '02d31828778227be0177822a4b680037',
        value: 'misc',
        label: 'Misc'
      },
      fileUpload: {
        id: '48b0d5eb-0b7e-4119-90f5-67709b50b175',
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 11580,
        modified: '2021-02-15T14:47:38Z',
        name: 'SupplementaryDocument1.docx'
      },
      name: 'Supplementary document 1'
    }],
    description: 'Agreement with ALL accordions showing',
    endDate: null,
    cancellationDeadline: null,
    alternateNames: [],
    relatedAgreements: [{
      id: '7a5933b3-e205-459f-9c3e-079850e9a6aa',
      type: 'related_to'
    }],
    lines: [],
    agreementLinesCount: 0,
    eresources: [],
    eresourcesCount: 0,
    orderLines: []
  },
  eresourcesFilterPath: 'current',
  searchString: '?filters=agreementStatus.active%2CagreementStatus.draft%2CagreementStatus.in_negotiation%2CagreementStatus.requested&sort=name',
  supplementaryProperties: [],
  terms: [{
    id: '02d31828778227760177822ae735002a',
    name: 'authorisedUsers',
    primary: true,
    defaultInternal: true,
    label: 'Definition of authorised user',
    description: 'The definition of an authorised user for a resource',
    weight: -1,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
  }, {
    id: '02d31828778227760177822ae79b002c',
    name: 'remoteAccess',
    primary: true,
    category: {
      id: '02d31828778227760177822ae67f001d',
      desc: 'Yes/No/Other',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae69c0020',
        value: 'other_(see_notes)',
        label: 'Other (see notes)'
      }, {
        id: '02d31828778227760177822ae68f001f',
        value: 'no',
        label: 'No'
      }, {
        id: '02d31828778227760177822ae683001e',
        value: 'yes',
        label: 'Yes'
      }]
    },
    defaultInternal: true,
    label: 'Access restricted to on-campus/campus network?',
    description: 'Can access to the resource be provided from outside the library or institutional location / network',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }, {
    id: '02d31828778227760177822ae7a2002d',
    name: 'illElectronic',
    primary: true,
    category: {
      id: '02d31828778227760177822ae6a10021',
      desc: 'Permitted/Prohibited',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae6dd0028',
        value: 'not_applicable',
        label: 'Not applicable'
      }, {
        id: '02d31828778227760177822ae6ac0023',
        value: 'permitted_(explicit)_under_conditions',
        label: 'Permitted (explicit) under conditions'
      }, {
        id: '02d31828778227760177822ae6b80024',
        value: 'permitted_(interpreted)',
        label: 'Permitted (interpreted)'
      }, {
        id: '02d31828778227760177822ae6a50022',
        value: 'permitted_(explicit)',
        label: 'Permitted (explicit)'
      }, {
        id: '02d31828778227760177822ae6c20025',
        value: 'prohibited_(explicit)',
        label: 'Prohibited (explicit)'
      }, {
        id: '02d31828778227760177822ae6cb0026',
        value: 'prohibited_(interpreted)',
        label: 'Prohibited (interpreted)'
      }, {
        id: '02d31828778227760177822ae6d40027',
        value: 'unmentioned',
        label: 'Unmentioned'
      }]
    },
    defaultInternal: true,
    label: 'Electronic ILL',
    description: 'The right to provide the licensed materials via interlibrary loan by way of electronic copies',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }, {
    id: '02d31828778227760177822ae7c30033',
    name: 'copyDigital',
    primary: true,
    category: {
      id: '02d31828778227760177822ae6a10021',
      desc: 'Permitted/Prohibited',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae6dd0028',
        value: 'not_applicable',
        label: 'Not applicable'
      }, {
        id: '02d31828778227760177822ae6ac0023',
        value: 'permitted_(explicit)_under_conditions',
        label: 'Permitted (explicit) under conditions'
      }, {
        id: '02d31828778227760177822ae6b80024',
        value: 'permitted_(interpreted)',
        label: 'Permitted (interpreted)'
      }, {
        id: '02d31828778227760177822ae6a50022',
        value: 'permitted_(explicit)',
        label: 'Permitted (explicit)'
      }, {
        id: '02d31828778227760177822ae6c20025',
        value: 'prohibited_(explicit)',
        label: 'Prohibited (explicit)'
      }, {
        id: '02d31828778227760177822ae6cb0026',
        value: 'prohibited_(interpreted)',
        label: 'Prohibited (interpreted)'
      }, {
        id: '02d31828778227760177822ae6d40027',
        value: 'unmentioned',
        label: 'Unmentioned'
      }]
    },
    defaultInternal: true,
    label: 'Making digital copies',
    description: 'The right of the licensee and authorized users to download and digitally copy a reasonable portion of the licensed materials',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }, {
    id: '02d31828778227760177822ae7c80034',
    name: 'copyPrint',
    primary: true,
    category: {
      id: '02d31828778227760177822ae6a10021',
      desc: 'Permitted/Prohibited',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae6dd0028',
        value: 'not_applicable',
        label: 'Not applicable'
      }, {
        id: '02d31828778227760177822ae6ac0023',
        value: 'permitted_(explicit)_under_conditions',
        label: 'Permitted (explicit) under conditions'
      }, {
        id: '02d31828778227760177822ae6b80024',
        value: 'permitted_(interpreted)',
        label: 'Permitted (interpreted)'
      }, {
        id: '02d31828778227760177822ae6a50022',
        value: 'permitted_(explicit)',
        label: 'Permitted (explicit)'
      }, {
        id: '02d31828778227760177822ae6c20025',
        value: 'prohibited_(explicit)',
        label: 'Prohibited (explicit)'
      }, {
        id: '02d31828778227760177822ae6cb0026',
        value: 'prohibited_(interpreted)',
        label: 'Prohibited (interpreted)'
      }, {
        id: '02d31828778227760177822ae6d40027',
        value: 'unmentioned',
        label: 'Unmentioned'
      }]
    },
    defaultInternal: true,
    label: 'Making print copies',
    description: 'The right of the licensee and authorized users to print a reasonable portion of the licensed materials',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }, {
    id: '02d31828778227760177822ae72e0029',
    name: 'concurrentAccess',
    primary: true,
    defaultInternal: true,
    label: 'Number of concurrent users allowed',
    description: 'The number of concurrent users allowed by the resource',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger'
  }, {
    id: '02d31828778227760177822ae7ae002f',
    name: 'illPrint',
    primary: true,
    category: {
      id: '02d31828778227760177822ae6a10021',
      desc: 'Permitted/Prohibited',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae6dd0028',
        value: 'not_applicable',
        label: 'Not applicable'
      }, {
        id: '02d31828778227760177822ae6ac0023',
        value: 'permitted_(explicit)_under_conditions',
        label: 'Permitted (explicit) under conditions'
      }, {
        id: '02d31828778227760177822ae6b80024',
        value: 'permitted_(interpreted)',
        label: 'Permitted (interpreted)'
      }, {
        id: '02d31828778227760177822ae6a50022',
        value: 'permitted_(explicit)',
        label: 'Permitted (explicit)'
      }, {
        id: '02d31828778227760177822ae6c20025',
        value: 'prohibited_(explicit)',
        label: 'Prohibited (explicit)'
      }, {
        id: '02d31828778227760177822ae6cb0026',
        value: 'prohibited_(interpreted)',
        label: 'Prohibited (interpreted)'
      }, {
        id: '02d31828778227760177822ae6d40027',
        value: 'unmentioned',
        label: 'Unmentioned'
      }]
    },
    defaultInternal: true,
    label: 'Print ILL',
    description: 'The right to provide the licensed materials via interlibrary loan by way of print copies or facsimile transmission',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }, {
    id: '02d31828778227760177822ae7a8002e',
    name: 'illSecureElectronic',
    primary: true,
    category: {
      id: '02d31828778227760177822ae6a10021',
      desc: 'Permitted/Prohibited',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae6dd0028',
        value: 'not_applicable',
        label: 'Not applicable'
      }, {
        id: '02d31828778227760177822ae6ac0023',
        value: 'permitted_(explicit)_under_conditions',
        label: 'Permitted (explicit) under conditions'
      }, {
        id: '02d31828778227760177822ae6b80024',
        value: 'permitted_(interpreted)',
        label: 'Permitted (interpreted)'
      }, {
        id: '02d31828778227760177822ae6a50022',
        value: 'permitted_(explicit)',
        label: 'Permitted (explicit)'
      }, {
        id: '02d31828778227760177822ae6c20025',
        value: 'prohibited_(explicit)',
        label: 'Prohibited (explicit)'
      }, {
        id: '02d31828778227760177822ae6cb0026',
        value: 'prohibited_(interpreted)',
        label: 'Prohibited (interpreted)'
      }, {
        id: '02d31828778227760177822ae6d40027',
        value: 'unmentioned',
        label: 'Unmentioned'
      }]
    },
    defaultInternal: true,
    label: 'Secure Electronic ILL',
    description: 'The right to provide the licensed materials via interlibrary loan by way of secure electronic transmission',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }, {
    id: '02d31828778227760177822ae7b20030',
    name: 'reservesElectronic',
    primary: true,
    category: {
      id: '02d31828778227760177822ae6a10021',
      desc: 'Permitted/Prohibited',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae6dd0028',
        value: 'not_applicable',
        label: 'Not applicable'
      }, {
        id: '02d31828778227760177822ae6ac0023',
        value: 'permitted_(explicit)_under_conditions',
        label: 'Permitted (explicit) under conditions'
      }, {
        id: '02d31828778227760177822ae6b80024',
        value: 'permitted_(interpreted)',
        label: 'Permitted (interpreted)'
      }, {
        id: '02d31828778227760177822ae6a50022',
        value: 'permitted_(explicit)',
        label: 'Permitted (explicit)'
      }, {
        id: '02d31828778227760177822ae6c20025',
        value: 'prohibited_(explicit)',
        label: 'Prohibited (explicit)'
      }, {
        id: '02d31828778227760177822ae6cb0026',
        value: 'prohibited_(interpreted)',
        label: 'Prohibited (interpreted)'
      }, {
        id: '02d31828778227760177822ae6d40027',
        value: 'unmentioned',
        label: 'Unmentioned'
      }]
    },
    defaultInternal: true,
    label: 'Storage of electronic copies on secure network',
    description: 'The right to make electronic copies of the licensed materials and store them on a secure network',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }, {
    id: '02d31828778227760177822ae7b80031',
    name: 'coursePackElectronic',
    primary: true,
    category: {
      id: '02d31828778227760177822ae6a10021',
      desc: 'Permitted/Prohibited',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae6dd0028',
        value: 'not_applicable',
        label: 'Not applicable'
      }, {
        id: '02d31828778227760177822ae6ac0023',
        value: 'permitted_(explicit)_under_conditions',
        label: 'Permitted (explicit) under conditions'
      }, {
        id: '02d31828778227760177822ae6b80024',
        value: 'permitted_(interpreted)',
        label: 'Permitted (interpreted)'
      }, {
        id: '02d31828778227760177822ae6a50022',
        value: 'permitted_(explicit)',
        label: 'Permitted (explicit)'
      }, {
        id: '02d31828778227760177822ae6c20025',
        value: 'prohibited_(explicit)',
        label: 'Prohibited (explicit)'
      }, {
        id: '02d31828778227760177822ae6cb0026',
        value: 'prohibited_(interpreted)',
        label: 'Prohibited (interpreted)'
      }, {
        id: '02d31828778227760177822ae6d40027',
        value: 'unmentioned',
        label: 'Unmentioned'
      }]
    },
    defaultInternal: false,
    label: 'Use in electronic coursepacks',
    description: 'The right to use licensed materials in collections or compilations of materials assembled in an electronic format by faculty members for use by students in a class for purposes of instruction',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }, {
    id: '02d31828778227760177822ae7be0032',
    name: 'coursePackPrint',
    primary: true,
    category: {
      id: '02d31828778227760177822ae6a10021',
      desc: 'Permitted/Prohibited',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae6dd0028',
        value: 'not_applicable',
        label: 'Not applicable'
      }, {
        id: '02d31828778227760177822ae6ac0023',
        value: 'permitted_(explicit)_under_conditions',
        label: 'Permitted (explicit) under conditions'
      }, {
        id: '02d31828778227760177822ae6b80024',
        value: 'permitted_(interpreted)',
        label: 'Permitted (interpreted)'
      }, {
        id: '02d31828778227760177822ae6a50022',
        value: 'permitted_(explicit)',
        label: 'Permitted (explicit)'
      }, {
        id: '02d31828778227760177822ae6c20025',
        value: 'prohibited_(explicit)',
        label: 'Prohibited (explicit)'
      }, {
        id: '02d31828778227760177822ae6cb0026',
        value: 'prohibited_(interpreted)',
        label: 'Prohibited (interpreted)'
      }, {
        id: '02d31828778227760177822ae6d40027',
        value: 'unmentioned',
        label: 'Unmentioned'
      }]
    },
    defaultInternal: false,
    label: 'Use in print course packs',
    description: 'The right to use licensed materials in collections or compilations of materials assembled in a print format by faculty members for use by students in a class for purposes of instruction',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }, {
    id: '02d31828778227760177822ae795002b',
    name: 'walkInAccess',
    primary: true,
    category: {
      id: '02d31828778227760177822ae67f001d',
      desc: 'Yes/No/Other',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae69c0020',
        value: 'other_(see_notes)',
        label: 'Other (see notes)'
      }, {
        id: '02d31828778227760177822ae68f001f',
        value: 'no',
        label: 'No'
      }, {
        id: '02d31828778227760177822ae683001e',
        value: 'yes',
        label: 'Yes'
      }]
    },
    defaultInternal: false,
    label: 'Walk-in access permitted?',
    description: 'Can non-members of the library/instittuion use the resource when in the library',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }, {
    id: '02d31828778227760177822ae7e5003a',
    name: 'authProxy',
    primary: false,
    category: {
      id: '02d31828778227760177822ae67f001d',
      desc: 'Yes/No/Other',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae69c0020',
        value: 'other_(see_notes)',
        label: 'Other (see notes)'
      }, {
        id: '02d31828778227760177822ae68f001f',
        value: 'no',
        label: 'No'
      }, {
        id: '02d31828778227760177822ae683001e',
        value: 'yes',
        label: 'Yes'
      }]
    },
    defaultInternal: true,
    label: 'Access via a proxy supported?',
    description: 'Whether authentication via a reverse proxy is supported',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }, {
    id: '02d31828778227760177822ae7f2003d',
    name: 'annualOptOut',
    primary: false,
    category: {
      id: '02d31828778227760177822ae67f001d',
      desc: 'Yes/No/Other',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae69c0020',
        value: 'other_(see_notes)',
        label: 'Other (see notes)'
      }, {
        id: '02d31828778227760177822ae68f001f',
        value: 'no',
        label: 'No'
      }, {
        id: '02d31828778227760177822ae683001e',
        value: 'yes',
        label: 'Yes'
      }]
    },
    defaultInternal: true,
    label: 'Annual opt-out clause included?',
    description: "Whether the license includes an 'annual opt-out' clause within a multi-year agreement",
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }, {
    id: '02d31828778227760177822ae7e00039',
    name: 'authIP',
    primary: false,
    category: {
      id: '02d31828778227760177822ae67f001d',
      desc: 'Yes/No/Other',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae69c0020',
        value: 'other_(see_notes)',
        label: 'Other (see notes)'
      }, {
        id: '02d31828778227760177822ae68f001f',
        value: 'no',
        label: 'No'
      }, {
        id: '02d31828778227760177822ae683001e',
        value: 'yes',
        label: 'Yes'
      }]
    },
    defaultInternal: true,
    label: 'IP authentication supported?',
    description: 'Whether authentication via IP range is supported',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }, {
    id: '02d31828778227760177822ae7da0038',
    name: 'metadataUsage',
    primary: false,
    defaultInternal: true,
    label: 'Metadata usage',
    description: 'Any restrictions expressed related to the use of metadata in the platforms',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
  }, {
    id: '02d31828778227760177822ae7d10036',
    name: 'otherRestrictions',
    primary: false,
    defaultInternal: true,
    label: 'Other restrictions',
    description: 'Other restrictions expressed in the license',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
  }, {
    id: '02d31828778227760177822ae7ee003c',
    name: 'authSAML',
    primary: false,
    category: {
      id: '02d31828778227760177822ae67f001d',
      desc: 'Yes/No/Other',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae69c0020',
        value: 'other_(see_notes)',
        label: 'Other (see notes)'
      }, {
        id: '02d31828778227760177822ae68f001f',
        value: 'no',
        label: 'No'
      }, {
        id: '02d31828778227760177822ae683001e',
        value: 'yes',
        label: 'Yes'
      }]
    },
    defaultInternal: true,
    label: 'SAML compliant authentication supported?',
    description: 'Whether authentication via SAML compliant method is supported',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }, {
    id: '02d31828778227760177822ae7cc0035',
    name: 'scholarlySharing',
    primary: false,
    category: {
      id: '02d31828778227760177822ae6a10021',
      desc: 'Permitted/Prohibited',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae6dd0028',
        value: 'not_applicable',
        label: 'Not applicable'
      }, {
        id: '02d31828778227760177822ae6ac0023',
        value: 'permitted_(explicit)_under_conditions',
        label: 'Permitted (explicit) under conditions'
      }, {
        id: '02d31828778227760177822ae6b80024',
        value: 'permitted_(interpreted)',
        label: 'Permitted (interpreted)'
      }, {
        id: '02d31828778227760177822ae6a50022',
        value: 'permitted_(explicit)',
        label: 'Permitted (explicit)'
      }, {
        id: '02d31828778227760177822ae6c20025',
        value: 'prohibited_(explicit)',
        label: 'Prohibited (explicit)'
      }, {
        id: '02d31828778227760177822ae6cb0026',
        value: 'prohibited_(interpreted)',
        label: 'Prohibited (interpreted)'
      }, {
        id: '02d31828778227760177822ae6d40027',
        value: 'unmentioned',
        label: 'Unmentioned'
      }]
    },
    defaultInternal: true,
    label: 'Sharing for scholarly use',
    description: 'The right of authorized users and/or licensee to transmit hard copy or electronic copy of reasonable amounts of licensed materials to a third party for personal, scholarly, educational, scientific or professional use',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }, {
    id: '02d31828778227760177822ae7d60037',
    name: 'textAndDataMining',
    primary: false,
    category: {
      id: '02d31828778227760177822ae6a10021',
      desc: 'Permitted/Prohibited',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae6dd0028',
        value: 'not_applicable',
        label: 'Not applicable'
      }, {
        id: '02d31828778227760177822ae6ac0023',
        value: 'permitted_(explicit)_under_conditions',
        label: 'Permitted (explicit) under conditions'
      }, {
        id: '02d31828778227760177822ae6b80024',
        value: 'permitted_(interpreted)',
        label: 'Permitted (interpreted)'
      }, {
        id: '02d31828778227760177822ae6a50022',
        value: 'permitted_(explicit)',
        label: 'Permitted (explicit)'
      }, {
        id: '02d31828778227760177822ae6c20025',
        value: 'prohibited_(explicit)',
        label: 'Prohibited (explicit)'
      }, {
        id: '02d31828778227760177822ae6cb0026',
        value: 'prohibited_(interpreted)',
        label: 'Prohibited (interpreted)'
      }, {
        id: '02d31828778227760177822ae6d40027',
        value: 'unmentioned',
        label: 'Unmentioned'
      }]
    },
    defaultInternal: false,
    label: 'Text and Data mining',
    description: 'Whether it is permitted to use text and data mining processes on the content of the resource',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }, {
    id: '02d31828778227760177822ae7f5003e',
    name: 'APCAndOffsetting',
    primary: false,
    defaultInternal: true,
    label: 'Whether the resource is subject to an APC discount or subscription cost offsetting agreement',
    description: 'Whether the resource is subject to an APC discount or subscription cost offsetting agreement',
    weight: 0,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
  }, {
    id: '02d31828778227760177822ae7e9003b',
    name: 'postCancellationAccess',
    primary: false,
    category: {
      id: '02d31828778227760177822ae67f001d',
      desc: 'Yes/No/Other',
      internal: false,
      values: [{
        id: '02d31828778227760177822ae69c0020',
        value: 'other_(see_notes)',
        label: 'Other (see notes)'
      }, {
        id: '02d31828778227760177822ae68f001f',
        value: 'no',
        label: 'No'
      }, {
        id: '02d31828778227760177822ae683001e',
        value: 'yes',
        label: 'Yes'
      }]
    },
    defaultInternal: true,
    label: 'Post-cancellation terms included?',
    description: 'Does the license include post-cancellation terms?',
    weight: 1,
    type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
  }]
};


const agreementWithoutAllAccordions = {
};

describe('Agreement render accordions', () => {
  describe('Agreement with all accordions', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <Agreement
            data={agreementWithAllAccordions}
            handlers={handlers}
            isLoading={isLoading}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the \'Internal contacts\' Accordion', async () => {
      await Accordion('Internal contacts').exists();
    });

    /* test('renders the \'Agreement lines\' Accordion', async () => {
      await Accordion('Agreement lines').exists();
    });

    test('renders the \'Controlling license\' Accordion', async () => {
      await Accordion('Controlling license').exists();
    });

    test('renders the \'Future licenses\' Accordion', async () => {
      await Accordion('Future licenses').exists();
    });

    test('renders the \'Historical licenses\' Accordion', async () => {
      await Accordion('Historical licenses').exists();
    });

    test('renders the \'External licenses\' Accordion', async () => {
      await Accordion('External licenses').exists();
    });

    test('renders the \'License and business terms\' Accordion', async () => {
      await Accordion('License and business terms').exists();
    });

    test('renders the \'Organizations\' Accordion', async () => {
      await Accordion('Organizations').exists();
    });

    test('renders the \'Supplementary documents\' Accordion', async () => {
      await Accordion('Supplementary documents').exists();
    });

    test('renders the \'Related agreements\' Accordion', async () => {
      await Accordion('Related agreements').exists();
    });

    test('renders the \'Notes\' Accordion', async () => {
      await Accordion('Notes').exists();
    }); */
  });

  /* describe('Agreement without all accordions', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <Agreement
            data={agreementWithoutAllAccordions}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('does not render an Accordion', async () => {
      await Accordion('All periods').absent();
    });
  }); */
});
