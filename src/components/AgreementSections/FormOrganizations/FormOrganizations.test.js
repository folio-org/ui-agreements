import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-testing';
import { Accordion } from '@folio/stripes-testing';
import FormOrganizations from './FormOrganizations';
import translationsProperties from '../../../../test/helpers';

/* We mock the OrganizationsFieldArray component here and test if that component renders as expected as a part of this test.
We neednt test out the  FormOrganizations functionality in theses tests because we shouldnt be concerned with the
underlying implementation of the child component */

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  OrganizationsFieldArray: () => <div>OrganizationsFieldArray</div>,
}));

const onSubmit = jest.fn();

const data = {
  'agreementLines': [],
  'agreementLinesToAdd': [],
  'agreementStatusValues': [
    {
      'id': 'f724fa215f80cddc346d79e3e04198bb',
      'value': 'closed',
      'label': 'Closed'
    },
    {
      'id': '2c9180c07b04e99a017b04ea26ce0030',
      'value': 'draft',
      'label': 'Draft'
    },
    {
      'id': '2c9180c07b04e99a017b04ea26d30031',
      'value': 'requested',
      'label': 'Requested'
    },
    {
      'id': '2c9180c07b04e99a017b04ea26d80032',
      'value': 'in_negotiation',
      'label': 'In negotiation'
    },
    {
      'id': '2c9180c07b04e99a017b04ea26dd0033',
      'value': 'active',
      'label': 'Active'
    }
  ],
  'reasonForClosureValues': [
    {
      'id': '82a241d53189b1f1da8e49c55dd3f7b1',
      'value': 'rejected',
      'label': 'Rejected'
    },
    {
      'id': '2c9180c07b04e99a017b04ea26b6002d',
      'value': 'cancelled',
      'label': 'Cancelled'
    },
    {
      'id': '2c9180c07b04e99a017b04ea26bd002e',
      'value': 'ceased',
      'label': 'Ceased'
    },
    {
      'id': '2c9180c07b04e99a017b04ea26c2002f',
      'value': 'superseded',
      'label': 'Superseded'
    }
  ],
  'amendmentStatusValues': [
    {
      'id': '2c9180c07b04e99a017b04ea26e70035',
      'value': 'current',
      'label': 'Current'
    },
    {
      'id': '2c9180c07b04e99a017b04ea26ec0036',
      'value': 'future',
      'label': 'Future'
    },
    {
      'id': '2c9180c07b04e99a017b04ea26f10037',
      'value': 'historical',
      'label': 'Historical'
    },
    {
      'id': '2c9180c07b04e99a017b04ea26f60038',
      'value': 'does_not_apply',
      'label': 'Does not apply'
    }
  ],
  'basket': [],
  'contactRoleValues': [
    {
      'id': '2c9180c07b04e99a017b04ea270f003e',
      'value': 'agreement_owner',
      'label': 'Agreement owner'
    },
    {
      'id': '2c9180c07b04e99a017b04ea2714003f',
      'value': 'authorized_signatory',
      'label': 'Authorized signatory'
    },
    {
      'id': '2c9180c07b04e99a017b04ea27190040',
      'value': 'erm_librarian',
      'label': 'ERM librarian'
    },
    {
      'id': '2c9180c07b04e99a017b04ea271e0041',
      'value': 'subject_specialist',
      'label': 'Subject specialist'
    }
  ],
  'documentCategories': [
    {
      'id': '2c9180c07b04e99a017b04ea26fd003a',
      'value': 'license',
      'label': 'License'
    },
    {
      'id': '2c9180c07b04e99a017b04ea2702003b',
      'value': 'misc',
      'label': 'Misc'
    },
    {
      'id': '2c9180c07b04e99a017b04ea2707003c',
      'value': 'consortium_negotiation_document',
      'label': 'Consortium negotiation document'
    }
  ],
  'externalAgreementLine': [],
  'isPerpetualValues': [
    {
      'id': '2c9180c07b04e99a017b04ea26770023',
      'value': 'yes',
      'label': 'Yes'
    },
    {
      'id': '2c9180c07b04e99a017b04ea267c0024',
      'value': 'no',
      'label': 'No'
    }
  ],
  'licenseLinkStatusValues': [
    {
      'id': '2c9180c07b04e99a017b04ea26300013',
      'value': 'controlling',
      'label': 'Controlling'
    },
    {
      'id': '2c9180c07b04e99a017b04ea26340014',
      'value': 'future',
      'label': 'Future'
    },
    {
      'id': '2c9180c07b04e99a017b04ea263b0015',
      'value': 'historical',
      'label': 'Historical'
    }
  ],
  'orderLines': [],
  'orgRoleValues': [
    {
      'id': '2c9180c07b04e99a017b04ea26290011',
      'value': 'content_provider',
      'label': 'Content provider'
    }
  ],
  'renewalPriorityValues': [
    {
      'id': '2c9180c07b04e99a017b04ea2699002a',
      'value': 'definitely_renew',
      'label': 'Definitely renew'
    },
    {
      'id': '2c9180c07b04e99a017b04ea269e002b',
      'value': 'for_review',
      'label': 'For review'
    },
    {
      'id': '2c9180c07b04e99a017b04ea26a3002c',
      'value': 'definitely_cancel',
      'label': 'Definitely cancel'
    }
  ],
  'supplementaryProperties': [],
  'users': [
    {
      'username': 'acq-admin',
      'id': 'f8493382-aa44-4b6a-ba28-20573fa1c02f',
      'barcode': '162787527772823304',
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
      'createdDate': '2021-08-02T03:34:37.743+00:00',
      'updatedDate': '2021-08-02T03:34:37.743+00:00',
      'metadata': {
        'createdDate': '2021-08-02T03:34:37.740+00:00',
        'createdByUserId': 'd530a37d-2d29-5f3f-ba4e-bd08242ab7da',
        'updatedDate': '2021-08-02T03:34:37.740+00:00',
        'updatedByUserId': 'd530a37d-2d29-5f3f-ba4e-bd08242ab7da'
      }
    },
    {
      'username': 'sheldon',
      'id': 'b4cee18d-f862-4ef1-95a5-879fdd619603',
      'barcode': '789',
      'active': true,
      'patronGroup': '3684a786-6671-4268-8ed0-9db82ebca60b',
      'departments': [],
      'proxyFor': [],
      'personal': {
        'lastName': 'sheldon',
        'firstName': 'bazinga',
        'email': 'sheldon@example.com',
        'addresses': [],
        'preferredContactTypeId': '002'
      },
      'createdDate': '2021-08-02T03:21:23.333+00:00',
      'updatedDate': '2021-08-02T03:21:23.333+00:00',
      'metadata': {
        'createdDate': '2021-08-02T03:21:23.331+00:00',
        'updatedDate': '2021-08-02T03:21:23.331+00:00'
      }
    }
  ]
};

