import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import {
  TestForm,
  renderWithIntl,
} from '@folio/stripes-erm-components/test/jest/helpers';
import { Accordion } from '@folio/stripes-testing';
import FormPOLines from './FormPOLines';
import translationsProperties from '../../../../test/helpers';

jest.mock('../../POLinesFieldArray', () => () => <div>POLinesFieldArray</div>);
const onSubmit = jest.fn();

const data = {
  'basket': '[]',
  'isEholdingsEnabled': true,
  'isLoading': false,
  'lineId': 'b725a59d-a156-45c1-8a90-f507322ad58b',
  'onSubmit': 'ƒ () {}'
  };

const initialValues = {
  'id': 'b725a59d-a156-45c1-8a90-f507322ad58b',
  'type': 'external',
  'description': 'This is description.',
  'authority': 'EKB-PACKAGE',
  'reference': '22-2122875',
  'explanation': null,
  'startDate': '2021-08-04',
  'endDate': '2021-08-28',
  'activeFrom': '2021-08-04',
  'activeTo': '2021-08-28',
  'contentUpdated': null,
  'haveAccess': true,
  'suppressFromDiscovery': true,
  'note': 'This is note.',
  'tags': '[]',
  'owner': {
  'id': '4d2e55ae-4af5-451a-bfba-ad427e3b993c',
  'dateCreated': '2021-08-26T08:28:23Z',
  'name': 'MR test info',
  'orgs': [],
  'externalLicenseDocs': [],
  'outwardRelationships': [],
  'customProperties': {},
  'contacts': [
      '{id: "2a3a3c6e-27b2-4415-87e7-4ab9be89706e", owner:…}'
  ],
  'tags': [],
  'lastUpdated': '2021-08-26T10:43:55Z',
  'inwardRelationships': [],
  'startDate': '2021-08-01',
  'linkedLicenses': [],
  'docs': [],
  'periods': [
      '{id: "a6887f5c-9c4b-4980-84ba-78146aa09b90", owner:…}'
  ],
  'usageDataProviders': [],
  'agreementStatus': {
      'id': '2c91809c7b802194017b80287c9c0033',
      'value': 'requested',
      'label': 'Requested'
  },
  'supplementaryDocs': [],
  'endDate': null,
  'cancellationDeadline': null,
  'items': [
      {
      'id': 'b725a59d-a156-45c1-8a90-f507322ad58b'
      },
      {
      'id': '93aa3ccb-fc0f-4ba1-96dd-ce0cb55658f6'
      }
  ],
  'alternateNames': []
  },
  'poLines': [
  {
      'id': 'e208111a-d92a-4a5c-86b6-800edff71f8b',
      'poLineId': 'baec48dd-1594-2712-be8f-de336bc83fcc',
      'owner': {
      'id': 'b725a59d-a156-45c1-8a90-f507322ad58b'
      }
  }
  ],
  'customCoverage': false,
  'reference_object': {
  'label': "Women's Magazine Archive I",
  'type': 'Package',
  'provider': 'Proquest Info & Learning Co',
  'titleCount': 6,
  'selectedCount': 6,
  'contentType': 'Aggregated Full Text',
  'providerName': 'Proquest Info & Learning Co',
  'isSelected': true
  },
  'linkedResource': {
  'id': 'b725a59d-a156-45c1-8a90-f507322ad58b',
  'type': 'external',
  'description': 'This is description.',
  'authority': 'EKB-PACKAGE',
  'reference': '22-2122875',
  'explanation': null,
  'startDate': '2021-08-04',
  'endDate': '2021-08-28',
  'activeFrom': '2021-08-04',
  'activeTo': '2021-08-28',
  'contentUpdated': null,
  'haveAccess': true,
  'suppressFromDiscovery': true,
  'note': 'This is note.',
  'tags': [],
  'owner': {
      'id': '4d2e55ae-4af5-451a-bfba-ad427e3b993c',
      'dateCreated': '2021-08-26T08:28:23Z',
      'name': 'MR test info',
      'orgs': '[]',
      'externalLicenseDocs': '[]',
      'outwardRelationships': '[]',
      'customProperties': '{}',
      'contacts': [
      {
          'id': '2a3a3c6e-27b2-4415-87e7-4ab9be89706e',
          'owner': {
          'id': '4d2e55ae-4af5-451a-bfba-ad427e3b993c'
          },
          'role': {
          'id': '2c91809c7b802194017b80287bda0011',
          'value': 'erm_librarian',
          'label': 'ERM librarian'
          },
          'user': 'bb48e70e-c790-4a00-a232-5c5d14ddab09'
      }
      ],
      'tags': '[]',
      'lastUpdated': '2021-08-26T10:43:55Z',
      'inwardRelationships': '[]',
      'startDate': '2021-08-01',
      'linkedLicenses': '[]',
      'docs': '[]',
      'periods': [
      {
          'id': 'a6887f5c-9c4b-4980-84ba-78146aa09b90',
          'startDate': '2021-08-01',
          'owner': {
          'id': '4d2e55ae-4af5-451a-bfba-ad427e3b993c'
          },
          'periodStatus': 'current'
      }
      ],
      'usageDataProviders': '[]',
      'agreementStatus': {
      'id': '2c91809c7b802194017b80287c9c0033',
      'value': 'requested',
      'label': 'Requested'
      },
      'supplementaryDocs': '[]',
      'endDate': null,
      'cancellationDeadline': null,
      'items': [
      {
          'id': 'b725a59d-a156-45c1-8a90-f507322ad58b'
      },
      {
          'id': '93aa3ccb-fc0f-4ba1-96dd-ce0cb55658f6'
      }
      ],
      'alternateNames': '[]'
  },
  'poLines': [
      {
      'id': 'e208111a-d92a-4a5c-86b6-800edff71f8b',
      'poLineId': 'baec48dd-1594-2712-be8f-de336bc83fcc',
      'owner': {
          'id': 'b725a59d-a156-45c1-8a90-f507322ad58b'
      }
      }
  ],
  'customCoverage': false,
  'reference_object': {
      'label': "Women's Magazine Archive I",
      'type': 'Package',
      'provider': 'Proquest Info & Learning Co',
      'titleCount': 6,
      'selectedCount': 6,
      'contentType': 'Aggregated Full Text',
      'providerName': 'Proquest Info & Learning Co',
      'isSelected': true
      }
  }
};

  describe('with initialValues', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm initialValues={initialValues} onSubmit={onSubmit}>
          <FormPOLines data={data} />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the PO lines accordion', async () => {
      await Accordion('PO lines').exists();
    });

    test('renders the POLinesFieldArray component', () => {
      const { getByText } = renderComponent;
      expect(getByText('POLinesFieldArray')).toBeInTheDocument();
    });
  });
