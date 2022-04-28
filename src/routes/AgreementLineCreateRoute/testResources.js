const match = {
  'path': '/erm/agreements/:agreementId/line/create',
  'url': '/erm/agreements/8f9f0c1d-7c8e-433d-9ffe-e1cf4dadd71a/line/create',
  'isExact': true,
  'params': {
    'agreementId': '8f9f0c1d-7c8e-433d-9ffe-e1cf4dadd71a'
  }
};

const resources = {
  'entitlements': {
    'hasLoaded': false,
    'isPending': false,
    'failed': false,
    'records': [],
    'successfulMutations': [{
      'type': 'POST',
      'record': {
        'id': '503569e5-3c52-4289-94b6-e9cf4213a703',
        'type': 'external',
        'description': null,
        'authority': 'EKB-PACKAGE',
        'reference': '43-2508',
        'explanation': null,
        'startDate': null,
        'endDate': null,
        'activeFrom': null,
        'activeTo': null,
        'contentUpdated': null,
        'haveAccess': true,
        'suppressFromDiscovery': false,
        'note': null,
        'owner': {
          'id': '8f9f0c1d-7c8e-433d-9ffe-e1cf4dadd71a',
          'dateCreated': '2021-11-24T09:31:56Z',
          'name': 'MR agreement',
          'orgs': [],
          'externalLicenseDocs': [],
          'outwardRelationships': [],
          'customProperties': {},
          'contacts': [],
          'tags': [],
          'lastUpdated': '2021-11-24T09:31:56Z',
          'inwardRelationships': [],
          'startDate': '2021-11-01',
          'linkedLicenses': [],
          'docs': [],
          'periods': [
            '{id: "39e9fed3-4c6c-479d-96da-fddb290a8e77", owner:…}'
          ],
          'usageDataProviders': [],
          'agreementStatus': {
            'id': '2c91809c7d4f9d78017d4fa4cd880026',
            'value': 'active',
            'label': 'Active'
          },
          'supplementaryDocs': [],
          'endDate': null,
          'cancellationDeadline': null,
          'alternateNames': []
        },
        'customCoverage': false,
        'reference_object': {
          'label': 'IOP Package I',
          'type': 'Package',
          'provider': 'IOP Publishing Limited',
          'titleCount': 11,
          'selectedCount': 0,
          'contentType': 'E-Journal',
          'providerName': 'IOP Publishing Limited'
        }
      }
    },
    {
      'type': 'POST',
      'record': '{activeFrom: null, activeTo: null, authority: "EKB-…}'
    }
    ],
    'failedMutations': [],
    'pendingMutations': []
  },
  'basket': [],
  'settings': {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': '[]',
    'successfulMutations': '[]',
    'failedMutations': '[]',
    'pendingMutations': '[]',
    'loadedAt': 'Wed Nov 24 2021 13:48:39 GMT+0000 (Greenwich Mean Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/configurations/entries?query=(module=AGREEMENTS%20and%20configName=general)',
    'headers': 'Headers(undefined) {"content-type" => "application/json"}',
    'httpStatus': 200,
    'other': '{resultInfo: {…}, totalRecords: 0}',
    'resource': 'settings',
    'module': '@folio/agreements',
    'throwErrors': true
  }
};

export {
  match,
  resources,
};
