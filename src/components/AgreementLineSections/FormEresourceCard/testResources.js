const internalPackage = {
  'id': 'bb60ec83-3af5-40c5-a689-0b2e214e0bf7',
  'dateCreated': '2021-09-05T02:32:37Z',
  'tags': '[]',
  'lastUpdated': '2021-09-05T02:32:37Z',
  'vendor': {
    'id': '3d947738-8feb-4e68-9f12-ada13616ba76',
    'name': 'Association for Computing Machinery',
    'orgsUuid_object': {
      'error': 400,
      'message': 'Bad Request'
    }
  },
  'coverage': '[]',
  'source': 'GOKb',
  'remoteKb': {
    'id': 'd11f210b-6856-4ee2-9d12-12f95123e7db',
    'cursor': '2021-09-04T06:00:41Z',
    'active': true,
    'trustedSourceTI': false,
    'activationEnabled': false,
    'readonly': false,
    'syncStatus': 'idle',
    'lastCheck': 1630856719085,
    'name': 'GOKb_TEST',
    'type': 'org.olf.kb.adapters.GOKbOAIAdapter',
    'fullPrefix': 'gokb',
    'uri': 'https://gokbt.gbv.de/gokb/oai/index',
    'supportsHarvesting': true,
    'rectype': 1
  },
  'name': 'ACM Digtal Library',
  'suppressFromDiscovery': false,
  'reference': 'ACM_Digtal_Library_2',
  'resourceCount': 0,
  'class': 'org.olf.kb.Pkg'
};

const externalPackage = {
  'contentType': 'Aggregated Full Text',
  'customCoverage': {
    'beginCoverage': '',
    'endCoverage': ''
  },
  'isCustom': false,
  'isSelected': true,
  'name': 'i-law.com',
  'packageId': 3581,
  'packageType': 'Variable',
  'providerId': 936,
  'providerName': 'Informa Law & Finance',
  'selectedCount': 181,
  'titleCount': 181,
  'visibilityData': {
    'isHidden': false,
    'reason': ''
  },
  'id': '936-3581',
  'type': 'packages'
};

const initialValuesData = {
  'basket': '[]',
  'isEholdingsEnabled': true,
  'isLoading': false,
  'lineId': '986dd5b8-b252-485e-9f7b-2021ab38c422',
  'onSubmit': jest.fn()
};

const line = {
  'id': '986dd5b8-b252-485e-9f7b-2021ab38c422',
  'dateCreated': '2021-09-05T12:45:57Z',
  'activeTo': '2021-09-30',
  'tags': [],
  'lastUpdated': '2021-09-05T12:45:57Z',
  'owner': {
    'id': 'a350a2d9-75ff-48e5-8d7e-164da901397a',
    'cancellationDeadline': '2021-09-26',
    'dateCreated': '2021-09-05T12:43:47Z',
    'isPerpetual': {
      'id': '2c91809c7bb3a08e017bb3a79752000a',
      'value': 'yes',
      'label': 'Yes'
    },
    'name': 'MR agr packages',
    'orgs': '[]',
    'externalLicenseDocs': '[]',
    'outwardRelationships': '[]',
    'customProperties': '{}',
    'contacts': '[]',
    'tags': '[]',
    'lastUpdated': '2021-09-05T13:30:42Z',
    'inwardRelationships': '[]',
    'renewalPriority': {
      'id': '2c91809c7bb3a08e017bb3a797790011',
      'value': 'definitely_renew',
      'label': 'Definitely renew'
    },
    'endDate': '2021-09-30',
    'startDate': '2021-09-01',
    'linkedLicenses': '[]',
    'docs': '[]',
    'periods': [{
      'id': '12cf839c-a513-42b0-96cc-ead840205c8f',
      'startDate': '2021-09-01',
      'cancellationDeadline': '2021-09-26',
      'owner': {
        'id': 'a350a2d9-75ff-48e5-8d7e-164da901397a'
      },
      'note': 'This is period note',
      'endDate': '2021-09-30',
      'periodStatus': 'current'
    }],
    'usageDataProviders': '[]',
    'agreementStatus': {
      'id': '2c91809c7bb3a08e017bb3a797c6001a',
      'value': 'active',
      'label': 'Active'
    },
    'supplementaryDocs': '[]',
    'description': 'This is description',
    'items': [{
      'id': '986dd5b8-b252-485e-9f7b-2021ab38c422'
    }],
    'alternateNames': '[]'
  },
  'resource': {
    'id': 'bb60ec83-3af5-40c5-a689-0b2e214e0bf7',
    'class': 'org.olf.kb.Pkg',
    'name': 'ACM Digtal Library',
    'suppressFromDiscovery': false,
    'tags': '[]',
    'customCoverage': false,
    '_object': {
      'id': 'bb60ec83-3af5-40c5-a689-0b2e214e0bf7',
      'dateCreated': '2021-09-05T02:32:37Z',
      'tags': [],
      'lastUpdated': '2021-09-05T02:32:37Z',
      'vendor': {
        'id': '3d947738-8feb-4e68-9f12-ada13616ba76',
        'name': 'Association for Computing Machinery',
        'orgsUuid_object': {
          'error': 400,
          'message': 'Bad Request'
        }
      },
      'coverage': [],
      'source': 'GOKb',
      'remoteKb': {
        'id': 'd11f210b-6856-4ee2-9d12-12f95123e7db',
        'cursor': '2021-09-04T06:00:41Z',
        'active': true,
        'trustedSourceTI': false,
        'activationEnabled': false,
        'readonly': false,
        'syncStatus': 'idle',
        'lastCheck': 1630856719085,
        'name': 'GOKb_TEST',
        'type': 'org.olf.kb.adapters.GOKbOAIAdapter',
        'fullPrefix': 'gokb',
        'uri': 'https://gokbt.gbv.de/gokb/oai/index',
        'supportsHarvesting': true,
        'rectype': 1
      },
      'name': 'ACM Digtal Library',
      'suppressFromDiscovery': false,
      'reference': 'ACM_Digtal_Library_2',
      'resourceCount': 0,
      'class': 'org.olf.kb.Pkg'
    }
  },
  'activeFrom': '2021-09-01',
  'poLines': [],
  'suppressFromDiscovery': true,
  'note': 'This is note',
  'description': 'This is agreement line description',
  'customCoverage': false,
  'explanation': 'Agreement includes a package containing this item',
  'startDate': '2021-09-01',
  'endDate': '2021-09-30',
  'contentUpdated': null,
  'haveAccess': true
};

