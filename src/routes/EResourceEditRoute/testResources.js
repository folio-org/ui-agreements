const eresource = {
  hasLoaded: true,
  isPending: false,
  failed: false,
  records: [
    '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
  ],
  successfulMutations: [],
  failedMutations: [],
  pendingMutations: [],
  loadedAt: 'Mon Nov 29 2021 17:05:57 GMT+0000 (Greenwich Mean Time)',
  url: 'https://folio-snapshot-okapi.dev.folio.org/erm/resource/d79ee1dc-86f3-4bd0-a9c3-f2ed73a142a5',
  headers: 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  httpStatus: 200,
  other: {
    totalRecords: null
  },
  resource: 'eresource',
  module: '@folio/agreements',
  throwErrors: true
};

const settings = {
  hasLoaded: true,
  isPending: false,
  failed: false,
  records: [],
  successfulMutations: [],
  failedMutations: [],
  pendingMutations: [],
  loadedAt: 'Mon Nov 29 2021 17:05:57 GMT+0000 (Greenwich Mean Time)',
  url: 'https://folio-snapshot-okapi.dev.folio.org/configurations/entries?query=(module=AGREEMENTS%20and%20configName=general)',
  headers: 'Headers(undefined) {"content-type" => "application/json"}',
  httpStatus: 200,
  other: {
    totalRecords: 0,
    resultInfo: '{diagnostics: Array(0), facets: Array(0), totalReco…}'
  },
  resource: 'settings',
  module: '@folio/agreements',
  throwErrors: true
};

const loadingView = {
  hasLoaded: false,
  isPending: true,
  failed: false,
  records: [],
  successfulMutations: [],
  failedMutations: [],
  pendingMutations: []
};

export { eresource, settings, loadingView };
