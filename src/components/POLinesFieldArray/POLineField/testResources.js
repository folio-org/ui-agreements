import { FormattedMessage } from 'react-intl';

const input = {
  name: 'poLines[0].poLineId',
  value: '556abc25-ebbf-3fb2-b478-1bfaff0af4dc',
  onBlur: () => {},
  onChange: () => {},
  onFocus: () => {}
};

const meta = {
  active: false,
  data: {},
  dirty: true,
  dirtySinceLastSubmit: false,
  invalid: false,
  modified: false,
  modifiedSinceLastSubmit: false,
  pristine: false,
  submitFailed: false,
  submitSucceeded: false,
  submitting: false,
  touched: false,
  valid: true,
  validating: false,
  visited: false
};

const id = 'edit-poline-0-0';

const onPOLineSelected = () => {};

const poLine = {
  id: '556abc25-ebbf-3fb2-b478-1bfaff0af4dc',
  edition: 'First edition',
  checkinItems: false,
  agreementId: '09c6ed1b-3984-4d9a-8f9b-e1200b68b61c',
  acquisitionMethod: 'Purchase',
  cancellationRestriction: false,
  cancellationRestrictionNote: '',
  claims: [{
    claimed: false,
    grace: 0
  }],
  collection: false,
  contributors: '[]',
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
    productIds: [{
      productId: '0747-0088',
      productIdType: '913300b2-03ed-469a-8179-c1092c991227'
    }],
    subscriptionInterval: 0
  },
  donor: '',
  fundDistribution: [{
    code: 'UNIV-SUBN',
    encumbrance: 'eb506834-6c70-4239-8d1a-6414a5b08014',
    fundId: '4428a37c-8bae-4f0d-865d-970d83d5ad55',
    distributionType: 'percentage',
    value: 100
  }],
  isPackage: false,
  locations: [{
    locationId: '758258bc-ecc1-41b8-abca-f7b610822ffd',
    quantity: 2,
    quantityElectronic: 0,
    quantityPhysical: 2
  }],
  orderFormat: 'Other',
  paymentStatus: 'Pending',
  physical: {
    materialType: 'dd0bf600-dbd9-44ab-9ff2-e2a61a6539f1',
    materialSupplier: 'e0fb5df2-cdf1-11e8-a8d5-f2801f1b9fd1',
    volumes: [
      'vol. 1'
    ]
  },
  poLineDescription: '',
  poLineNumber: '81-1',
  publicationDate: '1915',
  publisher: 'American Bar Association',
  purchaseOrderId: 'c27e60f9-6361-44c1-976e-0c4821a33a7d',
  receiptStatus: 'Pending',
  requester: '',
  rush: false,
  selector: '',
  source: 'User',
  tags: {
    tagList: [
      'CatalogingRecords'
    ]
  },
  titleOrPackage: 'ABA Journal',
  vendorDetail: {
    instructions: '',
    noteFromVendor: '',
    vendorAccount: '',
    referenceNumbers: []
  },
  metadata: {
    createdDate: '2021-11-17T01:51:00.242+00:00',
    updatedDate: '2021-11-17T01:51:00.242+00:00'
  }
};

const data = {
  input: {
    name: 'poLines[0].poLineId',
    value: '',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
  },
  meta: {
    active: false,
    data: {},
    dirty: false,
    dirtySinceLastSubmit: false,
    error: '<Memo />',
    invalid: true,
    modified: false,
    modifiedSinceLastSubmit: false,
    pristine: true,
    submitFailed: false,
    submitSucceeded: false,
    submitting: false,
    touched: false,
    valid: false,
    validating: false,
    visited: false
  },
  id: 'edit-poline-0-0',
  onPOLineSelected: () => {},
  poLine: {}
};

const errorData = {
  input: {
    name: 'poLines[0].poLineId',
    value: '',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
  },
  meta: {
    active: false,
    data: {},
    dirty: false,
    dirtySinceLastSubmit: false,
    error: <FormattedMessage id="stripes-core.label.missingRequiredField" />,
    invalid: true,
    modified: false,
    modifiedSinceLastSubmit: false,
    pristine: true,
    submitFailed: true,
    submitSucceeded: false,
    submitting: false,
    touched: true,
    valid: false,
    validating: false,
    visited: false
  },
  id: 'edit-poline-0-0',
  onPOLineSelected: () => {},
  poLine: {}
};

export {
  input,
  id,
  meta,
  poLine,
  onPOLineSelected,
  data,
  errorData
};