const handlers = {
  isSuppressFromDiscoveryEnabled: () => {},
  onClose: () => {}
};

const initialValues = {
  'id': '986dd5b8-b252-485e-9f7b-2021ab38c422',
  'dateCreated': '2021-09-05T12:45:57Z',
  'activeTo': '2021-09-30',
  'tags': '[]',
  'lastUpdated': '2021-09-05T12:45:57Z',
  'owner': '{agreementStatus: {…}, alternateNames: Array(0), ca…}',
  'resource': '{_object: {…}, class: "org.olf.kb.Pkg", customCover…}',
  'activeFrom': '2021-09-01',
  'poLines': '[]',
  'suppressFromDiscovery': true,
  'note': 'This is note',
  'description': 'This is agreement line description',
  'customCoverage': false,
  'explanation': 'Agreement includes a package containing this item',
  'startDate': '2021-09-01',
  'endDate': '2021-09-30',
  'contentUpdated': null,
  'haveAccess': true,
  'linkedResource': '{activeFrom: "2021-09-01", activeTo: "2021-09-30", …}'
};
const interalTitle = {
  'component': 'ƒ FormEresourceCard() {}',
  'headerEnd': null,
  'resource': {
    'id': 'abe6cfde-ee56-4491-9e53-b70acb9a984b',
    'accessStart': '2008-01-01',
    'dateCreated': '2021-09-08T02:06:41Z',
    'tags': '[]',
    'lastUpdated': '2021-09-08T02:07:07Z',
    'depth': 'Fulltext',
    'coverage': '[]',
    'pti': {
      'id': '27b9fe76-d1d2-45e8-b02c-474c32720d57',
      'dateCreated': '2021-09-08T02:06:41Z',
      'tags': [],
      'lastUpdated': '2021-09-08T02:06:41Z',
      'platform': {
        'id': '7a45fab1-9816-48d0-a8dd-05b1b8361a99',
        'dateCreated': '2021-09-08T02:01:19Z',
        'lastUpdated': '2021-09-08T02:01:19Z',
        'name': 'Elgaronline',
        'locators': [{
          'id': '81fe228d-db09-4075-ad0f-e9aa6542bace',
          'domainName': 'www.elgaronline.com'
        }]
      },
      'templatedUrls': [{
        'id': '08c8bca4-31b7-47b4-8de1-febd0ab46b95',
        'url': 'https://doi.org/10.4337/9781845425678',
        'name': 'defaultUrl',
        'resource': {
          'id': '27b9fe76-d1d2-45e8-b02c-474c32720d57'
        }
      }],
      'coverage': [],
      'titleInstance': {
        'id': '7b172272-a8df-4ba9-ae23-cd8a4552a686',
        'subType': {
          'id': '2c91809c7bc31559017bc31d3cde0015',
          'value': 'electronic',
          'label': 'Electronic'
        },
        'dateCreated': '2021-09-08T02:06:41Z',
        'tags': '[]',
        'lastUpdated': '2021-09-08T02:06:41Z',
        'publicationType': {
          'id': '2c91809c7bc31559017bc31d863e0046',
          'value': 'book',
          'label': 'Book'
        },
        'identifiers': [{
          'title': {
            'id': '7b172272-a8df-4ba9-ae23-cd8a4552a686'
          },
          'status': {
            'id': '2c91809c7bc31559017bc31d480d0045',
            'value': 'approved',
            'label': 'approved'
          },
          'identifier': {
            'value': '9781845425678',
            'ns': {
              'value': 'isbn'
            }
          }
        }],
        'coverage': '[]',
        'name': "\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"",
        'type': {
          'id': '2c91809c7bc31559017bc31d3ce50017',
          'value': 'monograph',
          'label': 'Monograph'
        },
        'suppressFromDiscovery': false,
        'work': {
          'id': 'd6914bfc-4706-4c31-84ad-389950469461'
        },
        'class': 'org.olf.kb.TitleInstance',
        'longName': "\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"",
        'relatedTitles': '[]'
      },
      'url': 'https://doi.org/10.4337/9781845425678',
      'name': "'\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catc...' on Platform 'Elgaronline'",
      'suppressFromDiscovery': false,
      'class': 'org.olf.kb.PlatformTitleInstance',
      'longName': "'\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"' on Platform 'Elgaronline'"
    },
    'pkg': {
      'id': '18e93b4a-bd70-4e84-8414-a0089f997989',
      'dateCreated': '2021-09-08T02:06:40Z',
      'lastUpdated': '2021-09-08T02:06:40Z',
      'vendor': {
        'id': 'a59a3daf-4c3f-40b7-8981-67bd3117af7c',
        'name': 'Edward Elgar',
        'orgsUuid_object': {
          'error': 400,
          'message': 'Bad Request'
        }
      },
      'source': 'GOKb',
      'remoteKb': {
        'id': 'a1fef7a6-c3f4-4f85-a952-82d9b64469f2',
        'cursor': '2021-09-06T09:01:11Z',
        'active': true,
        'trustedSourceTI': false,
        'activationEnabled': false,
        'readonly': false,
        'syncStatus': 'idle',
        'lastCheck': 1631087231292,
        'name': 'GOKb_TEST',
        'type': 'org.olf.kb.adapters.GOKbOAIAdapter',
        'fullPrefix': 'gokb',
        'uri': 'https://gokbt.gbv.de/gokb/oai/index',
        'supportsHarvesting': true,
        'rectype': 1
      },
      'name': 'Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz',
      'suppressFromDiscovery': false,
      'reference': 'Edward_Elgar:Edward_Elgar_E-Book_Archive_in_Business_&_Management,_Economics_and_Finance:Nationalliz',
      'resourceCount': 2540,
      'class': 'org.olf.kb.Pkg'
    },
    'addedTimestamp': 1631066800235,
    'accessEnd': '2021-03-31',
    'name': "'\"Institutions, industrial upgrading, and economic performance in Ja...' on Platform 'Elgaronline' in Package Edward Elgar:Edward Elgar E-Book Archive in Business & Management, ...",
    'lastSeenTimestamp': 1631066800235,
    'suppressFromDiscovery': false,
    'longName': "'\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"' on Platform 'Elgaronline' in Package Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz",
    'class': 'org.olf.kb.PackageContentItem'
  }
};

