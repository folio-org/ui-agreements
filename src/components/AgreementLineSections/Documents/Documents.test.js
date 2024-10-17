import { renderWithIntl, Accordion } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../../test/helpers';
import Documents from './Documents';

const line = {
  'id': 'c1e5cc30-5ac7-4a4b-ab45-34016ad1c209',
  'dateCreated': '2024-09-24T19:47:20Z',
  'tags': [],
  'lastUpdated': '2024-09-24T20:06:40Z',
  'owner': {
    'id': 'a99b94c4-6318-4ff7-a4b6-0a2d91f2aa34',
    'dateCreated': '2024-09-24T19:46:16Z',
    'agreementContentTypes': [],
    'name': 'MR TEST',
    'orgs': [],
    'externalLicenseDocs': [],
    'outwardRelationships': [],
    'customProperties': {},
    'contacts': [],
    'tags': [],
    'lastUpdated': '2024-09-24T20:06:40Z',
    'inwardRelationships': [],
    'startDate': '2024-09-24',
    'linkedLicenses': [],
    'docs': [],
    'periods': [
      {
        'id': 'f77eb1cd-f29c-4355-afe7-71144e84f525',
        'startDate': '2024-09-24',
        'owner': {
          'id': 'a99b94c4-6318-4ff7-a4b6-0a2d91f2aa34'
        },
        'periodStatus': 'current'
      }
    ],
    'usageDataProviders': [],
    'agreementStatus': {
      'id': '2c9180a19224454f0192244f5b70001f',
      'value': 'active',
      'label': 'Active'
    },
    'Documents': [],
    'cancellationDeadline': null,
    'alternateNames': [],
    'version': 6
  },
  'resource': {
    'id': 'f012a17d-388b-42e6-b219-00155eeb6acb',
    'class': 'org.olf.kb.ErmResource$HibernateProxy$Ss6Uslow',
    'name': 'EZB-NALP2-00545: Lippincott Williams & Wilkins (Allianzlizenz): Testlauf 2022-04-26',
    'suppressFromDiscovery': false,
    'tags': [],
    'alternateResourceNames': [],
    'customCoverage': false,
    '_object': {
      'id': 'f012a17d-388b-42e6-b219-00155eeb6acb',
      'availabilityScope': {
        'id': '2c9180a19224454f0192244ff08a0065',
        'value': 'consortium',
        'label': 'Consortium'
      },
      'dateCreated': '2024-09-24T14:09:48Z',
      'availabilityConstraints': [
        {
          'id': '51267ac1-b8f0-44ef-a089-7e5a59613c6b',
          'body': {
            'id': '2c9180a19224454f0192245dec890076',
            'value': 'allianzlizenz',
            'label': 'Allianzlizenz'
          }
        }
      ],
      'packageDescriptionUrls': [
        {
          'id': '8793a9ad-1b4d-48a5-b374-551ac129c15c',
          'url': 'http://gokbt.gbv.de/package/d7c635da-b4f6-4c9a-8970-42e68d9fc530'
        }
      ],
      'tags': [],
      'lastUpdated': '2024-09-24T14:09:48Z',
      'normalizedName': 'ezb-nalp2-00545: lippincott williams & wilkins (allianzlizenz): testlauf 2022-04-26',
      'vendor': {
        'id': '4a78bae0-b839-4fe0-91af-9c370053061b',
        'name': 'Lippincott Williams & Wilkins',
        'orgsUuid_object': {
          'error': 400,
          'message': 'Bad Request'
        }
      },
      'sourceDataUpdated': '2022-04-27T07:04:26Z',
      'coverage': [],
      'source': 'GOKb',
      'contentTypes': [],
      'sourceTitleCount': 0,
      'alternateResourceNames': [],
      'name': 'EZB-NALP2-00545: Lippincott Williams & Wilkins (Allianzlizenz): Testlauf 2022-04-26',
      'lifecycleStatus': {
        'id': '2c9180a19224454f0192244f5b890025',
        'value': 'current',
        'label': 'Current'
      },
      'suppressFromDiscovery': false,
      'sourceDataCreated': '2022-04-26T10:19:41Z',
      'reference': 'd7c635da-b4f6-4c9a-8970-42e68d9fc530',
      'resourceCount': 0,
      'class': 'org.olf.kb.Pkg',
      'identifiers': [
        {
          'identifier': {
            'value': 'EZB-NALP2-00545',
            'ns': {
              'value': 'ezb_collection_id'
            }
          },
          'status': {
            'id': '2c9180a19224454f0192244fa321005e',
            'value': 'approved',
            'label': 'approved'
          }
        },
        {
          'identifier': {
            'value': '18939859',
            'ns': {
              'value': 'gokb_id'
            }
          },
          'status': {
            'id': '2c9180a19224454f0192244fa321005e',
            'value': 'approved',
            'label': 'approved'
          }
        },
        {
          'identifier': {
            'value': 'd7c635da-b4f6-4c9a-8970-42e68d9fc530',
            'ns': {
              'value': 'gokb_uuid'
            }
          },
          'status': {
            'id': '2c9180a19224454f0192244fa321005e',
            'value': 'approved',
            'label': 'approved'
          }
        }
      ]
    }
  },
  'poLines': [],
  'docs': [
    {
      'id': 'bce1b2d6-b21b-450e-aaf8-c8af4ae63136',
      'dateCreated': '2024-09-24T19:47:53Z',
      'lastUpdated': '2024-09-24T19:51:56Z',
      'fileUpload': {
        'id': '5ca1ae61-7a19-4ca3-9fe6-a11fef011844',
        'contentType': 'image/png',
        'size': 24239,
        'modified': '2024-09-24T19:47:53Z',
        'name': 'Screenshot from 2024-09-06 11-37-33.png'
      },
      'url': 'https://test.com',
      'name': 'test1',
      'note': 'test1'
    }
  ],
  'suppressFromDiscovery': false,
  'customCoverage': false,
  'explanation': 'Agreement includes a package containing this item',
  'startDate': null,
  'endDate': null,
  'activeFrom': null,
  'activeTo': null,
  'contentUpdated': null,
  'haveAccess': true
};

