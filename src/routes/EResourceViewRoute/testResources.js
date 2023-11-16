const tagsEnabled = true;

const match = {
  path: '/erm/eresources/:id',
  url: '/erm/eresources/99234bd6-9953-4909-aded-eea4b0da96ed',
  isExact: true,
  params: {
    id: '99234bd6-9953-4909-aded-eea4b0da96ed'
  }
};

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
  loadedAt: 'Tue Nov 30 2021 23:09:21 GMT+0000 (Greenwich Mean Time)',
  url: 'https://folio-snapshot-okapi.dev.folio.org/erm/resource/99234bd6-9953-4909-aded-eea4b0da96ed',
  headers: 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  httpStatus: 200,
  other: {
    totalRecords: null
  },
  resource: 'eresource',
  module: '@folio/agreements',
  throwErrors: true
};

const entitlementOptions = {
  hasLoaded: true,
  isPending: false,
  failed: false,
  records: [
    '{_object: {…}, class: "org.olf.kb.PackageContentIte…}',
    '{_object: {…}, class: "org.olf.kb.Pkg", customCover…}'
  ],
  successfulMutations: [],
  failedMutations: [],
  pendingMutations: [],
  loadedAt: 'Tue Nov 30 2021 23:09:23 GMT+0000 (Greenwich Mean Time)',
  url: 'https://folio-snapshot-okapi.dev.folio.org/erm/resource/99234bd6-9953-4909-aded-eea4b0da96ed/entitlementOptions?perPage=10&stats=true',
  headers: 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  httpStatus: 200,
  other: {
    pageSize: 10,
    page: 1,
    totalPages: 1,
    meta: '{}',
    totalRecords: 2,
    total: 2
  },
  resource: 'entitlementOptions',
  module: '@folio/agreements',
  throwErrors: false
};

const entitlements = {
  hasLoaded: true,
  isPending: false,
  failed: false,
  records: [],
  successfulMutations: [],
  failedMutations: [],
  pendingMutations: [],
  loadedAt: 'Tue Nov 30 2021 23:09:22 GMT+0000 (Greenwich Mean Time)',
  url: 'https://folio-snapshot-okapi.dev.folio.org/erm/resource/99234bd6-9953-4909-aded-eea4b0da96ed/entitlements?perPage=10&stats=true',
  headers: 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  httpStatus: 200,
  other: {
    pageSize: 10,
    page: 1,
    totalPages: 0,
    meta: '{}',
    totalRecords: 0,
    total: 0
  },
  resource: 'entitlements',
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
  loadedAt: 'Tue Nov 30 2021 23:09:22 GMT+0000 (Greenwich Mean Time)',
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

const packageContents = {
  hasLoaded: true,
  isPending: false,
  failed: false,
  records: [],
  successfulMutations: [],
  failedMutations: [],
  pendingMutations: [],
  loadedAt: 'Tue Nov 30 2021 23:09:22 GMT+0000 (Greenwich Mean Time)',
  url: 'https://folio-snapshot-okapi.dev.folio.org/erm/packages/99234bd6-9953-4909-aded-eea4b0da96ed/content/current?filters=pkg.id%3D%3D99234bd6-9953-4909-aded-eea4b0da96ed&perPage=10&sort=pti.titleInstance.name%3Basc&stats=true',
  headers: 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  httpStatus: 200,
  other: {
    pageSize: 10,
    page: 1,
    totalPages: 0,
    meta: '{}',
    totalRecords: 0,
    total: 0
  },
  resource: 'packageContents',
  module: '@folio/agreements',
  throwErrors: true
};

const query = {
  query: '',
  sort: 'name'
};

const handlers = {};

const entitlementsCount = {
  update: 'ƒ update() {}',
  replace: 'ƒ replace() {}'
};

const packageContentsFilter = {
  update: 'ƒ update() {}',
  replace: 'ƒ replace() {}'
};

export {
  entitlements,
  entitlementsCount,
  entitlementOptions,
  eresource,
  packageContents,
  packageContentsFilter,
  query,
  settings,
  handlers,
  match,
  tagsEnabled
};
