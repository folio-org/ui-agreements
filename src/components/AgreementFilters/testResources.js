const activeFilters = {
    'agreementStatus': [
        'active',
        'draft',
        'in_negotiation',
        'requested'
    ]
};

const data = {
    'agreements': [{
        'id': '61281b25-436c-4f73-bda8-34dddce87ad0',
        'dateCreated': '2021-10-25T09:35:49Z',
        'isPerpetual': {
            'id': '2c91809c7cb51f31017cb526b0d5000b',
            'value': 'yes',
            'label': 'Yes'
        },
        'items': '[]',
        'name': 'MR agr test',
        'orgs': '[]',
        'externalLicenseDocs': '[]',
        'outwardRelationships': '[]',
        'customProperties': '{}',
        'contacts': '[]',
        'tags': '[]',
        'lastUpdated': '2021-10-25T09:35:49Z',
        'inwardRelationships': '[]',
        'renewalPriority': {
            'id': '2c91809c7cb51f31017cb526b1010013',
            'value': 'for_review',
            'label': 'For review'
        },
        'endDate': '2021-10-30',
        'startDate': '2021-10-01',
        'linkedLicenses': '[]',
        'docs': '[]',
        'periods': [{
            'id': '1c4f30bd-a5a3-4f07-8840-05f6ece4ef75',
            'startDate': '2021-10-01',
            'owner': '{id: "61281b25-436c-4f73-bda8-34dddce87ad0"}',
            'endDate': '2021-10-30',
            'periodStatus': 'current'
        }],
        'usageDataProviders': '[]',
        'agreementStatus': {
            'id': '2c91809c7cb51f31017cb526b155001b',
            'value': 'active',
            'label': 'Active'
        },
        'supplementaryDocs': '[]',
        'description': 'agreement description',
        'cancellationDeadline': null,
        'alternateNames': '[]'
    }],
    'agreementStatusValues': [{
            'id': 'b6f3f227a5571bc9213309228b8a486b',
            'value': 'closed',
            'label': 'Closed'
        },
        {
            'id': '2c91809c7cb51f31017cb526b1450018',
            'value': 'draft',
            'label': 'Draft'
        },
        {
            'id': '2c91809c7cb51f31017cb526b14a0019',
            'value': 'requested',
            'label': 'Requested'
        },
        {
            'id': '2c91809c7cb51f31017cb526b14f001a',
            'value': 'in_negotiation',
            'label': 'In negotiation'
        },
        {
            'id': '2c91809c7cb51f31017cb526b155001b',
            'value': 'active',
            'label': 'Active'
        }
    ],
    'renewalPriorityValues': [{
            'id': '2c91809c7cb51f31017cb526b0fb0012',
            'value': 'definitely_renew',
            'label': 'Definitely renew'
        },
        {
            'id': '2c91809c7cb51f31017cb526b1010013',
            'value': 'for_review',
            'label': 'For review'
        },
        {
            'id': '2c91809c7cb51f31017cb526b1060014',
            'value': 'definitely_cancel',
            'label': 'Definitely cancel'
        }
    ],
    'isPerpetualValues': [{
            'id': '2c91809c7cb51f31017cb526b0d5000b',
            'value': 'yes',
            'label': 'Yes'
        },
        {
            'id': '2c91809c7cb51f31017cb526b0da000c',
            'value': 'no',
            'label': 'No'
        }
    ],
    'contactRoleValues': [{
            'id': '2c91809c7cb51f31017cb526b0a10001',
            'value': 'agreement_owner',
            'label': 'Agreement owner'
        },
        {
            'id': '2c91809c7cb51f31017cb526b0a90002',
            'value': 'authorized_signatory',
            'label': 'Authorized signatory'
        },
        {
            'id': '2c91809c7cb51f31017cb526b0b00003',
            'value': 'erm_librarian',
            'label': 'ERM librarian'
        },
        {
            'id': '2c91809c7cb51f31017cb526b0b50004',
            'value': 'subject_specialist',
            'label': 'Subject specialist'
        }
    ],
    'orgRoleValues': [{
        'id': '2c91809c7cb51f31017cb526b1fb0041',
        'value': 'content_provider',
        'label': 'Content provider'
    }],
    'supplementaryProperties': '[]',
    'tagsValues': [{
            'id': 'd4139528-ce38-4c2d-b844-17ddb2222208',
            'label': 'catalogingrecords',
            'metadata': {
                'createdDate': '2021-10-25T06:00:39.667315Z',
                'createdByUserId': 'ee19b844-ee98-5bec-8ddf-7f1735a511bd'
            }
        },
        {
            'id': 'b3ed86fe-2382-409f-bbf0-bd07f59412b0',
            'label': 'important',
            'metadata': {
                'createdDate': '2021-10-25T01:52:52.118149Z'
            }
        },
        {
            'id': '8b8a8cf2-81bf-4c5e-91ea-9041a64cd71c',
            'label': 'urgent',
            'description': 'Requires urgent attention',
            'metadata': {
                'createdDate': '2021-10-25T01:52:52.118149Z'
            }
        }
    ]
};

const filterHandlers = {
    state: () => {},
    checkbox: () => {},
    clear: () => {},
    clearGroup: () => {},
    reset: () => {}
};

export {
    activeFilters,
    data,
    filterHandlers
};
