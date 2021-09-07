import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Accordion } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import POLines from './POLines';

const line = {
    'id': '0917813d-62c4-498e-beeb-2e713dff10dd',
    'type': 'external',
    'description': 'This is description',
    'authority': 'EKB-PACKAGE',
    'reference': '122380-2556389',
    'explanation': null,
    'startDate': '2021-09-01',
    'endDate': '2021-09-30',
    'activeFrom': '2021-09-01',
    'activeTo': '2021-09-30',
    'contentUpdated': null,
    'haveAccess': true,
    'suppressFromDiscovery': true,
    'note': 'This is note',
    'tags': '[]',
    'owner': {
    'id': 'f0563d0a-2f11-41a9-9d2a-2aaf640e2cd7',
    'cancellationDeadline': '2021-09-30',
    'dateCreated': '2021-09-07T08:18:50Z',
    'isPerpetual': {
        'id': '2c91809c7bbdeda7017bbdf5250c002b',
        'value': 'yes',
        'label': 'Yes'
    },
    'name': 'MR agr test',
    'orgs': [],
    'externalLicenseDocs': [],
    'outwardRelationships': [],
    'customProperties': {},
    'contacts': [],
    'tags': [],
    'lastUpdated': '2021-09-07T08:58:28Z',
    'inwardRelationships': [],
    'renewalPriority': {
        'id': '2c91809c7bbdeda7017bbdf525350033',
        'value': 'for_review',
        'label': 'For review'
    },
    'endDate': '2021-09-30',
    'startDate': '2021-09-01',
    'linkedLicenses': [],
    'docs': [],
    'periods': [
        {
        'id': 'd31ccd88-92e3-4fe0-8558-5c0043ee8009',
        'startDate': '2021-09-01',
        'cancellationDeadline': '2021-09-30',
        'owner': {
            'id': 'f0563d0a-2f11-41a9-9d2a-2aaf640e2cd7'
        },
        'endDate': '2021-09-30',
        'periodStatus': 'current'
        }
    ],
    'usageDataProviders': [],
    'agreementStatus': {
        'id': '2c91809c7bbdeda7017bbdf52595003b',
        'value': 'active',
        'label': 'Active'
    },
    'supplementaryDocs': [],
    'description': 'this is description',
    'items': [
        {
        'id': '3c0b4664-6b99-4728-a731-17ca6a2236d4'
        },
        {
        'id': '0917813d-62c4-498e-beeb-2e713dff10dd'
        },
        {
        'id': '1b1becc2-43fe-4e4e-a351-cf7924f0ee85'
        },
        {
        'id': '0f489801-e2da-4c47-a8f1-74e7881372c4'
        }
    ],
    'alternateNames': []
    },
    'poLines': [
    {
        'id': '556abc25-ebbf-3fb2-b478-1bfaff0af4dc',
        'edition': 'First edition',
        'checkinItems': false,
        'agreementId': '09c6ed1b-3984-4d9a-8f9b-e1200b68b61c',
        'acquisitionMethod': 'Purchase',
        'alerts': '[]',
        'cancellationRestriction': false,
        'cancellationRestrictionNote': '',
        'claims': [
        {
            'claimed': false,
            'grace': 0
        }
        ],
        'collection': false,
        'contributors': '[]',
        'cost': {
        'listUnitPrice': 0,
        'listUnitPriceElectronic': 0,
        'currency': 'USD',
        'additionalCost': 0,
        'discount': 0,
        'discountType': 'percentage',
        'quantityPhysical': 2,
        'quantityElectronic': 0,
        'poLineEstimatedPrice': 0
        },
        'description': '',
        'details': {
        'receivingNote': '',
        'productIds': [
            {
            'productId': '0747-0088',
            'productIdType': '913300b2-03ed-469a-8179-c1092c991227'
            }
        ],
        'subscriptionInterval': 0
        },
        'donor': '',
        'fundDistribution': [
        {
            'code': 'UNIV-SUBN',
            'encumbrance': 'eb506834-6c70-4239-8d1a-6414a5b08014',
            'fundId': '4428a37c-8bae-4f0d-865d-970d83d5ad55',
            'distributionType': 'percentage',
            'value': 100
        }
        ],
        'isPackage': false,
        'locations': [
        {
            'locationId': '758258bc-ecc1-41b8-abca-f7b610822ffd',
            'quantity': 2,
            'quantityElectronic': 0,
            'quantityPhysical': 2
        }
        ],
        'orderFormat': 'Other',
        'paymentStatus': 'Pending',
        'physical': {
        'materialType': 'dd0bf600-dbd9-44ab-9ff2-e2a61a6539f1',
        'materialSupplier': 'e0fb5df2-cdf1-11e8-a8d5-f2801f1b9fd1',
        'volumes': [
            'vol. 1'
        ]
        },
        'poLineDescription': '',
        'poLineNumber': '81-1',
        'publicationDate': '1915',
        'publisher': 'American Bar Association',
        'purchaseOrderId': 'c27e60f9-6361-44c1-976e-0c4821a33a7d',
        'receiptStatus': 'Pending',
        'reportingCodes': '[]',
        'requester': '',
        'rush': false,
        'selector': '',
        'source': 'User',
        'tags': {
        'tagList': [
            'CatalogingRecords'
        ]
        },
        'titleOrPackage': 'ABA Journal',
        'vendorDetail': {
        'instructions': '',
        'noteFromVendor': '',
        'vendorAccount': '',
        'referenceNumbers': []
        },
        'metadata': {
        'createdDate': '2021-09-07T01:51:20.873+00:00',
        'updatedDate': '2021-09-07T01:51:20.873+00:00'
        }
    }
    ],
    'customCoverage': false,
    'reference_object': {
    'label': 'i-Scholar',
    'type': 'Package',
    'provider': 'Informatics Publishing Limited',
    'titleCount': 1028,
    'selectedCount': 0,
    'contentType': 'E-Journal',
    'providerName': 'Informatics Publishing Limited'
    }
};