const externalTitle = {
  'isTitleCustom': false,
  'publisherName': 'Wydawnictwo Uniwersytetu Rzeszowskiego',
  'titleId': 12384379,
  'contributors': [{
    'type': 'Author',
    'contributor': 'Agata Paliwoda'
  }],
  'identifiers': [{
    'id': '978-83-7996-171-9',
    'subtype': 'Print',
    'type': 'ISBN'
  }],
  'name': '„Swoja i obca”',
  'publicationType': 'Book',
  'subjects': '[]',
  'customEmbargoPeriod': {
    'embargoValue': 0
  },
  'isPackageCustom': false,
  'isSelected': false,
  'titleHasSelectedResources': false,
  'isTokenNeeded': false,
  'locationId': 17779892,
  'managedEmbargoPeriod': {
    'embargoValue': 0
  },
  'packageId': '32498-1127152',
  'packageName': 'IBUK Libra (Nauki Humanistyczne)',
  'url': 'https://libra.ibuk.pl/book/166729',
  'providerId': 32498,
  'providerName': 'Wydawnictwo Naukowe PWN',
  'visibilityData': {
    'isHidden': false,
    'reason': ''
  },
  'managedCoverages': [{
    'beginCoverage': '2015-01-01',
    'endCoverage': '2015-12-31'
  }],
  'customCoverages': '[]',
  'proxy': {
    'id': 'ezproxy',
    'inherited': true
  },
  'id': '32498-1127152-12384379',
  'type': 'resources'
};

export {
  internalPackage,
  externalPackage,
  initialValuesData,
  line,
  handlers,
  initialValues,
  interalTitle,
  externalTitle
};
