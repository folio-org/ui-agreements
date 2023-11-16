const eresource = {
  id: 'c53fab4d-7813-40b5-9c4b-376a6d19a34c',
  availabilityScope: {
    id: 'ff8081817fd0b47d017fd0b5b6810001',
    value: 'global',
    label: 'Global'
  },
  dateCreated: '2022-03-28T13:51:12Z',
  packageDescriptionUrls: [{
    id: 'e7d503b0-5901-421f-9861-d86b21f7f6a9',
    url: 'https://blobb',
    owner: {
      id: 'c53fab4d-7813-40b5-9c4b-376a6d19a34c'
    }
  },
  {
    id: '98389b98-5ab0-42c2-9027-bbddc6bf769f',
    url: 'https://blubb',
    owner: {
      id: 'c53fab4d-7813-40b5-9c4b-376a6d19a34c'
    }
  }
  ],
  identifiers: [
    {
      identifier: {
        value: '1452686',
        ns: {
          value: 'gokb_id'
        }
      },
      status: {
        id: '2c91809c835db8af01835dc0ba57006a',
        value: 'approved',
        label: 'approved'
      }
    },
    {
      identifier: {
        value: '9a91cc3b-c42a-411b-be70-64fa93e0931b',
        ns: {
          value: 'gokb_uuid'
        }
      },
      status: {
        id: '2c91809c835db8af01835dc0ba57006a',
        value: 'approved',
        label: 'approved'
      }
    }
  ],
  lastUpdated: '2022-04-04T10:11:59Z',
  normalizedName: 'igi global:igi global infosci-journals:konsortiallizenz',
  vendor: {
    id: 'e1fc0050-48aa-481b-9534-c2e2fbdb9038',
    name: 'IGI Global',
    orgsUuid_object: {
      error: 400,
      message: 'Bad Request'
    }
  },
  sourceDataUpdated: '2022-03-28T03:09:04Z',
  source: 'GOKb',
  remoteKb: {
    id: 'a4626675-fdfc-465f-b8f9-ca0b572529c0',
    cursor: '2021-07-07T10:20:09Z',
    active: true,
    trustedSourceTI: false,
    activationEnabled: false,
    readonly: false,
    syncStatus: 'in-process',
    name: 'GOKb_TEST',
    type: 'org.olf.kb.adapters.GOKbOAIAdapter',
    fullPrefix: 'gokb',
    uri: 'https://gokbt.gbv.de/gokb/oai/index',
    supportsHarvesting: true,
    rectype: 1
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
  }
  ],
  alternateResourceNames: [{
    id: '98acf729-368e-44a4-a088-d3e2bcb105b3',
    name: 'Name 2',
  },
  {
    id: '27a9b427-5e4e-4d8d-ae87-fe8880551985',
    name: 'Name 1',
  },
  {
    id: '45e153bd-f3ed-4b23-9cf1-103334efdb51',
    name: 'Name 3',
  },
  {
    id: '54669ab9-ba4b-46f8-a79d-56247e618b96',
    name: 'Name 4',
  }
  ],
  name: 'IGI Global:IGI Global InfoSci-Journals:Konsortiallizenz',
  lifecycleStatus: {
    id: 'ff8081817fd0b47d017fd0b5b6d20006',
    value: 'current',
    label: 'Current'
  },
  suppressFromDiscovery: false,
  sourceDataCreated: '2022-03-21T23:00:04Z',
  description: 'a package description',
  reference: 'IGI_Global:IGI_Global_InfoSci-Journals:Konsortiallizenz',
  resourceCount: 0,
  class: 'org.olf.kb.Pkg'
};

export { eresource as default };
