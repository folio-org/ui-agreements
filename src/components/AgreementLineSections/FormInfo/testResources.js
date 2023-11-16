const data = {
  basket: '[]',
  line: {
    id: '045e0540-48b3-461c-9e5a-06513ef40587',
    dateCreated: '2021-08-24T12:14:29Z',
    activeTo: '2021-08-28',
    tags: [],
    lastUpdated: '2021-08-24T12:14:29Z',
    owner: {
      id: 'aa38f3fd-7a2b-401f-9f5f-b846493120d0',
      dateCreated: '2021-08-24T11:51:41Z',
      name: 'MR test info',
      orgs: '[]',
      externalLicenseDocs: '[]',
      outwardRelationships: '[]',
      customProperties: '{}',
      contacts: '[]',
      tags: '[]',
      lastUpdated: '2021-08-24T11:51:41Z',
      inwardRelationships: '[]',
      startDate: '2021-08-04',
      linkedLicenses: '[]',
      docs: '[]',
      periods: [
        {
          id: '2769b1ef-67bb-486e-9a63-49e02e322d4d',
          startDate: '2021-08-04',
          owner: {
            id: 'aa38f3fd-7a2b-401f-9f5f-b846493120d0'
          },
          periodStatus: 'current'
        }
      ],
      usageDataProviders: '[]',
      agreementStatus: {
        id: '2c91809c7b75d441017b75db827e002d',
        value: 'active',
        label: 'Active'
      },
      supplementaryDocs: '[]',
      endDate: null,
      cancellationDeadline: null,
      items: [
        {
          id: 'd3c6b472-e580-4fcc-98a6-511ca6f1cea6'
        },
        {
          id: 'f1a68f53-5965-42f1-a4ba-a5f56918c6bf'
        },
        {
          id: '045e0540-48b3-461c-9e5a-06513ef40587'
        }
      ],
      alternateNames: '[]'
    },
    activeFrom: '2021-08-04',
    poLines: [],
    type: 'detached',
    suppressFromDiscovery: true,
    note: 'This is note.',
    description: 'This is description',
    customCoverage: false,
    explanation: null,
    startDate: '2021-08-04',
    endDate: '2021-08-28',
    contentUpdated: null,
    haveAccess: true
  }
};

const handlers = {
  isSuppressFromDiscoveryEnabled: () => {},
  onClose: () => {}
};

const initialValues = {
  id: '045e0540-48b3-461c-9e5a-06513ef40587',
  dateCreated: '2021-08-24T12:14:29Z',
  activeTo: '2021-08-28',
  tags: '[]',
  lastUpdated: '2021-08-24T12:14:29Z',
  owner: {
    id: 'aa38f3fd-7a2b-401f-9f5f-b846493120d0',
    dateCreated: '2021-08-24T11:51:41Z',
    name: 'MR test info',
    orgs: [],
    externalLicenseDocs: [],
    outwardRelationships: [],
    customProperties: {},
    contacts: [],
    tags: [],
    lastUpdated: '2021-08-24T11:51:41Z',
    inwardRelationships: [],
    startDate: '2021-08-04',
    linkedLicenses: [],
    docs: [],
    periods: [
      '{id: "2769b1ef-67bb-486e-9a63-49e02e322d4d", owner:…}'
    ],
    usageDataProviders: [],
    agreementStatus: {
      id: '2c91809c7b75d441017b75db827e002d',
      value: 'active',
      label: 'Active'
    },
    supplementaryDocs: [],
    endDate: null,
    cancellationDeadline: null,
    items: [
      {
        id: 'd3c6b472-e580-4fcc-98a6-511ca6f1cea6'
      },
      {
        id: 'f1a68f53-5965-42f1-a4ba-a5f56918c6bf'
      },
      {
        id: '045e0540-48b3-461c-9e5a-06513ef40587'
      }
    ],
    alternateNames: []
  },
  activeFrom: '2021-08-04',
  poLines: '[]',
  type: 'detached',
  suppressFromDiscovery: true,
  note: 'This is note.',
  description: 'This is description',
  customCoverage: false,
  explanation: null,
  startDate: '2021-08-04',
  endDate: '2021-08-28',
  contentUpdated: null,
  haveAccess: true
};

const values = {
  isEholdingsEnabled: true,
  isLoading: false,
  lineId: '045e0540-48b3-461c-9e5a-06513ef40587',
  onSubmit: () => {}
};

export { data, handlers, initialValues, values };

