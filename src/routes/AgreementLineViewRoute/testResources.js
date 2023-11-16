const match = {
  path: '/erm/agreements/:agreementId/line/:lineId',
  url: '/erm/agreements/fc938790-26a3-4b23-898d-931d5e73a603/line/0076b852-8504-4def-a574-1c4c54fe02ce',
  isExact: true,
  params: {
    agreementId: 'fc938790-26a3-4b23-898d-931d5e73a603',
    lineId: '0076b852-8504-4def-a574-1c4c54fe02ce'
  }
};

const line = {
  hasLoaded: true,
  isPending: false,
  failed: false,
  records: [
    '{activeFrom: null, activeTo: null, authority: "EKB-…}'
  ],
  successfulMutations: [],
  failedMutations: [],
  pendingMutations: [],
  loadedAt: 'Thu Nov 25 2021 14:20:31 GMT+0000 (Greenwich Mean Time)',
  url: 'https://folio-snapshot-okapi.dev.folio.org/erm/entitlements/0076b852-8504-4def-a574-1c4c54fe02ce',
  headers: 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  httpStatus: 200,
  other: {},
  resource: 'line',
  module: '@folio/agreements',
  throwErrors: false
};

export {
  match,
  line,
};
