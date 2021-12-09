const urlCustomization = {
  'hasLoaded': true,
  'isPending': false,
  'failed': false,
  'records': [{
    'id': '8c195c10-086a-4c51-a7cb-d3e5d66b4042',
    'dateCreated': '2021-12-07T11:51:56Z',
    'rule': '1234',
    'context': {
      'id': '2c91809c7d929016017d92974eb90010',
      'value': 'urlcustomiser',
      'label': 'urlCustomiser'
    },
    'lastUpdated': '2021-12-07T11:51:56Z',
    'name': 'test',
    'idScopes': [
      '082ef5fe-fac7-46ba-a37c-b636ae7aa266'
    ]
  }],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': [],
  'loadedAt': 'Tue Dec 07 2021 11:52:01 GMT+0000 (Greenwich Mean Time)',
  'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/sts/8c195c10-086a-4c51-a7cb-d3e5d66b4042',
  'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  'httpStatus': 200,
  'other': {
    'totalRecords': null
  },
  'resource': 'urlCustomization',
  'module': '@folio/agreements',
  'throwErrors': true
};

const loadingView = {
  'hasLoaded': false,
  'isPending': true,
  'failed': false,
  'records': [],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': []
};

export { loadingView, urlCustomization };
