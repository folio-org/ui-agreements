const data = {
  'agreementLines': [],
  'agreementLinesToAdd': [],
  'agreementStatusValues': [
    {
      'id': 'c25b302f0740ff229729f659369191a2',
      'value': 'closed',
      'label': 'Closed'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c5aa1003e',
      'value': 'draft',
      'label': 'Draft'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c5aa7003f',
      'value': 'requested',
      'label': 'Requested'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c5aae0040',
      'value': 'in_negotiation',
      'label': 'In negotiation'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c5ab30041',
      'value': 'active',
      'label': 'Active'
    }
  ],
  'reasonForClosureValues': [
    {
      'id': '28e76f326dcc27e8b789115f2fe0e856',
      'value': 'rejected',
      'label': 'Rejected'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c5a83003b',
      'value': 'cancelled',
      'label': 'Cancelled'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c5a8c003c',
      'value': 'ceased',
      'label': 'Ceased'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c5a92003d',
      'value': 'superseded',
      'label': 'Superseded'
    }
  ],
  'amendmentStatusValues': [
    {
      'id': '2c9180c17cca1bd2017cca1c5a010024',
      'value': 'current',
      'label': 'Current'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c5a050025',
      'value': 'future',
      'label': 'Future'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c5a0a0026',
      'value': 'historical',
      'label': 'Historical'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c5a0e0027',
      'value': 'does_not_apply',
      'label': 'Does not apply'
    }
  ],
  'basket': [],
  'supplementaryProperties': [
    {
      'id': '2c9180c17cca1bd2017ccd9fd50a004a',
      'name': 'test',
      'primary': true,
      'defaultInternal': true,
      'label': 'test',
      'description': 'test',
      'weight': 1,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger'
    }
  ],
  'contactRoleValues': [
    {
      'id': '2c9180c17cca1bd2017cca1c59a20010',
      'value': 'agreement_owner',
      'label': 'Agreement owner'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c59a70011',
      'value': 'authorized_signatory',
      'label': 'Authorized signatory'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c59ac0012',
      'value': 'erm_librarian',
      'label': 'ERM librarian'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c59b20013',
      'value': 'subject_specialist',
      'label': 'Subject specialist'
    }
  ],
  'documentCategories': [
    {
      'id': '2c9180c17cca1bd2017cca1c5988000a',
      'value': 'license',
      'label': 'License'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c598f000b',
      'value': 'misc',
      'label': 'Misc'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c5994000c',
      'value': 'consortium_negotiation_document',
      'label': 'Consortium negotiation document'
    }
  ],
  'isPerpetualValues': [
    {
      'id': '2c9180c17cca1bd2017cca1c5a390031',
      'value': 'yes',
      'label': 'Yes'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c5a3e0032',
      'value': 'no',
      'label': 'No'
    }
  ],
  'licenseLinkStatusValues': [
    {
      'id': '2c9180c17cca1bd2017cca1c5a150029',
      'value': 'controlling',
      'label': 'Controlling'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c5a19002a',
      'value': 'future',
      'label': 'Future'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c5a1e002b',
      'value': 'historical',
      'label': 'Historical'
    }
  ],
  'orgRoleValues': [
    {
      'id': '2c9180c17cca1bd2017cca1c599b000e',
      'value': 'content_provider',
      'label': 'Content provider'
    }
  ],
  'renewalPriorityValues': [
    {
      'id': '2c9180c17cca1bd2017cca1c5a5d0038',
      'value': 'definitely_renew',
      'label': 'Definitely renew'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c5a620039',
      'value': 'for_review',
      'label': 'For review'
    },
    {
      'id': '2c9180c17cca1bd2017cca1c5a67003a',
      'value': 'definitely_cancel',
      'label': 'Definitely cancel'
    }
  ],
  'users': []
};

const initialValues = {
  'id': '7074dbfc-e4bc-4678-847b-bf48884f72a0',
  'dateCreated': '2021-10-29T20:01:51Z',
  'items': [],
  'name': 'AM ag 1',
  'orgs': [],
  'externalLicenseDocs': [],
  'outwardRelationships': [],
  'customProperties': {
    'test': [
      {
        '_delete': true
      }
    ]
  },
  'contacts': [],
  'tags': [],
  'lastUpdated': '2021-10-29T20:01:51Z',
  'inwardRelationships': [],
  'startDate': '2021-10-29',
  'linkedLicenses': [],
  'docs': [],
  'periods': [
    {
      'id': '3a87884e-5419-48f8-8c42-7b67495d9b9c',
      'startDate': '2021-10-29',
      'owner': {
        'id': '7074dbfc-e4bc-4678-847b-bf48884f72a0'
      },
      'periodStatus': 'current'
    }
  ],
  'usageDataProviders': [],
  'agreementStatus': 'active',
  'supplementaryDocs': [],
  'endDate': null,
  'cancellationDeadline': null,
  'alternateNames': [],
  'relatedAgreements': []
};

export { data, initialValues };
