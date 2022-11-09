import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-testing';
import { Accordion, KeyValue } from '@folio/stripes-testing';
import FormLicenses from './FormLicenses';
import translationsProperties from '../../../../test/helpers';

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  DocumentsFieldArray: () => <div>DocumentsFieldArray</div>,
}));

jest.mock('../../LicensesFieldArray', () => () => <div>LicensesFieldArray</div>);

const onSubmit = jest.fn();

const data = {
  'agreementLines': [],
  'agreementLinesToAdd': [],
  'agreementStatusValues': [
    {
      'id': '123c373779e2ad2beed67f24b8cbb66a',
      'value': 'closed',
      'label': 'Closed'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdce2003e',
      'value': 'draft',
      'label': 'Draft'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdce7003f',
      'value': 'requested',
      'label': 'Requested'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdcec0040',
      'value': 'in_negotiation',
      'label': 'In negotiation'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdcf10041',
      'value': 'active',
      'label': 'Active'
    }
  ],
  'reasonForClosureValues': [
    {
      'id': '352482a8922edc17892eb3c08c0378ff',
      'value': 'rejected',
      'label': 'Rejected'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdcca003b',
      'value': 'cancelled',
      'label': 'Cancelled'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdcd2003c',
      'value': 'ceased',
      'label': 'Ceased'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdcd7003d',
      'value': 'superseded',
      'label': 'Superseded'
    }
  ],
  'amendmentStatusValues': [
    {
      'id': '2c91809c7b0ed503017b0edbdc430020',
      'value': 'current',
      'label': 'Current'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdc480021',
      'value': 'future',
      'label': 'Future'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdc4d0022',
      'value': 'historical',
      'label': 'Historical'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdc520023',
      'value': 'does_not_apply',
      'label': 'Does not apply'
    }
  ],
  'basket': [],
  'supplementaryProperties': [],
  'contactRoleValues': [
    {
      'id': '2c91809c7b0ed503017b0edbdbeb000b',
      'value': 'agreement_owner',
      'label': 'Agreement owner'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdbf1000c',
      'value': 'authorized_signatory',
      'label': 'Authorized signatory'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdbf6000d',
      'value': 'erm_librarian',
      'label': 'ERM librarian'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdbfa000e',
      'value': 'subject_specialist',
      'label': 'Subject specialist'
    }
  ],
  'documentCategories': [
    {
      'id': '2c91809c7b0ed503017b0edbdbbb0001',
      'value': 'license',
      'label': 'License'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdbc50002',
      'value': 'misc',
      'label': 'Misc'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdbcb0003',
      'value': 'consortium_negotiation_document',
      'label': 'Consortium negotiation document'
    }
  ],
  'isPerpetualValues': [
    {
      'id': '2c91809c7b0ed503017b0edbdc890031',
      'value': 'yes',
      'label': 'Yes'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdc8d0032',
      'value': 'no',
      'label': 'No'
    }
  ],
  'licenseLinkStatusValues': [
    {
      'id': '2c91809c7b0ed503017b0edbdc010010',
      'value': 'controlling',
      'label': 'Controlling'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdc060011',
      'value': 'future',
      'label': 'Future'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdc0b0012',
      'value': 'historical',
      'label': 'Historical'
    }
  ],
  'orgRoleValues': [
    {
      'id': '2c91809c7b0ed503017b0edbdc83002f',
      'value': 'content_provider',
      'label': 'Content provider'
    }
  ],
  'renewalPriorityValues': [
    {
      'id': '2c91809c7b0ed503017b0edbdcab0038',
      'value': 'definitely_renew',
      'label': 'Definitely renew'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdcaf0039',
      'value': 'for_review',
      'label': 'For review'
    },
    {
      'id': '2c91809c7b0ed503017b0edbdcb5003a',
      'value': 'definitely_cancel',
      'label': 'Definitely cancel'
    }
  ],
  'users': []
};

const handlers = {
  onDownloadFile: () => { },
  onUploadFile: () => { }
};

