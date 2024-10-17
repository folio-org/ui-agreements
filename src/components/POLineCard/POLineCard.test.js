
import { StaticRouter as Router } from 'react-router-dom';
import { KeyValue, renderWithIntl } from '@folio/stripes-erm-testing';


import translationsProperties from '../../../test/helpers';
import POLineCard from './POLineCard';

jest.mock('../../hooks/useAcqMethods', () => ({
  useAcqMethods: jest.fn().mockReturnValue({ acqMethods: [], isLoading: false }),
}));

const data = {
  id: 'e96f0dbc-48f9-4e49-a394-35187507c25b',
  edition: 'First edition',
  checkinItems: false,
  agreementId: '09c6ed1b-3984-4d9a-8f9b-e1200b68b61c',
  acquisitionMethod: 'Purchase',
  alerts: [],
  cancellationRestriction: false,
  cancellationRestrictionNote: '',
  claims: [
    {
      claimed: false,
      grace: 0
    }
  ],
  collection: false,
  contributors: [],
  cost: {
    listUnitPrice: 0,
    listUnitPriceElectronic: 0,
    currency: 'USD',
    additionalCost: 0,
    discount: 0,
    discountType: 'percentage',
    quantityPhysical: 2,
    quantityElectronic: 0,
    poLineEstimatedPrice: 0
  },
  description: '',
  details: {
    receivingNote: '',
    productIds: [
      {
        productId: '0747-0088',
        productIdType: '913300b2-03ed-469a-8179-c1092c991227'
      }
    ],
    subscriptionInterval: 0
  },
  donor: '',
  fundDistribution: [
    {
      code: 'UNIV-SUBN',
      encumbrance: 'c2e528bf-ea58-4e3e-9e9e-54e642b183fa',
      fundId: '4428a37c-8bae-4f0d-865d-970d83d5ad55',
      distributionType: 'percentage',
      value: 100
    }
  ],
  instanceId: '69640328-788e-43fc-9c3c-af39e243f3b7',
  isPackage: false,
  locations: [
    {
      holdingId: '5cfffb70-ef44-487f-a26d-c10b2339b595',
      quantity: 2,
      quantityElectronic: 0,
      quantityPhysical: 2
    }
  ],
  orderFormat: 'Other',
  paymentStatus: 'Ongoing',
  physical: {
    createInventory: 'Instance, Holding, Item',
    materialType: 'dd0bf600-dbd9-44ab-9ff2-e2a61a6539f1',
    materialSupplier: 'e0fb5df2-cdf1-11e8-a8d5-f2801f1b9fd1',
    volumes: [
      'vol. 1'
    ]
  },
  poLineDescription: '',
  poLineNumber: '10011-1',
  publicationDate: '1915',
  publisher: 'American Bar Association',
  purchaseOrderId: '733867b9-40fb-4df4-bc82-ccb98c2d5846',
  receiptStatus: 'Ongoing',
  reportingCodes: [],
  requester: '',
  rush: false,
  selector: '',
  source: 'User',
  tags: {
    tagList: '["catalogingrecords"]'
  },
  titleOrPackage: 'ABA Journal',
  vendorDetail: {
    instructions: '',
    noteFromVendor: '',
    vendorAccount: '',
    referenceNumbers: '[]'
  },
  metadata: {
    createdDate: '2021-08-10T11:50:02.904+00:00',
    createdByUserId: 'f082d1d0-8ded-5e98-a340-e2fe9acb1bad',
    updatedDate: '2021-08-10T11:50:45.628+00:00',
    updatedByUserId: 'f082d1d0-8ded-5e98-a340-e2fe9acb1bad'
  }
};

let renderComponent;
describe('POLineCard', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <Router>
        <POLineCard
          id="polines"
          poLine={data}
        />
      </Router>,
      translationsProperties
    );
  });

  test('renders POLineCard component', () => {
    const { getByTestId } = renderComponent;
    expect(getByTestId('polines')).toBeInTheDocument();
  });

  test('renders the POLineCard component', () => {
    const { getByText } = renderComponent;
    expect(getByText('PO line: 10011-1')).toBeInTheDocument();
  });

  test('renders a link with the poLineNumber', () => {
    const { getByRole } = renderComponent;
    expect(getByRole('link', { name: 'PO line: 10011-1' })).toBeInTheDocument();
  });

  test('renders the POLineCard component', () => {
    const { getByText } = renderComponent;
    expect(getByText('Acquisition method')).toBeInTheDocument();
  });

  test('renders the expected acquisitionMethod value', async () => {
    await KeyValue('Acquisition method').has({ value: 'Purchase' });
  });

  test('renders the POLineCard component', () => {
    const { getByText } = renderComponent;
    expect(getByText('Title in PO line')).toBeInTheDocument();
  });

  test('renders title in poline', async () => {
    await KeyValue('Title in PO line').has({ value: 'ABA Journal' });
  });

  test('renders a link with instanceId', () => {
    const { getByRole } = renderComponent;
    expect(getByRole('link', { name: 'View in inventory' })).toBeInTheDocument();
  });
});
