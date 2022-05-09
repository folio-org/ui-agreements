const platform = {
  'hasLoaded': true,
  'isPending': false,
  'failed': false,
  'records': [{
    'id': '653fde07-0057-41a4-8272-9565e602333b',
    'dateCreated': '2021-12-02T02:42:15Z',
    'lastUpdated': '2021-12-02T02:42:15Z',
    'name': 'Brill',
    'locators': [{
      'id': 'cfa4a7a8-60fb-4dd9-a91a-e5cf9fdac424',
      'domainName': 'booksandjournals.brillonline.com'
    }]
  }],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': [],
  'loadedAt': 'Thu Dec 02 2021 13:44:43 GMT+0000 (Greenwich Mean Time)',
  'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/platforms/653fde07-0057-41a4-8272-9565e602333b',
  'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  'httpStatus': 200,
  'other': {
    'totalRecords': null
  },
  'resource': 'platform',
  'module': '@folio/agreements',
  'throwErrors': true
};

const stringTemplates = {
  'hasLoaded': true,
  'isPending': false,
  'failed': false,
  'records': [{
    'urlProxiers': [],
    'urlCustomisers': []
  }],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': [],
  'loadedAt': 'Thu Dec 02 2021 13:44:43 GMT+0000 (Greenwich Mean Time)',
  'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/sts/template/653fde07-0057-41a4-8272-9565e602333b',
  'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  'httpStatus': 200,
  'other': {
    'totalRecords': null
  },
  'resource': 'stringTemplates',
  'module': '@folio/agreements',
  'throwErrors': false
};

const proxyServers = [{
  'hasLoaded': true,
  'isPending': false,
  'failed': false,
  'records': [],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': [],
  'loadedAt': 'Thu Dec 02 2021 13:44:38 GMT+0000 (Greenwich Mean Time)',
  'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/sts?filters=context.value%3Durlproxier',
  'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  'httpStatus': 200,
  'other': {
    'totalRecords': null
  },
  'resource': 'proxyServers',
  'module': '@folio/agreements',
  'throwErrors': false
}];

export {
  proxyServers,
  platform,
  stringTemplates
};
