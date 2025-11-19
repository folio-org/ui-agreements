import refdata from './refdata';

export const pkgs = [
  {
    id: '9bd869e3-6c3c-42d2-aaf6-96d2725e71f3',
    availabilityScope: refdata.find(rdc => rdc.desc === 'Pkg.AvailabilityScope').values.find(rdv => rdv.value === 'global'),
    dateCreated: '2025-09-09T02:00:42Z',
    availabilityConstraints: [],
    packageDescriptionUrls: [
      {
        id: '9866f085-3bb5-4da1-95e3-66d6720deee4',
        url: 'https://gokbt.gbv.de/package/01de7360-8475-401e-8388-5c5c9b1186c3'
      }
    ],
    lastUpdated: '2025-09-09T09:15:27Z',
    normalizedName: 'accounting finance and economics ejournal collection',
    vendor: {
      id: 'cc90bb38-2445-4652-b0ed-736bd9f7579e',
      name: 'Emerald Group Publishing Limited'
    },
    sourceDataUpdated: '2022-09-21T14:09:16Z',
    source: 'GOKb',
    syncContentsFromSource: true,
    contentTypes: [{
      id: '54e14560-caf5-4c3f-8769-e5ce173fc2b8',
      contentType: refdata.find(rdc => rdc.desc === 'TitleInstance.SubType').values.find(rdv => rdv.value === 'print'),
    },
    {
      id: 'b5295cf8-db3c-4159-b923-92797ca2be28',
      contentType: refdata.find(rdc => rdc.desc === 'TitleInstance.SubType').values.find(rdv => rdv.value === 'electronic'),
    }],
    sourceTitleCount: 11,
    alternateResourceNames: [],
    name: 'Accounting Finance and Economics eJournal collection',
    lifecycleStatus: refdata.find(rdc => rdc.desc === 'Pkg.LifecycleStatus').values.find(rdv => rdv.value === 'current'),
    suppressFromDiscovery: false,
    sourceDataCreated: '2021-08-05T11:51:55Z',
    reference: '01de7360-8475-401e-8388-5c5c9b1186c3',
    resourceCount: 11,
    class: 'org.olf.kb.Pkg',
    identifiers: [
      {
        identifier: {
          value: '5994126',
          ns: {
            value: 'gokb_id'
          },
          occurrenceCount: 1
        },
        status: refdata.find(rdc => rdc.desc === 'IdentifierOccurrence.Status').values.find(rdv => rdv.value === 'approved'),
      },
      {
        identifier: {
          value: '01de7360-8475-401e-8388-5c5c9b1186c3',
          ns: {
            value: 'gokb_uuid'
          },
          occurrenceCount: 1
        },
        status: refdata.find(rdc => rdc.desc === 'IdentifierOccurrence.Status').values.find(rdv => rdv.value === 'approved'),
      }
    ]
  },
  {
    id: '9bd869e3-6c3c-42d2-aaf6-96d2725e71f3',
    availabilityScope: refdata.find(rdc => rdc.desc === 'Pkg.AvailabilityScope').values.find(rdv => rdv.value === 'global'),
    dateCreated: '2025-09-09T02:00:42Z',
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
    packageDescriptionUrls: [
      {
        id: '9866f085-3bb5-4da1-95e3-66d6720deee4',
        url: 'https://gokbt.gbv.de/package/01de7360-8475-401e-8388-5c5c9b1186c3'
      }
    ],
    lastUpdated: '2025-09-09T09:15:27Z',
    normalizedName: 'accounting finance and economics ejournal collection',
    vendor: {
      id: 'cc90bb38-2445-4652-b0ed-736bd9f7579e',
      name: 'Emerald Group Publishing Limited'
    },
    sourceDataUpdated: '2022-09-21T14:09:16Z',
    source: 'GOKb',
    syncContentsFromSource: true,
    contentTypes: [],
    sourceTitleCount: 11,
    alternateResourceNames: [],
    name: 'Accounting Finance and Economics eJournal collection',
    lifecycleStatus: refdata.find(rdc => rdc.desc === 'Pkg.LifecycleStatus').values.find(rdv => rdv.value === 'current'),
    suppressFromDiscovery: false,
    sourceDataCreated: '2021-08-05T11:51:55Z',
    reference: '01de7360-8475-401e-8388-5c5c9b1186c3',
    resourceCount: 11,
    class: 'org.olf.kb.Pkg',
    identifiers: [
      {
        identifier: {
          value: '5994126',
          ns: {
            value: 'gokb_id'
          },
          occurrenceCount: 1
        },
        status: refdata.find(rdc => rdc.desc === 'IdentifierOccurrence.Status').values.find(rdv => rdv.value === 'approved'),
      },
      {
        identifier: {
          value: '01de7360-8475-401e-8388-5c5c9b1186c3',
          ns: {
            value: 'gokb_uuid'
          },
          occurrenceCount: 1
        },
        status: refdata.find(rdc => rdc.desc === 'IdentifierOccurrence.Status').values.find(rdv => rdv.value === 'approved'),
      }
    ]
  },
  {
    id: 'eab7a8ea-6665-4f06-a55a-73a5aad36215',
    availabilityScope: refdata.find(rdc => rdc.desc === 'Pkg.AvailabilityScope').values.find(rdv => rdv.value === 'global'),
    dateCreated: '2025-09-09T02:01:27Z',
    availabilityConstraints: [],
    packageDescriptionUrls: [
      {
        id: '6d089053-e7e0-4176-8f86-ea9fbf83aa70',
        url: 'https://gokbt.gbv.de/package/3e19edea-95e6-47a7-acfe-a0de2bace2d2'
      }
    ],
    lastUpdated: '2025-09-09T09:16:08Z',
    normalizedName: 'emerald management 60',
    vendor: {
      id: 'cc90bb38-2445-4652-b0ed-736bd9f7579e',
      name: 'Emerald Group Publishing Limited'
    },
    sourceDataUpdated: '2023-05-11T00:30:51Z',
    source: 'GOKb',
    syncContentsFromSource: false,
    contentTypes: [
      {
        id: 'dc817b39-33bb-4e11-80d8-2bdb620ee6df',
        contentType: refdata.find(rdc => rdc.desc === 'Pkg.ContentType').values.find(rdv => rdv.value === 'journal'),
      }
    ],
    sourceTitleCount: 93,
    alternateResourceNames: [],
    name: 'Emerald Management 60',
    lifecycleStatus: refdata.find(rdc => rdc.desc === 'Pkg.LifecycleStatus').values.find(rdv => rdv.value === 'current'),
    suppressFromDiscovery: false,
    sourceDataCreated: '2023-02-03T14:24:27Z',
    reference: '3e19edea-95e6-47a7-acfe-a0de2bace2d2',
    resourceCount: 0,
    class: 'org.olf.kb.Pkg',
    identifiers: [
      {
        identifier: {
          value: '27311399',
          ns: {
            value: 'gokb_id'
          },
          occurrenceCount: 1
        },
        status: refdata.find(rdc => rdc.desc === 'IdentifierOccurrence.Status').values.find(rdv => rdv.value === 'approved'),
      },
      {
        identifier: {
          value: '3e19edea-95e6-47a7-acfe-a0de2bace2d2',
          ns: {
            value: 'gokb_uuid'
          },
          occurrenceCount: 1
        },
        status: refdata.find(rdc => rdc.desc === 'IdentifierOccurrence.Status').values.find(rdv => rdv.value === 'approved'),
      }
    ]
  },
  {
    id: '3901e11d-8236-4a73-b322-04df4aee6159',
    dateCreated: '2021-09-06T02:02:52Z',
    lastUpdated: '2021-09-06T02:02:52Z',
    vendor: {
      id: '9101ada1-1227-448a-ae9c-01cb4ab87b0d',
      name: 'Edward Elgar',
      orgsUuid_object: {
        error: 400,
        message: 'Bad Request'
      }
    },
    source: 'GOKb',
    remoteKb: {
      id: '02ccb570-8581-4f51-b589-3113655a4992',
      cursor: '2021-09-06T09:34:51Z',
      active: true,
      trustedSourceTI: false,
      activationEnabled: false,
      readonly: false,
      syncStatus: 'idle',
      lastCheck: 1630929320679,
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
  {
    'id': '6579cdf9-5601-4299-8d98-88ada4036091',
    'availabilityScope': refdata.find(rdc => rdc.desc === 'Pkg.AvailabilityScope').values.find(rdv => rdv.value === 'local'),
    'dateCreated': '2025-11-17T02:03:18Z',
    'availabilityConstraints': [
      {
        'id': '0981f598-fb2d-4215-8897-3382e9cd72c9',
        'body': {
          'id': '2c9180a89a8f7d71019a8f8d60c8009b',
          'value': 'ub_ilmenau',
          'label': 'UB Ilmenau'
        }
      }
    ],
    'packageDescriptionUrls': [
      {
        'id': 'b23cc150-dd74-4dab-b822-e59a557e1116',
        'url': 'https://gokbt.gbv.de/package/cc5a19bf-4942-417a-9d44-5dbe51bd32a3'
      }
    ],
    'lastUpdated': '2025-11-17T02:03:18Z',
    'normalizedName': 'springer journals : deal',
    'vendor': {
      'id': '43bacc81-9c5d-4642-a761-d8aa3cab940b',
      'name': 'Springer Nature'
    },
    'sourceDataUpdated': '2025-11-07T17:40:52Z',
    'source': 'GOKb',
    'syncContentsFromSource': false,
    'contentTypes': [
      {
        'id': '7c1e36ba-4b11-4ba2-b164-02796d15e454',
        'contentType': refdata.find(rdc => rdc.desc === 'Pkg.ContentType').values.find(rdv => rdv.value === 'journal'),
      }
    ],
    'sourceTitleCount': 3732,
    'alternateResourceNames': [],
    'name': 'Springer Journals : DEAL',
    'lifecycleStatus': refdata.find(rdc => rdc.desc === 'Pkg.LifecycleStatus').values.find(rdv => rdv.value === 'current'),
    'suppressFromDiscovery': false,
    'sourceDataCreated': '2025-03-04T13:56:23Z',
    'reference': 'cc5a19bf-4942-417a-9d44-5dbe51bd32a3',
    'resourceCount': 0,
    'class': 'org.olf.kb.Pkg',
    'identifiers': [
      {
        'identifier': {
          'value': '35898124',
          'ns': {
            'value': 'gokb_id'
          },
          'occurrenceCount': 1
        },
        'status': refdata.find(rdc => rdc.desc === 'IdentifierOccurrence.Status').values.find(rdv => rdv.value === 'approved'),
      },
      {
        'identifier': {
          'value': 'cc5a19bf-4942-417a-9d44-5dbe51bd32a3',
          'ns': {
            'value': 'gokb_uuid'
          },
          'occurrenceCount': 1
        },
        'status': refdata.find(rdc => rdc.desc === 'IdentifierOccurrence.Status').values.find(rdv => rdv.value === 'approved'),
      }
    ]
  }
];

export const platforms = [
  {
    id: '960bb184-6e0f-4898-a7bf-624773fd1d9b',
    dateCreated: '2025-09-09T09:15:27Z',
    lastUpdated: '2025-09-09T09:15:27Z',
    name: 'Emerald Insight',
    locators: [
      {
        id: 'a3787964-d9af-4927-bce2-1abdd6f083ac',
        domainName: 'www.emeraldinsight.com'
      }
    ]
  },
  {
    id: 'ef6b100a-2490-4b36-ab5d-8a7925ba959f',
    dateCreated: '2021-09-06T01:57:52Z',
    lastUpdated: '2021-09-06T01:57:52Z',
    name: 'Elgaronline',
    locators: [{
      id: '25532243-da35-4f76-941c-ddeb03394338',
      domainName: 'www.elgaronline.com'
    }]
  },
];

export const works = [
  {
    id: '13542125-b5ed-4d43-9cb5-6ddb62654315',
    title: 'International Journal of Managerial Finance',
    sourceIdentifier: {
      dateCreated: '2025-09-09T09:15:28Z',
      lastUpdated: '2025-09-09T09:15:28Z',
      status: refdata.find(rdc => rdc.desc === 'IdentifierOccurrence.Status').values.find(rdv => rdv.value === 'approved'),
      identifier: {
        value: '00e46664-9d3b-458e-9fff-1f800fbb707e',
        ns: {
          value: 'gokb'
        },
        occurrenceCount: 1
      }
    }
  }
];

export const tis = [
  {
    id: '38138ae2-9dd9-412a-a0eb-e8890c9d1274',
    subType: refdata.find(rdc => rdc.desc === 'TitleInstance.SubType').values.find(rdv => rdv.value === 'electronic'),
    dateCreated: '2025-09-09T09:15:28Z',
    tags: [],
    lastUpdated: '2025-09-09T09:15:28Z',
    normalizedName: 'international journal of managerial finance',
    publicationType: refdata.find(rdc => rdc.desc === 'TitleInstance.PublicationType').values.find(rdv => rdv.value === 'journal'),
    coverage: [
      {
        id: 'e7ea1021-e1ff-412a-826a-392b585bde59',
        startDate: '2005-01-01',
        summary: 'v*/i*/2005-01-01 - v*/i*/*'
      }
    ],
    name: 'International Journal of Managerial Finance',
    type: refdata.find(rdc => rdc.desc === 'TitleInstance.Type').values.find(rdv => rdv.value === 'serial'),
    suppressFromDiscovery: false,
    work: works.find(w => w.title === 'International Journal of Managerial Finance'),
    class: 'org.olf.kb.TitleInstance',
    longName: 'International Journal of Managerial Finance',
    identifiers: [
      {
        dateCreated: '2025-09-09T09:15:28Z',
        lastUpdated: '2025-09-09T09:15:28Z',
        status: refdata.find(rdc => rdc.desc === 'IdentifierOccurrence.Status').values.find(rdv => rdv.value === 'approved'),
        identifier: {
          value: '65256',
          ns: {
            value: 'ezb'
          },
          occurrenceCount: 1
        }
      },
      {
        dateCreated: '2025-09-09T09:15:28Z',
        lastUpdated: '2025-09-09T09:15:28Z',
        status: refdata.find(rdc => rdc.desc === 'IdentifierOccurrence.Status').values.find(rdv => rdv.value === 'approved'),
        identifier: {
          value: '00e46664-9d3b-458e-9fff-1f800fbb707e',
          ns: {
            value: 'gokb_uuid'
          },
          occurrenceCount: 1
        }
      },
      {
        dateCreated: '2025-09-09T09:15:28Z',
        lastUpdated: '2025-09-09T09:15:28Z',
        status: refdata.find(rdc => rdc.desc === 'IdentifierOccurrence.Status').values.find(rdv => rdv.value === 'approved'),
        identifier: {
          value: '1758-6569',
          ns: {
            value: 'issn'
          },
          occurrenceCount: 1
        }
      },
      {
        dateCreated: '2025-09-09T09:15:28Z',
        lastUpdated: '2025-09-09T09:15:28Z',
        status: refdata.find(rdc => rdc.desc === 'IdentifierOccurrence.Status').values.find(rdv => rdv.value === 'approved'),
        identifier: {
          value: '2227388-8',
          ns: {
            value: 'zdb'
          },
          occurrenceCount: 1
        }
      }
    ],
    relatedTitles: [
      {
        id: '18a571c9-ac50-478d-b9fe-4768acf25b8d',
        subType: refdata.find(rdc => rdc.desc === 'TitleInstance.SubType').values.find(rdv => rdv.value === 'print'),
        publicationType: refdata.find(rdc => rdc.desc === 'TitleInstance.PublicationType').values.find(rdv => rdv.value === 'journal'),
        name: 'International Journal of Managerial Finance',
        type: refdata.find(rdc => rdc.desc === 'TitleInstance.Type').values.find(rdv => rdv.value === 'serial'),
        longName: 'International Journal of Managerial Finance',
        identifiers: [
          {
            dateCreated: '2025-09-09T09:15:28Z',
            lastUpdated: '2025-09-09T09:15:28Z',
            status: refdata.find(rdc => rdc.desc === 'IdentifierOccurrence.Status').values.find(rdv => rdv.value === 'approved'),
            identifier: {
              value: '1743-9132',
              ns: {
                value: 'issn'
              },
              occurrenceCount: 1
            }
          }
        ]
      }
    ]
  },
  {
    id: '08eee460-758b-4339-960f-f16c4b8fe446',
    subType: refdata.find(rdc => rdc.desc === 'TitleInstance.SubType').values.find(rdv => rdv.value === 'electronic'),
    dateCreated: '2021-09-06T02:02:53Z',
    tags: '[]',
    lastUpdated: '2021-09-06T07:47:31Z',
    publicationType: refdata.find(rdc => rdc.desc === 'TitleInstance.PublicationType').values.find(rdv => rdv.value === 'book'),
    identifiers: [{
      title: {
        id: '08eee460-758b-4339-960f-f16c4b8fe446'
      },
      status: refdata.find(rdc => rdc.desc === 'IdentifierOccurrence.Status').values.find(rdv => rdv.value === 'approved'),
      identifier: {
        value: '9781845425678',
        ns: {
          value: 'isbn'
        }
      }
    }],
    coverage: '[]',
    name: "\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"",
    type: refdata.find(rdc => rdc.desc === 'TitleInstance.Type').values.find(rdv => rdv.value === 'monograph'),
    suppressFromDiscovery: true,
    work: {
      id: 'f740075c-99da-43fe-a5d9-68318e83fb8b'
    },
    class: 'org.olf.kb.TitleInstance',
    longName: "\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"",
    relatedTitles: '[]'
  },
];

export const ptis = [
  {
    id: 'ebce7fe8-4707-4c0b-8030-3bd3d3bc2f0c',
    dateCreated: '2025-09-09T09:15:28Z',
    tags: [],
    lastUpdated: '2025-09-09T09:15:28Z',
    platform: platforms.find(p => p.name === 'Emerald Insight'),
    templatedUrls: [],
    coverage: [
      {
        id: '3752e01a-b7bf-4ffb-8d4d-b449a08a7f2a',
        startDate: '2005-01-01',
        summary: 'v*/i*/2005-01-01 - v*/i*/*'
      }
    ],
    titleInstance: tis.find(t => t.name === 'International Journal of Managerial Finance'),
    url: 'https://www.emerald.com/insight/publication/issn/1743-9132',
    name: "'International Journal of Managerial Finance' on Platform 'Emerald Insight'",
    suppressFromDiscovery: false,
    class: 'org.olf.kb.PlatformTitleInstance',
    longName: "'International Journal of Managerial Finance' on Platform 'Emerald Insight'"
  },
  {
    id: 'b353eb8f-89e3-4de6-b099-ecfee80be537',
    dateCreated: '2021-09-06T02:02:53Z',
    tags: [],
    lastUpdated: '2021-09-06T02:02:53Z',
    platform: platforms.find(p => p.name === 'Elgaronline'),
    templatedUrls: [{
      id: '5b5b3349-9aa9-4fd8-94f1-016c748f6db0',
      url: 'https://doi.org/10.4337/9781845425678',
      name: 'defaultUrl',
      resource: {
        id: 'b353eb8f-89e3-4de6-b099-ecfee80be537'
      }
    }],
    coverage: [],
    titleInstance: tis.find(t => t.name === "\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\""),
    url: 'https://doi.org/10.4337/9781845425678',
    name: "Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catc...' on Platform 'Elgaronline'",
    suppressFromDiscovery: false,
    class: 'org.olf.kb.PlatformTitleInstance',
    longName: "'\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"' on Platform 'Elgaronline'"
  },
];

export const pcis = [
  {
    id: '1d7026ed-75f1-40d9-a167-632c6f3c5090',
    dateCreated: '2025-09-09T09:15:28Z',
    tags: [],
    lastUpdated: '2025-09-09T09:15:28Z',
    depth: 'Fulltext',
    coverage: [
      {
        id: '1e4d7f14-2ca6-42b7-8a17-4d32e6c9d793',
        startDate: '2005-01-01',
        startVolume: '1',
        startIssue: '1',
        summary: 'v1/i1/2005-01-01 - v*/i*/*'
      }
    ],
    pti: ptis.find(p => p.name === '\'International Journal of Managerial Finance\' on Platform \'Emerald Insight\''),
    pkg: pkgs.find(p => p.name === 'Accounting Finance and Economics eJournal collection'),
    addedTimestamp: 1757409327783,
    name: "'International Journal of Managerial Finance' on Platform 'Emerald Insight' in Package Accounting Finance and Economics eJournal collection",
    lastSeenTimestamp: 1757409327783,
    suppressFromDiscovery: false,
    longName: "'International Journal of Managerial Finance' on Platform 'Emerald Insight' in Package Accounting Finance and Economics eJournal collection",
    class: 'org.olf.kb.PackageContentItem'
  },
  {
    id: '292c4a7b-281b-47ef-bd86-51de7a133e4d',
    accessStart: '2008-01-01',
    dateCreated: '2021-09-06T02:02:53Z',
    tags: '[]',
    lastUpdated: '2021-09-06T02:03:17Z',
    depth: 'Fulltext',
    coverage: '[]',
    pti: ptis.find(p => p.name === "Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catc...' on Platform 'Elgaronline'"),
    pkg: pkgs.find(p => p.name === 'Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz'),
    addedTimestamp: 1630893772634,
    accessEnd: '2021-03-31',
    name: "'Institutions, industrial upgrading, and economic performance in Ja...' on Platform 'Elgaronline' in Package Edward Elgar:Edward Elgar E-Book Archive in Business & Management, ...",
    lastSeenTimestamp: 1630893772634,
    suppressFromDiscovery: false,
    longName: "'\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"' on Platform 'Elgaronline' in Package Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz",
    class: 'org.olf.kb.PackageContentItem'
  }
];
