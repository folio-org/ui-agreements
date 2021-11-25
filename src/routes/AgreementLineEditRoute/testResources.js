const isLoadingData = {
  'history': {
    'length': 17,
    'action': 'PUSH',
    'location': {
      'pathname': '/erm/agreements/fc938790-26a3-4b23-898d-931d5e73a603/line/0076b852-8504-4def-a574-1c4c54fe02ce/edit',
      'search': '?filters=agreementStatus.active%2CagreementStatus.draft%2CagreementStatus.in_negotiation%2CagreementStatus.requested&sort=name',
      'hash': '',
      'key': 'lgbjt4'
    },
    'createHref': 'ƒ createHref() {}',
    'push': 'ƒ push() {}',
    'replace': 'ƒ replace() {}',
    'go': 'ƒ go() {}',
    'goBack': 'ƒ goBack() {}',
    'goForward': 'ƒ goForward() {}',
    'block': 'ƒ block() {}',
    'listen': 'ƒ listen() {}'
  },
  'location': {
    'pathname': '/erm/agreements/fc938790-26a3-4b23-898d-931d5e73a603/line/0076b852-8504-4def-a574-1c4c54fe02ce/edit',
    'search': '?filters=agreementStatus.active%2CagreementStatus.draft%2CagreementStatus.in_negotiation%2CagreementStatus.requested&sort=name',
    'hash': '',
    'key': 'lgbjt4'
  },
  'match': {
    'path': '/erm/agreements/:agreementId/line/:lineId/edit',
    'url': '/erm/agreements/fc938790-26a3-4b23-898d-931d5e73a603/line/0076b852-8504-4def-a574-1c4c54fe02ce/edit',
    'isExact': true,
    'params': {
      'agreementId': 'fc938790-26a3-4b23-898d-931d5e73a603',
      'lineId': '0076b852-8504-4def-a574-1c4c54fe02ce'
    }
  },
  'stripes': {
    'logger': '{categories: "core,action,xhr", prefix: "stripes", …}',
    'store': '{@@observable: ƒ observable() {}, dispatch: ƒ () {}…}',
    'epics': '{add: ƒ add() {}, middleware: ƒ epicMiddleware() {}…}',
    'config': '{}',
    'okapi': '{authFailure: Array(0), bindings: {…}, currency: "U…}',
    'withOkapi': true,
    'setToken': 'ƒ setToken() {}',
    'actionNames': '["stripesHome", "usersSortByName", "selectPreviousR…]',
    'locale': 'en-US',
    'timezone': 'UTC',
    'currency': 'USD',
    'metadata': '{agreements: {…}, dashboard: {…}, eholdings: {…}, e…}',
    'icons': '{@folio/agreements: {…}, @folio/dashboard: {…}, @fo…}',
    'setLocale': 'ƒ setLocale() {}',
    'setTimezone': 'ƒ setTimezone() {}',
    'setCurrency': 'ƒ setCurrency() {}',
    'plugins': '{}',
    'setSinglePlugin': 'ƒ setSinglePlugin() {}',
    'bindings': '{}',
    'setBindings': 'ƒ setBindings() {}',
    'discovery': '{interfaceProviders: Array(67), interfaces: {…}, is…}',
    'user': '{perms: {…}, user: {…}}',
    'connect': 'ƒ () {}'
  },
  'resources': {
    'entitlements': {
      'hasLoaded': false,
      'isPending': true,
      'failed': false,
      'records': [],
      'successfulMutations': [],
      'failedMutations': [],
      'pendingMutations': []
    },
    'line': {
      'hasLoaded': true,
      'isPending': true,
      'failed': false,
      'records': [
        '{activeFrom: null, activeTo: null, authority: "EKB-…}'
      ],
      'successfulMutations': [],
      'failedMutations': [],
      'pendingMutations': [],
      'loadedAt': 'Thu Nov 25 2021 10:03:09 GMT+0000 (Greenwich Mean Time)',
      'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/entitlements/0076b852-8504-4def-a574-1c4c54fe02ce',
      'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
      'httpStatus': 200,
      'other': {},
      'resource': 'line',
      'module': '@folio/agreements',
      'throwErrors': true
    },
    'orderLines': {
      'hasLoaded': false,
      'isPending': true,
      'failed': false,
      'records': [],
      'successfulMutations': [],
      'failedMutations': [],
      'pendingMutations': []
    },
    'basket': [],
    'settings': {
      'hasLoaded': true,
      'isPending': true,
      'failed': false,
      'records': [],
      'successfulMutations': [],
      'failedMutations': [],
      'pendingMutations': [],
      'loadedAt': 'Thu Nov 25 2021 10:03:08 GMT+0000 (Greenwich Mean Time)',
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
    }
  },
  'mutator': {
    'entitlements': {
      'DELETE': 'ƒ DELETE() {}',
      'PUT': 'ƒ PUT() {}',
      'POST': 'ƒ POST() {}',
      'cancel': 'ƒ cancel() {}'
    },
    'line': {
      'DELETE': 'ƒ DELETE() {}',
      'PUT': 'ƒ PUT() {}',
      'POST': 'ƒ POST() {}',
      'cancel': 'ƒ cancel() {}',
      'GET': 'ƒ GET() {}',
      'reset': 'ƒ reset() {}'
    },
    'orderLines': {
      'DELETE': 'ƒ DELETE() {}',
      'PUT': 'ƒ PUT() {}',
      'POST': 'ƒ POST() {}',
      'cancel': 'ƒ cancel() {}',
      'GET': 'ƒ GET() {}',
      'reset': 'ƒ reset() {}'
    },
    'basket': {
      'update': 'ƒ update() {}',
      'replace': 'ƒ replace() {}'
    },
    'settings': {
      'DELETE': 'ƒ DELETE() {}',
      'PUT': 'ƒ PUT() {}',
      'POST': 'ƒ POST() {}',
      'cancel': 'ƒ cancel() {}'
    }
  },
  'refreshRemote': () => {},
  'root': {
    'addReducer': () => {},
    'addEpic': () => {},
    'store': '{@@observable: ƒ observable() {}, dispatch: ƒ () {}…}'
  },
  'isSuppressFromDiscoveryEnabled': 'ƒ () {}'
};

