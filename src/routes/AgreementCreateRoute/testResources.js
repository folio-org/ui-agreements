const agreements = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [{
            'id': '36ca0fd6-874a-4505-99b0-f7f95dcc374b',
            'dateCreated': '2021-10-13T08:58:04Z',
            'name': 'GO test 1',
            'orgs': [],
            'externalLicenseDocs': [],
            'outwardRelationships': [],
            'customProperties': {},
            'contacts': [],
            'tags': [],
            'lastUpdated': '2021-10-13T09:05:01Z',
            'inwardRelationships': [],
            'startDate': '2021-10-01',
            'linkedLicenses': [],
            'docs': [],
            'periods': [
                '{id: "3df8a2dd-f37c-4c95-a69a-c6703446ee33", owner:…}'
            ],
            'usageDataProviders': [],
            'agreementStatus': {
                'id': '2c91809c7c7753a2017c775beafb002c',
                'value': 'active',
                'label': 'Active'
            },
            'supplementaryDocs': [],
            'endDate': null,
            'cancellationDeadline': null,
            'alternateNames': []
        },
        {
            'id': 'eb385aa3-ae19-4c0a-a64b-314c847578eb',
            'cancellationDeadline': '2021-10-26',
            'dateCreated': '2021-10-13T08:20:03Z',
            'isPerpetual': {
                'id': '2c91809c7c7753a2017c775bea97001c',
                'value': 'yes',
                'label': 'Yes'
            },
            'name': 'MR agr test',
            'orgs': [],
            'externalLicenseDocs': [],
            'outwardRelationships': [],
            'customProperties': {},
            'contacts': [],
            'tags': [],
            'lastUpdated': '2021-10-13T08:20:03Z',
            'inwardRelationships': [],
            'renewalPriority': {
                'id': '2c91809c7c7753a2017c775beabc0024',
                'value': 'for_review',
                'label': 'For review'
            },
            'endDate': '2021-10-31',
            'startDate': '2021-10-01',
            'linkedLicenses': [],
            'docs': [],
            'periods': [
                '{cancellationDeadline: "2021-10-26", endDate: "2021…}'
            ],
            'usageDataProviders': [],
            'agreementStatus': {
                'id': '2c91809c7c7753a2017c775beafb002c',
                'value': 'active',
                'label': 'Active'
            },
            'supplementaryDocs': [],
            'description': 'agreement description',
            'alternateNames': []
        },
        {
            'id': 'c779d337-7ac3-48b9-8082-1aa430c9ffb9',
            'cancellationDeadline': '2021-10-26',
            'dateCreated': '2021-10-13T09:56:56Z',
            'isPerpetual': {
                'id': '2c91809c7c7753a2017c775bea97001c',
                'value': 'yes',
                'label': 'Yes'
            },
            'name': 'MR agreement test',
            'orgs': [],
            'licenseNote': 'general notes',
            'externalLicenseDocs': [
                '{dateCreated: "2021-10-13T09:56:56Z", id: "87fe07b8…}'
            ],
            'outwardRelationships': [],
            'customProperties': {},
            'contacts': [
                '{id: "5368d332-4953-4146-a7f2-5abe083643ff", owner:…}'
            ],
            'tags': [],
            'lastUpdated': '2021-10-13T09:56:56Z',
            'inwardRelationships': [],
            'renewalPriority': {
                'id': '2c91809c7c7753a2017c775beabc0024',
                'value': 'for_review',
                'label': 'For review'
            },
            'endDate': '2021-10-31',
            'startDate': '2021-10-01',
            'linkedLicenses': [
                '{amendments: Array(0), id: "2c91809c7c7753a2017c791…}'
            ],
            'docs': [],
            'periods': [
                '{cancellationDeadline: "2021-10-26", endDate: "2021…}'
            ],
            'usageDataProviders': [],
            'agreementStatus': {
                'id': '2c91809c7c7753a2017c775beafb002c',
                'value': 'active',
                'label': 'Active'
            },
            'supplementaryDocs': [],
            'description': 'agreement description',
            'alternateNames': []
        },
        {
            'id': '76db53ff-bc66-4bc2-b24e-64b4cc1c9ef8',
            'dateCreated': '2021-10-13T08:12:31Z',
            'name': 'OS Test Agreement 1',
            'orgs': [],
            'externalLicenseDocs': [],
            'outwardRelationships': [],
            'customProperties': {},
            'contacts': [],
            'tags': [],
            'lastUpdated': '2021-10-13T08:13:08Z',
            'inwardRelationships': [],
            'startDate': '2021-10-01',
            'linkedLicenses': [],
            'docs': [],
            'periods': [
                '{id: "45b5e6cc-8afb-4c08-8004-6d7739ab41ac", owner:…}'
            ],
            'usageDataProviders': [],
            'agreementStatus': {
                'id': '2c91809c7c7753a2017c775beafb002c',
                'value': 'active',
                'label': 'Active'
            },
            'supplementaryDocs': [],
            'endDate': null,
            'cancellationDeadline': null,
            'alternateNames': []
        }
    ],
};

