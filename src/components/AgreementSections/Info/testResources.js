const agreement = {
  'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef',
  'dateCreated': '2021-08-05T13:19:06Z',
  'agreementContentTypes': [
    {
      'id': '5e48d7f2-7d75-4aef-a9fe-35b50d542eb4',
      'contentType': {
        'id': '2c9180a6869847270186984d794a0008',
        'value': 'database',
        'label': 'Database'
      }
    },
    {
      'id': 'b5b68546-5759-45ed-9e54-3acd12c764d7',
      'contentType': {
        'id': '2c9180a6869847270186984d79410006',
        'value': 'books',
        'label': 'Books'
      }
    }
  ],
  'isPerpetual': {
    'id': '2c9180bb7b145d7e017b145e13b40028',
    'value': 'yes',
    'label': 'Yes'
  },
  'renewalPriority': {
    'id': '2c9180bb7b145d7e017b145e13d1002f',
    'value': 'definitely_renew',
    'label': 'Definitely renew'
  },
  'name': 'AM ag 1',
  'orgs': [
    {
      'id': 'ee82bf12-dd9d-4e59-8d91-81e1f4b9e933',
      'primaryOrg': false,
      'org': {
        'id': '7640fcd3-a757-47d7-a7fa-57b07b4490fc',
        'orgsUuid': '80fb5168-cdf1-11e8-a8d5-f2801f1b9fd1',
        'name': 'American Chemical Society',
        'orgsUuid_object': {
          'id': '80fb5168-cdf1-11e8-a8d5-f2801f1b9fd1',
          'name': 'American Chemical Society',
          'code': 'ACSO',
          'description': 'Serials - Domestic',
          'exportToAccounting': true,
          'status': 'Active',
          'language': 'en-us',
          'aliases': [
            {
              'value': 'ACS',
              'description': ''
            }
          ],
          'addresses': [
            {
              'addressLine1': '1155 Sixteenth Street, NW',
              'addressLine2': '',
              'city': 'Washington',
              'stateRegion': 'DC',
              'zipCode': '20036',
              'country': 'USA',
              'isPrimary': true,
              'categories': [],
              'language': 'English'
            }
          ],
          'phoneNumbers': [
            {
              'phoneNumber': '1-800-333-9511',
              'categories': [],
              'isPrimary': true,
              'language': 'English'
            }
          ],
          'emails': [
            {
              'value': 'service@acs.org',
              'description': 'Customer Service',
              'isPrimary': true,
              'categories': [],
              'language': 'English'
            }
          ],
          'urls': [
            {
              'value': 'https://www.acs.org/content/acs/en.html',
              'description': 'main English language website',
              'language': 'en-us',
              'isPrimary': true,
              'categories': [
                'f52ceea4-8e35-404b-9ebd-5c7db6613195'
              ],
              'notes': ''
            }
          ],
          'contacts': [
            '80fb5168-cdf1-11e8-a8d5-f2801f1b9fd1'
          ],
          'agreements': [
            {
              'name': 'ACS Web Editions',
              'discount': 0,
              'referenceUrl': 'https://www.acs.org/content/acs/en.html',
              'notes': 'Multiyear agreement (2018-2020)'
            }
          ],
          'erpCode': 'G64758-74831',
          'paymentMethod': 'EFT',
          'accessProvider': true,
          'governmental': false,
          'licensor': true,
          'materialSupplier': true,
          'vendorCurrencies': [
            'USD'
          ],
          'claimingInterval': 0,
          'discountPercent': 0,
          'expectedActivationInterval': 30,
          'expectedInvoiceInterval': 30,
          'renewalActivationInterval': 365,
          'subscriptionInterval': 365,
          'expectedReceiptInterval': 30,
          'taxId': '',
          'liableForVat': false,
          'taxPercentage': 0,
          'interfaces': [
            '60b952a6-5570-44f3-9972-f00c9dcb098e'
          ],
          'accounts': [
            {
              'name': 'Serialst',
              'accountNo': 'xxxx2149',
              'description': 'Libraries',
              'appSystemNo': '',
              'paymentMethod': 'EFT',
              'accountStatus': 'Active',
              'contactInfo': 'liblink@acs.org',
              'libraryCode': 'COB',
              'libraryEdiCode': '765987610',
              'notes': '',
              'acqUnitIds': []
            }
          ],
          'isVendor': true,
          'sanCode': '1234567',
          'changelogs': [
            {
              'description': 'This is a sample note.',
              'timestamp': '2008-05-15T10:53:00.000+00:00'
            }
          ],
          'acqUnitIds': [],
          'metadata': {
            'createdDate': '2021-08-05T03:23:39.417+00:00',
            'updatedDate': '2021-08-05T03:23:39.417+00:00'
          }
        }
      },
      'owner': {
        'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
      },
      'roles': [
        {
          'id': 'f93db396-26f4-4ee0-ab91-652e61af4f0f',
          'owner': {
            'id': 'ee82bf12-dd9d-4e59-8d91-81e1f4b9e933'
          },
          'role': {
            'id': '2c9180bb7b145d7e017b145e133a000b',
            'value': 'content_provider',
            'label': 'Content provider'
          }
        }
      ],
      'note': 'test org',
      'interfaces': [
        {
          'id': '60b952a6-5570-44f3-9972-f00c9dcb098e',
          'name': 'American Chemical Society Web Editions',
          'uri': 'https://pubs.acs.org/',
          'available': true,
          'deliveryMethod': 'Online',
          'statisticsFormat': 'COUNTER',
          'locallyStored': 'https://www.lib.sample.edu/staff/collectiondevelopment/',
          'onlineLocation': 'http://www.acs.org/content/acs/en.html',
          'type': [
            'End user',
            'Invoices'
          ],
          'metadata': {
            'createdDate': '2021-08-05T03:23:39.947+00:00',
            'updatedDate': '2021-08-05T03:23:39.947+00:00'
          }
        }
      ]
    }
  ],
  'externalLicenseDocs': [],
  'outwardRelationships': [
    {
      'id': 'edb061c5-3d5c-44aa-81c6-411af5cdbe75',
      'type': {
        'id': '2c9180bb7b145d7e017b145e1342000d',
        'value': 'supersedes',
        'label': 'Supersedes'
      },
      'note': 'test note',
      'outward': {
        'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef',
        'name': 'AM ag 1',
        'agreementStatus': {
          'id': '2c9180bb7b145d7e017b145e14130038',
          'value': 'active',
          'label': 'Active'
        },
        'startDate': '2021-08-05',
        'endDate': null
      },
      'inward': {
        'id': '1bec926d-abc0-4296-b783-d032b79dcc5e',
        'name': 'Special Test Agreement',
        'agreementStatus': {
          'id': '2c9180bb7b145d7e017b145e14130038',
          'value': 'active',
          'label': 'Active'
        },
        'startDate': '2021-08-01',
        'endDate': '2021-08-31'
      }
    }
  ],
  'customProperties': {},
  'contacts': [
    {
      'id': 'fd0847b9-34e8-4917-b2e1-9fdbe8d9a390',
      'owner': {
        'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
      },
      'role': {
        'id': '2c9180bb7b145d7e017b145e13200006',
        'value': 'agreement_owner',
        'label': 'Agreement owner'
      },
      'user': {
        'username': 'diku',
        'id': '4e9caea9-23dc-552d-9c1e-d8efb9924cf9',
        'active': true,
        'departments': [],
        'proxyFor': [],
        'personal': {
          'lastName': 'SYSTEM',
          'firstName': 'EDGE',
          'addresses': []
        },
        'createdDate': '2021-08-05T03:32:19.249+00:00',
        'updatedDate': '2021-08-05T03:32:19.249+00:00',
        'metadata': {
          'createdDate': '2021-08-05T03:32:19.240+00:00',
          'createdByUserId': '2fc7d652-4271-5a89-8542-b26a8d8ab95c',
          'updatedDate': '2021-08-05T03:32:19.240+00:00',
          'updatedByUserId': '2fc7d652-4271-5a89-8542-b26a8d8ab95c'
        }
      }
    }
  ],
  'tags': [],
  'lastUpdated': '2021-08-05T19:27:24Z',
  'inwardRelationships': [],
  'startDate': '2021-08-05',
  'linkedLicenses': [],
  'docs': [],
  'periods': [
    {
      'id': '1ce4c5c0-35fc-4d8a-b5b4-428858f17ba5',
      'startDate': '2021-08-05',
      'owner': {
        'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
      },
      'periodStatus': 'current'
    }
  ],
  'usageDataProviders': [
    {
      'id': '2c9180bb7b145d7e017b16ec6ef7004a',
      'remoteId': '9362de60-f8b2-4073-bee3-01fa5fc8462f',
      'remoteId_object': {
        'id': '9362de60-f8b2-4073-bee3-01fa5fc8462f',
        'label': 'Alexander Street Press',
        'harvestingConfig': {
          'harvestingStatus': 'active',
          'harvestVia': 'aggregator',
          'aggregator': {
            'id': '5b6ba83e-d7e5-414e-ba7b-134749c0d950',
            'name': 'German National Statistics Server',
            'vendorCode': 'ALEXS'
          },
          'reportRelease': 4,
          'requestedReports': [
            'JR5',
            'JR1'
          ],
          'harvestingStart': '2015-01'
        },
        'sushiCredentials': {
          'customerId': '0000000',
          'requestorId': 'electronic@lib.opentown.edu',
          'requestorMail': 'electronic@lib.optentown.edu'
        },
        'hasFailedReport': 'no',
        'reportErrorCodes': [],
        'reportTypes': [],
        'notes': 'Please fill in your own credentials: customer ID and requestor ID, name and mail are only demonstrational.',
        'metadata': {
          'createdDate': '2021-08-05T03:31:41.607+00:00',
          'updatedDate': '2021-08-05T03:31:41.607+00:00'
        }
      },
      'owner': {
        'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
      },
      'usageDataProviderNote': 'usage data note'
    }
  ],
  'agreementStatus': {
    'id': '2c9180bb7b145d7e017b145e14130038',
    'value': 'active',
    'label': 'Active'
  },
  'supplementaryDocs': [],
  'description': 'test desc 1',
  'endDate': null,
  'cancellationDeadline': null,
  'items': [
    {
      'id': '26a19e0e-4955-4c53-9042-91b4b6d0cd7e'
    }
  ],
  'alternateNames': [
    {
      'id': '7ac02b89-2c39-4679-9426-791064c22e6b',
      'owner': {
        'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
      },
      'name': 'alternatename1'
    },
    {
      'id': '39aad4da-2092-42a3-9d54-aca8abd62fd8',
      'owner': {
        'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
      },
      'name': 'alternatename2'
    }
  ],
  'relatedAgreements': [
    {
      'id': 'edb061c5-3d5c-44aa-81c6-411af5cdbe75',
      'note': 'test note',
      'type': 'supersedes'
    }
  ],
  'lines': [
    {
      'id': '26a19e0e-4955-4c53-9042-91b4b6d0cd7e',
      'dateCreated': '2021-08-05T13:19:38Z',
      'tags': [],
      'lastUpdated': '2021-08-05T13:49:05Z',
      'owner': {
        'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef',
        'dateCreated': '2021-08-05T13:19:06Z',
        'isPerpetual': {
          'id': '2c9180bb7b145d7e017b145e13b40028',
          'value': 'yes',
          'label': 'Yes'
        },
        'name': 'AM ag 1',
        'orgs': [
          {
            'id': 'ee82bf12-dd9d-4e59-8d91-81e1f4b9e933',
            'primaryOrg': false,
            'org': {
              'id': '7640fcd3-a757-47d7-a7fa-57b07b4490fc',
              'orgsUuid': '80fb5168-cdf1-11e8-a8d5-f2801f1b9fd1',
              'name': 'American Chemical Society'
            },
            'owner': {
              'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
            },
            'roles': [
              {
                'id': 'f93db396-26f4-4ee0-ab91-652e61af4f0f',
                'owner': {
                  'id': 'ee82bf12-dd9d-4e59-8d91-81e1f4b9e933'
                },
                'role': {
                  'id': '2c9180bb7b145d7e017b145e133a000b',
                  'value': 'content_provider',
                  'label': 'Content provider'
                }
              }
            ],
            'note': 'test org'
          }
        ],
        'externalLicenseDocs': [],
        'outwardRelationships': [
          {
            'id': 'edb061c5-3d5c-44aa-81c6-411af5cdbe75',
            'type': {
              'id': '2c9180bb7b145d7e017b145e1342000d',
              'value': 'supersedes',
              'label': 'Supersedes'
            },
            'note': 'test note',
            'outward': {
              'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef',
              'name': 'AM ag 1',
              'agreementStatus': {
                'id': '2c9180bb7b145d7e017b145e14130038',
                'value': 'active',
                'label': 'Active'
              },
              'startDate': '2021-08-05',
              'endDate': null
            },
            'inward': {
              'id': '1bec926d-abc0-4296-b783-d032b79dcc5e',
              'name': 'Special Test Agreement',
              'agreementStatus': {
                'id': '2c9180bb7b145d7e017b145e14130038',
                'value': 'active',
                'label': 'Active'
              },
              'startDate': '2021-08-01',
              'endDate': '2021-08-31'
            }
          }
        ],
        'customProperties': {},
        'contacts': [
          {
            'id': 'fd0847b9-34e8-4917-b2e1-9fdbe8d9a390',
            'owner': {
              'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
            },
            'role': {
              'id': '2c9180bb7b145d7e017b145e13200006',
              'value': 'agreement_owner',
              'label': 'Agreement owner'
            },
            'user': '4e9caea9-23dc-552d-9c1e-d8efb9924cf9'
          }
        ],
        'tags': [],
        'lastUpdated': '2021-08-05T19:27:24Z',
        'inwardRelationships': [],
        'startDate': '2021-08-05',
        'linkedLicenses': [],
        'docs': [],
        'periods': [
          {
            'id': '1ce4c5c0-35fc-4d8a-b5b4-428858f17ba5',
            'startDate': '2021-08-05',
            'owner': {
              'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
            },
            'periodStatus': 'current'
          }
        ],
        'usageDataProviders': [
          {
            'id': '2c9180bb7b145d7e017b16ec6ef7004a',
            'remoteId': '9362de60-f8b2-4073-bee3-01fa5fc8462f',
            'owner': {
              'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
            },
            'usageDataProviderNote': 'usage data note'
          }
        ],
        'agreementStatus': {
          'id': '2c9180bb7b145d7e017b145e14130038',
          'value': 'active',
          'label': 'Active'
        },
        'supplementaryDocs': [],
        'description': 'test desc 1',
        'endDate': null,
        'cancellationDeadline': null,
        'items': [
          {
            'id': '26a19e0e-4955-4c53-9042-91b4b6d0cd7e'
          }
        ],
        'alternateNames': [
          {
            'id': '7ac02b89-2c39-4679-9426-791064c22e6b',
            'owner': {
              'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
            },
            'name': 'alternatename1'
          },
          {
            'id': '39aad4da-2092-42a3-9d54-aca8abd62fd8',
            'owner': {
              'id': '1070dcf8-a3a7-4fcd-9218-b54ad6ad67ef'
            },
            'name': 'alternatename2'
          }
        ]
      },
      'resource': {
        'id': '0640e4c0-ac25-406a-97ec-a764ad379caa',
        'class': 'org.olf.kb.Pkg',
        'name': 'Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz',
        'suppressFromDiscovery': false,
        'tags': [],
        'customCoverage': false,
        '_object': {
          'id': '0640e4c0-ac25-406a-97ec-a764ad379caa',
          'dateCreated': '2021-08-05T04:05:23Z',
          'tags': [],
          'lastUpdated': '2021-08-05T04:05:23Z',
          'vendor': {
            'id': '6cf8a941-717b-4f5c-be67-57c270b6ce2f',
            'name': 'Edward Elgar'
          },
          'coverage': [],
          'source': 'GOKb',
          'remoteKb': {
            'id': '1b226bb8-c16b-45c5-adc9-ef3422b92149',
            'cursor': '2021-08-05T13:51:56Z',
            'active': true,
            'trustedSourceTI': false,
            'activationEnabled': false,
            'readonly': false,
            'syncStatus': 'idle',
            'lastCheck': 1628184749473,
            'name': 'GOKb_TEST',
            'type': 'org.olf.kb.adapters.GOKbOAIAdapter',
            'fullPrefix': 'gokb',
            'uri': 'https://gokbt.gbv.de/gokb/oai/index',
            'supportsHarvesting': true,
            'rectype': 1
          },
          'name': 'Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz',
          'suppressFromDiscovery': false,
          'reference': 'Edward_Elgar:Edward_Elgar_E-Book_Archive_in_Business_&_Management,_Economics_and_Finance:Nationalliz',
          'resourceCount': 2540,
          'class': 'org.olf.kb.Pkg'
        }
      },
      'poLines': [
        {
          'id': '73a2a7e2-48a8-4582-99ce-61737bec2322',
          'poLineId': 'bf9ba27d-25be-4b60-b031-a0f3783f82a7',
          'owner': {
            'id': '26a19e0e-4955-4c53-9042-91b4b6d0cd7e'
          }
        }
      ],
      'suppressFromDiscovery': false,
      'customCoverage': false,
      'explanation': 'Agreement includes a package containing this item',
      'startDate': null,
      'endDate': null,
      'activeFrom': null,
      'activeTo': null,
      'contentUpdated': null,
      'haveAccess': true
    }
  ],
  'agreementLinesCount': 1,
  'orderLines': [
    {
      'id': 'bf9ba27d-25be-4b60-b031-a0f3783f82a7',
      'edition': '',
      'checkinItems': false,
      'acquisitionMethod': 'Approval Plan',
      'alerts': [],
      'claims': [],
      'collection': false,
      'contributors': [
        {
          'contributor': 'Moutinho, Luiz',
          'contributorNameTypeId': '2b94c631-fca9-4892-a730-03ee529ffe2a'
        }
      ],
      'cost': {
        'listUnitPrice': 2,
        'currency': 'USD',
        'discount': 10,
        'discountType': 'percentage',
        'quantityPhysical': 1,
        'poLineEstimatedPrice': 1.8
      },
      'details': {
        'productIds': [
          {
            'productId': '9783319643991',
            'productIdType': '8261054f-be78-422d-bd51-4ed9f33c3422',
            'qualifier': ''
          }
        ],
        'subscriptionInterval': 0
      },
      'eresource': {
        'activated': false,
        'createInventory': 'Instance, Holding',
        'trial': false,
        'accessProvider': '50fb6ae0-cdf1-11e8-a8d5-f2801f1b9fd1'
      },
      'fundDistribution': [
        {
          'code': 'USHIST',
          'fundId': '65032151-39a5-4cef-8810-5350eb316300',
          'distributionType': 'percentage',
          'value': 100
        }
      ],
      'instanceId': '1640f178-f243-4e4a-bf1c-9e1e62b3171d',
      'isPackage': false,
      'locations': [
        {
          'holdingId': '45d34e51-aed8-4baf-ac7d-e75943218e70',
          'quantity': 1,
          'quantityPhysical': 1
        }
      ],
      'orderFormat': 'Physical Resource',
      'paymentStatus': 'Awaiting Payment',
      'physical': {
        'createInventory': 'Instance, Holding, Item',
        'materialType': '1a54b431-2e4f-452d-9cae-9cee66c9a892',
        'materialSupplier': '50fb6ae0-cdf1-11e8-a8d5-f2801f1b9fd1',
        'volumes': []
      },
      'poLineNumber': '10002-1',
      'publisher': 'Palgrave Macmillan',
      'purchaseOrderId': '7a993b5a-055d-4c04-aece-b0b01c4d0bbb',
      'receiptStatus': 'Awaiting Receipt',
      'reportingCodes': [],
      'rush': false,
      'source': 'User',
      'titleOrPackage': 'Futures, biometrics and neuroscience research Luiz Moutinho, Mladen Sokele, editors',
      'vendorDetail': {
        'instructions': '',
        'vendorAccount': 'BRXXXXX-01',
        'referenceNumbers': []
      },
      'metadata': {
        'createdDate': '2021-08-05T10:04:02.593+00:00',
        'createdByUserId': '2fc7d652-4271-5a89-8542-b26a8d8ab95c',
        'updatedDate': '2021-08-05T10:14:36.327+00:00',
        'updatedByUserId': '2fc7d652-4271-5a89-8542-b26a8d8ab95c'
      }
    }
  ]
};

export default agreement;
