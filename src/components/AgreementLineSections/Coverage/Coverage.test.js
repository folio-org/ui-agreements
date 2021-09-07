import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Accordion, MultiColumnList } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import Coverage from './Coverage';

const line = {
    'id': '1b1becc2-43fe-4e4e-a351-cf7924f0ee85',
    'dateCreated': '2021-09-07T08:20:49Z',
    'tags': '[]',
    'lastUpdated': '2021-09-07T09:38:46Z',
    'owner': {
    'id': 'f0563d0a-2f11-41a9-9d2a-2aaf640e2cd7',
    'cancellationDeadline': '2021-09-30',
    'dateCreated': '2021-09-07T08:18:50Z',
    'isPerpetual': {
        'id': '2c91809c7bbdeda7017bbdf5250c002b',
        'value': 'yes',
        'label': 'Yes'
    },
    'name': 'MR agr test',
    'orgs': [],
    'externalLicenseDocs': [],
    'outwardRelationships': [],
    'customProperties': {},
    'contacts': [],
    'tags': [],
    'lastUpdated': '2021-09-07T09:38:46Z',
    'inwardRelationships': [],
    'renewalPriority': {
        'id': '2c91809c7bbdeda7017bbdf525350033',
        'value': 'for_review',
        'label': 'For review'
    },
    'endDate': '2021-09-30',
    'startDate': '2021-09-01',
    'linkedLicenses': [],
    'docs': [],
    'periods': [
        {
        'id': 'd31ccd88-92e3-4fe0-8558-5c0043ee8009',
        'startDate': '2021-09-01',
        'cancellationDeadline': '2021-09-30',
        'owner': {
            'id': 'f0563d0a-2f11-41a9-9d2a-2aaf640e2cd7'
        },
        'endDate': '2021-09-30',
        'periodStatus': 'current'
        }
    ],
    'usageDataProviders': [],
    'agreementStatus': {
        'id': '2c91809c7bbdeda7017bbdf52595003b',
        'value': 'active',
        'label': 'Active'
    },
    'supplementaryDocs': [],
    'description': 'this is description',
    'items': [
        {
        'id': '1b1becc2-43fe-4e4e-a351-cf7924f0ee85'
        },
        {
        'id': '0f489801-e2da-4c47-a8f1-74e7881372c4'
        },
        {
        'id': '0917813d-62c4-498e-beeb-2e713dff10dd'
        },
        {
        'id': '3c0b4664-6b99-4728-a731-17ca6a2236d4'
        }
    ],
    'alternateNames': []
    },
    'resource': {
    'id': 'f5507697-335a-4ae0-9bfe-996b1a957de7',
    'class': 'org.olf.kb.PackageContentItem',
    'name': "'\"Institutions, industrial upgrading, and economic performance in Ja...' on Platform 'Elgaronline' in Package Edward Elgar:Edward Elgar E-Book Archive in Business & Management, ...",
    'suppressFromDiscovery': false,
    'tags': [],
    'customCoverage': false,
    '_object': {
        'id': 'f5507697-335a-4ae0-9bfe-996b1a957de7',
        'accessStart': '2008-01-01',
        'dateCreated': '2021-09-07T02:04:26Z',
        'tags': '[]',
        'lastUpdated': '2021-09-07T02:04:52Z',
        'depth': 'Fulltext',
        'coverage': '[]',
        'pti': {
        'id': 'dad7bc99-b4a1-4c86-a3a0-3731169bf570',
        'dateCreated': '2021-09-07T02:04:26Z',
        'tags': [],
        'lastUpdated': '2021-09-07T02:04:26Z',
        'platform': {
            'id': '733a9782-1a7d-46db-9c05-ac2ee4a177f1',
            'dateCreated': '2021-09-07T01:59:14Z',
            'lastUpdated': '2021-09-07T01:59:14Z',
            'name': 'Elgaronline',
            'locators': [
            {
                'id': '2edf1f1b-6b0f-4880-9f69-9c618b972a39',
                'domainName': 'www.elgaronline.com'
            }
            ]
        },
        'templatedUrls': [
            {
            'id': 'c0d88b17-a5ca-4128-a9af-f744838960bb',
            'url': 'https://doi.org/10.4337/9781845425678',
            'name': 'defaultUrl',
            'resource': {
                'id': 'dad7bc99-b4a1-4c86-a3a0-3731169bf570'
            }
            }
        ],
        'coverage': [],
        'titleInstance': {
            'id': '8442b9a1-53f5-45a0-bf73-edfe649d17bf',
            'subType': {
            'id': '2c91809c7bbdeda7017bbdf524db0020',
            'value': 'electronic',
            'label': 'Electronic'
            },
            'dateCreated': '2021-09-07T02:04:26Z',
            'tags': '[]',
            'lastUpdated': '2021-09-07T02:04:26Z',
            'publicationType': {
            'id': '2c91809c7bbdeda7017bbdf568560046',
            'value': 'book',
            'label': 'Book'
            },
            'identifiers': [
            {
                'title': {
                'id': '8442b9a1-53f5-45a0-bf73-edfe649d17bf'
                },
                'status': {
                'id': '2c91809c7bbdeda7017bbdf52f390045',
                'value': 'approved',
                'label': 'approved'
                },
                'identifier': {
                'value': '9781845425678',
                'ns': {
                    'value': 'isbn'
                }
                }
            }
            ],
            'coverage': '[]',
            'name': "\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"",
            'type': {
            'id': '2c91809c7bbdeda7017bbdf524e00022',
            'value': 'monograph',
            'label': 'Monograph'
            },
            'suppressFromDiscovery': false,
            'work': {
            'id': 'a9c4abc5-3744-47ab-9614-27ca3ba54852'
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
        'id': '31bd52f9-2ed9-4810-9e59-7e2f5e6638ce',
        'dateCreated': '2021-09-07T02:04:25Z',
        'lastUpdated': '2021-09-07T02:04:25Z',
        'vendor': {
            'id': '9b21bfe5-d4c0-4025-a76b-78efe16c2505',
            'name': 'Edward Elgar',
            'orgsUuid_object': {
            'error': 400,
            'message': 'Bad Request'
            }
        },
        'source': 'GOKb',
        'remoteKb': {
            'id': 'c683c1f8-ea73-4718-abaf-d26612c98c79',
            'cursor': '2021-09-06T06:00:42Z',
            'active': true,
            'trustedSourceTI': false,
            'activationEnabled': false,
            'readonly': false,
            'syncStatus': 'idle',
            'lastCheck': 1631000743112,
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
        'addedTimestamp': 1630980265534,
        'accessEnd': '2021-03-31',
        'name': "'\"Institutions, industrial upgrading, and economic performance in Ja...' on Platform 'Elgaronline' in Package Edward Elgar:Edward Elgar E-Book Archive in Business & Management, ...",
        'lastSeenTimestamp': 1630980265534,
        'suppressFromDiscovery': false,
        'longName': "'\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"' on Platform 'Elgaronline' in Package Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz",
        'class': 'org.olf.kb.PackageContentItem'
    }
    },
    'poLines': '[]',
    'suppressFromDiscovery': false,
    'coverage': [
    {
        'id': 'b462088d-863b-4f84-967e-98695e9a115f',
        'startDate': '2021-09-01',
        'endDate': '2021-09-30',
        'summary': 'v*/i*/2021-09-01 - v*/i*/2021-09-30'
    }
    ],
    'customCoverage': true,
    'explanation': 'Agreement includes this item from a package specifically',
    'startDate': null,
    'endDate': null,
    'activeFrom': null,
    'activeTo': null,
    'contentUpdated': null,
    'haveAccess': true
};

const resource = {
    'id': 'f5507697-335a-4ae0-9bfe-996b1a957de7',
    'accessStart': '2008-01-01',
    'dateCreated': '2021-09-07T02:04:26Z',
    'tags': '[]',
    'lastUpdated': '2021-09-07T02:04:52Z',
    'depth': 'Fulltext',
    'coverage': '[]',
    'pti': {
    'id': 'dad7bc99-b4a1-4c86-a3a0-3731169bf570',
    'dateCreated': '2021-09-07T02:04:26Z',
    'tags': [],
    'lastUpdated': '2021-09-07T02:04:26Z',
    'platform': {
        'id': '733a9782-1a7d-46db-9c05-ac2ee4a177f1',
        'dateCreated': '2021-09-07T01:59:14Z',
        'lastUpdated': '2021-09-07T01:59:14Z',
        'name': 'Elgaronline',
        'locators': [
        {
            'id': '2edf1f1b-6b0f-4880-9f69-9c618b972a39',
            'domainName': 'www.elgaronline.com'
        }
        ]
    },
    'templatedUrls': [
        {
        'id': 'c0d88b17-a5ca-4128-a9af-f744838960bb',
        'url': 'https://doi.org/10.4337/9781845425678',
        'name': 'defaultUrl',
        'resource': {
            'id': 'dad7bc99-b4a1-4c86-a3a0-3731169bf570'
        }
        }
    ],
    'coverage': [],
    'titleInstance': {
        'id': '8442b9a1-53f5-45a0-bf73-edfe649d17bf',
        'subType': {
        'id': '2c91809c7bbdeda7017bbdf524db0020',
        'value': 'electronic',
        'label': 'Electronic'
        },
        'dateCreated': '2021-09-07T02:04:26Z',
        'tags': '[]',
        'lastUpdated': '2021-09-07T02:04:26Z',
        'publicationType': {
        'id': '2c91809c7bbdeda7017bbdf568560046',
        'value': 'book',
        'label': 'Book'
        },
        'identifiers': [
        {
            'title': {
            'id': '8442b9a1-53f5-45a0-bf73-edfe649d17bf'
            },
            'status': {
            'id': '2c91809c7bbdeda7017bbdf52f390045',
            'value': 'approved',
            'label': 'approved'
            },
            'identifier': {
            'value': '9781845425678',
            'ns': {
                'value': 'isbn'
            }
            }
        }
        ],
        'coverage': '[]',
        'name': "\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"",
        'type': {
        'id': '2c91809c7bbdeda7017bbdf524e00022',
        'value': 'monograph',
        'label': 'Monograph'
        },
        'suppressFromDiscovery': false,
        'work': {
        'id': 'a9c4abc5-3744-47ab-9614-27ca3ba54852'
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
    'id': '31bd52f9-2ed9-4810-9e59-7e2f5e6638ce',
    'dateCreated': '2021-09-07T02:04:25Z',
    'lastUpdated': '2021-09-07T02:04:25Z',
    'vendor': {
        'id': '9b21bfe5-d4c0-4025-a76b-78efe16c2505',
        'name': 'Edward Elgar',
        'orgsUuid_object': {
        'error': 400,
        'message': 'Bad Request'
        }
    },
    'source': 'GOKb',
    'remoteKb': {
        'id': 'c683c1f8-ea73-4718-abaf-d26612c98c79',
        'cursor': '2021-09-06T06:00:42Z',
        'active': true,
        'trustedSourceTI': false,
        'activationEnabled': false,
        'readonly': false,
        'syncStatus': 'idle',
        'lastCheck': 1631000743112,
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
    'addedTimestamp': 1630980265534,
    'accessEnd': '2021-03-31',
    'name': "'\"Institutions, industrial upgrading, and economic performance in Ja...' on Platform 'Elgaronline' in Package Edward Elgar:Edward Elgar E-Book Archive in Business & Management, ...",
    'lastSeenTimestamp': 1630980265534,
    'suppressFromDiscovery': false,
    'longName': "'\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"' on Platform 'Elgaronline' in Package Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz",
    'class': 'org.olf.kb.PackageContentItem'
};

describe('Coverage', () => {
      beforeEach(() => {
         renderWithIntl(
           <MemoryRouter>
             <Coverage line={line} resource={resource} />
           </MemoryRouter>,
          translationsProperties
        );
      });

      test('renders Coverage Accordion', async () => {
        await Accordion('Coverage').exists();
      });
      test('renders expected column count', async () => {
        await MultiColumnList({ columnCount: 7 }).exists();
      });
      test('renders expected columns', async () => {
        await MultiColumnList({ columns: ['Start date', 'Start volume', 'Start issue', 'End date', 'End volume', 'End issue', 'Coverage type'] }).exists();
      });
});