const initialValues = {
  'id': '8827b9ee-035f-4850-b520-3536af73edae',
  'dateCreated': '2021-08-04T17:28:07Z',
  'name': 'AM ag 1',
  'orgs': [],
  'licenseNote': 'test note 1',
  'externalLicenseDocs': [
    {
      'id': 'f0d627be-9966-431a-af38-51473614bbf6',
      'dateCreated': '2021-08-04T17:28:07Z',
      'lastUpdated': '2021-08-04T17:28:07Z',
      'url': 'http://www/test.com',
      'name': 'external license 1'
    }
  ],
  'outwardRelationships': [],
  'customProperties': {},
  'contacts': [],
  'tags': [],
  'lastUpdated': '2021-08-04T17:28:07Z',
  'inwardRelationships': [],
  'startDate': '2021-08-04',
  'linkedLicenses': [
    {
      'id': '2c9180bf7b0f36eb017b1235498b004b',
      'remoteId': '4e438961-a76f-497b-8eec-79f1c528a33b',
      'remoteId_object': {
        'id': '4e438961-a76f-497b-8eec-79f1c528a33b',
        'dateCreated': '2021-08-04T17:26:56Z',
        'customProperties': {},
        'contacts': [],
        'tags': [],
        'lastUpdated': '2021-08-04T17:26:56Z',
        'docs': [],
        'name': 'AM license 2',
        'status': {
          'id': '2c9180c17b0f36e2017b0f3799390017',
          'value': 'active',
          'label': 'Active',
          'owner': {
            'id': '2c9180c17b0f36e2017b0f3799290014',
            'desc': 'License.Status',
            'internal': true
          }
        },
        'supplementaryDocs': [],
        'openEnded': false,
        'amendments': [],
        'orgs': [],
        'type': {
          'id': '2c9180c17b0f36e2017b0f3798af0001',
          'value': 'local',
          'label': 'Local',
          'owner': {
            'id': '2c9180c17b0f36e2017b0f3798600000',
            'desc': 'License.Type',
            'internal': false
          }
        },
        'alternateNames': []
      },
      'owner': {
        'id': '8827b9ee-035f-4850-b520-3536af73edae'
      },
      'amendments': [],
      'status': 'future',
      'note': 'license 2 note'
    },
    {
      'id': '2c9180bf7b0f36eb017b1235498b004a',
      'remoteId': '19aff47d-a5b7-4d0c-a7d2-3095464a050f',
      'remoteId_object': {
        'id': '19aff47d-a5b7-4d0c-a7d2-3095464a050f',
        'dateCreated': '2021-08-04T17:26:46Z',
        'customProperties': {},
        'contacts': [],
        'tags': [],
        'lastUpdated': '2021-08-04T17:26:46Z',
        'docs': [],
        'name': 'AM licenses 1',
        'status': {
          'id': '2c9180c17b0f36e2017b0f3799390017',
          'value': 'active',
          'label': 'Active',
          'owner': {
            'id': '2c9180c17b0f36e2017b0f3799290014',
            'desc': 'License.Status',
            'internal': true
          }
        },
        'supplementaryDocs': [],
        'openEnded': false,
        'amendments': [],
        'orgs': [],
        'type': {
          'id': '2c9180c17b0f36e2017b0f3798af0001',
          'value': 'local',
          'label': 'Local',
          'owner': {
            'id': '2c9180c17b0f36e2017b0f3798600000',
            'desc': 'License.Type',
            'internal': false
          }
        },
        'alternateNames': []
      },
      'owner': {
        'id': '8827b9ee-035f-4850-b520-3536af73edae'
      },
      'amendments': [],
      'status': 'controlling',
      'note': 'license 1 note'
    }
  ],
  'docs': [],
  'periods': [
    {
      'id': '4623ddab-eefb-4267-a402-27dd8f39f6a3',
      'startDate': '2021-08-04',
      'owner': {
        'id': '8827b9ee-035f-4850-b520-3536af73edae'
      },
      'periodStatus': 'current'
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

describe('FormLicenses', () => {
  let renderComponent;
  describe('with no initialValues', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormLicenses data={data} handlers={handlers} />
        </TestForm>, translationsProperties
      );
    });

    test('renders the Agreement lines accordion', async () => {
      await Accordion('License information').exists();
    });

    test('renders the note field', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('textbox', { name: 'General notes about the agreement\'s license' }));
    });

    test('renders expected Linked licenses component', async () => {
      await KeyValue('All licenses').has({ value: 'LicensesFieldArray' });
    });

    test('renders expected External licenses component', async () => {
      await KeyValue('External licenses').has({ value: 'DocumentsFieldArray' });
    });
  });

  describe('with initialValues', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm initialValues={initialValues} onSubmit={onSubmit}>
          <FormLicenses data={data} handlers={handlers} />
        </TestForm>, translationsProperties
      );
    });

    test('renders the Agreement lines accordion', async () => {
      await Accordion('License information').exists();
    });

    test('renders the expected note value', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('textbox')).toHaveTextContent('test note 1');
    });

    test('renders expected Linked licenses component', async () => {
      await KeyValue('All licenses').has({ value: 'LicensesFieldArray' });
    });

    test('renders expected External licenses component', async () => {
      await KeyValue('External licenses').has({ value: 'DocumentsFieldArray' });
    });
  });
});
