const agreement = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [{
        'id': '373437a0-0023-48ce-b516-c4f8330576a6',
        'cancellationDeadline': '2021-10-26',
        'dateCreated': '2021-10-20T08:09:15Z',
        'isPerpetual': {
            'id': '2c91809c7c9b5f3a017c9b67f96a0001',
            'value': 'yes',
            'label': 'Yes'
        },
        'items': [{
            'id': 'c1b59b66-8ab6-4008-8b63-57160fc7f66c',
            'dateCreated': '2021-10-20T08:43:22Z',
            'activeTo': '2021-10-24',
            'tags': [],
            'lastUpdated': '2021-10-20T09:28:28Z',
            'owner': {
                'id': '373437a0-0023-48ce-b516-c4f8330576a6'
            },
            'resource': {
                'id': '2116cfd8-7e69-43c5-9ca1-1556d70296ff',
                'class': 'org.olf.kb.PackageContentItem',
                'name': "'AI & society' on Platform 'SpringerLink' in Package Springer:Journals:Archiv:Nationallizenzen",
                'suppressFromDiscovery': false,
                'tags': '[]',
                'coverage': '[{…}]',
                'customCoverage': false,
                '_object': '{addedTimestamp: 1634695761679, class: "org.olf.kb.…}'
            },
            'activeFrom': '2021-10-08',
            'poLines': [
                '{id: "35825e38-5658-4e58-9b1d-1e99ed54e61d", owner:…}'
            ],
            'suppressFromDiscovery': false,
            'note': 'agreement line note',
            'coverage': [
                '{endDate: "2021-10-26", endIssue: "11", endVolume: …}'
            ],
            'customCoverage': true,
            'explanation': 'Agreement includes this item from a package specifically',
            'startDate': '2021-10-08',
            'endDate': '2021-10-24',
            'contentUpdated': null,
            'haveAccess': true
        }],
        'name': 'MR agreement test',
        'orgs': [],
        'externalLicenseDocs': [],
        'outwardRelationships': [{
            'id': '8e29f1cb-fcb5-481a-82f6-efee7798bc2b',
            'type': {
                'id': '2c91809c7c9b5f3a017c9b67fa6e002d',
                'value': 'provides_post-cancellation_access_for',
                'label': 'Provides post-cancellation access for'
            },
            'note': 'related agreement note',
            'outward': {
                'id': '373437a0-0023-48ce-b516-c4f8330576a6',
                'name': 'MR agreement test',
                'agreementStatus': '{id: "2c91809c7c9b5f3a017c9b67f9ef0011", label: "Ac…}',
                'startDate': '2021-10-01',
                'endDate': '2021-10-31'
            },
            'inward': {
                'id': '05a372bf-ebc4-4564-913d-6b3f4ba2c654',
                'name': 'MR agr test',
                'agreementStatus': '{id: "2c91809c7c9b5f3a017c9b67f9ef0011", label: "Ac…}',
                'startDate': '2021-10-15',
                'endDate': '2021-10-24'
            }
        }],
        'customProperties': {},
        'contacts': [{
            'id': '4795b652-6715-4268-9013-02b7b8d2b6c3',
            'owner': {
                'id': '373437a0-0023-48ce-b516-c4f8330576a6'
            },
            'role': {
                'id': '2c91809c7c9b5f3a017c9b67fa910034',
                'value': 'erm_librarian',
                'label': 'ERM librarian'
            },
            'user': '9e87bfea-2d31-4cc3-9cef-9e1e67553243'
        }],
        'tags': [],
        'lastUpdated': '2021-10-20T09:28:28Z',
        'inwardRelationships': [],
        'renewalPriority': {
            'id': '2c91809c7c9b5f3a017c9b67f99b0009',
            'value': 'for_review',
            'label': 'For review'
        },
        'endDate': '2021-10-31',
        'startDate': '2021-10-01',
        'linkedLicenses': [],
        'docs': [],
        'periods': [{
            'id': 'b40fe1bf-4d2f-461d-8236-81c934c0120a',
            'startDate': '2021-10-01',
            'cancellationDeadline': '2021-10-26',
            'owner': {
                'id': '373437a0-0023-48ce-b516-c4f8330576a6'
            },
            'note': 'agreement period note',
            'endDate': '2021-10-31',
            'periodStatus': 'current'
        }],
        'usageDataProviders': [],
        'agreementStatus': {
            'id': '2c91809c7c9b5f3a017c9b67f9ef0011',
            'value': 'active',
            'label': 'Active'
        },
        'supplementaryDocs': [],
        'description': 'agreement description',
        'alternateNames': [],
        'relatedAgreements': [{
            'id': '8e29f1cb-fcb5-481a-82f6-efee7798bc2b',
            'note': 'related agreement note',
            'agreement': {
                'id': '05a372bf-ebc4-4564-913d-6b3f4ba2c654',
                'name': 'MR agr test',
                'agreementStatus': '{id: "2c91809c7c9b5f3a017c9b67f9ef0011", label: "Ac…}',
                'startDate': '2021-10-15',
                'endDate': '2021-10-24'
            },
            'type': 'provides_post-cancellation_access_for'
        }]
    }],
    'successfulMutations': [],
    'failedMutations': [],
    'pendingMutations': [],
    'loadedAt': 'Wed Oct 20 2021 12:00:17 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/sas/373437a0-0023-48ce-b516-c4f8330576a6',
    'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
    'httpStatus': 200,
    'other': {
        'totalRecords': null
    },
    'resource': 'agreement',
    'module': '@folio/agreements',
    'throwErrors': true
};

