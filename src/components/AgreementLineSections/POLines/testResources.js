const line = {
  id: '6feae8e7-4033-4f57-ba98-5b87bb265a4f',
  dateCreated: '2021-09-09T13:46:54Z',
  activeTo: '2021-09-30',
  tags: '[]',
  lastUpdated: '2021-09-09T13:48:12Z',
  owner: {
    id: '733186f6-4c7d-4b32-a982-86ed03f0d6ea',
    cancellationDeadline: '2021-09-26',
    dateCreated: '2021-09-09T08:17:55Z',
    isPerpetual: {
      id: '2c91809c7bc8e064017bc8e81518000a',
      value: 'yes',
      label: 'Yes'
    },
    name: 'MR agr test',
    orgs: [],
    externalLicenseDocs: [],
    outwardRelationships: [],
    customProperties: {},
    contacts: [],
    tags: [],
    lastUpdated: '2021-09-09T13:48:12Z',
    inwardRelationships: [],
    renewalPriority: {
      id: '2c91809c7bc8e064017bc8e815420011',
      value: 'definitely_renew',
      label: 'Definitely renew'
    },
    endDate: '2021-09-30',
    startDate: '2021-09-01',
    linkedLicenses: [],
    docs: [],
    periods: [{
      id: '428fda12-c517-425b-828e-fd3b15bbaf35',
      startDate: '2021-09-01',
      cancellationDeadline: '2021-09-26',
      owner: {
        id: '733186f6-4c7d-4b32-a982-86ed03f0d6ea'
      },
      note: 'period note',
      endDate: '2021-09-30',
      periodStatus: 'current'
    }],
    usageDataProviders: [],
    agreementStatus: {
      id: '2c91809c7bc8e064017bc8e81591001a',
      value: 'active',
      label: 'Active'
    },
    supplementaryDocs: [],
    description: 'This is description',
    items: [{
      id: '6feae8e7-4033-4f57-ba98-5b87bb265a4f'
    }],
    alternateNames: []
  },
  activeFrom: '2021-09-01',
  poLines: [{
    id: '556abc25-ebbf-3fb2-b478-1bfaff0af4dc',
    edition: 'First edition',
    checkinItems: false,
    agreementId: '09c6ed1b-3984-4d9a-8f9b-e1200b68b61c',
    acquisitionMethod: 'Purchase',
    alerts: '[]',
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
      productIds: [
        '{productId: "0747-0088", productIdType: "913300b2-0…}'
      ],
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
    reportingCodes: '[]',
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
      createdDate: '2021-09-09T04:52:53.347+00:00',
      updatedDate: '2021-09-09T04:52:53.347+00:00'
    }
  }],
  type: 'detached',
  suppressFromDiscovery: true,
  note: 'This is note',
  description: 'This is description',
  customCoverage: false,
  explanation: null,
  startDate: '2021-09-01',
  endDate: '2021-09-30',
  contentUpdated: null,
  haveAccess: true
};

export default line;
