export const packagesData = {
  eresource: {
    id: '98a7b8fe-cd85-41b4-8eea-11eb80c0290f',
    dateCreated: '2021-01-28T13:05:23Z',
    lastUpdated: '2021-01-28T13:05:23Z',
    vendor: {
      id: 'e90cffdd-8d04-47be-aa37-355778d30e43',
      name: 'PBS Video',
      orgsUuid_object: {
        error: 400,
        message: 'Bad Request'
      }
    },
    source: 'GOKb',
    remoteKb: {
      id: '4e5c35f5-2570-4259-8a13-f7eaca072477',
      cursor: '2021-01-27T19:28:26Z',
      active: true,
      trustedSourceTI: false,
      activationEnabled: false,
      readonly: false,
      syncStatus: 'idle',
      lastCheck: 1611863286252,
      name: 'GOKb_TEST',
      type: 'org.olf.kb.adapters.GOKbOAIAdapter',
      fullPrefix: 'gokb',
      uri: 'http://gokbt.gbv.de/gokb/oai/index',
      supportsHarvesting: true,
      rectype: 1
    },
    name: 'AVA VOD Library',
    suppressFromDiscovery: false,
    reference: 'AVA_VOD_Library',
    resourceCount: 2,
    class: 'org.olf.kb.Pkg',
    lifecycleStatus: {
      id: 'ff8081817fd0b47d017fd0b5b6d20006',
      value: 'current',
      label: 'Current'
    },
    contentTypes: [{
      id: '54e14560-caf5-4c3f-8769-e5ce173fc2b8',
      contentType: {
        value: 'print',
        label: 'Print'
      }
    },
    {
      id: 'b5295cf8-db3c-4159-b923-92797ca2be28',
      contentType: {
        value: 'electronic',
        label: 'Electronic'
      }
    }],
    availabilityConstraints: [
      {
        id: 'f9a5977e-17a1-4399-8107-82f902007bae',
        body: {
          id: '02d3182883136e56018313ba8dfa0012',
          value: 'hbz',
          label: 'HBZ'
        }
      },
      {
        id: '8155baae-aac2-4699-a914-f60e5eed481b',
        body: {
          id: '02d3182883136e56018313ba8df10011',
          value: 'gbv',
          label: 'GBV'
        }
      }
    ],
    availabilityScope: {
      id: 'ff8081817fd0b47d017fd0b5b6810001',
      value: 'global',
      label: 'Global'
    },
    sourceDataCreated: '2022-03-21T23:00:04Z',
    sourceDataUpdated: '2022-03-28T03:09:04Z',
    syncContentsFromSource: true,
  },
};

export const packagesWithNoValues = {
  eresource: {
    id: '98a7b8fe-cd85-41b4-8eea-11eb80c0290f',
    dateCreated: '2021-01-28T13:05:23Z',
    lastUpdated: '2021-01-28T13:05:23Z',
    remoteKb: {
      id: '4e5c35f5-2570-4259-8a13-f7eaca072477',
      cursor: '2021-01-27T19:28:26Z',
      active: true,
      trustedSourceTI: false,
      activationEnabled: false,
      readonly: false,
      syncStatus: 'idle',
      lastCheck: 1611863286252,
      name: 'GOKb_TEST',
      type: 'org.olf.kb.adapters.GOKbOAIAdapter',
      fullPrefix: 'gokb',
      uri: 'http://gokbt.gbv.de/gokb/oai/index',
      supportsHarvesting: true,
      rectype: 1
    },
    name: 'AVA VOD Library',
    suppressFromDiscovery: false,
    resourceCount: 2,
    class: 'org.olf.kb.Pkg'
  },
};