const agreementStatusValues = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [{
            'id': '545935cabb72167f9aa3b029ee643a9e',
            'value': 'closed',
            'label': 'Closed'
        },
        {
            'id': '2c91809c7c9112ac017c911abc87003c',
            'value': 'draft',
            'label': 'Draft'
        },
        {
            'id': '2c91809c7c9112ac017c911abc8b003d',
            'value': 'requested',
            'label': 'Requested'
        },
        {
            'id': '2c91809c7c9112ac017c911abc90003e',
            'value': 'in_negotiation',
            'label': 'In negotiation'
        },
        {
            'id': '2c91809c7c9112ac017c911abc94003f',
            'value': 'active',
            'label': 'Active'
        }
    ],
    'successfulMutations': [],
    'failedMutations': [],
    'pendingMutations': [],
    'loadedAt': 'Mon Oct 18 2021 10:40:22 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/refdata/SubscriptionAgreement/agreementStatus',
    'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
    'httpStatus': 200,
    'other': {
        'totalRecords': null
    },
    'resource': 'agreementStatusValues',
    'module': '@folio/agreements',
    'throwErrors': true
};

const reasonForClosureValues = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [{
            'id': 'ba477ca3eb21c07040c331b75d717127',
            'value': 'rejected',
            'label': 'Rejected'
        },
        {
            'id': '2c91809c7c9112ac017c911abc700039',
            'value': 'cancelled',
            'label': 'Cancelled'
        },
        {
            'id': '2c91809c7c9112ac017c911abc76003a',
            'value': 'ceased',
            'label': 'Ceased'
        },
        {
            'id': '2c91809c7c9112ac017c911abc7b003b',
            'value': 'superseded',
            'label': 'Superseded'
        }
    ],
    'successfulMutations': '[]',
    'failedMutations': '[]',
    'pendingMutations': '[]',
    'loadedAt': 'Mon Oct 18 2021 10:40:22 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/refdata/SubscriptionAgreement/reasonForClosure?perPage=100',
    'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
    'httpStatus': 200,
    'other': '{totalRecords: null}',
    'resource': 'reasonForClosureValues',
    'module': '@folio/agreements',
    'throwErrors': true
};

const amendmentStatusValues = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': '[{…}, {…}, {…}, {…}]',
    'successfulMutations': '[]',
    'failedMutations': '[]',
    'pendingMutations': '[]',
    'loadedAt': 'Mon Oct 18 2021 10:40:22 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/refdata/LicenseAmendmentStatus/status',
    'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
    'httpStatus': 200,
    'other': '{totalRecords: null}',
    'resource': 'amendmentStatusValues',
    'module': '@folio/agreements',
    'throwErrors': true
};