const history = {
  'length': 19,
  'action': 'PUSH',
  'location': {
    'pathname': '/erm/agreements/fc938790-26a3-4b23-898d-931d5e73a603/line/0076b852-8504-4def-a574-1c4c54fe02ce/edit',
    'search': '?filters=agreementStatus.active%2CagreementStatus.draft%2CagreementStatus.in_negotiation%2CagreementStatus.requested&sort=name',
    'hash': '',
    'key': 'qvklgx'
  },
  'createHref': 'ƒ createHref() {}',
  'push': 'ƒ push() {}',
  'replace': 'ƒ replace() {}',
  'go': 'ƒ go() {}',
  'goBack': 'ƒ goBack() {}',
  'goForward': 'ƒ goForward() {}',
  'block': 'ƒ block() {}',
  'listen': 'ƒ listen() {}'
};

const location = {
  'pathname': '/erm/agreements/fc938790-26a3-4b23-898d-931d5e73a603/line/0076b852-8504-4def-a574-1c4c54fe02ce/edit',
  'search': '?filters=agreementStatus.active%2CagreementStatus.draft%2CagreementStatus.in_negotiation%2CagreementStatus.requested&sort=name',
  'hash': '',
  'key': 'qvklgx'
};

const match = {
  'path': '/erm/agreements/:agreementId/line/:lineId/edit',
  'url': '/erm/agreements/fc938790-26a3-4b23-898d-931d5e73a603/line/0076b852-8504-4def-a574-1c4c54fe02ce/edit',
  'isExact': true,
  'params': {
    'agreementId': 'fc938790-26a3-4b23-898d-931d5e73a603',
    'lineId': '0076b852-8504-4def-a574-1c4c54fe02ce'
  }
};

