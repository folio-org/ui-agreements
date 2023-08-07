
import { renderWithIntl, KeyValue } from '@folio/stripes-erm-testing';
import Header from './Header';
import translationsProperties from '../../../../test/helpers';

const agreement = {
  'id': '03c1a4f3-5514-4799-9ceb-2d4fe9910c5e',
  'name': 'AM ag 1',
  'orgs': [
    {
      'id': 'b4cb7994-7bc2-428b-99e4-ab2069ff17ea',
      'primaryOrg': true,
      'org': {
        'id': '14cd7673-2ebb-4ae2-912b-1cd2d35942fe',
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
          'aliases': [
            {
              'value': 'Alexander Street',
              'description': ''
            }
          ],
          'addresses': [
            {
              'addressLine1': '3212 Duke Street',
              'addressLine2': '',
              'city': 'Alexandria',
              'stateRegion': 'VA',
              'zipCode': '22314',
              'country': 'USA',
              'isPrimary': true,
              'categories': [

              ],
              'language': 'English'
            }
          ],
          'phoneNumbers': [
            {
              'phoneNumber': '1-800-889-5937',
              'categories': [

              ],
              'isPrimary': true,
              'language': 'English'
            }
          ],
          'emails': [
            {
              'value': 'customerservice@alexanderstreet.com',
              'description': 'main customer service email',
              'isPrimary': true,
              'categories': [

              ],
              'language': 'English'
            }
          ],
          'urls': [
            {
              'value': 'https://alexanderstreet.com/',
              'description': 'main website',
              'language': 'en-us',
              'isPrimary': true,
              'categories': [
                'f52ceea4-8e35-404b-9ebd-5c7db6613195'
              ],
              'notes': ''
            }
          ],
          'contacts': [
            '11fb627a-cdf1-11e8-a8d5-f2801f1b9fd1'
          ],
          'agreements': [
            {
              'name': 'library access',
              'discount': 0,
              'referenceUrl': '',
              'notes': ''
            }
          ],
          'erpCode': 'G64758-74828',
          'paymentMethod': 'Physical Check',
          'accessProvider': true,
          'governmental': false,
          'licensor': true,
          'materialSupplier': true,
          'vendorCurrencies': [
            'USD'
          ],
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
          'interfaces': [
            '14e81009-0f98-45a0-b8e6-e25547beb22f'
          ],
          'accounts': [
            {
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
              'acqUnitIds': [

              ]
            }
          ],
          'isVendor': true,
          'sanCode': '1234567',
          'changelogs': [
            {
              'description': 'This is a sample note.',
              'timestamp': '2008-05-15T10:53:00.000+00:00'
            }
          ],
          'acqUnitIds': [

          ],
          'metadata': {
            'createdDate': '2021-07-20T03:23:01.913+00:00',
            'updatedDate': '2021-07-20T03:23:01.913+00:00'
          }
        }
      },
      'owner': {
        'id': '03c1a4f3-5514-4799-9ceb-2d4fe9910c5e'
      },
      'roles': [
        {
          'id': '86569bf7-467e-4db2-abf7-152c0d500054',
          'owner': {
            'id': 'b4cb7994-7bc2-428b-99e4-ab2069ff17ea'
          },
          'role': {
            'id': '2c9180ba7ac1f702017ac1f795b7002a',
            'value': 'content_provider',
            'label': 'Content provider'
          }
        }
      ],
      'interfaces': [
        {
          'id': '14e81009-0f98-45a0-b8e6-e25547beb22f',
          'name': 'Academic Video Online',
          'uri': 'https://search.alexanderstreet.com/avon',
          'available': false,
          'type': [

          ],
          'metadata': {
            'createdDate': '2021-07-20T03:23:02.247+00:00',
            'updatedDate': '2021-07-20T03:23:02.247+00:00'
          }
        }
      ]
    }
  ],
  'externalLicenseDocs': [

  ],
  'outwardRelationships': [

  ],
  'customProperties': {

  },
  'contacts': [

  ],
  'tags': [],
  'inwardRelationships': [],
  'startDate': '2021-07-21',
  'linkedLicenses': [],
  'docs': [],
  'periods': [
    {
      'id': 'd168cbab-0caf-467a-acd9-90da21a0da11',
      'startDate': '2021-07-21',
      'owner': {
        'id': '03c1a4f3-5514-4799-9ceb-2d4fe9910c5e'
      },
      'periodStatus': 'next'
    }
  ],
  'usageDataProviders': [

  ],
  'agreementStatus': {
    'id': '2c9180ba7ac1f702017ac1f795450011',
    'value': 'active',
    'label': 'Active'
  },
  'supplementaryDocs': [

  ],
  'endDate': '2021-07-22',
  'cancellationDeadline': null,
  'alternateNames': [

  ],
  'relatedAgreements': [

  ],
  'lines': [

  ],
  'agreementLinesCount': 0,
  'eresources': [

  ],
  'eresourcesCount': 0,
  'orderLines': [

  ]
};

describe('Header', () => {
  beforeEach(() => {
    renderWithIntl(
      <Header
        agreement={agreement}
      />,
      translationsProperties
    );
  });

  test('renders the expected start date', async () => {
    await KeyValue('Start date').has({ value: '7/21/2021' });
  });

  test('renders the expected start date', async () => {
    await KeyValue('End date').has({ value: '7/22/2021' });
  });

  test('renders the expected status', async () => {
    await KeyValue('Status').has({ value: 'Active' });
  });

  test('renders the expected primary org', async () => {
    await KeyValue('Primary organization').has({ value: 'Alexander Street Press' });
  });
});
