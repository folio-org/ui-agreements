import { TestForm, renderWithIntl, Accordion } from '@folio/stripes-erm-testing';
import FormInternalContacts from './FormInternalContacts';
import translationsProperties from '../../../../test/helpers';

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

const intitialValues = {
  'id': '057db618-d497-4f40-8f34-65ad293d7c67',
  'dateCreated': '2021-08-02T19:52:12Z',
  'name': 'AM ag 1',
  'orgs': [],
  'externalLicenseDocs': [],
  'outwardRelationships': [],
  'customProperties': {},
  'contacts': [
    {
      'id': 'd1b01c0c-9840-4a95-b066-df67df940373',
      'owner': {
        'id': '057db618-d497-4f40-8f34-65ad293d7c67'
      },
      'role': 'authorized_signatory',
      'user': 'f8493382-aa44-4b6a-ba28-20573fa1c02f'
    },
    {
      'id': 'dd84db66-a197-462b-ba56-4822cf3ab0c3',
      'owner': {
        'id': '057db618-d497-4f40-8f34-65ad293d7c67'
      },
      'role': 'agreement_owner',
      'user': 'b4cee18d-f862-4ef1-95a5-879fdd619603'
    }
  ],
  'tags': [],
  'lastUpdated': '2021-08-02T19:52:28Z',
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

describe('FormInternalContacts', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <TestForm intitialValues={intitialValues} onSubmit={onSubmit}>
        <FormInternalContacts data={data} />
      </TestForm>, translationsProperties
    );
  });

  test('renders the Internal contacts accordion', async () => {
    await Accordion('Internal contacts').exists();
  });

  test('renders the InternalContactsFieldArray component', () => {
    const { getByText } = renderComponent;
    expect(getByText('InternalContactsFieldArray')).toBeInTheDocument();
  });
});
