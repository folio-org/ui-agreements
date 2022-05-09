const tagsEnabled = true;

const handlers = {
  'onDownloadFile': () => {},
  'onUploadFile': () => {},
};

const history = {
  push: () => {},
};

const location = {
  'pathname': '/erm/agreements/d5b622c5-2564-4d59-bed6-16fdb7c925f1',
  'search': '?filters=agreementStatus.active%2CagreementStatus.draft%2CagreementStatus.in_negotiation%2CagreementStatus.requested&sort=name',
  'hash': '',
  'key': '2v168o'
};

const match = {
  'path': '/erm/agreements/:id',
  'url': '/erm/agreements/d5b622c5-2564-4d59-bed6-16fdb7c925f1',
  'isExact': true,
  'params': {
    'id': 'd5b622c5-2564-4d59-bed6-16fdb7c925f1'
  }
};

const intl = {
  'formatMessage': jest.fn(),
};

const stripes = {
  'okapi': {
    'url': 'https://folio-snapshot-okapi.dev.folio.org',
    'tenant': 'diku',
    'token': 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkaWt1X2FkbWluIiwidXNlcl9pZCI6IjhmY2IwZGUzLTkwMzEtNTRmZi04NzI5LTlkOGJhOWUwY2JjMiIsImlhdCI6MTYzNDkwNTg5OSwidGVuYW50IjoiZGlrdSJ9.D5YnBwnqJpSRluNxVMvmxcshvndZD24zRal4t9e4HVE',
  },
};

const agreement = {
  'hasLoaded': true,
  'isPending': false,
  'failed': false,
  'records': [{
    'id': 'd5b622c5-2564-4d59-bed6-16fdb7c925f1',
    'cancellationDeadline': '2021-10-10',
    'dateCreated': '2021-10-22T12:36:46Z',
    'isPerpetual': {
      'id': '2c91809c7ca5ab60017ca5b2c7600028',
      'value': 'yes',
      'label': 'Yes'
    },
    'items': [],
    'name': 'MR agreement test',
    'orgs': [],
    'externalLicenseDocs': [],
    'outwardRelationships': [],
    'customProperties': {},
    'contacts': [],
    'tags': [],
    'lastUpdated': '2021-10-22T12:36:46Z',
    'inwardRelationships': [],
    'renewalPriority': {
      'id': '2c91809c7ca5ab60017ca5b2c7820030',
      'value': 'for_review',
      'label': 'For review'
    },
    'endDate': '2021-10-31',
    'startDate': '2021-10-01',
    'linkedLicenses': [],
    'docs': [],
    'periods': [
      '{cancellationDeadline: "2021-10-10", endDate: "2021…}'
    ],
    'usageDataProviders': [],
    'agreementStatus': {
      'id': '2c91809c7ca5ab60017ca5b2c7de0038',
      'value': 'active',
      'label': 'Active'
    },
    'supplementaryDocs': [],
    'description': 'agreement description',
    'alternateNames': [],
    'relatedAgreements': []
  }],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': [],
  'loadedAt': 'Fri Oct 22 2021 13:36:48 GMT+0100 (British Summer Time)',
  'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/sas/d5b622c5-2564-4d59-bed6-16fdb7c925f1',
  'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  'httpStatus': 200,
  'other': {
    'totalRecords': null
  },
  'resource': 'agreement',
  'module': '@folio/agreements',
  'throwErrors': true
};

const agreementLines = {
  'hasLoaded': true,
  'isPending': false,
  'failed': false,
  'records': [],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': [],
  'loadedAt': 'Fri Oct 22 2021 13:36:48 GMT+0100 (British Summer Time)',
  'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/entitlements?filters=owner%3Dd5b622c5-2564-4d59-bed6-16fdb7c925f1&perPage=10&sort=resource.name&stats=true',
  'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  'httpStatus': 200,
  'other': {
    'pageSize': 10,
    'page': 1,
    'totalPages': 0,
    'meta': '{}',
    'totalRecords': 0,
    'total': 0
  },
  'resource': 'agreementLines',
  'module': '@folio/agreements',
  'throwErrors': true
};

