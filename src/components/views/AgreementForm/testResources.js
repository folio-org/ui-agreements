import refdata from '../../../../test/jest/refdata';

const findRefdata = (desc) => (refdata.find(obj => obj.desc === desc)?.values);

const data = {
  agreementLines: [],
  agreementLinesToAdd: [],
  agreementStatusValues: findRefdata('SubscriptionAgreement.AgreementStatus'),
  reasonForClosureValues: findRefdata('SubscriptionAgreement.ReasonForClosure'),
  amendmentStatusValues: findRefdata('LicenseAmendmentStatus.Status'),
  basket: [],
  supplementaryProperties: [
    {
      id: '2c9180c17cca1bd2017ccd9fd50a004a',
      name: 'test',
      primary: true,
      defaultInternal: true,
      label: 'test',
      description: 'test',
      weight: 1,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger'
    }
  ],
  contactRoleValues: findRefdata('InternalContact.Role'),
  documentCategories: findRefdata('DocumentAttachment.AtType'),
  isPerpetualValues: findRefdata('Global.Yes_No'),
  licenseLinkStatusValues: findRefdata('RemoteLicenseLink.Status'),
  orgRoleValues: findRefdata('SubscriptionAgreementOrg.Role'),
  renewalPriorityValues: findRefdata('SubscriptionAgreement.RenewalPriority'),
  users: []
};

const initialValues = {
  id: '7074dbfc-e4bc-4678-847b-bf48884f72a0',
  dateCreated: '2021-10-29T20:01:51Z',
  items: [],
  name: 'AM ag 1',
  orgs: [],
  externalLicenseDocs: [],
  outwardRelationships: [],
  customProperties: {
    test: [
      {
        _delete: true
      }
    ]
  },
  contacts: [],
  tags: [],
  lastUpdated: '2021-10-29T20:01:51Z',
  inwardRelationships: [],
  startDate: '2021-10-29',
  linkedLicenses: [],
  docs: [],
  periods: [
    {
      id: '3a87884e-5419-48f8-8c42-7b67495d9b9c',
      startDate: '2021-10-29',
      owner: {
        id: '7074dbfc-e4bc-4678-847b-bf48884f72a0'
      },
      periodStatus: 'current'
    }
  ],
  usageDataProviders: [],
  agreementStatus: 'active',
  supplementaryDocs: [],
  endDate: null,
  cancellationDeadline: null,
  alternateNames: [],
  relatedAgreements: []
};

export { data, initialValues };
