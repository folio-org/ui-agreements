const activeFilters = {};

const data = {
  availabilityValues: [{
    id: '2c91809c84b954b10184b9cb5e7e0080',
    value: 'allianzlizenz',
    label: 'Allianzlizenz'
  },
  {
    id: '2c91809c84b954b10184ba0053020081',
    value: 'diku',
    label: 'DIKU'
  },
  {
    id: '2c91809c84b954b10184b9cac8ff007f',
    value: 'gwlb_hannover',
    label: 'GWLB Hannover'
  },
  {
    id: '2c91809c84b954b10184b96ade790075',
    value: 'hawk',
    label: 'HAWK'
  },
  {
    id: '2c91809c84b954b10184b97ee8890078',
    value: 'hil',
    label: 'HIL'
  },
  {
    id: '2c91809c84b954b10184b965095f0071',
    value: 'hs_hannover',
    label: 'HS Hannover'
  },
  {
    id: '2c91809c84b954b10184b96505930070',
    value: 'hebis',
    label: 'HeBIS'
  },
  {
    id: '2c91809c84b954b10184b998fc89007b',
    value: 'hebis-konsortium',
    label: 'HeBIS-Konsortium'
  },
  {
    id: '2c91809c84b954b10184ba00978b0082',
    value: 'mlu_halle',
    label: 'MLU Halle'
  },
  {
    id: '2c91809c84b954b10184b9c8f00f007d',
    value: 'nationalkonsortium',
    label: 'Nationalkonsortium'
  },
  {
    id: '2c91809c84b954b10184b98e1e350079',
    value: 'nationallizenz',
    label: 'Nationallizenz'
  },
  {
    id: '2c91809c84b954b10184b9c8f043007e',
    value: 'slub_dresden',
    label: 'SLUB Dresden'
  },
  {
    id: '2c91809c84b954b10184b98f5c9f007a',
    value: 'tib',
    label: 'TIB'
  },
  {
    id: '2c91809c84b954b10184b9bcb7cd007c',
    value: 'tu_hamburg',
    label: 'TU Hamburg'
  },
  {
    id: '2c91809c84b954b10184b975baad0076',
    value: 'vzg',
    label: 'VZG'
  },
  {
    id: '2c91809c84b954b10184b95d70e3006a',
    value: 'zbw',
    label: 'ZBW'
  }
  ],
  contentTypeValues: [{
    id: '2c91809c84b954b10184b95d6d770067',
    value: 'book',
    label: 'Book'
  },
  {
    id: '2c91809c84b954b10184b96ad4db0072',
    value: 'database',
    label: 'Database'
  },
  {
    id: '2c91809c84b954b10184b95d2e420062',
    value: 'journal',
    label: 'Journal'
  },
  {
    id: '2c91809c84b954b10184b97ee7890077',
    value: 'mixed',
    label: 'Mixed'
  }
  ],
  packages: [{
    id: '13c192c0-cc82-403b-b4fb-20e3daf6b7c6',
    availabilityScope: {
      id: '2c91809c84b954b10184b95d93d3006b',
      value: 'consortium',
      label: 'Consortium'
    },
    dateCreated: '2022-11-27T14:58:41Z',
    availabilityConstraints: [{
      id: '446f1f1e-3694-4b0c-8955-c66518252ada',
      body: {
        id: '2c91809c84b954b10184b998fc89007b',
        value: 'hebis-konsortium',
        label: 'HeBIS-Konsortium'
      }
    }],
    packageDescriptionUrls: [{
      id: '0f1ee0a3-cf80-49fd-a738-0ca2555c5087',
      url: 'https://gokbt.gbv.de/package/e7672e03-9b0a-4f76-ab43-25fef0289d3d'
    }],
    lastUpdated: '2022-11-27T14:58:42Z',
    normalizedName: 'acm digtal library',
    vendor: {
      id: 'afc68c0f-d7d1-49fd-b426-b5c1abaa203f',
      name: 'Association for Computing Machinery'
    },
    sourceDataUpdated: '2021-11-26T18:30:37Z',
    source: 'GOKb',
    contentTypes: [{
      id: 'e48d59df-2709-4321-9575-959ca637d5a7',
      contentType: '{id: "2c91809c84b954b10184b95d2e420062", label: "Jo…}'
    }],
    alternateResourceNames: [{
      id: 'a951fe0d-3f67-4850-ab63-76ae1ba771be',
      name: 'Association for Computing Machinery - Digital Library',
      owner: '{id: "13c192c0-cc82-403b-b4fb-20e3daf6b7c6"}'
    }],
    name: 'ACM Digtal Library',
    lifecycleStatus: {
      id: '2c91809c84b954b10184b95c73c80041',
      value: 'current',
      label: 'Current'
    },
    suppressFromDiscovery: false,
    sourceDataCreated: '2021-08-16T14:15:53Z',
    description: 'Volltextdatenbank aus Zeitschriften, Kongressberichten, Newsletters, Reviews, Special Interest Groups u.a.',
    reference: 'ACM_Digtal_Library_2',
    resourceCount: 10650,
    class: 'org.olf.kb.Pkg',
    identifiers: [{
      identifier: {
        value: '6128415',
        ns: {
          value: 'gokb_id'
        }
      },
      status: {
        id: '2c91809c84b954b10184b95d2e950064',
        value: 'approved',
        label: 'approved'
      }
    },
    {
      identifier: {
        value: 'e7672e03-9b0a-4f76-ab43-25fef0289d3d',
        ns: {
          value: 'gokb_uuid'
        }
      },
      status: {
        id: '2c91809c84b954b10184b95d2e950064',
        value: 'approved',
        label: 'approved'
      }
    }
    ]
  },
  {
    id: 'c5f00f3e-61c5-429d-b869-ef22b10eba77',
    availabilityScope: {
      id: '2c91809c84b954b10184b95c73c4003f',
      value: 'global',
      label: 'Global'
    },
    dateCreated: '2022-11-27T15:57:18Z',
    availabilityConstraints: '[]',
    packageDescriptionUrls: [{
      id: 'ed75a99d-af56-477c-aeaa-9ba9177ab8dd',
      url: 'https://gokbt.gbv.de/package/c6c02a7f-4581-487e-86da-73249df9316e'
    }],
    lastUpdated: '2022-11-27T15:57:18Z',
    normalizedName: 'acs in focus test',
    vendor: {
      id: '27b24ab1-7419-4e96-996c-9ad7b989fdb8',
      name: 'American Chemical Society'
    },
    sourceDataUpdated: '2021-08-13T06:20:30Z',
    source: 'GOKb',
    contentTypes: '[]',
    alternateResourceNames: '[]',
    name: 'ACS in Focus Test',
    lifecycleStatus: {
      id: '2c91809c84b954b10184b95c73c80041',
      value: 'current',
      label: 'Current'
    },
    suppressFromDiscovery: false,
    sourceDataCreated: '2020-10-30T14:30:16Z',
    reference: 'ACS_in_Focus_Test',
    resourceCount: 0,
    class: 'org.olf.kb.Pkg',
    identifiers: [{
      identifier: {
        value: '5126637',
        ns: {
          value: 'gokb_id'
        }
      },
      status: {
        id: '2c91809c84b954b10184b95d2e950064',
        value: 'approved',
        label: 'approved'
      }
    },
    {
      identifier: {
        value: 'c6c02a7f-4581-487e-86da-73249df9316e',
        ns: {
          value: 'gokb_uuid'
        }
      },
      status: {
        id: '2c91809c84b954b10184b95d2e950064',
        value: 'approved',
        label: 'approved'
      }
    }
    ]
  }
  ],
  scopeValues: [{
    id: '2c91809c84b954b10184b95d93d3006b',
    value: 'consortium',
    label: 'Consortium'
  },
  {
    id: '2c91809c84b954b10184b95c73c4003f',
    value: 'global',
    label: 'Global'
  },
  {
    id: '2c91809c84b954b10184b95d70bb0068',
    value: 'local',
    label: 'Local'
  },
  {
    id: '2c91809c84b954b10184b96ad8ef0074',
    value: 'other',
    label: 'Other'
  },
  {
    id: '2c91809c84b954b10184b95e484f006c',
    value: 'regional',
    label: 'Regional'
  }
  ],
  sourceValues: ['GOKb', 'kbplus', 'k-int'],
  statusValues: [{
    id: '2c91809c84b954b10184b95c73c80041',
    value: 'current',
    label: 'Current'
  },
  {
    id: '2c91809c84b954b10184b95c73d40044',
    value: 'deleted',
    label: 'Deleted'
  },
  {
    id: '2c91809c84b954b10184b95c73d00043',
    value: 'expected',
    label: 'Expected'
  },
  {
    id: '2c91809c84b954b10184b95c73cc0042',
    value: 'retired',
    label: 'Retired'
  }
  ],
  tagsValues: [{
    id: '18a8f2b9-49c3-4496-8669-0fb86144fb4c',
    label: 'important',
    metadata: {
      createdDate: '2022-11-27T13:52:25.682+00:00'
    }
  },
  {
    id: 'b224a0c1-2bdd-4941-b419-4cb440c022b3',
    label: 'urgent',
    description: 'Requires urgent attention',
    metadata: {
      createdDate: '2022-11-27T13:52:25.687+00:00'
    }
  }
  ],
  synchronisationStatusValues: [
    { label: 'Synchronising', value: 'true' },
    { label: 'Paused', value: 'false' },
    { label: 'Not set', value: 'isNotSet' }
  ]
};

export {
  activeFilters,
  data
};