const contactRoleValues = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [{
            'id': '2c91809c7c9112ac017c911abb850007',
            'value': 'agreement_owner',
            'label': 'Agreement owner'
        },
        {
            'id': '2c91809c7c9112ac017c911abb8a0008',
            'value': 'authorized_signatory',
            'label': 'Authorized signatory'
        },
        {
            'id': '2c91809c7c9112ac017c911abb8f0009',
            'value': 'erm_librarian',
            'label': 'ERM librarian'
        },
        {
            'id': '2c91809c7c9112ac017c911abb95000a',
            'value': 'subject_specialist',
            'label': 'Subject specialist'
        }
    ],
    'successfulMutations': '[]',
    'failedMutations': '[]',
    'pendingMutations': '[]',
    'loadedAt': 'Mon Oct 18 2021 10:40:22 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/refdata/InternalContact/role?perPage=100',
    'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
    'httpStatus': 200,
    'other': {
        'totalRecords': null
    },
    'resource': 'contactRoleValues',
    'module': '@folio/agreements',
    'throwErrors': true
};

const externalAgreementLine = {
    'hasLoaded': false,
    'isPending': false,
    'failed': false,
    'records': '[]',
    'successfulMutations': '[]',
    'failedMutations': '[]',
    'pendingMutations': '[]'
};

const isPerpetualValues = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [{
            'id': '2c91809c7c9112ac017c911abc33002f',
            'value': 'yes',
            'label': 'Yes'
        },
        {
            'id': '2c91809c7c9112ac017c911abc370030',
            'value': 'no',
            'label': 'No'
        }
    ],
    'successfulMutations': '[]',
    'failedMutations': '[]',
    'pendingMutations': '[]',
    'loadedAt': 'Mon Oct 18 2021 10:40:22 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/refdata/SubscriptionAgreement/isPerpetual',
    'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
    'httpStatus': 200,
    'other': '{totalRecords: null}',
    'resource': 'isPerpetualValues',
    'module': '@folio/agreements',
    'throwErrors': true
};

const licenseLinkStatusValues = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [{
            'id': '2c91809c7c9112ac017c911abc24002b',
            'value': 'controlling',
            'label': 'Controlling'
        },
        {
            'id': '2c91809c7c9112ac017c911abc28002c',
            'value': 'future',
            'label': 'Future'
        },
        {
            'id': '2c91809c7c9112ac017c911abc2d002d',
            'value': 'historical',
            'label': 'Historical'
        }
    ],
    'successfulMutations': '[]',
    'failedMutations': '[]',
    'pendingMutations': '[]',
    'loadedAt': 'Mon Oct 18 2021 10:40:22 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/refdata/RemoteLicenseLink/status',
    'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
    'httpStatus': 200,
    'other': '{totalRecords: null}',
    'resource': 'licenseLinkStatusValues',
    'module': '@folio/agreements',
    'throwErrors': true
};

const orgRoleValues = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [{
        'id': '2c91809c7c9112ac017c911abc9d0041',
        'value': 'content_provider',
        'label': 'Content provider'
    }],
    'successfulMutations': '[]',
    'failedMutations': '[]',
    'pendingMutations': '[]',
    'loadedAt': 'Mon Oct 18 2021 10:40:22 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/refdata/SubscriptionAgreementOrg/role',
    'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
    'httpStatus': 200,
    'other': '{totalRecords: null}',
    'resource': 'orgRoleValues',
    'module': '@folio/agreements',
    'throwErrors': true
};

const relationshipTypeValues = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [{
            'id': '2c91809c7c9112ac017c911abbe7001c',
            'value': 'supersedes',
            'label': 'Supersedes'
        },
        {
            'id': '2c91809c7c9112ac017c911abbec001d',
            'value': 'provides_post-cancellation_access_for',
            'label': 'Provides post-cancellation access for'
        },
        {
            'id': '2c91809c7c9112ac017c911abbf1001e',
            'value': 'tracks_demand-driven_acquisitions_for',
            'label': 'Tracks demand-driven acquisitions for'
        },
        {
            'id': '2c91809c7c9112ac017c911abbf6001f',
            'value': 'related_to',
            'label': 'Related to'
        },
        {
            'id': '2c91809c7c9112ac017c911abbfb0020',
            'value': 'has_backfile_in',
            'label': 'Has backfile in'
        }
    ],
    'successfulMutations': '[]',
    'failedMutations': '[]',
    'pendingMutations': '[]',
    'loadedAt': 'Mon Oct 18 2021 10:40:22 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/refdata/AgreementRelationship/type',
    'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
    'httpStatus': 200,
    'other': '{totalRecords: null}',
    'resource': 'relationshipTypeValues',
    'module': '@folio/agreements',
    'throwErrors': true
};