const agreementLines = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [{
        'id': 'c1b59b66-8ab6-4008-8b63-57160fc7f66c',
        'dateCreated': '2021-10-20T08:43:22Z',
        'activeTo': '2021-10-24',
        'tags': [],
        'lastUpdated': '2021-10-20T09:28:28Z',
        'owner': {
            'id': '373437a0-0023-48ce-b516-c4f8330576a6',
            'cancellationDeadline': '2021-10-26',
            'dateCreated': '2021-10-20T08:09:15Z',
            'isPerpetual': '{id: "2c91809c7c9b5f3a017c9b67f96a0001", label: "Ye…}',
            'name': 'MR agreement test',
            'orgs': '[]',
            'externalLicenseDocs': '[]',
            'outwardRelationships': '[{…}]',
            'customProperties': '{}',
            'contacts': '[{…}]',
            'tags': '[]',
            'lastUpdated': '2021-10-20T09:28:28Z',
            'inwardRelationships': '[]',
            'renewalPriority': '{id: "2c91809c7c9b5f3a017c9b67f99b0009", label: "Fo…}',
            'endDate': '2021-10-31',
            'startDate': '2021-10-01',
            'linkedLicenses': '[]',
            'docs': '[]',
            'periods': '[{…}]',
            'usageDataProviders': '[]',
            'agreementStatus': '{id: "2c91809c7c9b5f3a017c9b67f9ef0011", label: "Ac…}',
            'supplementaryDocs': '[]',
            'description': 'agreement description',
            'alternateNames': '[]'
        },
        'resource': {
            'id': '2116cfd8-7e69-43c5-9ca1-1556d70296ff',
            'class': 'org.olf.kb.PackageContentItem',
            'name': "'AI & society' on Platform 'SpringerLink' in Package Springer:Journals:Archiv:Nationallizenzen",
            'suppressFromDiscovery': false,
            'tags': '[]',
            'coverage': '[{…}]',
            'customCoverage': false,
            '_object': '{addedTimestamp: 1634695761679, class: "org.olf.kb.…}'
        },
        'activeFrom': '2021-10-08',
        'poLines': [
            '{id: "35825e38-5658-4e58-9b1d-1e99ed54e61d", owner:…}'
        ],
        'suppressFromDiscovery': false,
        'note': 'agreement line note',
        'coverage': [
            '{endDate: "2021-10-26", endIssue: "11", endVolume: …}'
        ],
        'customCoverage': true,
        'explanation': 'Agreement includes this item from a package specifically',
        'startDate': '2021-10-08',
        'endDate': '2021-10-24',
        'contentUpdated': null,
        'haveAccess': true
    }],
    'successfulMutations': [],
    'failedMutations': [],
    'pendingMutations': [],
    'loadedAt': 'Wed Oct 20 2021 12:00:17 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/entitlements?filters=owner%3D373437a0-0023-48ce-b516-c4f8330576a6&perPage=10&sort=resource.name&stats=true',
    'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
    'httpStatus': 200,
    'other': {
        'pageSize': 10,
        'page': 1,
        'totalPages': 1,
        'meta': '{}',
        'totalRecords': 1,
        'total': 1
    },
    'resource': 'agreementLines',
    'module': '@folio/agreements',
    'throwErrors': true
};

