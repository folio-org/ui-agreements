const data = {
  basket: [
    {
      id: '267b8ab6-5ea6-45bb-8884-6f9cf460a0d0',
      class: 'org.olf.kb.Pkg',
      name: 'Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz',
      suppressFromDiscovery: false,
      tags: [],
      customCoverage: false,
      _object: {
        id: '267b8ab6-5ea6-45bb-8884-6f9cf460a0d0',
        dateCreated: '2021-11-19T01:58:42Z',
        tags: [],
        lastUpdated: '2021-11-19T01:58:42Z',
        normalizedName: 'edward elgar:edward elgar e-book archive in business & management, economics and finance:nationallizenz',
        vendor: {
          id: 'ce30e434-f897-4037-a07b-e656bfe5559d',
          name: 'Edward Elgar',
          orgsUuid_object: {
            error: 400,
            message: 'Bad Request'
          }
        },
        coverage: [],
        source: 'GOKb',
        remoteKb: {
          id: 'ebaf4815-a4bc-49f6-b929-03a216a4e206',
          cursor: '2021-11-17T15:58:18Z',
          active: true,
          trustedSourceTI: false,
          activationEnabled: false,
          readonly: false,
          syncStatus: 'idle',
          lastCheck: 1637347576976,
          name: 'GOKb_TEST',
          type: 'org.olf.kb.adapters.GOKbOAIAdapter',
          fullPrefix: 'gokb',
          uri: 'https://gokbt.gbv.de/gokb/oai/index',
          supportsHarvesting: true,
          rectype: 1
        },
        name: 'Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz',
        suppressFromDiscovery: false,
        reference: 'Edward_Elgar:Edward_Elgar_E-Book_Archive_in_Business_&_Management,_Economics_and_Finance:Nationalliz',
        resourceCount: 2540,
        class: 'org.olf.kb.Pkg'
      },
      rowIndex: 0
    }
  ]
};

const handlers = {
  onClose: jest.fn(),
  onRemoveBasketItem: jest.fn()
};

export { data, handlers };
