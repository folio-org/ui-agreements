import refdata from '../../../../test/jest/refdata';

const findRefdata = (desc) => (refdata.find(obj => obj.desc === desc)?.values);

const data = {
  agreementLines: [],
  agreementLinesToAdd: [],
  agreementStatusValues: findRefdata('SubscriptionAgreement.AgreementStatus'),
  reasonForClosureValues: findRefdata('SubscriptionAgreement.ReasonForClosure'),
  amendmentStatusValues: findRefdata('LicenseAmendmentStatus.Status'),
  basket: [],
  supplementaryProperties: [],
  contactRoleValues: findRefdata('InternalContact.Role'),
  documentCategories: findRefdata('DocumentAttachment.AtType'),
  isPerpetualValues: findRefdata('Global.Yes_No'),
  licenseLinkStatusValues: findRefdata('RemoteLicenseLink.Status'),
  orgRoleValues: findRefdata('SubscriptionAgreementOrg.Role'),
  renewalPriorityValues: findRefdata('SubscriptionAgreement.RenewalPriority'),
  users: []
};

const initialValues = {
  id: 'ac39d3ed-6287-4f00-912f-4e681f84aa61',
  dateCreated: '2021-08-06T18:14:55Z',
  isPerpetual: 'yes',
  name: 'AM ag 1',
  orgs: [],
  externalLicenseDocs: [],
  outwardRelationships: [],
  customProperties: {},
  contacts: [],
  tags: [],
  lastUpdated: '2021-08-06T18:14:55Z',
  inwardRelationships: [],
  renewalPriority: 'definitely_renew',
  endDate: '2021-08-14',
  startDate: '2021-08-06',
  linkedLicenses: [],
  docs: [],
  periods: [
    {
      id: '068c220f-8135-4d08-a437-660491dba0e4',
      startDate: '2021-08-06',
      owner: {
        id: 'ac39d3ed-6287-4f00-912f-4e681f84aa61'
      },
      endDate: '2021-08-14',
      periodStatus: 'current'
    }
  ],
  usageDataProviders: [],
  agreementStatus: 'active',
  supplementaryDocs: [],
  description: 'description for this agreement',
  cancellationDeadline: null,
  alternateNames: [
    {
      id: '1b9cbda2-a2f8-4f0c-a1e3-1fdf128b3ff2',
      owner: {
        id: 'ac39d3ed-6287-4f00-912f-4e681f84aa61'
      },
      name: 'am ag'
    }
  ],
  relatedAgreements: []
};

export {
  data,
  initialValues,
};
