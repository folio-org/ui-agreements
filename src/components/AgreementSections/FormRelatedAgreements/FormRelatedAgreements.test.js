
import { TestForm, renderWithIntl, Accordion } from '@folio/stripes-erm-testing';
import FormRelatedAgreements from './FormRelatedAgreements';
import translationsProperties from '../../../../test/helpers';

/* We mock the OrganizationsFieldArray component here and test if that component renders as expected as a part of this test.
We neednt test out the  FormOrganizations functionality in theses tests because we shouldnt be concerned with the
underlying implementation of the child component */

jest.mock('../../RelatedAgreementsFieldArray', () => () => <div>RelatedAgreementsFieldArray</div>);

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
  'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef',
  'dateCreated': '2021-08-05T13:19:06Z',
  'name': 'AM ag 1',
  'orgs': [
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
      'note': 'test org'
    }
  ],
  'externalLicenseDocs': [],
  'outwardRelationships': [
    {
      'id': 'edb061c5-3d5c-44aa-81c6-411af5cdbe75',
      'type': {
        'id': '2c9180bb7b145d7e017b145e1342000d',
        'value': 'supersedes',
        'label': 'Supersedes'
      },
      'note': 'test note',
      'outward': {
        'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef',
        'name': 'AM ag 1',
        'agreementStatus': {
          'id': '2c9180bb7b145d7e017b145e14130038',
          'value': 'active',
          'label': 'Active'
        },
        'startDate': '2021-08-05',
        'endDate': null
      },
      'inward': {
        'id': '1bec926d-abc0-4296-b783-d032b79dcc5e',
        'name': 'Special Test Agreement',
        'agreementStatus': {
          'id': '2c9180bb7b145d7e017b145e14130038',
          'value': 'active',
          'label': 'Active'
        },
        'startDate': '2021-08-01',
        'endDate': '2021-08-31'
      }
    }
  ],
  'customProperties': {},
  'contacts': [
    {
      'id': 'fd0847b9-34e8-4917-b2e1-9fdbe8d9a390',
      'owner': {
        'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
      },
      'role': 'agreement_owner',
      'user': '4e9caea9-23dc-552d-9c1e-d8efb9924cf9'
    }
  ],
  'tags': [],
  'lastUpdated': '2021-08-05T18:45:33Z',
  'inwardRelationships': [],
  'startDate': '2021-08-05',
  'linkedLicenses': [],
  'docs': [],
  'periods': [
    {
      'id': '1ce4c5c0-35fc-4d8a-b5b4-428858f17ba5',
      'startDate': '2021-08-05',
      'owner': {
        'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
      },
      'periodStatus': 'current'
    }
  ],
  'usageDataProviders': [
    {
      'id': '2c9180bb7b145d7e017b16ec6ef7004a',
      'remoteId': '9362de60-f8b2-4073-bee3-01fa5fc8462f',
      'remoteId_object': {
        'id': '9362de60-f8b2-4073-bee3-01fa5fc8462f',
        'label': 'Alexander Street Press',
        'harvestingConfig': {
          'harvestingStatus': 'active',
          'harvestVia': 'aggregator',
          'aggregator': {
            'id': '5b6ba83e-d7e5-414e-ba7b-134749c0d950',
            'name': 'German National Statistics Server',
            'vendorCode': 'ALEXS'
          },
          'reportRelease': 4,
          'requestedReports': [
            'JR5',
            'JR1'
          ],
          'harvestingStart': '2015-01'
        },
        'sushiCredentials': {
          'customerId': '0000000',
          'requestorId': 'electronic@lib.opentown.edu',
          'requestorMail': 'electronic@lib.optentown.edu'
        },
        'hasFailedReport': 'no',
        'reportErrorCodes': [],
        'reportTypes': [],
        'notes': 'Please fill in your own credentials: customer ID and requestor ID, name and mail are only demonstrational.',
        'metadata': {
          'createdDate': '2021-08-05T03:31:41.607+00:00',
          'updatedDate': '2021-08-05T03:31:41.607+00:00'
        }
      },
      'owner': {
        'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
      },
      'usageDataProviderNote': 'usage data note'
    }
  ],
  'agreementStatus': 'active',
  'supplementaryDocs': [],
  'endDate': null,
  'cancellationDeadline': null,
  'items': [
    {
      'id': '26a19e0e-4955-4c53-9042-91b4b6d0cd7e',
      'poLines': [
        {
          'id': '73a2a7e2-48a8-4582-99ce-61737bec2322',
          'poLineId': 'bf9ba27d-25be-4b60-b031-a0f3783f82a7',
          'owner': {
            'id': '26a19e0e-4955-4c53-9042-91b4b6d0cd7e'
          }
        }
      ],
      'activeFrom': null,
      'activeTo': null
    }
  ],
  'alternateNames': [
    {
      'id': '7ac02b89-2c39-4679-9426-791064c22e6b',
      'owner': {
        'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
      },
      'name': 'test'
    },
    {
      'id': '39aad4da-2092-42a3-9d54-aca8abd62fd8',
      'owner': {
        'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
      },
      'name': 'test1'
    }
  ],
  'relatedAgreements': [
    {
      'id': 'edb061c5-3d5c-44aa-81c6-411af5cdbe75',
      'note': 'test note',
      'type': 'supersedes'
    }
  ]
};

describe('FormRelatedAgreements', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <TestForm initialValues={initialValues} onSubmit={onSubmit}>
        <FormRelatedAgreements data={data} />
      </TestForm>, translationsProperties
    );
  });

  test('renders the Related agreements accordion', async () => {
    await Accordion('Related agreements').exists();
  });

  test('renders the RelatedAgreementsFieldArray component', () => {
    const { getByText } = renderComponent;
    expect(getByText('RelatedAgreementsFieldArray')).toBeInTheDocument();
  });
});
