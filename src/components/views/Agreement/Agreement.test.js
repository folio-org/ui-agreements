import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Accordion } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import Agreement from './Agreement';

const onClose = jest.fn();

const agreementWithAllAccordions = {
  data: {
    agreement: {
      'id': '37ede8a0-c864-4c85-a20b-664e0d50dc45',
      'name': 'Accordion Agreement 1',
      'orgs': [{
        'id': 'c679cb12-2cd4-4255-9e83-207f33361e89',
        'org': {
          'id': '0fb6bf7b-56f7-44b8-bc02-183cb82d459e',
          'orgsUuid': '11fb627a-cdf1-11e8-a8d5-f2801f1b9fd1',
          'name': 'Alexander Street Press',
          'orgsUuid_object': {
            'id': '11fb627a-cdf1-11e8-a8d5-f2801f1b9fd1',
            'name': 'Alexander Street Press',
            'code': 'ALEXS',
            'description': 'AV streaming services',
            'exportToAccounting': false,
            'status': 'Active',
            'language': 'en-us',
            'aliases': [{
              'value': 'Alexander Street',
              'description': ''
            }],
            'addresses': [{
              'addressLine1': '3212 Duke Street',
              'addressLine2': '',
              'city': 'Alexandria',
              'stateRegion': 'VA',
              'zipCode': '22314',
              'country': 'USA',
              'isPrimary': true,
              'categories': [],
              'language': 'English'
            }],
            'phoneNumbers': [{
              'phoneNumber': '1-800-889-5937',
              'categories': [],
              'isPrimary': true,
              'language': 'English'
            }],
            'emails': [{
              'value': 'customerservice@alexanderstreet.com',
              'description': 'main customer service email',
              'isPrimary': true,
              'categories': [],
              'language': 'English'
            }],
            'urls': [{
              'value': 'https://alexanderstreet.com/',
              'description': 'main website',
              'language': 'en-us',
              'isPrimary': true,
              'categories': ['f52ceea4-8e35-404b-9ebd-5c7db6613195'],
              'notes': ''
            }],
            'contacts': ['11fb627a-cdf1-11e8-a8d5-f2801f1b9fd1'],
            'agreements': [{
              'name': 'library access',
              'discount': 0,
              'referenceUrl': '',
              'notes': ''
            }],
            'erpCode': 'G64758-74828',
            'paymentMethod': 'Physical Check',
            'accessProvider': true,
            'governmental': false,
            'licensor': true,
            'materialSupplier': true,
            'vendorCurrencies': ['USD'],
            'claimingInterval': 0,
            'discountPercent': 0,
            'expectedActivationInterval': 1,
            'expectedInvoiceInterval': 30,
            'renewalActivationInterval': 365,
            'subscriptionInterval': 365,
            'expectedReceiptInterval': 30,
            'taxId': '',
            'liableForVat': false,
            'taxPercentage': 0,
            'interfaces': ['14e81009-0f98-45a0-b8e6-e25547beb22f'],
            'accounts': [{
              'name': 'Library account',
              'accountNo': '1234',
              'description': 'Main library account',
              'appSystemNo': '',
              'paymentMethod': 'Physical Check',
              'accountStatus': 'Active',
              'contactInfo': 'customerservice@alexanderstreet.com',
              'libraryCode': 'COB',
              'libraryEdiCode': '765987610',
              'notes': '',
              'acqUnitIds': []
            }],
            'isVendor': true,
            'sanCode': '1234567',
            'changelogs': [{
              'description': 'This is a sample note.',
              'timestamp': '2008-05-15T10:53:00.000+00:00'
            }],
            'acqUnitIds': [],
            'metadata': {
              'createdDate': '2021-02-07T02:51:01.131+00:00',
              'updatedDate': '2021-02-07T02:51:01.131+00:00'
            }
          }
        },
        'owner': {
          'id': '37ede8a0-c864-4c85-a20b-664e0d50dc45'
        },
        'role': {
          'id': '02d31828778227be0177822a4bab0041',
          'value': 'content_provider',
          'label': 'Content Provider'
        },
        'interfaces': [{
          'id': '14e81009-0f98-45a0-b8e6-e25547beb22f',
          'name': 'Academic Video Online',
          'uri': 'https://search.alexanderstreet.com/avon',
          'available': false,
          'type': [],
          'metadata': {
            'createdDate': '2021-02-07T02:51:02.907+00:00',
            'updatedDate': '2021-02-07T02:51:02.907+00:00'
          }
        }]
      }],
      'externalLicenseDocs': [{
        'id': 'd1093147-b34c-401a-9008-a11143b9590c',
        'dateCreated': '2021-02-15T14:47:38Z',
        'lastUpdated': '2021-02-15T14:47:38Z',
        'url': 'http://external.licen.se',
        'name': 'External license'
      }],
      'outwardRelationships': [{
        'id': '7a5933b3-e205-459f-9c3e-079850e9a6aa',
        'type': {
          'id': '02d31828778227be0177822a49c80004',
          'value': 'related_to',
          'label': 'Related to'
        },
        'outward': {
          'id': '37ede8a0-c864-4c85-a20b-664e0d50dc45',
          'name': 'Accordion Agreement 1',
          'agreementStatus': {
            'id': '02d31828778227be0177822a4aee0026',
            'value': 'active',
            'label': 'Active'
          },
          'startDate': '2021-02-01',
          'endDate': null
        },
        'inward': {
          'id': '5aa3201c-976c-4946-96d0-a2643e28cf89',
          'name': 'Active Agreement LR 002',
          'agreementStatus': {
            'id': '02d31828778227be0177822a4aee0026',
            'value': 'active',
            'label': 'Active'
          },
          'startDate': '2018-01-01',
          'endDate': null
        }
      }],
      'customProperties': {},
      'contacts': [{
        'id': '34f005ab-b279-4c99-b466-ea38328db23f',
        'owner': {
          'id': '37ede8a0-c864-4c85-a20b-664e0d50dc45'
        },
        'role': {
          'id': '02d31828778227be0177822a4b4c0033',
          'value': 'erm_librarian',
          'label': 'ERM librarian'
        },
        'user': {
          'username': 'acq-admin',
          'id': '37af9967-e7ce-4277-93ee-953b94f7e191',
          'barcode': '1612666852641202358',
          'active': true,
          'type': 'patron',
          'patronGroup': '3684a786-6671-4268-8ed0-9db82ebca60b',
          'departments': [],
          'proxyFor': [],
          'personal': {
            'lastName': 'Admin',
            'firstName': 'acq-admin',
            'addresses': []
          },
          'createdDate': '2021-02-07T03:00:52.684+00:00',
          'updatedDate': '2021-02-07T03:00:52.684+00:00',
          'metadata': {
            'createdDate': '2021-02-07T03:00:52.681+00:00',
            'createdByUserId': '6fbd6825-c677-5832-811c-e5fb7960bacc',
            'updatedDate': '2021-02-07T03:00:52.681+00:00',
            'updatedByUserId': '6fbd6825-c677-5832-811c-e5fb7960bacc'
          }
        }
      }],
      'tags': [{
        'id': 11,
        'normValue': 'testtag',
        'value': 'testtag'
      }],
      'inwardRelationships': [],
      'startDate': '2021-02-01',
      'linkedLicenses': [{
        'id': '02d31828778227be0177aa6c945f004c',
        'remoteId': '18b4bffb-5949-4f68-b3f1-23ef692e1666',
        'remoteId_object': {
          'id': '18b4bffb-5949-4f68-b3f1-23ef692e1666',
          'dateCreated': '2021-02-15T15:07:53Z',
          'customProperties': {},
          'contacts': [],
          'tags': [],
          'lastUpdated': '2021-02-15T15:07:53Z',
          'docs': [],
          'name': 'Future license',
          'status': {
            'id': '02d31828778227760177822ae512000f',
            'value': 'active',
            'label': 'Active',
            'owner': {
              'id': '02d31828778227760177822ae4f9000c',
              'desc': 'License.Status',
              'internal': true
            }
          },
          'supplementaryDocs': [],
          'startDate': '2022-01-01',
          'endDate': '2022-12-31',
          'openEnded': false,
          'amendments': [],
          'orgs': [],
          'type': {
            'id': '02d31828778227760177822ae5440013',
            'value': 'local',
            'label': 'Local',
            'owner': {
              'id': '02d31828778227760177822ae53b0012',
              'desc': 'License.Type',
              'internal': false
            }
          },
          'alternateNames': []
        },
        'owner': {
          'id': '37ede8a0-c864-4c85-a20b-664e0d50dc45'
        },
        'amendments': [],
        'status': {
          'id': '02d31828778227be0177822a4b2a002e',
          'value': 'future',
          'label': 'Future'
        }
      }, {
        'id': '02d31828778227be0177aa6bfd4d004b',
        'remoteId': 'd4819d9f-b99f-430c-9168-3b0b059d6579',
        'remoteId_object': {
          'id': 'd4819d9f-b99f-430c-9168-3b0b059d6579',
          'dateCreated': '2021-02-15T15:08:43Z',
          'customProperties': {},
          'contacts': [],
          'tags': [],
          'lastUpdated': '2021-02-15T15:08:43Z',
          'docs': [],
          'name': 'Controlling license',
          'status': {
            'id': '02d31828778227760177822ae512000f',
            'value': 'active',
            'label': 'Active',
            'owner': {
              'id': '02d31828778227760177822ae4f9000c',
              'desc': 'License.Status',
              'internal': true
            }
          },
          'supplementaryDocs': [],
          'startDate': '2021-01-01',
          'endDate': '2021-12-31',
          'openEnded': false,
          'amendments': [],
          'orgs': [],
          'type': {
            'id': '02d31828778227760177822ae5440013',
            'value': 'local',
            'label': 'Local',
            'owner': {
              'id': '02d31828778227760177822ae53b0012',
              'desc': 'License.Type',
              'internal': false
            }
          },
          'alternateNames': []
        },
        'owner': {
          'id': '37ede8a0-c864-4c85-a20b-664e0d50dc45'
        },
        'amendments': [],
        'status': {
          'id': '02d31828778227be0177822a4b22002d',
          'value': 'controlling',
          'label': 'Controlling'
        }
      }, {
        'id': '02d31828778227be0177aa6bfd4d004a',
        'remoteId': '95ac5e06-9907-464c-9b29-b69c76e4314d',
        'remoteId_object': {
          'id': '95ac5e06-9907-464c-9b29-b69c76e4314d',
          'dateCreated': '2021-02-15T15:06:59Z',
          'customProperties': {},
          'contacts': [],
          'tags': [],
          'lastUpdated': '2021-02-15T15:06:59Z',
          'docs': [],
          'name': 'Historical license',
          'status': {
            'id': '02d31828778227760177822ae512000f',
            'value': 'active',
            'label': 'Active',
            'owner': {
              'id': '02d31828778227760177822ae4f9000c',
              'desc': 'License.Status',
              'internal': true
            }
          },
          'supplementaryDocs': [],
          'startDate': '2019-01-01',
          'endDate': '2019-12-31',
          'openEnded': false,
          'amendments': [],
          'orgs': [],
          'type': {
            'id': '02d31828778227760177822ae5440013',
            'value': 'local',
            'label': 'Local',
            'owner': {
              'id': '02d31828778227760177822ae53b0012',
              'desc': 'License.Type',
              'internal': false
            }
          },
          'alternateNames': []
        },
        'owner': {
          'id': '37ede8a0-c864-4c85-a20b-664e0d50dc45'
        },
        'amendments': [],
        'status': {
          'id': '02d31828778227be0177822a4b33002f',
          'value': 'historical',
          'label': 'Historical'
        }
      }],
      'docs': [],
      'periods': [{
        'id': '7c246a46-aae9-4b78-934e-0936520471d9',
        'startDate': '2021-02-01',
        'owner': {
          'id': '37ede8a0-c864-4c85-a20b-664e0d50dc45'
        },
        'periodStatus': 'current'
      }],
      'usageDataProviders': [],
      'agreementStatus': {
        'id': '02d31828778227be0177822a4aee0026',
        'value': 'active',
        'label': 'Active'
      },
      'supplementaryDocs': [{
        'id': '9e1cd155-2566-45af-862d-3fcc2f1bb30e',
        'dateCreated': '2021-02-15T14:47:38Z',
        'lastUpdated': '2021-02-16T10:39:38Z',
        'atType': {
          'id': '02d31828778227be0177822a4b680037',
          'value': 'misc',
          'label': 'Misc'
        },
        'fileUpload': {
          'id': '48b0d5eb-0b7e-4119-90f5-67709b50b175',
          'contentType': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'size': 11580,
          'modified': '2021-02-15T14:47:38Z',
          'name': 'SupplementaryDocument1.docx'
        },
        'name': 'Supplementary document 1'
      }],
      'description': 'Agreement with accordions showing',
      'endDate': null,
      'cancellationDeadline': null,
      'alternateNames': [],
      'relatedAgreements': [{
        'id': '7a5933b3-e205-459f-9c3e-079850e9a6aa',
        'type': 'related_to'
      }],
      'lines': [],
      'agreementLinesCount': 0,
      'eresources': [],
      'eresourcesCount': 0,
      'orderLines': []
    }
  }
};

const agreementWithoutAllAccordions = {
  periods: [
    {
      endDate: '1970-03-19',
      startDate: '1968-07-24',
      cancellationDeadline: '1969-09-04',
      note: 'Period note 1'
    },
    {
      endDate: '2007-10-05',
      startDate: '2001-12-06',
      cancellationDeadline: '2003-01-16',
      note: 'Period note 2'
    }
  ]
};

describe('Agreement render accordions', () => {
  describe('Agreement with all accordions', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <Agreement
            data={agreementWithAllAccordions}
            handlers={onClose}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the \'Internal contacts\' Accordion', async () => {
      await Accordion('Internal contacts').exists();
    });

    test('renders the \'Agreement lines\' Accordion', async () => {
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
    });
  });

  describe('Agreement without all accordions', () => {
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

    /* test('does not render an Accordion', async () => {
      await Accordion('All periods').absent();
    }); */
  });
});
