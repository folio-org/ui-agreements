const data = {
  'agreementLines': [],
  'agreementLinesToAdd': [],
  'agreementStatusValues': [
    {
      'id': '5bdba58bd113e2027768debda7633c7e',
      'value': 'closed',
      'label': 'Closed'
    },
    {
      'id': '2c9180be7b19833e017b1983c62f003c',
      'value': 'draft',
      'label': 'Draft'
    },
    {
      'id': '2c9180be7b19833e017b1983c633003d',
      'value': 'requested',
      'label': 'Requested'
    },
    {
      'id': '2c9180be7b19833e017b1983c638003e',
      'value': 'in_negotiation',
      'label': 'In negotiation'
    },
    {
      'id': '2c9180be7b19833e017b1983c63d003f',
      'value': 'active',
      'label': 'Active'
    }
  ],
  'reasonForClosureValues': [
    {
      'id': '5393ea3fabe15df10ab9968a5d1a15a3',
      'value': 'rejected',
      'label': 'Rejected'
    },
    {
      'id': '2c9180be7b19833e017b1983c6150039',
      'value': 'cancelled',
      'label': 'Cancelled'
    },
    {
      'id': '2c9180be7b19833e017b1983c61e003a',
      'value': 'ceased',
      'label': 'Ceased'
    },
    {
      'id': '2c9180be7b19833e017b1983c622003b',
      'value': 'superseded',
      'label': 'Superseded'
    }
  ],
  'amendmentStatusValues': [
    {
      'id': '2c9180be7b19833e017b1983c5380007',
      'value': 'current',
      'label': 'Current'
    },
    {
      'id': '2c9180be7b19833e017b1983c53d0008',
      'value': 'future',
      'label': 'Future'
    },
    {
      'id': '2c9180be7b19833e017b1983c5410009',
      'value': 'historical',
      'label': 'Historical'
    },
    {
      'id': '2c9180be7b19833e017b1983c546000a',
      'value': 'does_not_apply',
      'label': 'Does not apply'
    }
  ],
  'basket': [],
  'supplementaryProperties': [],
  'contactRoleValues': [
    {
      'id': '2c9180be7b19833e017b1983c54d000c',
      'value': 'agreement_owner',
      'label': 'Agreement owner'
    },
    {
      'id': '2c9180be7b19833e017b1983c552000d',
      'value': 'authorized_signatory',
      'label': 'Authorized signatory'
    },
    {
      'id': '2c9180be7b19833e017b1983c556000e',
      'value': 'erm_librarian',
      'label': 'ERM librarian'
    },
    {
      'id': '2c9180be7b19833e017b1983c55b000f',
      'value': 'subject_specialist',
      'label': 'Subject specialist'
    }
  ],
  'documentCategories': [
    {
      'id': '2c9180be7b19833e017b1983c5620011',
      'value': 'license',
      'label': 'License'
    },
    {
      'id': '2c9180be7b19833e017b1983c5680012',
      'value': 'misc',
      'label': 'Misc'
    },
    {
      'id': '2c9180be7b19833e017b1983c56d0013',
      'value': 'consortium_negotiation_document',
      'label': 'Consortium negotiation document'
    }
  ],
  'isPerpetualValues': [
    {
      'id': '2c9180be7b19833e017b1983c5db002f',
      'value': 'yes',
      'label': 'Yes'
    },
    {
      'id': '2c9180be7b19833e017b1983c5de0030',
      'value': 'no',
      'label': 'No'
    }
  ],
  'licenseLinkStatusValues': [
    {
      'id': '2c9180be7b19833e017b1983c5a30021',
      'value': 'controlling',
      'label': 'Controlling'
    },
    {
      'id': '2c9180be7b19833e017b1983c5a70022',
      'value': 'future',
      'label': 'Future'
    },
    {
      'id': '2c9180be7b19833e017b1983c5ac0023',
      'value': 'historical',
      'label': 'Historical'
    }
  ],
  'orgRoleValues': [
    {
      'id': '2c9180be7b19833e017b1983c6450041',
      'value': 'content_provider',
      'label': 'Content provider'
    }
  ],
  'renewalPriorityValues': [
    {
      'id': '2c9180be7b19833e017b1983c5fa0036',
      'value': 'definitely_renew',
      'label': 'Definitely renew'
    },
    {
      'id': '2c9180be7b19833e017b1983c5fe0037',
      'value': 'for_review',
      'label': 'For review'
    },
    {
      'id': '2c9180be7b19833e017b1983c6020038',
      'value': 'definitely_cancel',
      'label': 'Definitely cancel'
    }
  ],
  'users': []
};

const form = {
  'mutators': {
    setFieldData: () => { }
  }
};

const values = {
  'periods': [
    {}
  ],
  'customProperties': {}
};

const initialValues = {
  'id': 'ac39d3ed-6287-4f00-912f-4e681f84aa61',
  'dateCreated': '2021-08-06T18:14:55Z',
  'isPerpetual': 'yes',
  'name': 'AM ag 1',
  'orgs': [],
  'externalLicenseDocs': [],
  'outwardRelationships': [],
  'customProperties': {},
  'contacts': [],
  'tags': [],
  'lastUpdated': '2021-08-06T18:14:55Z',
  'inwardRelationships': [],
  'renewalPriority': 'definitely_renew',
  'endDate': '2021-08-14',
  'startDate': '2021-08-06',
  'linkedLicenses': [],
  'docs': [],
  'periods': [
    {
      'id': '068c220f-8135-4d08-a437-660491dba0e4',
      'startDate': '2021-08-06',
      'owner': {
        'id': 'ac39d3ed-6287-4f00-912f-4e681f84aa61'
      },
      'endDate': '2021-08-14',
      'periodStatus': 'current'
    }
  ],
  'usageDataProviders': [],
  'agreementStatus': 'active',
  'supplementaryDocs': [],
  'description': 'description for this agreement',
  'cancellationDeadline': null,
  'alternateNames': [
    {
      'id': '1b9cbda2-a2f8-4f0c-a1e3-1fdf128b3ff2',
      'owner': {
        'id': 'ac39d3ed-6287-4f00-912f-4e681f84aa61'
      },
      'name': 'am ag'
    }
  ],
  'relatedAgreements': []
};

export {
  data,
  form,
  initialValues,
  values
};