const initialValues = {
  'id': '057db618-d497-4f40-8f34-65ad293d7c67',
  'dateCreated': '2021-08-02T19:52:12Z',
  'name': 'AM ag 1',
  'orgs': [
    {
      'id': '73a7c249-a941-4413-9284-8c1f6681d2f7',
      'primaryOrg': false,
      'org': {
        'id': '78c20ff4-6623-448e-bc27-e3639f6e9fce',
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
              'categories': [],
              'language': 'English'
            }
          ],
          'phoneNumbers': [
            {
              'phoneNumber': '1-800-889-5937',
              'categories': [],
              'isPrimary': true,
              'language': 'English'
            }
          ],
          'emails': [
            {
              'value': 'customerservice@alexanderstreet.com',
              'description': 'main customer service email',
              'isPrimary': true,
              'categories': [],
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
            'createdDate': '2021-08-02T03:22:52.757+00:00',
            'updatedDate': '2021-08-02T03:22:52.757+00:00'
          }
        }
      },
      'owner': {
        'id': '057db618-d497-4f40-8f34-65ad293d7c67'
      },
      'roles': [
        {
          'id': 'd3c1e8e7-2dcd-420a-88da-c558693ef1db',
          'owner': {
            'id': '73a7c249-a941-4413-9284-8c1f6681d2f7'
          },
          'role': {
            'id': '2c9180c07b04e99a017b04ea26290011',
            'value': 'content_provider',
            'label': 'Content provider'
          }
        }
      ],
      'note': 'test'
    },
    {
      'id': 'ce4244e7-73fc-4c66-8f3c-e7edb03cebb2',
      'primaryOrg': false,
      'org': {
        'id': '23365f3d-37e1-4380-b128-6e6900b2d3c7',
        'orgsUuid': '80fb5168-cdf1-11e8-a8d5-c2801f1b9f21',
        'name': 'Bibsam',
        'orgsUuid_object': {
          'id': '80fb5168-cdf1-11e8-a8d5-c2801f1b9f21',
          'name': 'Bibsam',
          'code': 'consortia1',
          'description': 'The Bibsam consortium is operated by Kungl. biblioteket, the National Library of Sweden. It has 79 active member institutions including universities, university colleges, and government funded research institutions. It manages about 40 licenses for approx. 100 e-resources, including "big deal" agreements with scholarly journal publishers as well as agreements for encyclopaedias and abstract and indexing databases.',
          'exportToAccounting': false,
          'status': 'Active',
          'aliases': [
            {
              'value': 'Kungl biblioteket'
            },
            {
              'value': 'National Library of Sweden'
            }
          ],
          'addresses': [],
          'phoneNumbers': [],
          'emails': [],
          'urls': [],
          'contacts': [],
          'agreements': [],
          'vendorCurrencies': [],
          'interfaces': [
            'cd5926fa-77aa-4eb3-ac34-c9a1747ba21a'
          ],
          'accounts': [],
          'isVendor': false,
          'changelogs': [],
          'acqUnitIds': [],
          'metadata': {
            'createdDate': '2021-08-02T03:22:52.769+00:00',
            'updatedDate': '2021-08-02T03:22:52.769+00:00'
          }
        }
      },
      'owner': {
        'id': '057db618-d497-4f40-8f34-65ad293d7c67'
      },
      'roles': [
        {
          'id': '228d67ad-7424-40de-a835-0e418bb7f48c',
          'owner': {
            'id': 'ce4244e7-73fc-4c66-8f3c-e7edb03cebb2'
          },
          'role': {
            'id': '2c9180c07b04e99a017b04ea26290011',
            'value': 'content_provider',
            'label': 'Content provider'
          }
        }
      ]
    }
  ],
  'externalLicenseDocs': [],
  'outwardRelationships': [],
  'customProperties': {},
  'contacts': [
    {
      'id': 'dd84db66-a197-462b-ba56-4822cf3ab0c3',
      'owner': {
        'id': '057db618-d497-4f40-8f34-65ad293d7c67'
      },
      'role': 'agreement_owner',
      'user': 'b4cee18d-f862-4ef1-95a5-879fdd619603'
    },
    {
      'id': 'd1b01c0c-9840-4a95-b066-df67df940373',
      'owner': {
        'id': '057db618-d497-4f40-8f34-65ad293d7c67'
      },
      'role': 'authorized_signatory',
      'user': 'f8493382-aa44-4b6a-ba28-20573fa1c02f'
    }
  ],
  'tags': [],
  'lastUpdated': '2021-08-02T20:02:17Z',
  'inwardRelationships': [],
  'startDate': '2021-08-03',
  'linkedLicenses': [],
  'docs': [],
  'periods': [
    {
      'id': 'f2ffdc11-c942-4cdd-9ca4-35c7d31ae9d0',
      'startDate': '2021-08-03',
      'owner': {
        'id': '057db618-d497-4f40-8f34-65ad293d7c67'
      },
      'periodStatus': 'next'
    }
  ],
  'usageDataProviders': [],
  'agreementStatus': 'active',
  'supplementaryDocs': [],
  'endDate': null,
  'cancellationDeadline': null,
  'alternateNames': [],
  'relatedAgreements': []
};

describe('FormOrganizations', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <TestForm initialValues={initialValues} onSubmit={onSubmit}>
        <FormOrganizations data={data} />
      </TestForm>, translationsProperties
    );
  });

  test('renders the Organizations accordion', async () => {
    await Accordion('Organizations').exists();
  });

  test('renders the OrganizationsFieldArray component', () => {
    const { getByText } = renderComponent;
    expect(getByText('OrganizationsFieldArray')).toBeInTheDocument();
  });
});