const agreementEresources = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [{
        'id': '2116cfd8-7e69-43c5-9ca1-1556d70296ff',
        'class': 'org.olf.kb.PackageContentItem',
        'name': "'AI & society' on Platform 'SpringerLink' in Package Springer:Journals:Archiv:Nationallizenzen",
        'suppressFromDiscovery': false,
        'tags': [],
        'coverage': [
            '{endDate: "2021-10-26", endIssue: "11", endVolume: …}'
        ],
        'customCoverage': true,
        '_object': {
            'id': '2116cfd8-7e69-43c5-9ca1-1556d70296ff',
            'dateCreated': '2021-10-20T02:12:50Z',
            'tags': '[]',
            'lastUpdated': '2021-10-20T02:12:50Z',
            'depth': 'Fulltext',
            'coverage': '[{…}]',
            'pti': '{class: "org.olf.kb.PlatformTitleInstance", coverag…}',
            'pkg': '{class: "org.olf.kb.Pkg", dateCreated: "2021-10-20T…}',
            'addedTimestamp': 1634695761679,
            'name': "'AI & society' on Platform 'SpringerLink' in Package Springer:Journals:Archiv:Nationallizenzen",
            'lastSeenTimestamp': 1634695761679,
            'suppressFromDiscovery': false,
            'longName': "'AI & society' on Platform 'SpringerLink' in Package Springer:Journals:Archiv:Nationallizenzen",
            'class': 'org.olf.kb.PackageContentItem'
        }
    }],
    'successfulMutations': [],
    'failedMutations': [],
    'pendingMutations': [],
    'loadedAt': 'Wed Oct 20 2021 12:00:17 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/sas/373437a0-0023-48ce-b516-c4f8330576a6/resources/current?perPage=10&sort=pti.titleInstance.name%3Basc&stats=true',
    'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
    'httpStatus': 200,
    'other': {
        'pageSize': 10,
        'page': 1,
        'totalPages': 1,
        'meta': '{}',
        'totalRecords': 1,
        'total': 1
    },
    'resource': 'agreementEresources',
    'module': '@folio/agreements',
    'throwErrors': true
};

const eresourcesFilterPath = 'current';

const interfaces = {
    'hasLoaded': false,
    'isPending': false,
    'failed': false,
    'records': [],
    'successfulMutations': [],
    'failedMutations': [],
    'pendingMutations': []
};

const orderLines = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [{
        'id': '556abc25-ebbf-3fb2-b478-1bfaff0af4dc',
        'edition': 'First edition',
        'checkinItems': false,
        'agreementId': '09c6ed1b-3984-4d9a-8f9b-e1200b68b61c',
        'acquisitionMethod': 'Purchase',
        'alerts': [],
        'cancellationRestriction': false,
        'cancellationRestrictionNote': '',
        'claims': [
            '{claimed: false, grace: 0}'
        ],
        'collection': false,
        'contributors': [],
        'cost': {
            'listUnitPrice': 0,
            'listUnitPriceElectronic': 0,
            'currency': 'USD',
            'additionalCost': 0,
            'discount': 0,
            'discountType': 'percentage',
            'quantityPhysical': 2,
            'quantityElectronic': 0,
            'poLineEstimatedPrice': 0
        },
        'description': '',
        'details': {
            'receivingNote': '',
            'productIds': '[{…}]',
            'subscriptionInterval': 0
        },
        'donor': '',
        'fundDistribution': [
            '{code: "UNIV-SUBN", distributionType: "percentage",…}'
        ],
        'isPackage': false,
        'locations': [
            '{locationId: "758258bc-ecc1-41b8-abca-f7b610822ffd"…}'
        ],
        'orderFormat': 'Other',
        'paymentStatus': 'Pending',
        'physical': {
            'materialType': 'dd0bf600-dbd9-44ab-9ff2-e2a61a6539f1',
            'materialSupplier': 'e0fb5df2-cdf1-11e8-a8d5-f2801f1b9fd1',
            'volumes': '["vol. 1"]'
        },
        'poLineDescription': '',
        'poLineNumber': '81-1',
        'publicationDate': '1915',
        'publisher': 'American Bar Association',
        'purchaseOrderId': 'c27e60f9-6361-44c1-976e-0c4821a33a7d',
        'receiptStatus': 'Pending',
        'reportingCodes': [],
        'requester': '',
        'rush': false,
        'selector': '',
        'source': 'User',
        'tags': {
            'tagList': '["CatalogingRecords"]'
        },
        'titleOrPackage': 'ABA Journal',
        'vendorDetail': {
            'instructions': '',
            'noteFromVendor': '',
            'vendorAccount': '',
            'referenceNumbers': '[]'
        },
        'metadata': {
            'createdDate': '2021-10-20T01:52:48.607+00:00',
            'updatedDate': '2021-10-20T01:52:48.607+00:00'
        }
    }],
    'successfulMutations': [],
    'failedMutations': [],
    'pendingMutations': [],
    'loadedAt': 'Wed Oct 20 2021 12:00:35 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/orders/order-lines?limit=1000&query=id%3D%3D556abc25-ebbf-3fb2-b478-1bfaff0af4dc',
    'headers': 'Headers(undefined) {"content-type" => "application/json"}',
    'httpStatus': 200,
    'other': {
        'totalRecords': 1
    },
    'resource': 'orderLines',
    'module': '@folio/agreements',
    'throwErrors': false
};

