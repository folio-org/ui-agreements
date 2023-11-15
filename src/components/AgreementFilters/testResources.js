import refdata from '../../../test/jest/refdata';

const findRefdata = (desc) => (refdata.find(obj => obj.desc === desc)?.values);

const activeFilters = {
  'agreementStatus': [
    'active',
    'draft',
    'in_negotiation',
    'requested'
  ],
  'agreementContentType': [
    'books',
    'database'
  ],
  'orgs': [
    '9032ae7d-ca16-4399-abae-e6186628c669'
  ],
  'role': [
    '2c91809c7cd92b6b017cd932c5a90012'
  ],
  'contacts': [
    ''
  ],
  'contactRole': [
    '2c91809c7cd92b6b017cd932c57f0008'
  ],
  'tags': [
    'urgent',
    'test',
    'important',
    'catalogingrecords'
  ]
};

const data = {
  'agreements': [],
  'agreementStatusValues': findRefdata('SubscriptionAgreement.AgreementStatus'),
  'renewalPriorityValues': findRefdata('SubscriptionAgreement.RenewalPriority'),
  'isPerpetualValues': findRefdata('Global.Yes_No'),
  'contactRoleValues': findRefdata('InternalContact.Role'),
  'orgRoleValues': findRefdata('SubscriptionAgreementOrg.Role'),
  'supplementaryProperties': [],
  'agreementContentTypeValues': findRefdata('SubscriptionAgreement.ContentType'),
  'documentAtTypeValues': findRefdata('DocumentAttachment.AtType'),
  'tagsValues': [{
    'id': 'aeb85be7-7440-474f-94de-066fd69c7604',
    'label': 'catalogingrecords',
    'metadata': '{createdByUserId: "6409c3c0-cbb9-5d53-b174-393deb63…}'
  },
  {
    'id': '621e53a7-038a-4b6c-892f-169c3fbf655c',
    'label': 'important',
    'metadata': '{createdDate: "2021-11-01T01:52:24.475558Z"}'
  },
  {
    'id': '68e1bb44-0b36-453d-b336-1127990d02e2',
    'label': 'test',
    'description': 'test',
    'metadata': '{createdByUserId: "6409c3c0-cbb9-5d53-b174-393deb63…}'
  },
  {
    'id': '1d75d6c3-18e7-40b5-a5b6-08ac0acf4d54',
    'label': 'urgent',
    'description': 'Requires urgent attention',
    'metadata': '{createdDate: "2021-11-01T01:52:24.475558Z"}'
  }
  ]
};

export {
  activeFilters,
  data
};
