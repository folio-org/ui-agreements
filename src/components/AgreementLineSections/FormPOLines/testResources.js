const line = {
  id: '1c247260-bd39-4a5a-887f-25c40cfc53d2',
  type: 'external',
  description: 'this is description',
  authority: 'EKB-TITLE',
  reference: '32498-16793-12384379',
  explanation: null,
  startDate: '2021-09-01',
  endDate: '2021-09-30',
  activeFrom: '2021-09-01',
  activeTo: '2021-09-30',
  contentUpdated: null,
  haveAccess: true,
  suppressFromDiscovery: true,
  note: 'this is note',
  tags: '[]',
  owner: '{agreementStatus: {…}, alternateNames: Array(0), ca…}',
  poLines: [{
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
      createdDate: '2021-09-09T04:52:53.347+00:00',
      updatedDate: '2021-09-09T04:52:53.347+00:00'
    }
  }],
  customCoverage: false,
  coverage: '[{…}]',
  reference_object: {
    label: '„Swoja i obca”',
    type: 'Book',
    provider: 'Wydawnictwo Naukowe PWN',
    publicationType: 'Book',
    url: 'https://libra.ibuk.pl/book/166729',
    identifiers: [{
      identifier: {
        value: '978-83-7996-171-9',
        ns: {
          value: 'pisbn'
        }
      }
    }],
    authors: [
      'Agata Paliwoda'
    ],
    packageData: {
      authority: 'EKB-PACKAGE',
      reference: '32498-16793',
      name: 'IBUK Libra',
      titleCount: 39204,
      selectedCount: 0,
      contentType: 'Aggregated Full Text',
      providerName: 'Wydawnictwo Naukowe PWN'
    },
    providerName: 'Wydawnictwo Naukowe PWN'
  }
};

const initialValues = {
  id: 'b725a59d-a156-45c1-8a90-f507322ad58b',
  type: 'external',
  description: 'This is description.',
  authority: 'EKB-PACKAGE',
  reference: '22-2122875',
  explanation: null,
  startDate: '2021-08-04',
  endDate: '2021-08-28',
  activeFrom: '2021-08-04',
  activeTo: '2021-08-28',
  contentUpdated: null,
  haveAccess: true,
  suppressFromDiscovery: true,
  note: 'This is note.',
  tags: '[]',
  owner: {
    id: '4d2e55ae-4af5-451a-bfba-ad427e3b993c',
    dateCreated: '2021-08-26T08:28:23Z',
    name: 'MR test info',
    orgs: [],
    externalLicenseDocs: [],
    outwardRelationships: [],
    customProperties: {},
    contacts: [
      '{id: "2a3a3c6e-27b2-4415-87e7-4ab9be89706e", owner:…}'
    ],
    tags: [],
    lastUpdated: '2021-08-26T10:43:55Z',
    inwardRelationships: [],
    startDate: '2021-08-01',
    linkedLicenses: [],
    docs: [],
    periods: [
      '{id: "a6887f5c-9c4b-4980-84ba-78146aa09b90", owner:…}'
    ],
    usageDataProviders: [],
    agreementStatus: {
      id: '2c91809c7b802194017b80287c9c0033',
      value: 'requested',
      label: 'Requested'
    },
    supplementaryDocs: [],
    endDate: null,
    cancellationDeadline: null,
    items: [{
      id: 'b725a59d-a156-45c1-8a90-f507322ad58b'
    },
    {
      id: '93aa3ccb-fc0f-4ba1-96dd-ce0cb55658f6'
    }
    ],
    alternateNames: []
  },
  poLines: [{
    id: 'e208111a-d92a-4a5c-86b6-800edff71f8b',
    poLineId: 'baec48dd-1594-2712-be8f-de336bc83fcc',
    owner: {
      id: 'b725a59d-a156-45c1-8a90-f507322ad58b'
    }
  }],
  customCoverage: false,
  reference_object: {
    label: "Women's Magazine Archive I",
    type: 'Package',
    provider: 'Proquest Info & Learning Co',
    titleCount: 6,
    selectedCount: 6,
    contentType: 'Aggregated Full Text',
    providerName: 'Proquest Info & Learning Co',
    isSelected: true
  },
  linkedResource: {
    id: 'b725a59d-a156-45c1-8a90-f507322ad58b',
    type: 'external',
    description: 'This is description.',
    authority: 'EKB-PACKAGE',
    reference: '22-2122875',
    explanation: null,
    startDate: '2021-08-04',
    endDate: '2021-08-28',
    activeFrom: '2021-08-04',
    activeTo: '2021-08-28',
    contentUpdated: null,
    haveAccess: true,
    suppressFromDiscovery: true,
    note: 'This is note.',
    tags: [],
    owner: {
      id: '4d2e55ae-4af5-451a-bfba-ad427e3b993c',
      dateCreated: '2021-08-26T08:28:23Z',
      name: 'MR test info',
      orgs: '[]',
      externalLicenseDocs: '[]',
      outwardRelationships: '[]',
      customProperties: '{}',
      contacts: [{
        id: '2a3a3c6e-27b2-4415-87e7-4ab9be89706e',
        owner: {
          id: '4d2e55ae-4af5-451a-bfba-ad427e3b993c'
        },
        role: {
          id: '2c91809c7b802194017b80287bda0011',
          value: 'erm_librarian',
          label: 'ERM librarian'
        },
        user: 'bb48e70e-c790-4a00-a232-5c5d14ddab09'
      }],
      tags: '[]',
      lastUpdated: '2021-08-26T10:43:55Z',
      inwardRelationships: '[]',
      startDate: '2021-08-01',
      linkedLicenses: '[]',
      docs: '[]',
      periods: [{
        id: 'a6887f5c-9c4b-4980-84ba-78146aa09b90',
        startDate: '2021-08-01',
        owner: {
          id: '4d2e55ae-4af5-451a-bfba-ad427e3b993c'
        },
        periodStatus: 'current'
      }],
      usageDataProviders: '[]',
      agreementStatus: {
        id: '2c91809c7b802194017b80287c9c0033',
        value: 'requested',
        label: 'Requested'
      },
      supplementaryDocs: '[]',
      endDate: null,
      cancellationDeadline: null,
      items: [{
        id: 'b725a59d-a156-45c1-8a90-f507322ad58b'
      },
      {
        id: '93aa3ccb-fc0f-4ba1-96dd-ce0cb55658f6'
      }
      ],
      alternateNames: '[]'
    },
    poLines: [{
      id: 'e208111a-d92a-4a5c-86b6-800edff71f8b',
      poLineId: 'baec48dd-1594-2712-be8f-de336bc83fcc',
      owner: {
        id: 'b725a59d-a156-45c1-8a90-f507322ad58b'
      }
    }],
    customCoverage: false,
    reference_object: {
      label: "Women's Magazine Archive I",
      type: 'Package',
      provider: 'Proquest Info & Learning Co',
      titleCount: 6,
      selectedCount: 6,
      contentType: 'Aggregated Full Text',
      providerName: 'Proquest Info & Learning Co',
      isSelected: true
    }
  }
};
export {
  line,
  initialValues
};
