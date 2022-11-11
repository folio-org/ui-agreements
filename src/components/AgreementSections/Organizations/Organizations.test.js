import { renderWithIntl } from '@folio/stripes-erm-testing';
import { Accordion } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import Organizations from './Organizations';

const agreement = {
  orgs: [
    {
      'id': 'ee82bf12-dd9d-4e59-8d91-81e1f4b9e933',
      'primaryOrg': false,
      'org': {
        'id': '7640fcd3-a757-47d7-a7fa-57b07b4490fc',
        'orgsUuid': '80fb5168-cdf1-11e8-a8d5-f2801f1b9fd1',
        'name': 'American Chemical Society',
        'orgsUuid_object': {
          'id': '80fb5168-cdf1-11e8-a8d5-f2801f1b9fd1',
          'name': 'American Chemical Society',
          'code': 'ACSO',
          'description': 'Serials - Domestic',
          'exportToAccounting': true,
          'status': 'Active',
          'language': 'en-us',
          'aliases': [
            {
              'value': 'ACS',
              'description': ''
            }
          ],
          'addresses': [
            {
              'addressLine1': '1155 Sixteenth Street, NW',
              'addressLine2': '',
              'city': 'Washington',
              'stateRegion': 'DC',
              'zipCode': '20036',
              'country': 'USA',
              'isPrimary': true,
              'categories': [],
              'language': 'English'
            }
          ],
          'phoneNumbers': [
            {
              'phoneNumber': '1-800-333-9511',
              'categories': [],
              'isPrimary': true,
              'language': 'English'
            }
          ],
          'emails': [
            {
              'value': 'service@acs.org',
              'description': 'Customer Service',
              'isPrimary': true,
              'categories': [],
              'language': 'English'
            }
          ],
          'urls': [
            {
              'value': 'https://www.acs.org/content/acs/en.html',
              'description': 'main English language website',
              'language': 'en-us',
              'isPrimary': true,
              'categories': [
                'f52ceea4-8e35-404b-9ebd-5c7db6613195'
              ],
              'notes': ''
            }
          ],
          'contacts': [
            '80fb5168-cdf1-11e8-a8d5-f2801f1b9fd1'
          ],
          'agreements': [
            {
              'name': 'ACS Web Editions',
              'discount': 0,
              'referenceUrl': 'https://www.acs.org/content/acs/en.html',
              'notes': 'Multiyear agreement (2018-2020)'
            }
          ],
          'erpCode': 'G64758-74831',
          'paymentMethod': 'EFT',
          'accessProvider': true,
          'governmental': false,
          'licensor': true,
          'materialSupplier': true,
          'vendorCurrencies': [
            'USD'
          ],
          'claimingInterval': 0,
          'discountPercent': 0,
          'expectedActivationInterval': 30,
          'expectedInvoiceInterval': 30,
          'renewalActivationInterval': 365,
          'subscriptionInterval': 365,
          'expectedReceiptInterval': 30,
          'taxId': '',
          'liableForVat': false,
          'taxPercentage': 0,
          'interfaces': [
            '60b952a6-5570-44f3-9972-f00c9dcb098e'
          ],
          'accounts': [
            {
              'name': 'Serialst',
              'accountNo': 'xxxx2149',
              'description': 'Libraries',
              'appSystemNo': '',
              'paymentMethod': 'EFT',
              'accountStatus': 'Active',
              'contactInfo': 'liblink@acs.org',
              'libraryCode': 'COB',
              'libraryEdiCode': '765987610',
              'notes': '',
              'acqUnitIds': []
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
          'acqUnitIds': [],
          'metadata': {
            'createdDate': '2021-08-05T03:23:39.417+00:00',
            'updatedDate': '2021-08-05T03:23:39.417+00:00'
          }
        }
      },
      'owner': {
        'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
      },
      'roles': [
        {
          'id': 'f93db396-26f4-4ee0-ab91-652e61af4f0f',
          'owner': {
            'id': 'ee82bf12-dd9d-4e59-8d91-81e1f4b9e933'
          },
          'role': {
            'id': '2c9180bb7b145d7e017b145e133a000b',
            'value': 'content_provider',
            'label': 'Content provider'
          }
        }
      ],
      'note': 'test org',
      'interfaces': [
        {}
      ]
    }
  ]
};

const handlers = {
  onFetchCredentials: () => { }
};

let renderComponent;

describe('Organizations', () => {
  describe('agreement with orgs', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Organizations
          agreement={agreement}
          handlers={handlers}
          id="organizations"
        />,
        translationsProperties
      );
    });

    test('renders the Organizations Accordion', async () => {
      await Accordion('Organizations').exists();
    });

    test('renders the ViewOrganizationCard component', () => {
      const { getByText } = renderComponent;
      expect(getByText('ViewOrganizationCard'));
    });
  });

  describe('agreement without orgs', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Organizations
          agreement={{}}
          handlers={handlers}
          id="organizations"
        />,
        translationsProperties
      );
    });

    test('renders the Organizations Accordion', async () => {
      await Accordion('Organizations').exists();
    });

    test('renders the no organization for this agreement message', () => {
      const { getByText } = renderComponent;
      expect(getByText('No organizations for this agreement'));
    });
  });
});
