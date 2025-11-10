import refdata from './refdata';

const pkgAgreementId = 'f78b6bf6-04f0-4e5b-8452-28712853ad33';
const pkgAgreement = {
  id: pkgAgreementId,
  cancellationDeadline: '2021-09-28',
  dateCreated: '2021-09-06T07:39:24Z',
  isPerpetual: refdata.find(rdc => rdc.desc === 'Global.Yes_No').values.find(rdv => rdv.value === 'yes'),
  name: 'MR agr packages',
  orgs: [],
  externalLicenseDocs: [],
  outwardRelationships: [],
  customProperties: {},
  contacts: [],
  tags: [],
  lastUpdated: '2021-09-06T12:58:41Z',
  inwardRelationships: [],
  renewalPriority: refdata.find(rdc => rdc.desc === 'SubscriptionAgreement.RenewalPriority').values.find(rdv => rdv.value === 'definitely_renew'),
  endDate: '2021-09-30',
  startDate: '2021-09-01',
  linkedLicenses: [],
  docs: [],
  periods: [{
    id: 'c5f87743-a2e4-4328-a5a3-111c7fa0163a',
    startDate: '2021-09-01',
    cancellationDeadline: '2021-09-28',
    owner: {
      id: pkgAgreementId
    },
    note: 'period note',
    endDate: '2021-09-30',
    periodStatus: 'current'
  }],
  usageDataProviders: [],
  agreementStatus: refdata.find(rdc => rdc.desc === 'SubscriptionAgreement.AgreementStatus').values.find(rdv => rdv.value === 'active'),
  supplementaryDocs: [],
  description: 'this is description',
  items: [{
    id: 'c995ebbe-67a7-41ca-bae7-eefe66ce615a'
  },
  {
    id: '13672d4d-1c9e-4957-b4c8-975e48fd9365'
  }
  ],
  alternateNames: []
};

const externalAgreementId = '733186f6-4c7d-4b32-a982-86ed03f0d6ea';
const externalAgreement = {
  id: externalAgreementId,
  cancellationDeadline: '2021-09-26',
  dateCreated: '2021-09-09T08:17:55Z',
  isPerpetual: refdata.find(rdc => rdc.desc === 'Global.Yes_No').values.find(rdv => rdv.value === 'yes'),
  name: 'MR agr test',
  orgs: [],
  externalLicenseDocs: [],
  outwardRelationships: [],
  customProperties: {},
  contacts: [],
  tags: [],
  lastUpdated: '2021-09-09T11:56:05Z',
  inwardRelationships: [],
  renewalPriority: refdata.find(rdc => rdc.desc === 'SubscriptionAgreement.RenewalPriority').values.find(rdv => rdv.value === 'definitely_renew'),
  endDate: '2021-09-30',
  startDate: '2021-09-01',
  linkedLicenses: [],
  docs: [],
  periods: [{
    id: '428fda12-c517-425b-828e-fd3b15bbaf35',
    startDate: '2021-09-01',
    cancellationDeadline: '2021-09-26',
    owner: {
      id: externalAgreementId
    },
    note: 'period note',
    endDate: '2021-09-30',
    periodStatus: 'current'
  }],
  usageDataProviders: [],
  agreementStatus: refdata.find(rdc => rdc.desc === 'SubscriptionAgreement.AgreementStatus').values.find(rdv => rdv.value === 'active'),
  supplementaryDocs: [],
  description: 'This is description',
  items: [{
    id: 'a4255fc3-986e-47a3-94cb-6bd30b828d1d'
  },
  {
    id: '1c247260-bd39-4a5a-887f-25c40cfc53d2'
  }
  ],
  alternateNames: []
};

const minimalAgreementId = 'c0c324b1-d6a8-4ef3-8f80-64774e367920';
const minimalAgreement = {
  id: minimalAgreementId,
  name: 'CM test 1',
  periods: []
};

export {
  pkgAgreementId,
  pkgAgreement,
  externalAgreementId,
  externalAgreement,
  minimalAgreementId,
  minimalAgreement
};
