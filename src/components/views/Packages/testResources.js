const data = {
  packages: [
    {
      id: '8a7a5564-16b7-428f-bb59-afa68fe4e24d',
      availabilityScope: {
        id: '2c91809e95a455490195a45eb1f60063',
        value: 'consortium',
        label: 'Consortium',
      },
      dateCreated: '2025-03-17T13:50:46Z',
      availabilityConstraints: [],
      packageDescriptionUrls: [
        {
          id: '9de23c8c-82f4-4c06-9784-da31910729ad',
          url: 'https://gokbt.gbv.de/package/4a963b47-f292-43c8-829e-b289f7c23924',
        },
      ],
      lastUpdated: '2025-03-17T13:50:46Z',
      normalizedName: 'financial times historical archive : nl',
      vendor: {
        id: '633c842f-ac4e-4283-9bd4-6bc29c8348de',
        name: 'Vendor Name',
      },
      sourceDataUpdated: '2021-08-13T06:17:04Z',
      source: 'GOKb',
      syncContentsFromSource: false,
      contentTypes: [
        {
          id: '76db684f-0b6d-4941-9a2f-c3df1eddde52',
          contentType: {
            id: '2c91809e95a455490195a45ead30005c',
            value: 'journal',
            label: 'Journal',
          },
        },
      ],
      sourceTitleCount: 1,
      alternateResourceNames: [
        {
          id: '15c6a7ab-b058-462e-9931-62e314721338',
          name: 'ZDB-1-FTA',
          owner: {
            id: '8a7a5564-16b7-428f-bb59-afa68fe4e24d',
          },
        },
      ],
      name: 'Financial Times Historical Archive : NL',
      lifecycleStatus: {
        id: '2c91809e95a455490195a45e7805003b',
        value: 'current',
        label: 'Current',
      },
      suppressFromDiscovery: false,
      sourceDataCreated: '2019-05-17T11:55:57Z',
      reference: '4a963b47-f292-43c8-829e-b289f7c23924',
      resourceCount: 0,
      class: 'org.olf.kb.Pkg',
      identifiers: [
        {
          identifier: {
            value: '1650210',
            ns: {
              value: 'gokb_id',
            },
          },
          status: {
            id: '2c91809e95a455490195a45eadb8005e',
            value: 'approved',
            label: 'approved',
          },
        },
      ],
    },
    {
      id: '4f09de63-35e9-4d66-b2f5-a5256d8fc728',
      availabilityScope: {
        id: '2c91809c84b42df30184b436d85d006b',
        value: 'consortium',
        label: 'Consortium'
      },
      dateCreated: '2022-11-26T14:58:48Z',
      availabilityConstraints: [{
        id: '88952b67-b33a-4d5f-ba18-8c97ae2af105',
        body: '{id: "2c91809c84b42df30184b472b92b007b", label: "He…}'
      }],
      packageDescriptionUrls: [{
        id: '60961956-4d1e-422e-8689-93d8b7cc83e8',
        url: 'https://gokbt.gbv.de/package/e7672e03-9b0a-4f76-ab43-25fef0289d3d'
      }],
      lastUpdated: '2022-11-26T14:58:48Z',
      normalizedName: 'acm digtal library',
      vendor: '{id: "e43ae0ea-f137-4067-87e1-d15faebefc3a", name: …}',
      sourceDataUpdated: '2021-11-26T18:30:37Z',
      source: 'GOKb',
      remoteKb: {
        id: '8b3cb2fb-53c7-4911-9e44-318969b02642',
        cursor: '2022-11-26T08:51:48Z',
        active: true,
        trustedSourceTI: false,
        activationEnabled: false,
        readonly: false,
        syncStatus: 'idle',
        lastCheck: 1669488301930,
        name: 'GOKb_TEST',
        type: 'org.olf.kb.adapters.GOKbOAIAdapter',
        fullPrefix: 'gokb',
        uri: 'https://gokbt.gbv.de/gokb/oai/index',
        supportsHarvesting: true,
        rectype: 1
      },
      contentTypes: [{
        id: '580b2a76-94e2-4d56-8692-f56e183c2733',
        contentType: '{id: "2c91809c84b42df30184b43671470062", label: "Jo…}'
      }],
      alternateResourceNames: [{
        id: '1c49fb03-e8ad-45c5-90d9-1881eb6dff16',
        name: 'Association for Computing Machinery - Digital Library',
        owner: '{id: "4f09de63-35e9-4d66-b2f5-a5256d8fc728"}'
      }],
      name: 'ACM Digtal Library',
      lifecycleStatus: {
        id: '2c91809c84b42df30184b435a7230039',
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
          id: '2c91809c84b42df30184b436719a0064',
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
          id: '2c91809c84b42df30184b436719a0064',
          value: 'approved',
          label: 'approved'
        }
      }
      ]
    }
  ],
};

const searchString = '?filters=synchronisationStatus.true%2CsynchronisationStatus.false&page=1&query=test&sort=name';
const selectedRecordId = '8a7a5564-16b7-428f-bb59-afa68fe4e24d';

const source = {
  totalCount: () => {},
  loaded: () => {},
  pending: () => {},
  failure: () => {},
  failureMessage: () => {}
};

export {
  data,
  source,
  selectedRecordId,
  searchString
};
