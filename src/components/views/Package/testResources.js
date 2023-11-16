const data = {
  eresource: {
    id: '1010759a-e8ba-4b97-9e88-97db31e99909',
    description: 'This is a package description',
    dateCreated: '2021-11-17T02:49:32Z',
    lastUpdated: '2021-11-17T02:49:32Z',
    normalizedName: 'acm digtal library',
    vendor: {
      id: 'b41dfc53-5ad5-4b77-9cbf-42d31b5f7dac',
      name: 'Association for Computing Machinery',
      orgsUuid_object: {
        error: 400,
        message: 'Bad Request'
      }
    },
    source: 'GOKb',
    remoteKb: {
      id: 'b6450b01-ab5d-48c1-8278-0353955fe105',
      cursor: '2021-11-17T13:40:09Z',
      active: true,
      trustedSourceTI: false,
      activationEnabled: false,
      readonly: false,
      syncStatus: 'idle',
      lastCheck: 1637160468896,
      name: 'GOKb_TEST',
      type: 'org.olf.kb.adapters.GOKbOAIAdapter',
      fullPrefix: 'gokb',
      uri: 'https://gokbt.gbv.de/gokb/oai/index',
      supportsHarvesting: true,
      rectype: 1
    },
    name: 'ACM Digtal Library',
    suppressFromDiscovery: false,
    reference: 'ACM_Digtal_Library_2',
    resourceCount: 10650,
    class: 'org.olf.kb.Pkg'
  },
  entitlementOptions: [],
  entitlementOptionsCount: 0,
  entitlements: [],
  entitlementsCount: 0,
  packageContentsFilter: 'current',
  packageContents: [
    {
      id: '18ce23b7-754e-4002-a91f-9ea2bdb0062c',
      dateCreated: '2021-11-17T02:49:32Z',
      tags: [],
      lastUpdated: '2021-11-17T02:49:32Z',
      depth: 'Fulltext',
      coverage: [],
      pti: {
        id: 'a7ea4a17-40d1-4714-bb57-bf359d2db104',
        dateCreated: '2021-11-17T02:49:32Z',
        tags: [],
        lastUpdated: '2021-11-17T02:49:32Z',
        platform: {
          id: 'aefc84f4-551a-43cc-918e-feb3708e09bb',
          dateCreated: '2021-11-17T02:49:32Z',
          lastUpdated: '2021-11-17T02:49:32Z',
          name: 'ACM Digital Library',
          locators: [
            {
              id: 'f1a70aa8-61ce-40c2-b0ed-bf0faa754717',
              domainName: 'dl.acm.org'
            }
          ]
        },
        templatedUrls: [
          {
            id: '05a952da-0626-46ea-b9fc-042041551884',
            url: 'https://dl.acm.org/doi/book/10.1145/3423423',
            name: 'defaultUrl',
            resource: {
              id: 'a7ea4a17-40d1-4714-bb57-bf359d2db104'
            }
          }
        ],
        coverage: [],
        titleInstance: {
          id: '5f7829a9-63da-4ace-a570-84cede377260',
          subType: {
            id: '2c91809c7d2b9151017d2b982b05003a',
            value: 'electronic',
            label: 'Electronic'
          },
          dateCreated: '2021-11-17T02:49:32Z',
          tags: [],
          lastUpdated: '2021-11-17T02:49:32Z',
          normalizedName: '10th international conference on the internet of things companion',
          publicationType: {
            id: '2c91809c7d2b9151017d2b98627c0046',
            value: 'book',
            label: 'Book'
          },
          identifiers: [
            {
              title: {
                id: '5f7829a9-63da-4ace-a570-84cede377260'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-8820-7',
                ns: {
                  value: 'isbn'
                }
              }
            },
            {
              title: {
                id: '5f7829a9-63da-4ace-a570-84cede377260'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-8820-7',
                ns: {
                  value: 'isbn'
                }
              }
            }
          ],
          coverage: [],
          name: '10th International Conference on the Internet of Things Companion',
          type: {
            id: '2c91809c7d2b9151017d2b982b0c003c',
            value: 'monograph',
            label: 'Monograph'
          },
          suppressFromDiscovery: false,
          work: {
            id: 'aa5af6b0-7ef9-4efa-bc85-253b8e647980'
          },
          class: 'org.olf.kb.TitleInstance',
          longName: '10th International Conference on the Internet of Things Companion',
          relatedTitles: []
        },
        url: 'https://dl.acm.org/doi/book/10.1145/3423423',
        name: "'10th International Conference on the Internet of Things Companion' on Platform 'ACM Digital Library'",
        suppressFromDiscovery: false,
        class: 'org.olf.kb.PlatformTitleInstance',
        longName: "'10th International Conference on the Internet of Things Companion' on Platform 'ACM Digital Library'"
      },
      pkg: {
        id: '1010759a-e8ba-4b97-9e88-97db31e99909',
        dateCreated: '2021-11-17T02:49:32Z',
        lastUpdated: '2021-11-17T02:49:32Z',
        normalizedName: 'acm digtal library',
        vendor: {
          id: 'b41dfc53-5ad5-4b77-9cbf-42d31b5f7dac',
          name: 'Association for Computing Machinery',
          orgsUuid_object: {
            error: 400,
            message: 'Bad Request'
          }
        },
        source: 'GOKb',
        remoteKb: {
          id: 'b6450b01-ab5d-48c1-8278-0353955fe105',
          cursor: '2021-11-17T13:40:09Z',
          active: true,
          trustedSourceTI: false,
          activationEnabled: false,
          readonly: false,
          syncStatus: 'idle',
          lastCheck: 1637160468896,
          name: 'GOKb_TEST',
          type: 'org.olf.kb.adapters.GOKbOAIAdapter',
          fullPrefix: 'gokb',
          uri: 'https://gokbt.gbv.de/gokb/oai/index',
          supportsHarvesting: true,
          rectype: 1
        },
        name: 'ACM Digtal Library',
        suppressFromDiscovery: false,
        reference: 'ACM_Digtal_Library_2',
        resourceCount: 10650,
        class: 'org.olf.kb.Pkg'
      },
      addedTimestamp: 1637117372625,
      name: "'10th International Conference on the Internet of Things Companion' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      lastSeenTimestamp: 1637117372625,
      suppressFromDiscovery: false,
      longName: "'10th International Conference on the Internet of Things Companion' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      class: 'org.olf.kb.PackageContentItem'
    },
    {
      id: '745faaf1-73de-4af0-8e2f-05e12e74f562',
      dateCreated: '2021-11-17T02:49:32Z',
      tags: [],
      lastUpdated: '2021-11-17T02:49:32Z',
      depth: 'Fulltext',
      coverage: [],
      pti: {
        id: 'a21e00ee-5c76-49e6-b49e-bfe74a0395b5',
        dateCreated: '2021-11-17T02:49:32Z',
        tags: [],
        lastUpdated: '2021-11-17T02:49:32Z',
        platform: {
          id: 'aefc84f4-551a-43cc-918e-feb3708e09bb',
          dateCreated: '2021-11-17T02:49:32Z',
          lastUpdated: '2021-11-17T02:49:32Z',
          name: 'ACM Digital Library',
          locators: [
            {
              id: 'f1a70aa8-61ce-40c2-b0ed-bf0faa754717',
              domainName: 'dl.acm.org'
            }
          ]
        },
        templatedUrls: [
          {
            id: '6b7f348a-4472-4b3f-b8f6-532e8dc39524',
            url: 'https://dl.acm.org/doi/book/10.1145/3411408',
            name: 'defaultUrl',
            resource: {
              id: 'a21e00ee-5c76-49e6-b49e-bfe74a0395b5'
            }
          }
        ],
        coverage: [],
        titleInstance: {
          id: '6e9dc699-6724-4fa2-b82c-c73e4b2967d7',
          subType: {
            id: '2c91809c7d2b9151017d2b982b05003a',
            value: 'electronic',
            label: 'Electronic'
          },
          dateCreated: '2021-11-17T02:49:32Z',
          tags: [],
          lastUpdated: '2021-11-17T02:49:32Z',
          normalizedName: '11th hellenic conference on artificial intelligence',
          publicationType: {
            id: '2c91809c7d2b9151017d2b98627c0046',
            value: 'book',
            label: 'Book'
          },
          identifiers: [
            {
              title: {
                id: '6e9dc699-6724-4fa2-b82c-c73e4b2967d7'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-8878-8',
                ns: {
                  value: 'isbn'
                }
              }
            },
            {
              title: {
                id: '6e9dc699-6724-4fa2-b82c-c73e4b2967d7'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-8878-8',
                ns: {
                  value: 'isbn'
                }
              }
            }
          ],
          coverage: [],
          name: '11th Hellenic Conference on Artificial Intelligence',
          type: {
            id: '2c91809c7d2b9151017d2b982b0c003c',
            value: 'monograph',
            label: 'Monograph'
          },
          suppressFromDiscovery: false,
          work: {
            id: '0127e829-2de4-4ec6-9bf2-15fc8bf7e309'
          },
          class: 'org.olf.kb.TitleInstance',
          longName: '11th Hellenic Conference on Artificial Intelligence',
          relatedTitles: []
        },
        url: 'https://dl.acm.org/doi/book/10.1145/3411408',
        name: "'11th Hellenic Conference on Artificial Intelligence' on Platform 'ACM Digital Library'",
        suppressFromDiscovery: false,
        class: 'org.olf.kb.PlatformTitleInstance',
        longName: "'11th Hellenic Conference on Artificial Intelligence' on Platform 'ACM Digital Library'"
      },
      pkg: {
        id: '1010759a-e8ba-4b97-9e88-97db31e99909',
        dateCreated: '2021-11-17T02:49:32Z',
        lastUpdated: '2021-11-17T02:49:32Z',
        normalizedName: 'acm digtal library',
        vendor: {
          id: 'b41dfc53-5ad5-4b77-9cbf-42d31b5f7dac',
          name: 'Association for Computing Machinery',
          orgsUuid_object: {
            error: 400,
            message: 'Bad Request'
          }
        },
        source: 'GOKb',
        remoteKb: {
          id: 'b6450b01-ab5d-48c1-8278-0353955fe105',
          cursor: '2021-11-17T13:40:09Z',
          active: true,
          trustedSourceTI: false,
          activationEnabled: false,
          readonly: false,
          syncStatus: 'idle',
          lastCheck: 1637160468896,
          name: 'GOKb_TEST',
          type: 'org.olf.kb.adapters.GOKbOAIAdapter',
          fullPrefix: 'gokb',
          uri: 'https://gokbt.gbv.de/gokb/oai/index',
          supportsHarvesting: true,
          rectype: 1
        },
        name: 'ACM Digtal Library',
        suppressFromDiscovery: false,
        reference: 'ACM_Digtal_Library_2',
        resourceCount: 10650,
        class: 'org.olf.kb.Pkg'
      },
      addedTimestamp: 1637117372625,
      name: "'11th Hellenic Conference on Artificial Intelligence' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      lastSeenTimestamp: 1637117372625,
      suppressFromDiscovery: false,
      longName: "'11th Hellenic Conference on Artificial Intelligence' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      class: 'org.olf.kb.PackageContentItem'
    },
    {
      id: '8999daa1-1c23-4b7d-9274-7e4616a4f885',
      dateCreated: '2021-11-17T02:49:32Z',
      tags: [],
      lastUpdated: '2021-11-17T02:49:32Z',
      depth: 'Fulltext',
      coverage: [],
      pti: {
        id: '1a4dedf0-d821-4c00-b2b9-9e687ac5526c',
        dateCreated: '2021-11-17T02:49:32Z',
        tags: [],
        lastUpdated: '2021-11-17T02:49:32Z',
        platform: {
          id: 'aefc84f4-551a-43cc-918e-feb3708e09bb',
          dateCreated: '2021-11-17T02:49:32Z',
          lastUpdated: '2021-11-17T02:49:32Z',
          name: 'ACM Digital Library',
          locators: [
            {
              id: 'f1a70aa8-61ce-40c2-b0ed-bf0faa754717',
              domainName: 'dl.acm.org'
            }
          ]
        },
        templatedUrls: [
          {
            id: '85f897e3-e5e3-47dc-ab7f-fe3bfbe90286',
            url: 'https://dl.acm.org/doi/book/10.1145/3394231',
            name: 'defaultUrl',
            resource: {
              id: '1a4dedf0-d821-4c00-b2b9-9e687ac5526c'
            }
          }
        ],
        coverage: [],
        titleInstance: {
          id: '215c862f-8814-4d12-8e22-52df50d21c14',
          subType: {
            id: '2c91809c7d2b9151017d2b982b05003a',
            value: 'electronic',
            label: 'Electronic'
          },
          dateCreated: '2021-11-17T02:49:32Z',
          tags: [],
          lastUpdated: '2021-11-17T02:49:32Z',
          normalizedName: '12th acm conference on web science',
          publicationType: {
            id: '2c91809c7d2b9151017d2b98627c0046',
            value: 'book',
            label: 'Book'
          },
          identifiers: [
            {
              title: {
                id: '215c862f-8814-4d12-8e22-52df50d21c14'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-7989-2',
                ns: {
                  value: 'isbn'
                }
              }
            },
            {
              title: {
                id: '215c862f-8814-4d12-8e22-52df50d21c14'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-7989-2',
                ns: {
                  value: 'isbn'
                }
              }
            }
          ],
          coverage: [],
          name: '12th ACM Conference on Web Science',
          type: {
            id: '2c91809c7d2b9151017d2b982b0c003c',
            value: 'monograph',
            label: 'Monograph'
          },
          suppressFromDiscovery: false,
          work: {
            id: 'd2f9768d-6747-441c-829c-253000cb4ffc'
          },
          class: 'org.olf.kb.TitleInstance',
          longName: '12th ACM Conference on Web Science',
          relatedTitles: []
        },
        url: 'https://dl.acm.org/doi/book/10.1145/3394231',
        name: "'12th ACM Conference on Web Science' on Platform 'ACM Digital Library'",
        suppressFromDiscovery: false,
        class: 'org.olf.kb.PlatformTitleInstance',
        longName: "'12th ACM Conference on Web Science' on Platform 'ACM Digital Library'"
      },
      pkg: {
        id: '1010759a-e8ba-4b97-9e88-97db31e99909',
        dateCreated: '2021-11-17T02:49:32Z',
        lastUpdated: '2021-11-17T02:49:32Z',
        normalizedName: 'acm digtal library',
        vendor: {
          id: 'b41dfc53-5ad5-4b77-9cbf-42d31b5f7dac',
          name: 'Association for Computing Machinery',
          orgsUuid_object: {
            error: 400,
            message: 'Bad Request'
          }
        },
        source: 'GOKb',
        remoteKb: {
          id: 'b6450b01-ab5d-48c1-8278-0353955fe105',
          cursor: '2021-11-17T13:40:09Z',
          active: true,
          trustedSourceTI: false,
          activationEnabled: false,
          readonly: false,
          syncStatus: 'idle',
          lastCheck: 1637160468896,
          name: 'GOKb_TEST',
          type: 'org.olf.kb.adapters.GOKbOAIAdapter',
          fullPrefix: 'gokb',
          uri: 'https://gokbt.gbv.de/gokb/oai/index',
          supportsHarvesting: true,
          rectype: 1
        },
        name: 'ACM Digtal Library',
        suppressFromDiscovery: false,
        reference: 'ACM_Digtal_Library_2',
        resourceCount: 10650,
        class: 'org.olf.kb.Pkg'
      },
      addedTimestamp: 1637117372625,
      name: "'12th ACM Conference on Web Science' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      lastSeenTimestamp: 1637117372625,
      suppressFromDiscovery: false,
      longName: "'12th ACM Conference on Web Science' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      class: 'org.olf.kb.PackageContentItem'
    },
    {
      id: '63bf1d4f-5cb7-4271-acb6-00ade94c6112',
      dateCreated: '2021-11-17T02:49:32Z',
      tags: [],
      lastUpdated: '2021-11-17T02:49:32Z',
      depth: 'Fulltext',
      coverage: [],
      pti: {
        id: 'ff563dcd-54b0-4ed5-81f6-22264901383f',
        dateCreated: '2021-11-17T02:49:32Z',
        tags: [],
        lastUpdated: '2021-11-17T02:49:32Z',
        platform: {
          id: 'aefc84f4-551a-43cc-918e-feb3708e09bb',
          dateCreated: '2021-11-17T02:49:32Z',
          lastUpdated: '2021-11-17T02:49:32Z',
          name: 'ACM Digital Library',
          locators: [
            {
              id: 'f1a70aa8-61ce-40c2-b0ed-bf0faa754717',
              domainName: 'dl.acm.org'
            }
          ]
        },
        templatedUrls: [
          {
            id: '404ab65c-718b-48ae-a059-3fbb3b306a90',
            url: 'https://dl.acm.org/doi/book/10.1145/3394332',
            name: 'defaultUrl',
            resource: {
              id: 'ff563dcd-54b0-4ed5-81f6-22264901383f'
            }
          }
        ],
        coverage: [],
        titleInstance: {
          id: '1bde8779-2883-460f-9c94-e29f8a800551',
          subType: {
            id: '2c91809c7d2b9151017d2b982b05003a',
            value: 'electronic',
            label: 'Electronic'
          },
          dateCreated: '2021-11-17T02:49:32Z',
          tags: [],
          lastUpdated: '2021-11-17T02:49:32Z',
          normalizedName: '12th acm conference on web science companion',
          publicationType: {
            id: '2c91809c7d2b9151017d2b98627c0046',
            value: 'book',
            label: 'Book'
          },
          identifiers: [
            {
              title: {
                id: '1bde8779-2883-460f-9c94-e29f8a800551'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-7994-6',
                ns: {
                  value: 'isbn'
                }
              }
            },
            {
              title: {
                id: '1bde8779-2883-460f-9c94-e29f8a800551'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-7994-6',
                ns: {
                  value: 'isbn'
                }
              }
            }
          ],
          coverage: [],
          name: '12th ACM Conference on Web Science Companion',
          type: {
            id: '2c91809c7d2b9151017d2b982b0c003c',
            value: 'monograph',
            label: 'Monograph'
          },
          suppressFromDiscovery: false,
          work: {
            id: '560d750f-a99a-49cc-80e4-14f331952ed8'
          },
          class: 'org.olf.kb.TitleInstance',
          longName: '12th ACM Conference on Web Science Companion',
          relatedTitles: []
        },
        url: 'https://dl.acm.org/doi/book/10.1145/3394332',
        name: "'12th ACM Conference on Web Science Companion' on Platform 'ACM Digital Library'",
        suppressFromDiscovery: false,
        class: 'org.olf.kb.PlatformTitleInstance',
        longName: "'12th ACM Conference on Web Science Companion' on Platform 'ACM Digital Library'"
      },
      pkg: {
        id: '1010759a-e8ba-4b97-9e88-97db31e99909',
        dateCreated: '2021-11-17T02:49:32Z',
        lastUpdated: '2021-11-17T02:49:32Z',
        normalizedName: 'acm digtal library',
        vendor: {
          id: 'b41dfc53-5ad5-4b77-9cbf-42d31b5f7dac',
          name: 'Association for Computing Machinery',
          orgsUuid_object: {
            error: 400,
            message: 'Bad Request'
          }
        },
        source: 'GOKb',
        remoteKb: {
          id: 'b6450b01-ab5d-48c1-8278-0353955fe105',
          cursor: '2021-11-17T13:40:09Z',
          active: true,
          trustedSourceTI: false,
          activationEnabled: false,
          readonly: false,
          syncStatus: 'idle',
          lastCheck: 1637160468896,
          name: 'GOKb_TEST',
          type: 'org.olf.kb.adapters.GOKbOAIAdapter',
          fullPrefix: 'gokb',
          uri: 'https://gokbt.gbv.de/gokb/oai/index',
          supportsHarvesting: true,
          rectype: 1
        },
        name: 'ACM Digtal Library',
        suppressFromDiscovery: false,
        reference: 'ACM_Digtal_Library_2',
        resourceCount: 10650,
        class: 'org.olf.kb.Pkg'
      },
      addedTimestamp: 1637117372625,
      name: "'12th ACM Conference on Web Science Companion' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      lastSeenTimestamp: 1637117372625,
      suppressFromDiscovery: false,
      longName: "'12th ACM Conference on Web Science Companion' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      class: 'org.olf.kb.PackageContentItem'
    },
    {
      id: 'c7e9c23d-0c82-46a3-96e9-02f163aeb004',
      dateCreated: '2021-11-17T02:49:33Z',
      tags: [],
      lastUpdated: '2021-11-17T02:49:33Z',
      depth: 'Fulltext',
      coverage: [],
      pti: {
        id: 'e98d0eb8-6af7-496a-ad03-1faef9de5bd4',
        dateCreated: '2021-11-17T02:49:33Z',
        tags: [],
        lastUpdated: '2021-11-17T02:49:33Z',
        platform: {
          id: 'aefc84f4-551a-43cc-918e-feb3708e09bb',
          dateCreated: '2021-11-17T02:49:32Z',
          lastUpdated: '2021-11-17T02:49:32Z',
          name: 'ACM Digital Library',
          locators: [
            {
              id: 'f1a70aa8-61ce-40c2-b0ed-bf0faa754717',
              domainName: 'dl.acm.org'
            }
          ]
        },
        templatedUrls: [
          {
            id: '53fe6d8d-5925-494a-be6b-709aa04af146',
            url: 'https://dl.acm.org/doi/book/10.1145/3457913',
            name: 'defaultUrl',
            resource: {
              id: 'e98d0eb8-6af7-496a-ad03-1faef9de5bd4'
            }
          }
        ],
        coverage: [],
        titleInstance: {
          id: '268473fb-7318-4b1b-a7c1-e2418bac97f2',
          subType: {
            id: '2c91809c7d2b9151017d2b982b05003a',
            value: 'electronic',
            label: 'Electronic'
          },
          dateCreated: '2021-11-17T02:49:33Z',
          tags: [],
          lastUpdated: '2021-11-17T02:49:33Z',
          normalizedName: '12th asia-pacific symposium on internetware',
          publicationType: {
            id: '2c91809c7d2b9151017d2b98627c0046',
            value: 'book',
            label: 'Book'
          },
          identifiers: [
            {
              title: {
                id: '268473fb-7318-4b1b-a7c1-e2418bac97f2'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-8819-1',
                ns: {
                  value: 'isbn'
                }
              }
            },
            {
              title: {
                id: '268473fb-7318-4b1b-a7c1-e2418bac97f2'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-8819-1',
                ns: {
                  value: 'isbn'
                }
              }
            }
          ],
          coverage: [],
          name: '12th Asia-Pacific Symposium on Internetware',
          type: {
            id: '2c91809c7d2b9151017d2b982b0c003c',
            value: 'monograph',
            label: 'Monograph'
          },
          suppressFromDiscovery: false,
          work: {
            id: 'a9251097-38f7-4e96-9d05-57f5f27706ba'
          },
          class: 'org.olf.kb.TitleInstance',
          longName: '12th Asia-Pacific Symposium on Internetware',
          relatedTitles: []
        },
        url: 'https://dl.acm.org/doi/book/10.1145/3457913',
        name: "'12th Asia-Pacific Symposium on Internetware' on Platform 'ACM Digital Library'",
        suppressFromDiscovery: false,
        class: 'org.olf.kb.PlatformTitleInstance',
        longName: "'12th Asia-Pacific Symposium on Internetware' on Platform 'ACM Digital Library'"
      },
      pkg: {
        id: '1010759a-e8ba-4b97-9e88-97db31e99909',
        dateCreated: '2021-11-17T02:49:32Z',
        lastUpdated: '2021-11-17T02:49:32Z',
        normalizedName: 'acm digtal library',
        vendor: {
          id: 'b41dfc53-5ad5-4b77-9cbf-42d31b5f7dac',
          name: 'Association for Computing Machinery',
          orgsUuid_object: {
            error: 400,
            message: 'Bad Request'
          }
        },
        source: 'GOKb',
        remoteKb: {
          id: 'b6450b01-ab5d-48c1-8278-0353955fe105',
          cursor: '2021-11-17T13:40:09Z',
          active: true,
          trustedSourceTI: false,
          activationEnabled: false,
          readonly: false,
          syncStatus: 'idle',
          lastCheck: 1637160468896,
          name: 'GOKb_TEST',
          type: 'org.olf.kb.adapters.GOKbOAIAdapter',
          fullPrefix: 'gokb',
          uri: 'https://gokbt.gbv.de/gokb/oai/index',
          supportsHarvesting: true,
          rectype: 1
        },
        name: 'ACM Digtal Library',
        suppressFromDiscovery: false,
        reference: 'ACM_Digtal_Library_2',
        resourceCount: 10650,
        class: 'org.olf.kb.Pkg'
      },
      addedTimestamp: 1637117372625,
      name: "'12th Asia-Pacific Symposium on Internetware' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      lastSeenTimestamp: 1637117372625,
      suppressFromDiscovery: false,
      longName: "'12th Asia-Pacific Symposium on Internetware' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      class: 'org.olf.kb.PackageContentItem'
    },
    {
      id: '7fb74ede-04b0-425f-9e79-7eb26ebb12a0',
      dateCreated: '2021-11-17T02:49:33Z',
      tags: [],
      lastUpdated: '2021-11-17T02:49:33Z',
      depth: 'Fulltext',
      coverage: [],
      pti: {
        id: 'c3436b8f-b131-4bc7-85ba-6839eee90afd',
        dateCreated: '2021-11-17T02:49:33Z',
        tags: [],
        lastUpdated: '2021-11-17T02:49:33Z',
        platform: {
          id: 'aefc84f4-551a-43cc-918e-feb3708e09bb',
          dateCreated: '2021-11-17T02:49:32Z',
          lastUpdated: '2021-11-17T02:49:32Z',
          name: 'ACM Digital Library',
          locators: [
            {
              id: 'f1a70aa8-61ce-40c2-b0ed-bf0faa754717',
              domainName: 'dl.acm.org'
            }
          ]
        },
        templatedUrls: [
          {
            id: '0bceef53-05a0-4e4d-9657-306a7939069e',
            url: 'https://dl.acm.org/doi/book/10.1145/3460881',
            name: 'defaultUrl',
            resource: {
              id: 'c3436b8f-b131-4bc7-85ba-6839eee90afd'
            }
          }
        ],
        coverage: [],
        titleInstance: {
          id: '01494f98-c86f-48da-ab34-fb6f75299963',
          subType: {
            id: '2c91809c7d2b9151017d2b982b05003a',
            value: 'electronic',
            label: 'Electronic'
          },
          dateCreated: '2021-11-17T02:49:33Z',
          tags: [],
          lastUpdated: '2021-11-17T02:49:33Z',
          normalizedName: '12th augmented human international conference',
          publicationType: {
            id: '2c91809c7d2b9151017d2b98627c0046',
            value: 'book',
            label: 'Book'
          },
          identifiers: [
            {
              title: {
                id: '01494f98-c86f-48da-ab34-fb6f75299963'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-9030-9',
                ns: {
                  value: 'isbn'
                }
              }
            },
            {
              title: {
                id: '01494f98-c86f-48da-ab34-fb6f75299963'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-9030-9',
                ns: {
                  value: 'isbn'
                }
              }
            }
          ],
          coverage: [],
          name: '12th Augmented Human International Conference',
          type: {
            id: '2c91809c7d2b9151017d2b982b0c003c',
            value: 'monograph',
            label: 'Monograph'
          },
          suppressFromDiscovery: false,
          work: {
            id: 'f80a4967-414f-42c8-9c84-12163f535fc6'
          },
          class: 'org.olf.kb.TitleInstance',
          longName: '12th Augmented Human International Conference',
          relatedTitles: []
        },
        url: 'https://dl.acm.org/doi/book/10.1145/3460881',
        name: "'12th Augmented Human International Conference' on Platform 'ACM Digital Library'",
        suppressFromDiscovery: false,
        class: 'org.olf.kb.PlatformTitleInstance',
        longName: "'12th Augmented Human International Conference' on Platform 'ACM Digital Library'"
      },
      pkg: {
        id: '1010759a-e8ba-4b97-9e88-97db31e99909',
        dateCreated: '2021-11-17T02:49:32Z',
        lastUpdated: '2021-11-17T02:49:32Z',
        normalizedName: 'acm digtal library',
        vendor: {
          id: 'b41dfc53-5ad5-4b77-9cbf-42d31b5f7dac',
          name: 'Association for Computing Machinery',
          orgsUuid_object: {
            error: 400,
            message: 'Bad Request'
          }
        },
        source: 'GOKb',
        remoteKb: {
          id: 'b6450b01-ab5d-48c1-8278-0353955fe105',
          cursor: '2021-11-17T13:40:09Z',
          active: true,
          trustedSourceTI: false,
          activationEnabled: false,
          readonly: false,
          syncStatus: 'idle',
          lastCheck: 1637160468896,
          name: 'GOKb_TEST',
          type: 'org.olf.kb.adapters.GOKbOAIAdapter',
          fullPrefix: 'gokb',
          uri: 'https://gokbt.gbv.de/gokb/oai/index',
          supportsHarvesting: true,
          rectype: 1
        },
        name: 'ACM Digtal Library',
        suppressFromDiscovery: false,
        reference: 'ACM_Digtal_Library_2',
        resourceCount: 10650,
        class: 'org.olf.kb.Pkg'
      },
      addedTimestamp: 1637117372625,
      name: "'12th Augmented Human International Conference' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      lastSeenTimestamp: 1637117372625,
      suppressFromDiscovery: false,
      longName: "'12th Augmented Human International Conference' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      class: 'org.olf.kb.PackageContentItem'
    },
    {
      id: '219e0c2a-6227-411e-90f6-7897994d921f',
      dateCreated: '2021-11-17T02:49:33Z',
      tags: [],
      lastUpdated: '2021-11-17T02:49:33Z',
      depth: 'Fulltext',
      coverage: [],
      pti: {
        id: '7d2c9a89-55b3-423f-9c98-998e91aecb87',
        dateCreated: '2021-11-17T02:49:33Z',
        tags: [],
        lastUpdated: '2021-11-17T02:49:33Z',
        platform: {
          id: 'aefc84f4-551a-43cc-918e-feb3708e09bb',
          dateCreated: '2021-11-17T02:49:32Z',
          lastUpdated: '2021-11-17T02:49:32Z',
          name: 'ACM Digital Library',
          locators: [
            {
              id: 'f1a70aa8-61ce-40c2-b0ed-bf0faa754717',
              domainName: 'dl.acm.org'
            }
          ]
        },
        templatedUrls: [
          {
            id: '0beaec2a-875a-42d8-9fcc-2703fc0960e0',
            url: 'https://dl.acm.org/doi/book/10.1145/3409251',
            name: 'defaultUrl',
            resource: {
              id: '7d2c9a89-55b3-423f-9c98-998e91aecb87'
            }
          }
        ],
        coverage: [],
        titleInstance: {
          id: 'c219a284-5bd5-4785-9768-48084467dcd9',
          subType: {
            id: '2c91809c7d2b9151017d2b982b05003a',
            value: 'electronic',
            label: 'Electronic'
          },
          dateCreated: '2021-11-17T02:49:33Z',
          tags: [],
          lastUpdated: '2021-11-17T02:49:33Z',
          normalizedName: '12th international conference on automotive user interfaces and interactive vehicular applications',
          publicationType: {
            id: '2c91809c7d2b9151017d2b98627c0046',
            value: 'book',
            label: 'Book'
          },
          identifiers: [
            {
              title: {
                id: 'c219a284-5bd5-4785-9768-48084467dcd9'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-8066-9',
                ns: {
                  value: 'isbn'
                }
              }
            },
            {
              title: {
                id: 'c219a284-5bd5-4785-9768-48084467dcd9'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-8066-9',
                ns: {
                  value: 'isbn'
                }
              }
            }
          ],
          coverage: [],
          name: '12th International Conference on Automotive User Interfaces and Interactive Vehicular Applications',
          type: {
            id: '2c91809c7d2b9151017d2b982b0c003c',
            value: 'monograph',
            label: 'Monograph'
          },
          suppressFromDiscovery: false,
          work: {
            id: '46aca3d8-47cc-42dc-9378-b621415370a5'
          },
          class: 'org.olf.kb.TitleInstance',
          longName: '12th International Conference on Automotive User Interfaces and Interactive Vehicular Applications',
          relatedTitles: []
        },
        url: 'https://dl.acm.org/doi/book/10.1145/3409251',
        name: "'12th International Conference on Automotive User Interfaces and Interactive Vehicular Applications' on Platform 'ACM Digital Library'",
        suppressFromDiscovery: false,
        class: 'org.olf.kb.PlatformTitleInstance',
        longName: "'12th International Conference on Automotive User Interfaces and Interactive Vehicular Applications' on Platform 'ACM Digital Library'"
      },
      pkg: {
        id: '1010759a-e8ba-4b97-9e88-97db31e99909',
        dateCreated: '2021-11-17T02:49:32Z',
        lastUpdated: '2021-11-17T02:49:32Z',
        normalizedName: 'acm digtal library',
        vendor: {
          id: 'b41dfc53-5ad5-4b77-9cbf-42d31b5f7dac',
          name: 'Association for Computing Machinery',
          orgsUuid_object: {
            error: 400,
            message: 'Bad Request'
          }
        },
        source: 'GOKb',
        remoteKb: {
          id: 'b6450b01-ab5d-48c1-8278-0353955fe105',
          cursor: '2021-11-17T13:40:09Z',
          active: true,
          trustedSourceTI: false,
          activationEnabled: false,
          readonly: false,
          syncStatus: 'idle',
          lastCheck: 1637160468896,
          name: 'GOKb_TEST',
          type: 'org.olf.kb.adapters.GOKbOAIAdapter',
          fullPrefix: 'gokb',
          uri: 'https://gokbt.gbv.de/gokb/oai/index',
          supportsHarvesting: true,
          rectype: 1
        },
        name: 'ACM Digtal Library',
        suppressFromDiscovery: false,
        reference: 'ACM_Digtal_Library_2',
        resourceCount: 10650,
        class: 'org.olf.kb.Pkg'
      },
      addedTimestamp: 1637117372625,
      name: "'12th International Conference on Automotive User Interfaces and Int...' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      lastSeenTimestamp: 1637117372625,
      suppressFromDiscovery: false,
      longName: "'12th International Conference on Automotive User Interfaces and Interactive Vehicular Applications' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      class: 'org.olf.kb.PackageContentItem'
    },
    {
      id: 'b30aec4b-f380-43d6-8854-356934f982a9',
      dateCreated: '2021-11-17T02:49:33Z',
      tags: [],
      lastUpdated: '2021-11-17T02:49:33Z',
      depth: 'Fulltext',
      coverage: [],
      pti: {
        id: '5047481c-74f7-4989-a239-267b97cdd9e9',
        dateCreated: '2021-11-17T02:49:33Z',
        tags: [],
        lastUpdated: '2021-11-17T02:49:33Z',
        platform: {
          id: 'aefc84f4-551a-43cc-918e-feb3708e09bb',
          dateCreated: '2021-11-17T02:49:32Z',
          lastUpdated: '2021-11-17T02:49:32Z',
          name: 'ACM Digital Library',
          locators: [
            {
              id: 'f1a70aa8-61ce-40c2-b0ed-bf0faa754717',
              domainName: 'dl.acm.org'
            }
          ]
        },
        templatedUrls: [
          {
            id: 'ece03057-763c-4466-92fd-784d6b128926',
            url: 'https://dl.acm.org/doi/book/10.1145/3409120',
            name: 'defaultUrl',
            resource: {
              id: '5047481c-74f7-4989-a239-267b97cdd9e9'
            }
          }
        ],
        coverage: [],
        titleInstance: {
          id: '236371c5-4327-4236-bba7-631628e8c26b',
          subType: {
            id: '2c91809c7d2b9151017d2b982b05003a',
            value: 'electronic',
            label: 'Electronic'
          },
          dateCreated: '2021-11-17T02:49:33Z',
          tags: [],
          lastUpdated: '2021-11-17T02:49:33Z',
          normalizedName: '12th international conference on automotive user interfaces and interactive vehicular applications',
          publicationType: {
            id: '2c91809c7d2b9151017d2b98627c0046',
            value: 'book',
            label: 'Book'
          },
          identifiers: [
            {
              title: {
                id: '236371c5-4327-4236-bba7-631628e8c26b'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-8065-2',
                ns: {
                  value: 'isbn'
                }
              }
            },
            {
              title: {
                id: '236371c5-4327-4236-bba7-631628e8c26b'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-8065-2',
                ns: {
                  value: 'isbn'
                }
              }
            }
          ],
          coverage: [],
          name: '12th International Conference on Automotive User Interfaces and Interactive Vehicular Applications',
          type: {
            id: '2c91809c7d2b9151017d2b982b0c003c',
            value: 'monograph',
            label: 'Monograph'
          },
          suppressFromDiscovery: false,
          work: {
            id: '24c0618d-9a55-4b86-b64c-ff8139914bab'
          },
          class: 'org.olf.kb.TitleInstance',
          longName: '12th International Conference on Automotive User Interfaces and Interactive Vehicular Applications',
          relatedTitles: []
        },
        url: 'https://dl.acm.org/doi/book/10.1145/3409120',
        name: "'12th International Conference on Automotive User Interfaces and Interactive Vehicular Applications' on Platform 'ACM Digital Library'",
        suppressFromDiscovery: false,
        class: 'org.olf.kb.PlatformTitleInstance',
        longName: "'12th International Conference on Automotive User Interfaces and Interactive Vehicular Applications' on Platform 'ACM Digital Library'"
      },
      pkg: {
        id: '1010759a-e8ba-4b97-9e88-97db31e99909',
        dateCreated: '2021-11-17T02:49:32Z',
        lastUpdated: '2021-11-17T02:49:32Z',
        normalizedName: 'acm digtal library',
        vendor: {
          id: 'b41dfc53-5ad5-4b77-9cbf-42d31b5f7dac',
          name: 'Association for Computing Machinery',
          orgsUuid_object: {
            error: 400,
            message: 'Bad Request'
          }
        },
        source: 'GOKb',
        remoteKb: {
          id: 'b6450b01-ab5d-48c1-8278-0353955fe105',
          cursor: '2021-11-17T13:40:09Z',
          active: true,
          trustedSourceTI: false,
          activationEnabled: false,
          readonly: false,
          syncStatus: 'idle',
          lastCheck: 1637160468896,
          name: 'GOKb_TEST',
          type: 'org.olf.kb.adapters.GOKbOAIAdapter',
          fullPrefix: 'gokb',
          uri: 'https://gokbt.gbv.de/gokb/oai/index',
          supportsHarvesting: true,
          rectype: 1
        },
        name: 'ACM Digtal Library',
        suppressFromDiscovery: false,
        reference: 'ACM_Digtal_Library_2',
        resourceCount: 10650,
        class: 'org.olf.kb.Pkg'
      },
      addedTimestamp: 1637117372625,
      name: "'12th International Conference on Automotive User Interfaces and Int...' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      lastSeenTimestamp: 1637117372625,
      suppressFromDiscovery: false,
      longName: "'12th International Conference on Automotive User Interfaces and Interactive Vehicular Applications' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      class: 'org.olf.kb.PackageContentItem'
    },
    {
      id: '2d6b8b0a-3cb2-49ae-b71d-fe2e0e723924',
      dateCreated: '2021-11-17T02:49:33Z',
      tags: [],
      lastUpdated: '2021-11-17T02:49:33Z',
      depth: 'Fulltext',
      coverage: [],
      pti: {
        id: '7e245705-ab63-46d4-94c9-ce63b668d572',
        dateCreated: '2021-11-17T02:49:33Z',
        tags: [],
        lastUpdated: '2021-11-17T02:49:33Z',
        platform: {
          id: 'aefc84f4-551a-43cc-918e-feb3708e09bb',
          dateCreated: '2021-11-17T02:49:32Z',
          lastUpdated: '2021-11-17T02:49:32Z',
          name: 'ACM Digital Library',
          locators: [
            {
              id: 'f1a70aa8-61ce-40c2-b0ed-bf0faa754717',
              domainName: 'dl.acm.org'
            }
          ]
        },
        templatedUrls: [
          {
            id: '9415c48f-a71d-4700-8f5d-0522ce4cbfed',
            url: 'https://dl.acm.org/doi/book/10.1145/3462741',
            name: 'defaultUrl',
            resource: {
              id: '7e245705-ab63-46d4-94c9-ce63b668d572'
            }
          }
        ],
        coverage: [],
        titleInstance: {
          id: 'ce8b00af-375c-4818-b1fe-8e750eaecbf8',
          subType: {
            id: '2c91809c7d2b9151017d2b982b05003a',
            value: 'electronic',
            label: 'Electronic'
          },
          dateCreated: '2021-11-17T02:49:33Z',
          tags: [],
          lastUpdated: '2021-11-17T02:49:33Z',
          normalizedName: '13th acm web science conference 2021',
          publicationType: {
            id: '2c91809c7d2b9151017d2b98627c0046',
            value: 'book',
            label: 'Book'
          },
          identifiers: [
            {
              title: {
                id: 'ce8b00af-375c-4818-b1fe-8e750eaecbf8'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-8525-1',
                ns: {
                  value: 'isbn'
                }
              }
            },
            {
              title: {
                id: 'ce8b00af-375c-4818-b1fe-8e750eaecbf8'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-8525-1',
                ns: {
                  value: 'isbn'
                }
              }
            }
          ],
          coverage: [],
          name: '13th ACM Web Science Conference 2021',
          type: {
            id: '2c91809c7d2b9151017d2b982b0c003c',
            value: 'monograph',
            label: 'Monograph'
          },
          suppressFromDiscovery: false,
          work: {
            id: 'ad8be3ac-3ede-46f4-8197-5dcbbdb5fe95'
          },
          class: 'org.olf.kb.TitleInstance',
          longName: '13th ACM Web Science Conference 2021',
          relatedTitles: []
        },
        url: 'https://dl.acm.org/doi/book/10.1145/3462741',
        name: "'13th ACM Web Science Conference 2021' on Platform 'ACM Digital Library'",
        suppressFromDiscovery: false,
        class: 'org.olf.kb.PlatformTitleInstance',
        longName: "'13th ACM Web Science Conference 2021' on Platform 'ACM Digital Library'"
      },
      pkg: {
        id: '1010759a-e8ba-4b97-9e88-97db31e99909',
        dateCreated: '2021-11-17T02:49:32Z',
        lastUpdated: '2021-11-17T02:49:32Z',
        normalizedName: 'acm digtal library',
        vendor: {
          id: 'b41dfc53-5ad5-4b77-9cbf-42d31b5f7dac',
          name: 'Association for Computing Machinery',
          orgsUuid_object: {
            error: 400,
            message: 'Bad Request'
          }
        },
        source: 'GOKb',
        remoteKb: {
          id: 'b6450b01-ab5d-48c1-8278-0353955fe105',
          cursor: '2021-11-17T13:40:09Z',
          active: true,
          trustedSourceTI: false,
          activationEnabled: false,
          readonly: false,
          syncStatus: 'idle',
          lastCheck: 1637160468896,
          name: 'GOKb_TEST',
          type: 'org.olf.kb.adapters.GOKbOAIAdapter',
          fullPrefix: 'gokb',
          uri: 'https://gokbt.gbv.de/gokb/oai/index',
          supportsHarvesting: true,
          rectype: 1
        },
        name: 'ACM Digtal Library',
        suppressFromDiscovery: false,
        reference: 'ACM_Digtal_Library_2',
        resourceCount: 10650,
        class: 'org.olf.kb.Pkg'
      },
      addedTimestamp: 1637117372625,
      name: "'13th ACM Web Science Conference 2021' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      lastSeenTimestamp: 1637117372625,
      suppressFromDiscovery: false,
      longName: "'13th ACM Web Science Conference 2021' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      class: 'org.olf.kb.PackageContentItem'
    },
    {
      id: '348d10f2-50e8-47de-859c-5b8fce76905c',
      dateCreated: '2021-11-17T02:49:33Z',
      tags: [],
      lastUpdated: '2021-11-17T02:49:33Z',
      depth: 'Fulltext',
      coverage: [],
      pti: {
        id: '54fb6f3d-a138-4d13-accd-c88fca862e54',
        dateCreated: '2021-11-17T02:49:33Z',
        tags: [],
        lastUpdated: '2021-11-17T02:49:33Z',
        platform: {
          id: 'aefc84f4-551a-43cc-918e-feb3708e09bb',
          dateCreated: '2021-11-17T02:49:32Z',
          lastUpdated: '2021-11-17T02:49:32Z',
          name: 'ACM Digital Library',
          locators: [
            {
              id: 'f1a70aa8-61ce-40c2-b0ed-bf0faa754717',
              domainName: 'dl.acm.org'
            }
          ]
        },
        templatedUrls: [
          {
            id: 'fb509b73-201a-412c-acf3-0be6dc063a8d',
            url: 'https://dl.acm.org/doi/book/10.1145/3447535',
            name: 'defaultUrl',
            resource: {
              id: '54fb6f3d-a138-4d13-accd-c88fca862e54'
            }
          }
        ],
        coverage: [],
        titleInstance: {
          id: 'a5323d14-8c42-4115-83de-27672a4510ac',
          subType: {
            id: '2c91809c7d2b9151017d2b982b05003a',
            value: 'electronic',
            label: 'Electronic'
          },
          dateCreated: '2021-11-17T02:49:33Z',
          tags: [],
          lastUpdated: '2021-11-17T02:49:33Z',
          normalizedName: '13th acm web science conference 2021',
          publicationType: {
            id: '2c91809c7d2b9151017d2b98627c0046',
            value: 'book',
            label: 'Book'
          },
          identifiers: [
            {
              title: {
                id: 'a5323d14-8c42-4115-83de-27672a4510ac'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-8330-1',
                ns: {
                  value: 'isbn'
                }
              }
            },
            {
              title: {
                id: 'a5323d14-8c42-4115-83de-27672a4510ac'
              },
              status: {
                id: '2c91809c7d2b9151017d2b98341c0045',
                value: 'approved',
                label: 'approved'
              },
              identifier: {
                value: '978-1-4503-8330-1',
                ns: {
                  value: 'isbn'
                }
              }
            }
          ],
          coverage: [],
          name: '13th ACM Web Science Conference 2021',
          type: {
            id: '2c91809c7d2b9151017d2b982b0c003c',
            value: 'monograph',
            label: 'Monograph'
          },
          suppressFromDiscovery: false,
          work: {
            id: '0810d9ac-a071-48e9-aca8-43a9d490d16e'
          },
          class: 'org.olf.kb.TitleInstance',
          longName: '13th ACM Web Science Conference 2021',
          relatedTitles: []
        },
        url: 'https://dl.acm.org/doi/book/10.1145/3447535',
        name: "'13th ACM Web Science Conference 2021' on Platform 'ACM Digital Library'",
        suppressFromDiscovery: false,
        class: 'org.olf.kb.PlatformTitleInstance',
        longName: "'13th ACM Web Science Conference 2021' on Platform 'ACM Digital Library'"
      },
      pkg: {
        id: '1010759a-e8ba-4b97-9e88-97db31e99909',
        dateCreated: '2021-11-17T02:49:32Z',
        lastUpdated: '2021-11-17T02:49:32Z',
        normalizedName: 'acm digtal library',
        vendor: {
          id: 'b41dfc53-5ad5-4b77-9cbf-42d31b5f7dac',
          name: 'Association for Computing Machinery',
          orgsUuid_object: {
            error: 400,
            message: 'Bad Request'
          }
        },
        source: 'GOKb',
        remoteKb: {
          id: 'b6450b01-ab5d-48c1-8278-0353955fe105',
          cursor: '2021-11-17T13:40:09Z',
          active: true,
          trustedSourceTI: false,
          activationEnabled: false,
          readonly: false,
          syncStatus: 'idle',
          lastCheck: 1637160468896,
          name: 'GOKb_TEST',
          type: 'org.olf.kb.adapters.GOKbOAIAdapter',
          fullPrefix: 'gokb',
          uri: 'https://gokbt.gbv.de/gokb/oai/index',
          supportsHarvesting: true,
          rectype: 1
        },
        name: 'ACM Digtal Library',
        suppressFromDiscovery: false,
        reference: 'ACM_Digtal_Library_2',
        resourceCount: 10650,
        class: 'org.olf.kb.Pkg'
      },
      addedTimestamp: 1637117372625,
      name: "'13th ACM Web Science Conference 2021' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      lastSeenTimestamp: 1637117372625,
      suppressFromDiscovery: false,
      longName: "'13th ACM Web Science Conference 2021' on Platform 'ACM Digital Library' in Package ACM Digtal Library",
      class: 'org.olf.kb.PackageContentItem'
    }
  ],
  packageContentsCount: 10650,
  searchString: '?filters=class.package&sort=name'
};

const handlers = {
  onFilterPackageContents: jest.fn(),
  onNeedMorePackageContents: jest.fn(),
};

export { data, handlers };
