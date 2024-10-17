const data = {
  supplementaryProperties: [
    {
      id: '2c9180c07cd98e75017cde9c56eb004e',
      name: 'testname',
      primary: true,
      defaultInternal: true,
      label: 'test label',
      description: 'test desc',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger'
    }
  ],
  agreement: {
    id: '17fd957e-f3f5-40ea-92d6-6b5451b3273d',
    cancellationDeadline: '2021-11-30',
    dateCreated: '2021-11-01T19:53:51Z',
    isPerpetual: {
      id: '2c9180c07cd98e75017cd98f03690031',
      value: 'yes',
      label: 'Yes'
    },
    items: [],
    name: 'AM ag 1',
    orgs: [
      {
        id: '93052f80-710e-4f6e-99e8-10152673d848',
        primaryOrg: true,
        org: {
          id: '1e316946-f754-4b1a-9046-0dbbf3075607',
          orgsUuid: '80fb5168-cdf1-11e8-a8d5-f2801f1b9fd1',
          name: 'American Chemical Society',
          orgsUuid_object: {
            id: '80fb5168-cdf1-11e8-a8d5-f2801f1b9fd1',
            name: 'American Chemical Society',
            code: 'ACSO',
            description: 'Serials - Domestic',
            exportToAccounting: true,
            status: 'Active',
            language: 'en-us',
            aliases: [
              {
                value: 'ACS',
                description: ''
              }
            ],
            addresses: [
              {
                addressLine1: '1155 Sixteenth Street, NW',
                addressLine2: '',
                city: 'Washington',
                stateRegion: 'DC',
                zipCode: '20036',
                country: 'USA',
                isPrimary: true,
                categories: [],
                language: 'English'
              }
            ],
            phoneNumbers: [
              {
                phoneNumber: '1-800-333-9511',
                categories: [],
                isPrimary: true,
                language: 'English'
              }
            ],
            emails: [
              {
                value: 'service@acs.org',
                description: 'Customer Service',
                isPrimary: true,
                categories: [],
                language: 'English'
              }
            ],
            urls: [
              {
                value: 'https://www.acs.org/content/acs/en.html',
                description: 'main English language website',
                language: 'en-us',
                isPrimary: true,
                categories: [
                  'f52ceea4-8e35-404b-9ebd-5c7db6613195'
                ],
                notes: ''
              }
            ],
            contacts: [
              '80fb5168-cdf1-11e8-a8d5-f2801f1b9fd1'
            ],
            agreements: [
              {
                name: 'ACS Web Editions',
                discount: 0,
                referenceUrl: 'https://www.acs.org/content/acs/en.html',
                notes: 'Multiyear agreement (2018-2020)'
              }
            ],
            erpCode: 'G64758-74831',
            paymentMethod: 'EFT',
            accessProvider: true,
            governmental: false,
            licensor: true,
            materialSupplier: true,
            vendorCurrencies: [
              'USD'
            ],
            claimingInterval: 0,
            discountPercent: 0,
            expectedActivationInterval: 30,
            expectedInvoiceInterval: 30,
            renewalActivationInterval: 365,
            subscriptionInterval: 365,
            expectedReceiptInterval: 30,
            taxId: '',
            liableForVat: false,
            taxPercentage: 0,
            interfaces: [
              '60b952a6-5570-44f3-9972-f00c9dcb098e'
            ],
            accounts: [
              {
                name: 'Serialst',
                accountNo: 'xxxx2149',
                description: 'Libraries',
                appSystemNo: '',
                paymentMethod: 'EFT',
                accountStatus: 'Active',
                contactInfo: 'liblink@acs.org',
                libraryCode: 'COB',
                libraryEdiCode: '765987610',
                notes: '',
                acqUnitIds: []
              }
            ],
            isVendor: true,
            sanCode: '1234567',
            changelogs: [
              {
                description: 'This is a sample note.',
                timestamp: '2008-05-15T10:53:00.000+00:00'
              }
            ],
            acqUnitIds: [],
            tags: {
              tagList: []
            },
            metadata: {
              createdDate: '2021-11-01T03:24:29.668+00:00',
              updatedDate: '2021-11-01T11:20:36.386+00:00',
              updatedByUserId: '3458d275-e5ce-57f7-b626-289a00db2498'
            }
          }
        },
        owner: {
          id: '17fd957e-f3f5-40ea-92d6-6b5451b3273d'
        },
        roles: [
          {
            id: '19e57817-ad09-4f8b-9322-1eb1e5bda22c',
            owner: {
              id: '93052f80-710e-4f6e-99e8-10152673d848'
            },
            role: {
              id: '2c9180c07cd98e75017cd98f02c6000e',
              value: 'content_provider',
              label: 'Content provider'
            },
            note: 'test org note'
          }
        ],
        interfaces: [
          {
            id: '60b952a6-5570-44f3-9972-f00c9dcb098e',
            name: 'American Chemical Society Web Editions',
            uri: 'https://pubs.acs.org/',
            available: true,
            deliveryMethod: 'Online',
            statisticsFormat: 'COUNTER',
            locallyStored: 'https://www.lib.sample.edu/staff/collectiondevelopment/',
            onlineLocation: 'http://www.acs.org/content/acs/en.html',
            type: [
              'End user',
              'Invoices'
            ],
            metadata: {
              createdDate: '2021-11-01T03:24:30.180+00:00',
              updatedDate: '2021-11-01T03:24:30.180+00:00'
            }
          }
        ]
      }
    ],
    licenseNote: 'test license info',
    externalLicenseDocs: [
      {
        id: 'c70517eb-9b08-4252-b9b7-be47d59e755d',
        dateCreated: '2021-11-01T21:34:49Z',
        lastUpdated: '2021-11-01T21:34:49Z',
        location: 'test loc',
        url: 'http://www.testurl.com',
        name: 'test ext license'
      }
    ],
    outwardRelationships: [
      {
        id: 'ff41b2a0-ec06-496a-b487-ca5a27d2ad12',
        type: {
          id: '2c9180c07cd98e75017cd98f02e70015',
          value: 'supersedes',
          label: 'Supersedes'
        },
        outward: {
          id: '17fd957e-f3f5-40ea-92d6-6b5451b3273d',
          name: 'AM ag 1',
          agreementStatus: {
            id: '2c9180c07cd98e75017cd98f03ec0041',
            value: 'active',
            label: 'Active'
          },
          startDate: '2021-11-02',
          endDate: '2021-11-24'
        },
        inward: {
          id: 'a16d787a-38f2-411c-b4e2-00a9bb80eb08',
          name: 'am ag 2',
          agreementStatus: {
            id: '2c9180c07cd98e75017cd98f03ec0041',
            value: 'active',
            label: 'Active'
          },
          startDate: '2021-11-09',
          endDate: null
        }
      }
    ],
    customProperties: {},
    contacts: [
      {
        id: '6445b045-e33a-4039-b2f6-4102b43fddc2',
        owner: {
          id: '17fd957e-f3f5-40ea-92d6-6b5451b3273d'
        },
        role: {
          id: '2c9180c07cd98e75017cd98f02d20011',
          value: 'authorized_signatory',
          label: 'Authorized signatory'
        },
        user: {
          username: 'acq-admin',
          id: 'e8003e49-f496-469b-a12e-40551e0ff0e4',
          barcode: '1635737848302575470',
          active: true,
          type: 'patron',
          patronGroup: '3684a786-6671-4268-8ed0-9db82ebca60b',
          departments: [],
          proxyFor: [],
          personal: {
            lastName: 'Admin',
            firstName: 'acq-admin',
            addresses: []
          },
          createdDate: '2021-11-01T03:37:28.324+00:00',
          updatedDate: '2021-11-01T03:37:28.324+00:00',
          metadata: {
            createdDate: '2021-11-01T03:37:28.320+00:00',
            createdByUserId: '3458d275-e5ce-57f7-b626-289a00db2498',
            updatedDate: '2021-11-01T03:37:28.320+00:00',
            updatedByUserId: '3458d275-e5ce-57f7-b626-289a00db2498'
          }
        }
      }
    ],
    tags: [],
    lastUpdated: '2021-11-01T21:34:49Z',
    inwardRelationships: [],
    renewalPriority: {
      id: '2c9180c07cd98e75017cd98f03920038',
      value: 'definitely_renew',
      label: 'Definitely renew'
    },
    endDate: '2021-11-24',
    startDate: '2021-11-02',
    linkedLicenses: [
      {
        id: '2c9180c07cd98e75017cdd6d239e004c',
        remoteId: 'ae8e486d-7570-4f8b-a29f-e9ec981d978f',
        remoteId_object: {
          id: 'ae8e486d-7570-4f8b-a29f-e9ec981d978f',
          endDateSemantics: {
            id: '2c9180bf7cd98e60017cd98f1edd0003',
            value: 'implicit',
            label: 'Implicit',
            owner: {
              id: '2c9180bf7cd98e60017cd98f1e5c0000',
              desc: 'License.EndDateSemantics',
              internal: true
            }
          },
          dateCreated: '2021-11-01T21:32:50Z',
          customProperties: {},
          contacts: [],
          tags: [],
          lastUpdated: '2021-11-01T21:32:50Z',
          docs: [],
          name: 'am license 2',
          status: {
            id: '2c9180bf7cd98e60017cd98f1ef80007',
            value: 'active',
            label: 'Active',
            owner: {
              id: '2c9180bf7cd98e60017cd98f1ee40004',
              desc: 'License.Status',
              internal: true
            }
          },
          supplementaryDocs: [],
          openEnded: false,
          amendments: [],
          orgs: [],
          type: {
            id: '2c9180bf7cd98e60017cd98f1f4a0013',
            value: 'local',
            label: 'Local',
            owner: {
              id: '2c9180bf7cd98e60017cd98f1f470012',
              desc: 'License.Type',
              internal: false
            }
          },
          alternateNames: []
        },
        owner: {
          id: '17fd957e-f3f5-40ea-92d6-6b5451b3273d'
        },
        amendments: [],
        status: {
          id: '2c9180c07cd98e75017cd98f0344002a',
          value: 'future',
          label: 'Future'
        }
      },
      {
        id: '2c9180c07cd98e75017cdd6d239e004d',
        remoteId: '6d75d9e3-5dbd-4ddd-a777-726900207ef9',
        remoteId_object: {
          id: '6d75d9e3-5dbd-4ddd-a777-726900207ef9',
          endDateSemantics: {
            id: '2c9180bf7cd98e60017cd98f1edd0003',
            value: 'implicit',
            label: 'Implicit',
            owner: {
              id: '2c9180bf7cd98e60017cd98f1e5c0000',
              desc: 'License.EndDateSemantics',
              internal: true
            }
          },
          dateCreated: '2021-11-01T21:33:00Z',
          customProperties: {},
          contacts: [],
          tags: [],
          lastUpdated: '2021-11-01T21:33:00Z',
          docs: [],
          name: 'am license 3',
          status: {
            id: '2c9180bf7cd98e60017cd98f1ef80007',
            value: 'active',
            label: 'Active',
            owner: {
              id: '2c9180bf7cd98e60017cd98f1ee40004',
              desc: 'License.Status',
              internal: true
            }
          },
          supplementaryDocs: [],
          openEnded: false,
          amendments: [],
          orgs: [],
          type: {
            id: '2c9180bf7cd98e60017cd98f1f4a0013',
            value: 'local',
            label: 'Local',
            owner: {
              id: '2c9180bf7cd98e60017cd98f1f470012',
              desc: 'License.Type',
              internal: false
            }
          },
          alternateNames: []
        },
        owner: {
          id: '17fd957e-f3f5-40ea-92d6-6b5451b3273d'
        },
        amendments: [],
        status: {
          id: '2c9180c07cd98e75017cd98f034a002b',
          value: 'historical',
          label: 'Historical'
        }
      },
      {
        id: '2c9180c07cd98e75017cdd6bff60004b',
        remoteId: 'c44ad9e7-2ee3-4080-8d20-dc4c13c338ed',
        remoteId_object: {
          id: 'c44ad9e7-2ee3-4080-8d20-dc4c13c338ed',
          endDateSemantics: {
            id: '2c9180bf7cd98e60017cd98f1edd0003',
            value: 'implicit',
            label: 'Implicit',
            owner: {
              id: '2c9180bf7cd98e60017cd98f1e5c0000',
              desc: 'License.EndDateSemantics',
              internal: true
            }
          },
          dateCreated: '2021-11-01T21:32:34Z',
          customProperties: {},
          contacts: [],
          tags: [],
          lastUpdated: '2021-11-01T21:32:34Z',
          docs: [],
          name: 'am license 1',
          status: {
            id: '2c9180bf7cd98e60017cd98f1ef80007',
            value: 'active',
            label: 'Active',
            owner: {
              id: '2c9180bf7cd98e60017cd98f1ee40004',
              desc: 'License.Status',
              internal: true
            }
          },
          supplementaryDocs: [],
          openEnded: false,
          amendments: [],
          orgs: [],
          type: {
            id: '2c9180bf7cd98e60017cd98f1f4a0013',
            value: 'local',
            label: 'Local',
            owner: {
              id: '2c9180bf7cd98e60017cd98f1f470012',
              desc: 'License.Type',
              internal: false
            }
          },
          alternateNames: []
        },
        owner: {
          id: '17fd957e-f3f5-40ea-92d6-6b5451b3273d'
        },
        amendments: [],
        status: {
          id: '2c9180c07cd98e75017cd98f033f0029',
          value: 'controlling',
          label: 'Controlling'
        }
      }
    ],
    docs: [],
    periods: [
      {
        id: '69382035-9ae3-4c93-8336-8e6890c4b4fe',
        startDate: '2021-11-02',
        cancellationDeadline: '2021-11-30',
        owner: {
          id: '17fd957e-f3f5-40ea-92d6-6b5451b3273d'
        },
        note: 'period note',
        endDate: '2021-11-24',
        periodStatus: 'next'
      }
    ],
    usageDataProviders: [
      {
        id: '2c9180c07cd98e75017cdd11f7fd004a',
        remoteId: '0ba00047-b6cb-417a-a735-e2c1e45e30f1',
        remoteId_object: {
          id: '0ba00047-b6cb-417a-a735-e2c1e45e30f1',
          label: 'GOBI Library Solutions',
          harvestingConfig: {
            harvestingStatus: 'active',
            harvestVia: 'sushi',
            sushiConfig: {
              serviceType: 'cs41',
              serviceUrl: 'http://usage.gobi.com/SushiServer'
            },
            reportRelease: 4,
            requestedReports: [
              'DR1'
            ],
            harvestingStart: '2018-01'
          },
          sushiCredentials: {
            customerId: '0000000000',
            requestorId: '00000000-0000-0000-0000-000000000000',
            requestorName: 'Opentown Libraries',
            requestorMail: 'electronic@lib.optentown.edu'
          },
          hasFailedReport: 'no',
          reportErrorCodes: [],
          reportTypes: [],
          notes: 'Please fill in your own credentials: customer ID and requestor ID, name and mail are only demonstrational.',
          metadata: {
            createdDate: '2021-11-01T03:33:05.043+00:00',
            updatedDate: '2021-11-01T03:33:05.043+00:00'
          }
        },
        owner: {
          id: '17fd957e-f3f5-40ea-92d6-6b5451b3273d'
        },
        usageDataProviderNote: 'UDP note'
      }
    ],
    agreementStatus: {
      id: '2c9180c07cd98e75017cd98f03ec0041',
      value: 'active',
      label: 'Active'
    },
    supplementaryDocs: [
      {
        id: '6a7852f5-fcc0-49f6-b97a-1517c980b3b3',
        dateCreated: '2021-11-01T19:55:14Z',
        lastUpdated: '2021-11-01T19:55:14Z',
        location: 'test loc',
        url: 'http:www.testurl.com',
        name: 'test supp doc'
      }
    ],
    description: 'test desc',
    alternateNames: [
      {
        id: 'cefd639e-a593-4ee1-9196-f3bc870f9874',
        owner: {
          id: '17fd957e-f3f5-40ea-92d6-6b5451b3273d'
        },
        name: 'test name'
      }
    ],
    relatedAgreements: [
      {
        id: 'ff41b2a0-ec06-496a-b487-ca5a27d2ad12',
        type: 'supersedes'
      }
    ],
    lines: [],
    agreementLinesCount: 0,
    eresources: [],
    eresourcesCount: 0,
    orderLines: []
  },
  eresourcesFilterPath: 'current',
  searchString: '?filters=agreementStatus.active%2CagreementStatus.draft%2CagreementStatus.in_negotiation%2CagreementStatus.requested&sort=name',
  terms: [
    {
      id: '2c9180bf7cd98e60017cd98f213e0028',
      name: 'authorisedUsers',
      primary: true,
      defaultInternal: true,
      label: 'Definition of authorised user',
      description: 'The definition of an authorised user for a resource',
      weight: -1,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
    },
    {
      id: '2c9180bf7cd98e60017cd98f221e002a',
      name: 'remoteAccess',
      primary: true,
      category: {
        id: '2c9180bf7cd98e60017cd98f202e001b',
        desc: 'Yes/No/Other',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f2040001e',
            value: 'other_(see_notes)',
            label: 'Other (see notes)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f2031001c',
            value: 'yes',
            label: 'Yes'
          },
          {
            id: '2c9180bf7cd98e60017cd98f2038001d',
            value: 'no',
            label: 'No'
          }
        ]
      },
      defaultInternal: true,
      label: 'Access restricted to on-campus/campus network?',
      description: 'Can access to the resource be provided from outside the library or institutional location / network',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bf7cd98e60017cd98f2222002b',
      name: 'illElectronic',
      primary: true,
      category: {
        id: '2c9180bf7cd98e60017cd98f2046001f',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f205f0023',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f204a0020',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20510021',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20570022',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20670024',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f206d0025',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20720026',
            value: 'not_applicable',
            label: 'Not applicable'
          }
        ]
      },
      defaultInternal: true,
      label: 'Electronic ILL',
      description: 'The right to provide the licensed materials via interlibrary loan by way of electronic copies',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bf7cd98e60017cd98f22470031',
      name: 'copyDigital',
      primary: true,
      category: {
        id: '2c9180bf7cd98e60017cd98f2046001f',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f205f0023',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f204a0020',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20510021',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20570022',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20670024',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f206d0025',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20720026',
            value: 'not_applicable',
            label: 'Not applicable'
          }
        ]
      },
      defaultInternal: true,
      label: 'Making digital copies',
      description: 'The right of the licensee and authorized users to download and digitally copy a reasonable portion of the licensed materials',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bf7cd98e60017cd98f224b0032',
      name: 'copyPrint',
      primary: true,
      category: {
        id: '2c9180bf7cd98e60017cd98f2046001f',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f205f0023',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f204a0020',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20510021',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20570022',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20670024',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f206d0025',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20720026',
            value: 'not_applicable',
            label: 'Not applicable'
          }
        ]
      },
      defaultInternal: true,
      label: 'Making print copies',
      description: 'The right of the licensee and authorized users to print a reasonable portion of the licensed materials',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bf7cd98e60017cd98f21330027',
      name: 'concurrentAccess',
      primary: true,
      defaultInternal: true,
      label: 'Number of concurrent users allowed',
      description: 'The number of concurrent users allowed by the resource',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger'
    },
    {
      id: '2c9180bf7cd98e60017cd98f2230002d',
      name: 'illPrint',
      primary: true,
      category: {
        id: '2c9180bf7cd98e60017cd98f2046001f',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f205f0023',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f204a0020',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20510021',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20570022',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20670024',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f206d0025',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20720026',
            value: 'not_applicable',
            label: 'Not applicable'
          }
        ]
      },
      defaultInternal: true,
      label: 'Print ILL',
      description: 'The right to provide the licensed materials via interlibrary loan by way of print copies or facsimile transmission',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bf7cd98e60017cd98f2228002c',
      name: 'illSecureElectronic',
      primary: true,
      category: {
        id: '2c9180bf7cd98e60017cd98f2046001f',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f205f0023',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f204a0020',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20510021',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20570022',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20670024',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f206d0025',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20720026',
            value: 'not_applicable',
            label: 'Not applicable'
          }
        ]
      },
      defaultInternal: true,
      label: 'Secure Electronic ILL',
      description: 'The right to provide the licensed materials via interlibrary loan by way of secure electronic transmission',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bf7cd98e60017cd98f2236002e',
      name: 'reservesElectronic',
      primary: true,
      category: {
        id: '2c9180bf7cd98e60017cd98f2046001f',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f205f0023',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f204a0020',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20510021',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20570022',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20670024',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f206d0025',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20720026',
            value: 'not_applicable',
            label: 'Not applicable'
          }
        ]
      },
      defaultInternal: true,
      label: 'Storage of electronic copies on secure network',
      description: 'The right to make electronic copies of the licensed materials and store them on a secure network',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bf7cd98e60017cd98f223c002f',
      name: 'coursePackElectronic',
      primary: true,
      category: {
        id: '2c9180bf7cd98e60017cd98f2046001f',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f205f0023',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f204a0020',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20510021',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20570022',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20670024',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f206d0025',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20720026',
            value: 'not_applicable',
            label: 'Not applicable'
          }
        ]
      },
      defaultInternal: false,
      label: 'Use in electronic coursepacks',
      description: 'The right to use licensed materials in collections or compilations of materials assembled in an electronic format by faculty members for use by students in a class for purposes of instruction',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bf7cd98e60017cd98f22420030',
      name: 'coursePackPrint',
      primary: true,
      category: {
        id: '2c9180bf7cd98e60017cd98f2046001f',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f205f0023',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f204a0020',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20510021',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20570022',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20670024',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f206d0025',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20720026',
            value: 'not_applicable',
            label: 'Not applicable'
          }
        ]
      },
      defaultInternal: false,
      label: 'Use in print course packs',
      description: 'The right to use licensed materials in collections or compilations of materials assembled in a print format by faculty members for use by students in a class for purposes of instruction',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bf7cd98e60017cd98f22180029',
      name: 'walkInAccess',
      primary: true,
      category: {
        id: '2c9180bf7cd98e60017cd98f202e001b',
        desc: 'Yes/No/Other',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f2040001e',
            value: 'other_(see_notes)',
            label: 'Other (see notes)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f2031001c',
            value: 'yes',
            label: 'Yes'
          },
          {
            id: '2c9180bf7cd98e60017cd98f2038001d',
            value: 'no',
            label: 'No'
          }
        ]
      },
      defaultInternal: false,
      label: 'Walk-in access permitted?',
      description: 'Can non-members of the library/instittuion use the resource when in the library',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bf7cd98e60017cd98f22640038',
      name: 'authProxy',
      primary: false,
      category: {
        id: '2c9180bf7cd98e60017cd98f202e001b',
        desc: 'Yes/No/Other',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f2040001e',
            value: 'other_(see_notes)',
            label: 'Other (see notes)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f2031001c',
            value: 'yes',
            label: 'Yes'
          },
          {
            id: '2c9180bf7cd98e60017cd98f2038001d',
            value: 'no',
            label: 'No'
          }
        ]
      },
      defaultInternal: true,
      label: 'Access via a proxy supported?',
      description: 'Whether authentication via a reverse proxy is supported',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bf7cd98e60017cd98f2271003b',
      name: 'annualOptOut',
      primary: false,
      category: {
        id: '2c9180bf7cd98e60017cd98f202e001b',
        desc: 'Yes/No/Other',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f2040001e',
            value: 'other_(see_notes)',
            label: 'Other (see notes)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f2031001c',
            value: 'yes',
            label: 'Yes'
          },
          {
            id: '2c9180bf7cd98e60017cd98f2038001d',
            value: 'no',
            label: 'No'
          }
        ]
      },
      defaultInternal: true,
      label: 'Annual opt-out clause included?',
      description: "Whether the license includes an 'annual opt-out' clause within a multi-year agreement",
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bf7cd98e60017cd98f225f0037',
      name: 'authIP',
      primary: false,
      category: {
        id: '2c9180bf7cd98e60017cd98f202e001b',
        desc: 'Yes/No/Other',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f2040001e',
            value: 'other_(see_notes)',
            label: 'Other (see notes)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f2031001c',
            value: 'yes',
            label: 'Yes'
          },
          {
            id: '2c9180bf7cd98e60017cd98f2038001d',
            value: 'no',
            label: 'No'
          }
        ]
      },
      defaultInternal: true,
      label: 'IP authentication supported?',
      description: 'Whether authentication via IP range is supported',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bf7cd98e60017cd98f225a0036',
      name: 'metadataUsage',
      primary: false,
      defaultInternal: true,
      label: 'Metadata usage',
      description: 'Any restrictions expressed related to the use of metadata in the platforms',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
    },
    {
      id: '2c9180bf7cd98e60017cd98f22520034',
      name: 'otherRestrictions',
      primary: false,
      defaultInternal: true,
      label: 'Other restrictions',
      description: 'Other restrictions expressed in the license',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
    },
    {
      id: '2c9180bf7cd98e60017cd98f226c003a',
      name: 'authSAML',
      primary: false,
      category: {
        id: '2c9180bf7cd98e60017cd98f202e001b',
        desc: 'Yes/No/Other',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f2040001e',
            value: 'other_(see_notes)',
            label: 'Other (see notes)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f2031001c',
            value: 'yes',
            label: 'Yes'
          },
          {
            id: '2c9180bf7cd98e60017cd98f2038001d',
            value: 'no',
            label: 'No'
          }
        ]
      },
      defaultInternal: true,
      label: 'SAML compliant authentication supported?',
      description: 'Whether authentication via SAML compliant method is supported',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bf7cd98e60017cd98f224f0033',
      name: 'scholarlySharing',
      primary: false,
      category: {
        id: '2c9180bf7cd98e60017cd98f2046001f',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f205f0023',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f204a0020',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20510021',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20570022',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20670024',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f206d0025',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20720026',
            value: 'not_applicable',
            label: 'Not applicable'
          }
        ]
      },
      defaultInternal: true,
      label: 'Sharing for scholarly use',
      description: 'The right of authorized users and/or licensee to transmit hard copy or electronic copy of reasonable amounts of licensed materials to a third party for personal, scholarly, educational, scientific or professional use',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bf7cd98e60017cd98f22560035',
      name: 'textAndDataMining',
      primary: false,
      category: {
        id: '2c9180bf7cd98e60017cd98f2046001f',
        desc: 'Permitted/Prohibited',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f205f0023',
            value: 'prohibited_(explicit)',
            label: 'Prohibited (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f204a0020',
            value: 'permitted_(explicit)',
            label: 'Permitted (explicit)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20510021',
            value: 'permitted_(explicit)_under_conditions',
            label: 'Permitted (explicit) under conditions'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20570022',
            value: 'permitted_(interpreted)',
            label: 'Permitted (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20670024',
            value: 'prohibited_(interpreted)',
            label: 'Prohibited (interpreted)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f206d0025',
            value: 'unmentioned',
            label: 'Unmentioned'
          },
          {
            id: '2c9180bf7cd98e60017cd98f20720026',
            value: 'not_applicable',
            label: 'Not applicable'
          }
        ]
      },
      defaultInternal: false,
      label: 'Text and Data mining',
      description: 'Whether it is permitted to use text and data mining processes on the content of the resource',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      id: '2c9180bf7cd98e60017cd98f2273003c',
      name: 'APCAndOffsetting',
      primary: false,
      defaultInternal: true,
      label: 'Whether the resource is subject to an APC discount or subscription cost offsetting agreement',
      description: 'Whether the resource is subject to an APC discount or subscription cost offsetting agreement',
      weight: 0,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
    },
    {
      id: '2c9180bf7cd98e60017cd98f22680039',
      name: 'postCancellationAccess',
      primary: false,
      category: {
        id: '2c9180bf7cd98e60017cd98f202e001b',
        desc: 'Yes/No/Other',
        internal: false,
        values: [
          {
            id: '2c9180bf7cd98e60017cd98f2040001e',
            value: 'other_(see_notes)',
            label: 'Other (see notes)'
          },
          {
            id: '2c9180bf7cd98e60017cd98f2031001c',
            value: 'yes',
            label: 'Yes'
          },
          {
            id: '2c9180bf7cd98e60017cd98f2038001d',
            value: 'no',
            label: 'No'
          }
        ]
      },
      defaultInternal: true,
      label: 'Post-cancellation terms included?',
      description: 'Does the license include post-cancellation terms?',
      weight: 1,
      type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    }
  ]
};

const handlers = {
  onClone: jest.fn(),
  onClose: jest.fn(),
  onDelete: jest.fn(),
  onEdit: jest.fn(),
  onExportAgreement: jest.fn(),
  onToggleTags: jest.fn()
};

export { data, handlers };
