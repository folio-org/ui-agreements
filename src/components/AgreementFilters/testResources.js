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
  'agreementStatusValues': [{
    'id': 'c2852a2226d11e472d881fa19cb9d715',
    'value': 'closed',
    'label': 'Closed'
  },
  {
    'id': '2c91809c7cd92b6b017cd932c66d0038',
    'value': 'draft',
    'label': 'Draft'
  },
  {
    'id': '2c91809c7cd92b6b017cd932c6730039',
    'value': 'requested',
    'label': 'Requested'
  },
  {
    'id': '2c91809c7cd92b6b017cd932c678003a',
    'value': 'in_negotiation',
    'label': 'In negotiation'
  },
  {
    'id': '2c91809c7cd92b6b017cd932c67e003b',
    'value': 'active',
    'label': 'Active'
  }
  ],
  'renewalPriorityValues': [{
    'id': '2c91809c7cd92b6b017cd932c6350032',
    'value': 'definitely_renew',
    'label': 'Definitely renew'
  },
  {
    'id': '2c91809c7cd92b6b017cd932c6390033',
    'value': 'for_review',
    'label': 'For review'
  },
  {
    'id': '2c91809c7cd92b6b017cd932c63f0034',
    'value': 'definitely_cancel',
    'label': 'Definitely cancel'
  }
  ],
  'isPerpetualValues': [{
    'id': '2c91809c7cd92b6b017cd932c617002b',
    'value': 'yes',
    'label': 'Yes'
  },
  {
    'id': '2c91809c7cd92b6b017cd932c61b002c',
    'value': 'no',
    'label': 'No'
  }
  ],
  'contactRoleValues': [{
    'id': '2c91809c7cd92b6b017cd932c5750006',
    'value': 'agreement_owner',
    'label': 'Agreement owner'
  },
  {
    'id': '2c91809c7cd92b6b017cd932c57a0007',
    'value': 'authorized_signatory',
    'label': 'Authorized signatory'
  },
  {
    'id': '2c91809c7cd92b6b017cd932c57f0008',
    'value': 'erm_librarian',
    'label': 'ERM librarian'
  },
  {
    'id': '2c91809c7cd92b6b017cd932c5840009',
    'value': 'subject_specialist',
    'label': 'Subject specialist'
  }
  ],
  'orgRoleValues': [{
    'id': '2c91809c7cd92b6b017cd932c5a90012',
    'value': 'content_provider',
    'label': 'Content provider'
  }],
  'supplementaryProperties': [],
  'agreementContentTypeValues': [
    {
      'id': '2c9180a68633e0bc018633e6896a0014',
      'value': 'audio',
      'label': 'Audio'
    },
    {
      'id': '2c9180a68633e0bc018633e6893e0011',
      'value': 'books',
      'label': 'Books'
    },
    {
      'id': '2c9180a68633e0bc018633e689630013',
      'value': 'database',
      'label': 'Database'
    },
    {
      'id': '2c9180a68633e0bc018633e6895e0012',
      'value': 'journals',
      'label': 'Journals'
    },
    {
      'id': '2c9180a68633e0bc018633e689700015',
      'value': 'video',
      'label': 'Video'
    }
  ],
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