const resource = {
  'id': 'f012a17d-388b-42e6-b219-00155eeb6acb',
  'availabilityScope': {
    'id': '2c9180a19224454f0192244ff08a0065',
    'value': 'consortium',
    'label': 'Consortium',
  },
  'dateCreated': '2024-09-24T14:09:48Z',
  'availabilityConstraints': [
    {
      'id': '51267ac1-b8f0-44ef-a089-7e5a59613c6b',
      'body': {
        'id': '2c9180a19224454f0192245dec890076',
        'value': 'allianzlizenz',
        'label': 'Allianzlizenz',
      },
    },
  ],
  'packageDescriptionUrls': [
    {
      'id': '8793a9ad-1b4d-48a5-b374-551ac129c15c',
      'url': 'http://gokbt.gbv.de/package/d7c635da-b4f6-4c9a-8970-42e68d9fc530',
    },
  ],
  'tags': [],
  'lastUpdated': '2024-09-24T14:09:48Z',
  'normalizedName':
    'ezb-nalp2-00545: lippincott williams & wilkins (allianzlizenz): testlauf 2022-04-26',
  'vendor': {
    'id': '4a78bae0-b839-4fe0-91af-9c370053061b',
    'name': 'Lippincott Williams & Wilkins',
    'orgsUuid_object': {
      'error': 400,
      'message': 'Bad Request',
    },
  },
  'sourceDataUpdated': '2022-04-27T07:04:26Z',
  'coverage': [],
  'source': 'GOKb',
  'contentTypes': [],
  'sourceTitleCount': 0,
  'alternateResourceNames': [],
  'name':
    'EZB-NALP2-00545: Lippincott Williams & Wilkins (Allianzlizenz): Testlauf 2022-04-26',
  'lifecycleStatus': {
    'id': '2c9180a19224454f0192244f5b890025',
    'value': 'current',
    'label': 'Current',
  },
  'suppressFromDiscovery': false,
  'sourceDataCreated': '2022-04-26T10:19:41Z',
  'reference': 'd7c635da-b4f6-4c9a-8970-42e68d9fc530',
  'resourceCount': 0,
  'class': 'org.olf.kb.Pkg',
  'identifiers': [
    {
      'identifier': {
        'value': 'EZB-NALP2-00545',
        'ns': {
          'value': 'ezb_collection_id',
        },
      },
      'status': {
        'id': '2c9180a19224454f0192244fa321005e',
        'value': 'approved',
        'label': 'approved',
      },
    },
    {
      'identifier': {
        'value': '18939859',
        'ns': {
          'value': 'gokb_id',
        },
      },
      'status': {
        'id': '2c9180a19224454f0192244fa321005e',
        'value': 'approved',
        'label': 'approved',
      },
    },
    {
      'identifier': {
        'value': 'd7c635da-b4f6-4c9a-8970-42e68d9fc530',
        'ns': {
          'value': 'gokb_uuid',
        },
      },
      'status': {
        'id': '2c9180a19224454f0192244fa321005e',
        'value': 'approved',
        'label': 'approved',
      },
    },
  ],
};
const handlers = {
  onDownloadFile: () => {},
};

let renderComponent;

describe('Documents', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <Documents
        handlers={handlers}
        id="Docs"
        line={line}
        resource={resource}
      />,
      translationsProperties
    );
  });

  test('renders the Documents Accordion', async () => {
    await Accordion('Documents').exists();
  });

  test('renders the DocumentCard component', () => {
    const { getAllByText } = renderComponent;
    expect(getAllByText('DocumentCard'));
  });
});