const stripes = {
  'logger': '{categories: "core,action,xhr", prefix: "stripes", …}',
  'store': '{@@observable: ƒ observable() {}, dispatch: ƒ () {}…}',
  'epics': '{add: ƒ add() {}, middleware: ƒ epicMiddleware() {}…}',
  'config': '{}',
  'okapi': '{authFailure: Array(0), bindings: {…}, currency: "U…}',
  'withOkapi': true,
  'setToken': 'ƒ setToken() {}',
  'actionNames': '["stripesHome", "usersSortByName", "selectPreviousR…]',
  'locale': 'en-US',
  'timezone': 'UTC',
  'currency': 'USD',
  'metadata': '{agreements: {…}, dashboard: {…}, eholdings: {…}, e…}',
  'icons': '{@folio/agreements: {…}, @folio/dashboard: {…}, @fo…}',
  'setLocale': 'ƒ setLocale() {}',
  'setTimezone': 'ƒ setTimezone() {}',
  'setCurrency': 'ƒ setCurrency() {}',
  'plugins': '{}',
  'setSinglePlugin': 'ƒ setSinglePlugin() {}',
  'bindings': '{}',
  'setBindings': 'ƒ setBindings() {}',
  'discovery': '{interfaceProviders: Array(67), interfaces: {…}, is…}',
  'user': '{perms: {…}, user: {…}}',
  'connect': 'ƒ () {}'
};

const entitlements = {
  'hasLoaded': false,
  'isPending': false,
  'failed': false,
  'records': [],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': []
};

const line = {
  'hasLoaded': true,
  'isPending': false,
  'failed': false,
  'records': [
    '{activeFrom: null, activeTo: null, authority: "EKB-…}'
  ],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': [],
  'loadedAt': 'Thu Nov 25 2021 11:31:18 GMT+0000 (Greenwich Mean Time)',
  'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/entitlements/0076b852-8504-4def-a574-1c4c54fe02ce',
  'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  'httpStatus': 200,
  'other': {},
  'resource': 'line',
  'module': '@folio/agreements',
  'throwErrors': true
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

const basket = [];

const settings = {
  'hasLoaded': true,
  'isPending': false,
  'failed': false,
  'records': [],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': [],
  'loadedAt': 'Thu Nov 25 2021 11:31:18 GMT+0000 (Greenwich Mean Time)',
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

const mutator = {
  'entitlements': {
    'DELETE': 'ƒ DELETE() {}',
    'PUT': 'ƒ PUT() {}',
    'POST': 'ƒ POST() {}',
    'cancel': 'ƒ cancel() {}'
  },
  'line': {
    'DELETE': 'ƒ DELETE() {}',
    'PUT': 'ƒ PUT() {}',
    'POST': 'ƒ POST() {}',
    'cancel': 'ƒ cancel() {}',
    'GET': 'ƒ GET() {}',
    'reset': 'ƒ reset() {}'
  },
  'orderLines': {
    'DELETE': 'ƒ DELETE() {}',
    'PUT': 'ƒ PUT() {}',
    'POST': 'ƒ POST() {}',
    'cancel': 'ƒ cancel() {}',
    'GET': 'ƒ GET() {}',
    'reset': 'ƒ reset() {}'
  },
  'basket': {
    'update': 'ƒ update() {}',
    'replace': 'ƒ replace() {}'
  },
  'settings': {
    'DELETE': 'ƒ DELETE() {}',
    'PUT': 'ƒ PUT() {}',
    'POST': 'ƒ POST() {}',
    'cancel': 'ƒ cancel() {}'
  }
};

export {
  entitlements,
  line,
  basket,
  orderLines,
  settings,
  isLoadingData,
  history,
  location,
  match,
  mutator,
  stripes
};
