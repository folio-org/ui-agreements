const location = {
  pathname: '/erm/agreements/d5b622c5-2564-4d59-bed6-16fdb7c925f1',
  search: '?filters=agreementStatus.active%2CagreementStatus.draft%2CagreementStatus.in_negotiation%2CagreementStatus.requested&sort=name',
  hash: '',
  key: '2v168o'
};

const match = {
  path: '/erm/agreements/:id',
  url: '/erm/agreements/d5b622c5-2564-4d59-bed6-16fdb7c925f1',
  isExact: true,
  params: {
    id: 'd5b622c5-2564-4d59-bed6-16fdb7c925f1'
  }
};

const agreement = {
  id: 'd5b622c5-2564-4d59-bed6-16fdb7c925f1',
  cancellationDeadline: '2021-10-10',
  dateCreated: '2021-10-22T12:36:46Z',
  isPerpetual: {
    id: '2c91809c7ca5ab60017ca5b2c7600028',
    value: 'yes',
    label: 'Yes'
  },
  items: [],
  name: 'MR agreement test',
  orgs: [],
  externalLicenseDocs: [],
  outwardRelationships: [],
  customProperties: {},
  contacts: [],
  tags: [],
  lastUpdated: '2021-10-22T12:36:46Z',
  inwardRelationships: [],
  renewalPriority: {
    id: '2c91809c7ca5ab60017ca5b2c7820030',
    value: 'for_review',
    label: 'For review'
  },
  endDate: '2021-10-31',
  startDate: '2021-10-01',
  linkedLicenses: [],
  docs: [],
  periods: [
    '{cancellationDeadline: "2021-10-10", endDate: "2021…}'
  ],
  usageDataProviders: [],
  agreementStatus: {
    id: '2c91809c7ca5ab60017ca5b2c7de0038',
    value: 'active',
    label: 'Active'
  },
  supplementaryDocs: [],
  description: 'agreement description',
  alternateNames: [],
  relatedAgreements: []
};

export {
  agreement,
  location,
  match,
};