const resource = {
    'id': '0917813d-62c4-498e-beeb-2e713dff10dd',
    'type': 'external',
    'description': 'This is description',
    'authority': 'EKB-PACKAGE',
    'reference': '122380-2556389',
    'explanation': null,
    'startDate': '2021-09-01',
    'endDate': '2021-09-30',
    'activeFrom': '2021-09-01',
    'activeTo': '2021-09-30',
    'contentUpdated': null,
    'haveAccess': true,
    'suppressFromDiscovery': true,
    'note': 'This is note',
    'tags': '[]',
    'owner': {
    'id': 'f0563d0a-2f11-41a9-9d2a-2aaf640e2cd7',
    'cancellationDeadline': '2021-09-30',
    'dateCreated': '2021-09-07T08:18:50Z',
    'isPerpetual': {
        'id': '2c91809c7bbdeda7017bbdf5250c002b',
        'value': 'yes',
        'label': 'Yes'
    },
    'name': 'MR agr test',
    'orgs': [],
    'externalLicenseDocs': [],
    'outwardRelationships': [],
    'customProperties': {},
    'contacts': [],
    'tags': [],
    'lastUpdated': '2021-09-07T08:58:28Z',
    'inwardRelationships': [],
    'renewalPriority': {
        'id': '2c91809c7bbdeda7017bbdf525350033',
        'value': 'for_review',
        'label': 'For review'
    },
    'endDate': '2021-09-30',
    'startDate': '2021-09-01',
    'linkedLicenses': [],
    'docs': [],
    'periods': [
        {
        'id': 'd31ccd88-92e3-4fe0-8558-5c0043ee8009',
        'startDate': '2021-09-01',
        'cancellationDeadline': '2021-09-30',
        'owner': {
            'id': 'f0563d0a-2f11-41a9-9d2a-2aaf640e2cd7'
        },
        'endDate': '2021-09-30',
        'periodStatus': 'current'
        }
    ],
    'usageDataProviders': [],
    'agreementStatus': {
        'id': '2c91809c7bbdeda7017bbdf52595003b',
        'value': 'active',
        'label': 'Active'
    },
    'supplementaryDocs': [],
    'description': 'this is description',
    'items': [
        {
        'id': '3c0b4664-6b99-4728-a731-17ca6a2236d4'
        },
        {
        'id': '0917813d-62c4-498e-beeb-2e713dff10dd'
        },
        {
        'id': '1b1becc2-43fe-4e4e-a351-cf7924f0ee85'
        },
        {
        'id': '0f489801-e2da-4c47-a8f1-74e7881372c4'
        }
    ],
    'alternateNames': []
    },
    'poLines': [
    {
        'id': '556abc25-ebbf-3fb2-b478-1bfaff0af4dc',
        'edition': 'First edition',
        'checkinItems': false,
        'agreementId': '09c6ed1b-3984-4d9a-8f9b-e1200b68b61c',
        'acquisitionMethod': 'Purchase',
        'alerts': '[]',
        'cancellationRestriction': false,
        'cancellationRestrictionNote': '',
        'claims': [
        {
            'claimed': false,
            'grace': 0
        }
        ],
        'collection': false,
        'contributors': '[]',
        'cost': {
        'listUnitPrice': 0,
        'listUnitPriceElectronic': 0,
        'currency': 'USD',
        'additionalCost': 0,
        'discount': 0,
        'discountType': 'percentage',
        'quantityPhysical': 2,
        'quantityElectronic': 0,
        'poLineEstimatedPrice': 0
        },
        'description': '',
        'details': {
        'receivingNote': '',
        'productIds': [
            {
            'productId': '0747-0088',
            'productIdType': '913300b2-03ed-469a-8179-c1092c991227'
            }
        ],
        'subscriptionInterval': 0
        },
        'donor': '',
        'fundDistribution': [
        {
            'code': 'UNIV-SUBN',
            'encumbrance': 'eb506834-6c70-4239-8d1a-6414a5b08014',
            'fundId': '4428a37c-8bae-4f0d-865d-970d83d5ad55',
            'distributionType': 'percentage',
            'value': 100
        }
        ],
        'isPackage': false,
        'locations': [
        {
            'locationId': '758258bc-ecc1-41b8-abca-f7b610822ffd',
            'quantity': 2,
            'quantityElectronic': 0,
            'quantityPhysical': 2
        }
        ],
        'orderFormat': 'Other',
        'paymentStatus': 'Pending',
        'physical': {
        'materialType': 'dd0bf600-dbd9-44ab-9ff2-e2a61a6539f1',
        'materialSupplier': 'e0fb5df2-cdf1-11e8-a8d5-f2801f1b9fd1',
        'volumes': [
            'vol. 1'
        ]
        },
        'poLineDescription': '',
        'poLineNumber': '81-1',
        'publicationDate': '1915',
        'publisher': 'American Bar Association',
        'purchaseOrderId': 'c27e60f9-6361-44c1-976e-0c4821a33a7d',
        'receiptStatus': 'Pending',
        'reportingCodes': '[]',
        'requester': '',
        'rush': false,
        'selector': '',
        'source': 'User',
        'tags': {
        'tagList': [
            'CatalogingRecords'
        ]
        },
        'titleOrPackage': 'ABA Journal',
        'vendorDetail': {
        'instructions': '',
        'noteFromVendor': '',
        'vendorAccount': '',
        'referenceNumbers': []
        },
        'metadata': {
        'createdDate': '2021-09-07T01:51:20.873+00:00',
        'updatedDate': '2021-09-07T01:51:20.873+00:00'
        }
    }
    ],
    'customCoverage': false,
    'reference_object': {
    'label': 'i-Scholar',
    'type': 'Package',
    'provider': 'Informatics Publishing Limited',
    'titleCount': 1028,
    'selectedCount': 0,
    'contentType': 'E-Journal',
    'providerName': 'Informatics Publishing Limited'
    }
};

jest.mock('../../POLineCard', () => () => <div>POLineCard</div>);
describe('POLines', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <POLines line={line} resource={resource} />
        </MemoryRouter>,
        translationsProperties
      );
    });
    test('renders the POLines Accordion', async () => {
      await Accordion('PO lines').exists();
    });
    test('renders the POLineCard component', () => {
        const { getByText } = renderComponent;
        expect(getByText('POLineCard')).toBeInTheDocument();
      });
});
