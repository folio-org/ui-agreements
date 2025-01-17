const data = {
  basket: [{
    class: 'org.olf.kb.Pkg',
    id: '1ac840f8-1d61-4762-8f04-d9f9002a38e2',
    name: 'ACS in Focus Test',
    _object: {
      id: '1ac840f8-1d61-4762-8f04-d9f9002a38e2',
      availabilityScope: {
        id: '2c91809e9471ef2c019471f85da90042',
        value: 'global',
        label: 'Global'
      },
      dateCreated: '2025-01-17T02:10:16Z',
      availabilityConstraints: [],
      packageDescriptionUrls: [
        {
          id: '67141d4a-8adc-4635-8549-11c936decf09',
          url: 'http://gokbt.gbv.de/package/c6c02a7f-4581-487e-86da-73249df9316e'
        }
      ],
      lastUpdated: '2025-01-17T02:10:16Z',
      normalizedName: 'acs in focus test',
      vendor: {
        id: '25353090-4fc2-499a-9ca7-3c6276ee3aef',
        name: 'American Chemical Society',
        orgsUuid_object: {
          error: 400,
          message: 'Bad Request'
        }
      },
      sourceDataUpdated: '2021-08-13T06:20:30Z',
      source: 'GOKb',
      contentTypes: [],
      sourceTitleCount: 0,
      alternateResourceNames: [],
      name: 'ACS in Focus Test',
      lifecycleStatus: {
        id: '2c91809e9471ef2c019471f85daf0044',
        value: 'current',
        label: 'Current'
      },
      suppressFromDiscovery: false,
      sourceDataCreated: '2020-10-30T14:30:16Z',
      reference: 'c6c02a7f-4581-487e-86da-73249df9316e',
      resourceCount: 0,
      class: 'org.olf.kb.Pkg',
      identifiers: [
        {
          identifier: {
            value: '5126637',
            ns: { value: 'gokb_id' }
          },
          status: {
            id: '2c91809e9471ef2c019471f896d1005e',
            value: 'approved',
            label: 'approved'
          }
        },
        {
          identifier: {
            value: 'c6c02a7f-4581-487e-86da-73249df9316e',
            ns: { value: 'gokb_uuid' }
          },
          status: {
            id: '2c91809e9471ef2c019471f896d1005e',
            value: 'approved',
            label: 'approved'
          }
        }
      ]
    }
  }
  ]
};

const handlers = {
  onClose: jest.fn(),
  onRemoveBasketItem: jest.fn()
};

export { data, handlers };
