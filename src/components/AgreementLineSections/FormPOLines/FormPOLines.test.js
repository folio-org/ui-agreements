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

const line = {
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
          'owner': '{id: "4d2e55ae-4af5-451a-bfba-ad427e3b993c"}',
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
      'id': 'baec48dd-1594-2712-be8f-de336bc83fcc',
      'edition': 'First edition',
      'checkinItems': false,
      'agreementId': '800b2f19-7134-4408-8145-3b04697b7de7',
      'acquisitionMethod': 'Purchase',
      'alerts': [],
      'cancellationRestriction': false,
      'cancellationRestrictionNote': '',
      'claims': [
          '{claimed: true, grace: 0}'
      ],
      'collection': false,
      'contributors': [],
      'cost': {
          'listUnitPrice': 500,
          'listUnitPriceElectronic': 0,
          'currency': 'USD',
          'additionalCost': 0,
          'discount': 20,
          'discountType': 'amount',
          'quantityPhysical': 6,
          'quantityElectronic': 1,
          'poLineEstimatedPrice': 2980
      },
      'description': '',
      'details': {
          'receivingNote': '',
          'productIds': [
          {
              'productId': '0552142352',
              'productIdType': '8261054f-be78-422d-bd51-4ed9f33c3422'
          },
          {
              'productId': '9780552142352',
              'productIdType': '8261054f-be78-422d-bd51-4ed9f33c3422'
          }
          ],
          'subscriptionFrom': '2018-07-20T00:00:00.000+00:00',
          'subscriptionInterval': 1095,
          'subscriptionTo': '2021-07-19T00:00:00.000+00:00'
      },
      'donor': '',
      'eresource': {
          'activated': false,
          'activationDue': 1,
          'createInventory': 'Instance, Holding',
          'trial': true,
          'expectedActivation': '2019-07-20T00:00:00.000+00:00',
          'userLimit': 0,
          'accessProvider': '14fb6608-cdf1-11e8-a8d5-f2801f1b9fd1',
          'materialType': 'a7eb0130-7287-4485-b32c-b4b5814da0fa'
      },
      'fundDistribution': [
          {
          'code': 'USHIST',
          'encumbrance': 'e1a607b4-2ed3-4bd9-9c1e-3726737d5425',
          'fundId': '65032151-39a5-4cef-8810-5350eb316300',
          'distributionType': 'percentage',
          'value': 50
          },
          {
          'code': 'EUROHIST',
          'encumbrance': '6268d1e5-00c4-4ba7-86ff-c3eeb44886ea',
          'fundId': 'e9285a1c-1dfc-4380-868c-e74073003f43',
          'distributionType': 'percentage',
          'value': 50
          }
      ],
      'isPackage': true,
      'locations': [
          {
          'locationId': 'f34d27c6-a8eb-461b-acd6-5dea81771e70',
          'quantity': 2,
          'quantityElectronic': 1,
          'quantityPhysical': 1
          },
          {
          'locationId': 'fcd64ce1-6995-48f0-840e-89ffa2288371',
          'quantity': 1,
          'quantityElectronic': 0,
          'quantityPhysical': 1
          },
          {
          'locationId': 'b241764c-1466-4e1d-a028-1a3684a5da87',
          'quantity': 4,
          'quantityElectronic': 0,
          'quantityPhysical': 4
          }
      ],
      'orderFormat': 'P/E Mix',
      'paymentStatus': 'Pending',
      'physical': {
          'createInventory': 'Instance, Holding, Item',
          'materialType': '5ee11d91-f7e8-481d-b079-65d708582ccc',
          'materialSupplier': '70fb4e66-cdf1-11e8-a8d5-f2801f1b9fd1',
          'receiptDue': '2018-08-19T00:00:00.000+00:00',
          'volumes': [
          'vol. 1'
          ]
      },
      'poLineDescription': '',
      'poLineNumber': '52590-1',
      'purchaseOrderId': '0610be6d-0ddd-494b-b867-19f63d8b5d6d',
      'receiptStatus': 'Pending',
      'reportingCodes': [],
      'requester': '',
      'rush': false,
      'selector': 'sgw',
      'source': 'User',
      'tags': {
          'tagList': [
          'membership'
          ]
      },
      'titleOrPackage': 'Interesting Times',
      'vendorDetail': {
          'instructions': '',
          'noteFromVendor': '',
          'vendorAccount': '',
          'referenceNumbers': '[]'
      },
      'metadata': {
          'createdDate': '2021-08-26T01:51:03.062+00:00',
          'updatedDate': '2021-08-26T01:51:03.062+00:00'
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
};

const handlers = {
  isSuppressFromDiscoveryEnabled: () => {},
  onClose: () => {}
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

describe('FormPOLines', () => {
  let renderComponent;
  describe('with no initialValues', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
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

  describe('with initialValues', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm handlers={handlers} initialValues={initialValues} line={line} onSubmit={onSubmit}>
          <FormPOLines data={data} />
        </TestForm>,
        translationsProperties
      );
    });
    test('renders Description field', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('button', { name: 'Submit' }));
    });
  });
});