const agreementEresources = {
  'hasLoaded': true,
  'isPending': false,
  'failed': false,
  'records': [],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': [],
  'loadedAt': 'Fri Oct 22 2021 13:36:48 GMT+0100 (British Summer Time)',
  'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/sas/d5b622c5-2564-4d59-bed6-16fdb7c925f1/resources/current?perPage=10&sort=pti.titleInstance.name%3Basc&stats=true',
  'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  'httpStatus': 200,
  'other': {
    'pageSize': 10,
    'page': 1,
    'totalPages': 0,
    'meta': '{}',
    'totalRecords': 0,
    'total': 0
  },
  'resource': 'agreementEresources',
  'module': '@folio/agreements',
  'throwErrors': true
};

const eresourcesFilterPath = 'current';

const interfaces = {
  'hasLoaded': false,
  'isPending': false,
  'failed': false,
  'records': [],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': []
};

const orderLines = {
  'hasLoaded': false,
  'isPending': false,
  'failed': false,
  'records': [],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': []
};

const settings = {
  'hasLoaded': true,
  'isPending': false,
  'failed': false,
  'records': [],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': [],
  'loadedAt': 'Fri Oct 22 2021 13:36:48 GMT+0100 (British Summer Time)',
  'url': 'https://folio-snapshot-okapi.dev.folio.org/configurations/entries?query=(module=AGREEMENTS%20and%20configName=general)',
  'headers': 'Headers(undefined) {"content-type" => "application/json"}',
  'httpStatus': 200,
  'other': {
    'totalRecords': 0,
    'resultInfo': '{diagnostics: Array(0), facets: Array(0), totalReco…}'
  },
  'resource': 'settings',
  'module': '@folio/agreements',
  'throwErrors': true
};

const users = {
  'hasLoaded': false,
  'isPending': false,
  'failed': false,
  'records': [],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': []
};

const interfacesCredentials = {
  'hasLoaded': false,
  'isPending': false,
  'failed': false,
  'records': [],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': []
};

const query = {
  'query': '',
  'filters': 'agreementStatus.active,agreementStatus.draft,agreementStatus.in_negotiation,agreementStatus.requested',
  'sort': 'name'
};

const mutator = {
  'agreement': {
    DELETE: () => {},
    PUT: () => {},
    POST: () => {},
    cancel: () => {},
  },
  'agreementLines': {
    DELETE: () => {},
    PUT: () => {},
    POST: () => {},
    cancel: () => {},
  },
  'agreementEresources': {
    DELETE: () => {},
    PUT: () => {},
    POST: () => {},
    cancel: () => {},
  },
  'eresourcesFilterPath': {
    update: () => {},
    replace: () => {},
  },
  'interfaces': {
    DELETE: () => {},
    PUT: () => {},
    POST: () => {},
    cancel: () => {},
  },
  'orderLines': {
    DELETE: () => {},
    PUT: () => {},
    POST: () => {},
    cancel: () => {},
  },
  'settings': {
    DELETE: () => {},
    PUT: () => {},
    POST: () => {},
    cancel: () => {},
  },
  'supplementaryProperties': {
    DELETE: () => {},
    PUT: () => {},
    POST: () => {},
    cancel: () => {},
  },
  'terms': {
    DELETE: () => {},
    PUT: () => {},
    POST: () => {},
    cancel: () => {},
  },
  'users': {
    DELETE: () => {},
    PUT: () => {},
    POST: () => {},
    cancel: () => {},
  },
  'interfacesCredentials': {
    DELETE: () => {},
    PUT: () => {},
    POST: () => {},
    cancel: () => {},
  },
  'interfaceRecord': {
    update: () => {},
    replace: () => {},
  },
  'agreementEresourcesOffset': {
    update: () => {},
    replace: () => {},
  },
  'agreementLinesOffset': {
    update: () => {},
    replace: () => {}
  },
  'query': {
    update: () => {},
    replace: () => {},
  },
  'tagSettings': {
    DELETE: () => {},
    PUT: () => {},
    POST: () => {},
    cancel: () => {},
  }
};

export {
  agreement,
  agreementLines,
  agreementEresources,
  eresourcesFilterPath,
  interfaces,
  orderLines,
  query,
  settings,
  users,
  stripes,
  history,
  tagsEnabled,
  location,
  handlers,
  match,
  intl,
  interfacesCredentials,
  mutator
};