const renewalPriorityValues = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [{
            'id': '2c91809c7c9112ac017c911abc540036',
            'value': 'definitely_renew',
            'label': 'Definitely renew'
        },
        {
            'id': '2c91809c7c9112ac017c911abc590037',
            'value': 'for_review',
            'label': 'For review'
        },
        {
            'id': '2c91809c7c9112ac017c911abc5e0038',
            'value': 'definitely_cancel',
            'label': 'Definitely cancel'
        }
    ],
    'successfulMutations': '[]',
    'failedMutations': '[]',
    'pendingMutations': '[]',
    'loadedAt': 'Mon Oct 18 2021 10:40:22 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/refdata/SubscriptionAgreement/renewalPriority?perPage=100',
    'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
    'httpStatus': 200,
    'other': '{totalRecords: null}',
    'resource': 'renewalPriorityValues',
    'module': '@folio/agreements',
    'throwErrors': true
};

const basket = [{
        'id': '5bb2be54-aebc-465e-aafb-195dee16657b',
        'class': 'org.olf.kb.Pkg',
        'name': 'Duncker & Humblot E-Books „Best of reprints“ WIRTSCHAFT & FINANZEN 1875–1941',
        'suppressFromDiscovery': false,
        'tags': '[]',
        'customCoverage': false,
        '_object': '{class: "org.olf.kb.Pkg", coverage: Array(0), dateC…}',
        'rowIndex': 0
    },
    {
        'id': '90367edb-3c6b-43ba-85e6-14d8e9ae4165',
        'class': 'org.olf.kb.PackageContentItem',
        'name': "'\"Wirtschaftswissenschaft?\": [Lujo Brentano zum siebzigsten Geburtst...' on Platform 'Duncker & Humblot eJournals' in Package Duncker & Humblot E-Books „Best of reprints“ WIRTSCHAFT & FINANZEN ...",
        'suppressFromDiscovery': false,
        'tags': '[]',
        'customCoverage': false,
        '_object': '{addedTimestamp: 1634522506184, class: "org.olf.kb.…}',
        'rowIndex': 1
    }
];

const query = {
    'query': ''
};

const documentCategories = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [{
            'id': '2c91809c7c9112ac017c911abbd60018',
            'value': 'license',
            'label': 'License'
        },
        {
            'id': '2c91809c7c9112ac017c911abbdb0019',
            'value': 'misc',
            'label': 'Misc'
        },
        {
            'id': '2c91809c7c9112ac017c911abbe0001a',
            'value': 'consortium_negotiation_document',
            'label': 'Consortium negotiation document'
        }
    ],
    'successfulMutations': '[]',
    'failedMutations': '[]',
    'pendingMutations': '[]',
    'loadedAt': 'Mon Oct 18 2021 10:40:22 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/refdata/DocumentAttachment/atType?perPage=100',
    'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
    'httpStatus': 200,
    'other': {
        'totalRecords': null
    },
    'resource': 'documentCategories',
    'module': '@folio/agreements',
    'throwErrors': true
};

export {
    agreements,
    agreementStatusValues,
    amendmentStatusValues,
    basket,
    contactRoleValues,
    documentCategories,
    externalAgreementLine,
    isPerpetualValues,
    licenseLinkStatusValues,
    orgRoleValues,
    query,
    reasonForClosureValues,
    relationshipTypeValues,
    renewalPriorityValues,
};
