const data = {
  platform: {
    id: '84f5cfee-374a-4d66-bd1d-87f7b71f016e',
    dateCreated: '2021-11-18T02:49:51Z',
    lastUpdated: '2021-11-18T02:49:51Z',
    name: 'ACM Digital Library',
    locators: [
      {
        id: 'da0661ac-a480-4124-9422-047ac4bdc51b',
        domainName: 'dl.acm.org'
      }
    ]
  },
  stringTemplates: {
    urlProxiers: [],
    urlCustomisers: []
  },
  proxyServers: []
};

const handlers = {
  onClose: () => jest.fn(),
  onEdit: () => jest.fn()
};

export { data, handlers };