const query = {
    'query': '',
    'filters': 'agreementStatus.active,agreementStatus.draft,agreementStatus.in_negotiation,agreementStatus.requested',
    'sort': 'name'
};

const settings = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [],
    'successfulMutations': [],
    'failedMutations': [],
    'pendingMutations': [],
    'loadedAt': 'Wed Oct 20 2021 12:00:17 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/configurations/entries?query=(module=AGREEMENTS%20and%20configName=general)',
    'headers': 'Headers(undefined) {"content-type" => "application/json"}',
    'httpStatus': 200,
    'other': {
        'totalRecords': 0,
        'resultInfo': '{diagnostics: Array(0), facets: Array(0), totalReco…}'
    },
    'resource': 'settings',
    'module': '@folio/agreements',
    'throwErrors': true
};

const users = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [{
        'username': 'devan',
        'id': '9e87bfea-2d31-4cc3-9cef-9e1e67553243',
        'barcode': '649452403745915',
        'active': false,
        'type': 'patron',
        'patronGroup': 'ad0bc554-d5bc-463c-85d1-5562127ae91b',
        'departments': [],
        'proxyFor': [],
        'personal': {
            'lastName': 'Miller',
            'firstName': 'Lolita',
            'middleName': 'Dayton',
            'email': 'muriel@jaskolski-hand-and-shields.so',
            'phone': '094-136-9018 x0864',
            'mobilePhone': '(124)569-8555 x042',
            'dateOfBirth': '1950-10-14T00:00:00.000+00:00',
            'addresses': '[{…}]',
            'preferredContactTypeId': '005'
        },
        'enrollmentDate': '2018-09-22T00:00:00.000+00:00',
        'expirationDate': '2020-06-13T00:00:00.000+00:00',
        'createdDate': '2021-10-20T01:53:04.298+00:00',
        'updatedDate': '2021-10-20T01:53:04.298+00:00',
        'metadata': {
            'createdDate': '2021-10-20T01:53:04.295+00:00',
            'updatedDate': '2021-10-20T01:53:04.295+00:00'
        }
    }],
    'successfulMutations': [],
    'failedMutations': [],
    'pendingMutations': [],
    'loadedAt': 'Wed Oct 20 2021 12:00:35 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/users?limit=100&query=id%3D%3D9e87bfea-2d31-4cc3-9cef-9e1e67553243',
    'headers': 'Headers(undefined) {"content-type" => "application/json"}',
    'httpStatus': 200,
    'other': {
        'totalRecords': 1,
        'resultInfo': '{diagnostics: Array(0), facets: Array(0), totalReco…}'
    },
    'resource': 'users',
    'module': '@folio/agreements',
    'throwErrors': true
};

export {
    agreement,
    agreementLines,
    agreementEresources,
    eresourcesFilterPath,
    interfaces,
    orderLines,
    query,
    settings,
    users
};
