const data = {
  urlCustomization: {
    id: '60ed082f-fec2-4eb1-97d0-1ba34c1dc288',
    dateCreated: '2021-11-18T18:45:25Z',
    rule: 'test code',
    context: {
      id: '2c91809c7d30b7b0017d30bef8fa0004',
      value: 'urlcustomiser',
      label: 'urlCustomiser'
    },
    lastUpdated: '2021-11-18T18:45:25Z',
    name: 'test customization',
    idScopes: [
      '84f5cfee-374a-4d66-bd1d-87f7b71f016e'
    ]
  }
};

const handlers = {
  onDelete: jest.fn(),
  onClose: jest.fn(),
  onEdit: jest.fn()
};

export { data, handlers };
