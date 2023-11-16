const resources = {
  openAgreements: {
    hasLoaded: true,
    isPending: false,
    failed: false,
    records: [{
      id: '83d89e5c-0466-417e-ad8b-af164940429c',
      dateCreated: '2021-09-14T12:09:20Z',
      vendorReference: 'AGG_VR_002',
      isPerpetual: {
        id: '02d318287be424d6017be432de48001b',
        value: 'no',
        label: 'No'
      },
      name: 'Active Agreement LR 002',
      orgs: [],
      externalLicenseDocs: [],
      outwardRelationships: [],
      customProperties: {},
      contacts: [],
      tags: [],
      lastUpdated: '2021-09-14T12:09:20Z',
      inwardRelationships: [],
      vendor: {
        id: '967a05ee-039f-4c52-990e-975f45ceffb3',
        orgsUuid: '05f327a6-c4d3-43c2-828f-7d6e7e401c99',
        name: 'My Super Vendor'
      },
      renewalPriority: {
        id: '02d318287be424d6017be432de7c0021',
        value: 'definitely_renew',
        label: 'Definitely renew'
      },
      startDate: '2018-01-01',
      linkedLicenses: [],
      docs: [],
      periods: [{
        id: '8d980cbd-e3e1-46d4-bc97-ba0c760ffdd3',
        startDate: '2018-01-01',
        owner: {
          id: '83d89e5c-0466-417e-ad8b-af164940429c'
        },
        periodStatus: 'current'
      }],
      localReference: 'AGG_LR_002',
      usageDataProviders: [],
      agreementStatus: {
        id: '02d318287be424d6017be432dee7002a',
        value: 'active',
        label: 'Active'
      },
      supplementaryDocs: [],
      description: 'This is an active agreement',
      endDate: null,
      cancellationDeadline: null,
      items: [{
        id: '93390f44-a5d1-4228-8d27-0236f6a6592c'
      }],
      alternateNames: []
    }, {
      id: '277a3522-8826-4e0a-a463-bc127e6429a0',
      dateCreated: '2021-09-14T12:09:20Z',
      vendorReference: '301:3707',
      isPerpetual: {
        id: '02d318287be424d6017be432de48001b',
        value: 'no',
        label: 'No'
      },
      name: 'Bentham Science (External/EKB)',
      orgs: [],
      externalLicenseDocs: [],
      outwardRelationships: [],
      customProperties: {},
      contacts: [],
      tags: [],
      lastUpdated: '2021-10-06T14:25:03Z',
      inwardRelationships: [],
      vendor: {
        id: '22740a91-a9c3-4d3a-ab66-2f4a296963ca',
        name: 'Bentham Science'
      },
      renewalPriority: {
        id: '02d318287be424d6017be432de7c0021',
        value: 'definitely_renew',
        label: 'Definitely renew'
      },
      startDate: '2018-01-01',
      linkedLicenses: [],
      docs: [],
      periods: [{
        id: '1de4e704-5bb2-4bf2-99f4-aeed107ffcf3',
        startDate: '2018-01-01',
        owner: {
          id: '277a3522-8826-4e0a-a463-bc127e6429a0'
        },
        periodStatus: 'current'
      }],
      localReference: 'EBSCO_TC1',
      usageDataProviders: [],
      agreementStatus: {
        id: '02d318287be424d6017be432dee7002a',
        value: 'active',
        label: 'Active'
      },
      supplementaryDocs: [],
      description: 'This agreement is a test case for where the content an agreement provides access to is defined externally - in this case EKB vendor 301/package 3707.',
      endDate: null,
      cancellationDeadline: null,
      items: [{
        id: '8bda3815-ba7f-4384-b6fd-d9d4c0256c64'
      }, {
        id: 'f860bd38-eeef-4b8d-ac53-b8784b8ae629'
      }, {
        id: '84444bff-cd1b-4b27-b65a-ecbc77ebbb64'
      }, {
        id: '026bd35e-0c95-4a6b-9541-eb50ff9ab16a'
      }, {
        id: '02515fdc-b575-484f-84f3-20a80ebbcd73'
      }],
      alternateNames: []
    }, {
      id: '2f992c8c-ed27-462a-b6db-484583e60575',
      dateCreated: '2021-09-15T14:33:56Z',
      name: 'CM Agreement 1',
      orgs: [{
        id: '2f20b496-3af2-4c89-98ba-44049aa842f8',
        primaryOrg: false,
        org: {
          id: '5935b6fc-f74b-40c1-a709-0c8a4335a56d',
          orgsUuid: '13fb64dc-cdf1-11e8-a8d5-f2801f1b9fd1',
          name: 'United States Geological Survey'
        },
        owner: {
          id: '2f992c8c-ed27-462a-b6db-484583e60575'
        },
        roles: [{
          id: '8f93a6b0-b77e-45cb-841a-f50c155d1b8f',
          owner: {
            id: '2f20b496-3af2-4c89-98ba-44049aa842f8'
          },
          role: {
            id: '02d318287be424d6017be432df4f0038',
            value: 'content_provider',
            label: 'Content provider'
          }
        }]
      }],
      externalLicenseDocs: [],
      outwardRelationships: [],
      customProperties: {},
      contacts: [],
      tags: [],
      lastUpdated: '2021-10-01T08:51:26Z',
      inwardRelationships: [],
      endDate: '2022-09-30',
      startDate: '2021-05-01',
      linkedLicenses: [{
        id: '02d318287be4b40d017beea5d65c0002',
        remoteId: '03ddb0ed-0d29-4802-b7c8-dae44af4e3cc',
        owner: {
          id: '2f992c8c-ed27-462a-b6db-484583e60575'
        },
        amendments: [{
          id: 'e131469b-cdb8-4ef4-a93b-0af0a2944450',
          owner: {
            id: '02d318287be4b40d017beea5d65c0002'
          },
          status: {
            id: '02d318287be424d6017be432dde20017',
            value: 'historical',
            label: 'Historical'
          },
          amendmentId: '03f53409-969a-4203-aaa1-1c8a92226c29'
        }],
        status: {
          id: '02d318287be424d6017be432ddc40013',
          value: 'historical',
          label: 'Historical'
        },
        note: 'Historical license note'
      }, {
        id: '02d318287be4b40d017bee6b96dc0001',
        remoteId: 'd7bcbb7c-c6f5-40b1-86b7-9165284bb39a',
        owner: {
          id: '2f992c8c-ed27-462a-b6db-484583e60575'
        },
        amendments: [{
          id: 'cc753486-7953-4b51-9dbc-b1111012d06e',
          owner: {
            id: '02d318287be4b40d017bee6b96dc0001'
          },
          status: {
            id: '02d318287be424d6017be432ddda0016',
            value: 'future',
            label: 'Future'
          },
          amendmentId: '00fe1bba-0d23-42af-b4b4-340a4ee8fd73',
          note: 'Future license amendment note'
        }],
        status: {
          id: '02d318287be424d6017be432ddbb0012',
          value: 'future',
          label: 'Future'
        },
        note: 'Future license note'
      }, {
        id: '02d318287be4b40d017be9e0e97c0000',
        remoteId: '24c03685-d932-427c-a244-9ca0614f6df2',
        owner: {
          id: '2f992c8c-ed27-462a-b6db-484583e60575'
        },
        amendments: [{
          id: 'eab87612-488b-4f17-ae32-db92e8a64684',
          owner: {
            id: '02d318287be4b40d017be9e0e97c0000'
          },
          status: {
            id: '02d318287be424d6017be432ddd10015',
            value: 'current',
            label: 'Current'
          },
          amendmentId: '42646aca-f519-4de3-b13a-f9b40713fc6f'
        }, {
          id: 'd6c09d12-f14e-4ceb-947f-c603bb9077d7',
          owner: {
            id: '02d318287be4b40d017be9e0e97c0000'
          },
          status: {
            id: '02d318287be424d6017be432ddd10015',
            value: 'current',
            label: 'Current'
          },
          amendmentId: 'c2ad4cc4-69af-41b8-bba4-a541989f6e11'
        }, {
          id: '0e033d25-7a50-4b52-bc97-c60b83182428',
          owner: {
            id: '02d318287be4b40d017be9e0e97c0000'
          },
          status: {
            id: '02d318287be424d6017be432dde20017',
            value: 'historical',
            label: 'Historical'
          },
          amendmentId: 'fddc67a7-b25d-4cb2-a9f3-4e69f08cd723'
        }, {
          id: '94d297a9-f6f6-4c3b-9441-3d53c580f063',
          owner: {
            id: '02d318287be4b40d017be9e0e97c0000'
          },
          status: {
            id: '02d318287be424d6017be432ddda0016',
            value: 'future',
            label: 'Future'
          },
          amendmentId: 'eccae425-b08b-4f31-841c-1eb9cd3516a5'
        }, {
          id: '87d48634-00fc-4564-bec2-8c3d0ca6f8f0',
          owner: {
            id: '02d318287be4b40d017be9e0e97c0000'
          },
          status: {
            id: '02d318287be424d6017be432dde20017',
            value: 'historical',
            label: 'Historical'
          },
          amendmentId: '2028a550-f82a-43f2-8671-de620242d714'
        }, {
          id: '38f6d0a6-30ae-46bf-878a-75d22060572a',
          owner: {
            id: '02d318287be4b40d017be9e0e97c0000'
          },
          status: {
            id: '02d318287be424d6017be432ddd10015',
            value: 'current',
            label: 'Current'
          },
          amendmentId: 'd4c28655-e3f9-424c-b340-244d40dc4fa0'
        }, {
          id: '0829643f-5ac3-4d4c-982a-e99c2a590635',
          owner: {
            id: '02d318287be4b40d017be9e0e97c0000'
          },
          status: {
            id: '02d318287be424d6017be432ddd10015',
            value: 'current',
            label: 'Current'
          },
          amendmentId: '85f4d4f2-af10-43a4-9884-fae558af6abc'
        }, {
          id: 'df1b24df-0c8c-43f0-9f5e-90924597654f',
          owner: {
            id: '02d318287be4b40d017be9e0e97c0000'
          },
          status: {
            id: '02d318287be424d6017be432ddda0016',
            value: 'future',
            label: 'Future'
          },
          amendmentId: 'e66e9da4-7b6d-4326-a611-4d8e4f623de9'
        }, {
          id: 'f2bd551a-f14f-489f-bf54-0ac4c13ab28e',
          owner: {
            id: '02d318287be4b40d017be9e0e97c0000'
          },
          status: {
            id: '02d318287be424d6017be432ddd10015',
            value: 'current',
            label: 'Current'
          },
          amendmentId: 'a931b294-9794-4416-820e-054b78510efa'
        }],
        status: {
          id: '02d318287be424d6017be432ddb00011',
          value: 'controlling',
          label: 'Controlling'
        }
      }],
      docs: [],
      periods: [{
        id: 'c7f6c2ea-63e3-4429-80d6-ae52bc9e6537',
        startDate: '2021-05-01',
        owner: {
          id: '2f992c8c-ed27-462a-b6db-484583e60575'
        },
        endDate: '2022-09-30',
        periodStatus: 'current'
      }],
      usageDataProviders: [],
      agreementStatus: {
        id: '02d318287be424d6017be432dee7002a',
        value: 'active',
        label: 'Active'
      },
      supplementaryDocs: [],
      cancellationDeadline: null,
      alternateNames: []
    }, {
      id: 'f8789faa-236b-42e6-a946-b3c096a91a56',
      dateCreated: '2021-09-14T12:09:20Z',
      vendorReference: 'AGG_VR_002',
      isPerpetual: {
        id: '02d318287be424d6017be432de48001b',
        value: 'no',
        label: 'No'
      },
      name: 'Freedom Collection',
      orgs: [],
      externalLicenseDocs: [],
      outwardRelationships: [],
      customProperties: {},
      contacts: [],
      tags: [],
      lastUpdated: '2021-09-14T12:09:20Z',
      inwardRelationships: [],
      vendor: {
        id: 'ab60df58-127e-417f-8b1b-f4fb506d361f',
        name: 'Elsevier'
      },
      renewalPriority: {
        id: '02d318287be424d6017be432de7c0021',
        value: 'definitely_renew',
        label: 'Definitely renew'
      },
      startDate: '2018-01-01',
      linkedLicenses: [],
      docs: [],
      periods: [{
        id: 'f563345f-3cfa-4d63-8ce8-13e49d991fb9',
        startDate: '2018-01-01',
        owner: {
          id: 'f8789faa-236b-42e6-a946-b3c096a91a56'
        },
        periodStatus: 'current'
      }],
      localReference: 'AGG_LR_002',
      usageDataProviders: [],
      agreementStatus: {
        id: '02d318287be424d6017be432dee7002a',
        value: 'active',
        label: 'Active'
      },
      supplementaryDocs: [],
      description: 'An agreement that describes all the content that we buy from Elsevier',
      endDate: null,
      cancellationDeadline: null,
      alternateNames: []
    }, {
      id: '6747b6ef-ce7a-4510-aafd-20b3680d1009',
      dateCreated: '2021-10-18T10:25:36Z',
      name: 'Package agreement 1',
      orgs: [],
      externalLicenseDocs: [],
      outwardRelationships: [],
      customProperties: {},
      contacts: [],
      tags: [],
      lastUpdated: '2021-10-25T14:04:32Z',
      inwardRelationships: [],
      startDate: '2021-10-01',
      linkedLicenses: [],
      docs: [],
      periods: [{
        id: '76c17156-d445-4a19-9aec-280dfb59cc48',
        startDate: '2021-10-01',
        owner: {
          id: '6747b6ef-ce7a-4510-aafd-20b3680d1009'
        },
        periodStatus: 'current'
      }],
      usageDataProviders: [],
      agreementStatus: {
        id: '02d318287be424d6017be432dee7002a',
        value: 'active',
        label: 'Active'
      },
      supplementaryDocs: [],
      endDate: null,
      cancellationDeadline: null,
      items: [{
        id: 'a57af3fb-86a2-4435-b103-96dbcb5644c6'
      }, {
        id: '976bdd1b-99ca-40ba-a0bd-358f130de1de'
      }, {
        id: '367a8318-6c43-4c26-aa69-72aa2a339f89'
      }, {
        id: '21e6c859-b8d6-45e5-be34-e36862c29f0a'
      }, {
        id: '9b27fcd9-fc9a-49bf-85b9-f1fae44689d6'
      }, {
        id: '3370c300-ff2b-4283-a785-c24599cf7247'
      }],
      alternateNames: []
    }, {
      id: 'ac24f98d-f14b-45d4-b7ab-1502f052dd2f',
      dateCreated: '2021-10-06T14:26:17Z',
      name: 'Package card external test agreement',
      orgs: [],
      externalLicenseDocs: [],
      outwardRelationships: [],
      customProperties: {},
      contacts: [],
      tags: [],
      lastUpdated: '2021-10-06T14:26:17Z',
      inwardRelationships: [],
      startDate: '2021-10-01',
      linkedLicenses: [],
      docs: [],
      periods: [{
        id: '4d616558-7879-46ea-83c7-dae5d8e156b6',
        startDate: '2021-10-01',
        owner: {
          id: 'ac24f98d-f14b-45d4-b7ab-1502f052dd2f'
        },
        periodStatus: 'current'
      }],
      usageDataProviders: [],
      agreementStatus: {
        id: '02d318287be424d6017be432dee7002a',
        value: 'active',
        label: 'Active'
      },
      supplementaryDocs: [],
      endDate: null,
      cancellationDeadline: null,
      items: [{
        id: '12340496-95a8-4c4e-941f-af60ed5935a3'
      }],
      alternateNames: []
    }, {
      id: '6b50d7b0-49b2-4309-9642-d85cd3758ea2',
      dateCreated: '2021-09-14T12:09:20Z',
      vendorReference: 'AGG_VR_002',
      isPerpetual: {
        id: '02d318287be424d6017be432de48001b',
        value: 'no',
        label: 'No'
      },
      name: 'Springer Nature',
      orgs: [],
      externalLicenseDocs: [],
      outwardRelationships: [],
      customProperties: {},
      contacts: [],
      tags: [],
      lastUpdated: '2021-09-14T12:09:20Z',
      inwardRelationships: [],
      vendor: {
        id: 'f1e9f940-ee74-4773-a4fb-52a1c47a594d',
        name: 'Springer'
      },
      renewalPriority: {
        id: '02d318287be424d6017be432de7c0021',
        value: 'definitely_renew',
        label: 'Definitely renew'
      },
      startDate: '2018-01-01',
      linkedLicenses: [],
      docs: [],
      periods: [{
        id: 'a87fb4a3-d6b2-4c3c-9bf3-3120f7a16c85',
        startDate: '2018-01-01',
        owner: {
          id: '6b50d7b0-49b2-4309-9642-d85cd3758ea2'
        },
        periodStatus: 'current'
      }],
      localReference: 'AGG_LR_002',
      usageDataProviders: [],
      agreementStatus: {
        id: '02d318287be424d6017be432dee7002a',
        value: 'active',
        label: 'Active'
      },
      supplementaryDocs: [],
      description: 'An agreement that describes all the content that we access via Springer Nature',
      endDate: null,
      cancellationDeadline: null,
      alternateNames: []
    }, {
      id: 'f3c09750-b6da-46d0-a8b1-1760ec1d3c6d',
      dateCreated: '2021-10-25T13:17:46Z',
      name: 'test formatted number agreement',
      orgs: [],
      externalLicenseDocs: [],
      outwardRelationships: [],
      customProperties: {
        testNumber: [{
          id: 14,
          internal: true,
          value: 11.1,
          type: {
            id: '02d318287c4ec26b017cb7967b950000',
            name: 'testNumber',
            primary: false,
            defaultInternal: true,
            label: 'Test',
            description: 'test formatted number',
            weight: 0,
            type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyDecimal'
          }
        }],
        testInteger: [{
          id: 15,
          internal: true,
          value: 11,
          type: {
            id: '02d318287c4ec26b017cb79b30250001',
            name: 'testInteger',
            primary: false,
            defaultInternal: true,
            label: 'testInteger',
            description: 'test formatted integer number',
            weight: 0,
            type: 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger'
          }
        }]
      },
      contacts: [],
      tags: [],
      lastUpdated: '2021-10-25T13:20:58Z',
      inwardRelationships: [],
      startDate: '2021-10-01',
      linkedLicenses: [],
      docs: [],
      periods: [{
        id: 'b7212570-6b48-448d-a055-6ca1fd989bb7',
        startDate: '2021-10-01',
        owner: {
          id: 'f3c09750-b6da-46d0-a8b1-1760ec1d3c6d'
        },
        periodStatus: 'current'
      }],
      usageDataProviders: [],
      agreementStatus: {
        id: '02d318287be424d6017be432dee7002a',
        value: 'active',
        label: 'Active'
      },
      supplementaryDocs: [],
      endDate: null,
      cancellationDeadline: null,
      alternateNames: []
    }, {
      id: '5b8a49d0-7237-42b4-ba47-a4590cce54bc',
      renewalDate: '2019-01-01',
      dateCreated: '2021-09-14T12:09:18Z',
      vendorReference: 'TRIAL_AVR_001',
      isPerpetual: {
        id: '02d318287be424d6017be432ddfd001a',
        value: 'yes',
        label: 'Yes'
      },
      nextReviewDate: '2018-10-01',
      name: 'Trial Agreement LR 001',
      orgs: [{
        id: '4c268851-8141-4f81-b2ed-5d48e0c5a404',
        primaryOrg: false,
        org: {
          id: '5935b6fc-f74b-40c1-a709-0c8a4335a56d',
          orgsUuid: '13fb64dc-cdf1-11e8-a8d5-f2801f1b9fd1',
          name: 'United States Geological Survey'
        },
        owner: {
          id: '5b8a49d0-7237-42b4-ba47-a4590cce54bc'
        },
        roles: [{
          id: 'e3449489-9cf4-410f-85ae-297191de9b25',
          owner: {
            id: '4c268851-8141-4f81-b2ed-5d48e0c5a404'
          },
          role: {
            id: '02d318287be424d6017be432df4f0038',
            value: 'content_provider',
            label: 'Content provider'
          }
        }]
      }],
      externalLicenseDocs: [{
        id: 'e45ef224-0323-4c1f-852c-5177c7f56a01',
        dateCreated: '2021-09-14T12:09:18Z',
        lastUpdated: '2021-10-01T08:52:03Z',
        atType: {
          id: '02d318287be424d6017be432dcdb0001',
          value: 'license',
          label: 'License'
        },
        location: 'sent in, sent back, queried, lost, found, subjected to public inquiry, lost again, and finally buried in soft peat for three months and recycled as firelighters.',
        url: 'http://a.b.c/d/e/f.doc',
        name: 'An External license document',
        note: 'This is a document attachment'
      }],
      outwardRelationships: [],
      customProperties: {},
      contacts: [],
      tags: [{
        id: 2,
        normValue: 'other_value',
        value: 'Other value'
      }, {
        id: 1,
        normValue: 'legacy',
        value: 'Legacy'
      }, {
        id: 3,
        normValue: 'legacy',
        value: 'legacy'
      }],
      lastUpdated: '2021-10-01T08:52:03Z',
      inwardRelationships: [],
      vendor: {
        id: '967a05ee-039f-4c52-990e-975f45ceffb3',
        orgsUuid: '05f327a6-c4d3-43c2-828f-7d6e7e401c99',
        name: 'My Super Vendor'
      },
      renewalPriority: {
        id: '02d318287be424d6017be432de880022',
        value: 'for_review',
        label: 'For review'
      },
      endDate: '2019-12-31',
      startDate: '2018-01-01',
      linkedLicenses: [],
      docs: [{
        id: '31ade70a-3336-477b-a71f-020884b35403',
        dateCreated: '2021-09-14T12:09:18Z',
        lastUpdated: '2021-10-01T08:52:03Z',
        atType: {
          id: '02d318287be424d6017be432dcdb0001',
          value: 'license',
          label: 'License'
        },
        location: 'sent in, sent back, queried, lost, found, subjected to public inquiry, lost again, and finally buried in soft peat for three months and recycled as firelighters.',
        url: 'http://a.b.c/d/e/f.doc',
        name: 'A test document attachment',
        note: 'This is a document attachment'
      }],
      periods: [{
        id: 'df469430-46e5-4857-9ec1-51d30e26496f',
        startDate: '2018-01-01',
        owner: {
          id: '5b8a49d0-7237-42b4-ba47-a4590cce54bc'
        },
        endDate: '2019-12-31',
        periodStatus: 'previous'
      }],
      localReference: 'TRIAL_ALR_001',
      usageDataProviders: [],
      agreementStatus: {
        id: '02d318287be424d6017be432decc0027',
        value: 'draft',
        label: 'Draft'
      },
      supplementaryDocs: [],
      description: 'This is a trial agreement',
      cancellationDeadline: null,
      items: [{
        id: '1d39cbc2-cd62-467a-9d96-a289c8dc4973'
      }],
      alternateNames: []
    }, {
      id: '38d01d5c-d57f-4f96-9be2-9ceff0f991a4',
      dateCreated: '2021-09-14T12:09:20Z',
      vendorReference: 'AGG_VR_002',
      isPerpetual: {
        id: '02d318287be424d6017be432de48001b',
        value: 'no',
        label: 'No'
      },
      name: 'Wiley Test Agreement',
      orgs: [],
      externalLicenseDocs: [],
      outwardRelationships: [],
      customProperties: {},
      contacts: [],
      tags: [],
      lastUpdated: '2021-09-14T12:09:20Z',
      inwardRelationships: [],
      vendor: {
        id: '84b13c7a-cdf8-4476-9ece-3b8a3dd69465',
        name: 'Wiley'
      },
      renewalPriority: {
        id: '02d318287be424d6017be432de7c0021',
        value: 'definitely_renew',
        label: 'Definitely renew'
      },
      startDate: '2018-01-01',
      linkedLicenses: [],
      docs: [],
      periods: [{
        id: '55a42990-704a-47a5-bd3b-65ebf7ad677f',
        startDate: '2018-01-01',
        owner: {
          id: '38d01d5c-d57f-4f96-9be2-9ceff0f991a4'
        },
        periodStatus: 'current'
      }],
      localReference: 'AGG_LR_002',
      usageDataProviders: [],
      agreementStatus: {
        id: '02d318287be424d6017be432dee7002a',
        value: 'active',
        label: 'Active'
      },
      supplementaryDocs: [],
      description: 'An agreement that describes all the content that we buy from Wiley',
      endDate: null,
      cancellationDeadline: null,
      alternateNames: []
    }],
    successfulMutations: [],
    failedMutations: [],
    pendingMutations: [],
    loadedAt: '2021-10-27T15:23:18.619Z',
    url: 'http://130.83.152.168:9130/erm/sas?filters=agreementStatus.value%3D%3Dactive%7C%7CagreementStatus.value%3D%3Ddraft%7C%7CagreementStatus.value%3D%3Din_negotiation%7C%7CagreementStatus.value%3D%3Drequested&perPage=100&sort=name&stats=true',
    headers: {},
    httpStatus: 200,
    other: {
      pageSize: 100,
      page: 1,
      totalPages: 1,
      meta: {},
      totalRecords: 10,
      total: 10
    },
    resource: 'openAgreements',
    module: '@folio/agreements',
    throwErrors: true
  },
  basket: [{
    id: '2d5c8ed6-b2bb-49ec-b899-d04762767cbe',
    class: 'org.olf.kb.PackageContentItem',
    name: "'200 Years of Ricardian Trade Theory' on Platform 'SpringerLink' in Package Springer eBooks: Economics and Finance 2017",
    suppressFromDiscovery: false,
    tags: [],
    customCoverage: false,
    _object: {
      id: '2d5c8ed6-b2bb-49ec-b899-d04762767cbe',
      dateCreated: '2021-09-14T13:09:13Z',
      tags: [],
      lastUpdated: '2021-09-14T13:09:13Z',
      depth: 'Fulltext',
      coverage: [],
      pti: {
        id: 'cfcb6dc4-aebc-4689-9c09-515e9167cce0',
        dateCreated: '2021-09-14T13:09:13Z',
        tags: [],
        lastUpdated: '2021-09-14T13:09:13Z',
        platform: {
          id: 'eecdf573-20b9-4c55-bab6-c6ccba315a23',
          dateCreated: '2021-09-14T12:43:38Z',
          lastUpdated: '2021-09-14T12:43:38Z',
          name: 'SpringerLink',
          locators: [{
            id: 'e427427f-3c1b-44c2-89f9-f32d065cb6ca',
            domainName: 'link.springer.com'
          }]
        },
        templatedUrls: [{
          id: 'b0006472-5da5-458a-a446-8699199f436b',
          url: 'http://link.springer.com/10.1007/978-3-319-60606-4',
          name: 'defaultUrl',
          resource: {
            id: 'cfcb6dc4-aebc-4689-9c09-515e9167cce0'
          }
        }],
        coverage: [],
        titleInstance: {
          id: '7900934c-4059-49e6-a148-8b1270d89b42',
          subType: {
            id: '02d318287be424d6017be432dd8a000c',
            value: 'electronic',
            label: 'Electronic'
          },
          dateCreated: '2021-09-14T13:09:13Z',
          tags: [],
          lastUpdated: '2021-09-14T13:09:13Z',
          publicationType: {
            id: '02d318287be424d6017be4333d1e0046',
            value: 'book',
            label: 'Book'
          },
          identifiers: [{
            title: {
              id: '7900934c-4059-49e6-a148-8b1270d89b42'
            },
            status: {
              id: '02d318287be424d6017be432e64b0045',
              value: 'approved',
              label: 'approved'
            },
            identifier: {
              value: '10.1007/978-3-319-60606-4',
              ns: {
                value: 'doi'
              }
            }
          }, {
            title: {
              id: '7900934c-4059-49e6-a148-8b1270d89b42'
            },
            status: {
              id: '02d318287be424d6017be432e64b0045',
              value: 'approved',
              label: 'approved'
            },
            identifier: {
              value: '978-3-319-60606-4',
              ns: {
                value: 'isbn'
              }
            }
          }, {
            title: {
              id: '7900934c-4059-49e6-a148-8b1270d89b42'
            },
            status: {
              id: '02d318287be424d6017be432e64b0045',
              value: 'approved',
              label: 'approved'
            },
            identifier: {
              value: '978-3-319-60605-7',
              ns: {
                value: 'isbn'
              }
            }
          }],
          coverage: [],
          name: '200 Years of Ricardian Trade Theory',
          type: {
            id: '02d318287be424d6017be432dd94000e',
            value: 'monograph',
            label: 'Monograph'
          },
          suppressFromDiscovery: false,
          work: {
            id: 'da42d208-060e-44a0-8cfb-f3e8608b5325'
          },
          class: 'org.olf.kb.TitleInstance',
          longName: '200 Years of Ricardian Trade Theory',
          relatedTitles: []
        },
        url: 'http://link.springer.com/10.1007/978-3-319-60606-4',
        name: "'200 Years of Ricardian Trade Theory' on Platform 'SpringerLink'",
        suppressFromDiscovery: false,
        class: 'org.olf.kb.PlatformTitleInstance',
        longName: "'200 Years of Ricardian Trade Theory' on Platform 'SpringerLink'"
      },
      pkg: {
        id: 'db86a0d9-c974-4c3f-b07f-27c39d633d76',
        dateCreated: '2021-09-14T13:08:50Z',
        lastUpdated: '2021-09-14T13:08:50Z',
        vendor: {
          id: 'f1e9f940-ee74-4773-a4fb-52a1c47a594d',
          name: 'Springer',
          orgsUuid_object: {
            error: 400,
            message: 'Bad Request'
          }
        },
        source: 'GOKb',
        remoteKb: {
          id: '7fba4705-37ab-4712-944b-d69c87714fb5',
          cursor: '2021-08-18T12:21:55Z',
          active: true,
          trustedSourceTI: false,
          activationEnabled: false,
          readonly: false,
          syncStatus: 'in-process',
          name: 'GOKb_TEST',
          type: 'org.olf.kb.adapters.GOKbOAIAdapter',
          fullPrefix: 'gokb',
          uri: 'https://gokbt.gbv.de/gokb/oai/index',
          supportsHarvesting: true,
          rectype: 1
        },
        name: 'Springer eBooks: Economics and Finance 2017',
        suppressFromDiscovery: false,
        reference: 'Springer_eBooks:_Business_and_Management_2017',
        resourceCount: 489,
        class: 'org.olf.kb.Pkg'
      },
      addedTimestamp: 1631624930518,
      name: "'200 Years of Ricardian Trade Theory' on Platform 'SpringerLink' in Package Springer eBooks: Economics and Finance 2017",
      lastSeenTimestamp: 1631624930518,
      suppressFromDiscovery: false,
      longName: "'200 Years of Ricardian Trade Theory' on Platform 'SpringerLink' in Package Springer eBooks: Economics and Finance 2017",
      class: 'org.olf.kb.PackageContentItem'
    },
    rowIndex: 0
  }, {
    id: 'db86a0d9-c974-4c3f-b07f-27c39d633d76',
    class: 'org.olf.kb.Pkg',
    name: 'Springer eBooks: Economics and Finance 2017',
    suppressFromDiscovery: false,
    tags: [],
    customCoverage: false,
    _object: {
      id: 'db86a0d9-c974-4c3f-b07f-27c39d633d76',
      dateCreated: '2021-09-14T13:08:50Z',
      tags: [],
      lastUpdated: '2021-09-14T13:08:50Z',
      vendor: {
        id: 'f1e9f940-ee74-4773-a4fb-52a1c47a594d',
        name: 'Springer',
        orgsUuid_object: {
          error: 400,
          message: 'Bad Request'
        }
      },
      coverage: [],
      source: 'GOKb',
      remoteKb: {
        id: '7fba4705-37ab-4712-944b-d69c87714fb5',
        cursor: '2021-08-18T12:21:55Z',
        active: true,
        trustedSourceTI: false,
        activationEnabled: false,
        readonly: false,
        syncStatus: 'in-process',
        name: 'GOKb_TEST',
        type: 'org.olf.kb.adapters.GOKbOAIAdapter',
        fullPrefix: 'gokb',
        uri: 'https://gokbt.gbv.de/gokb/oai/index',
        supportsHarvesting: true,
        rectype: 1
      },
      name: 'Springer eBooks: Economics and Finance 2017',
      suppressFromDiscovery: false,
      reference: 'Springer_eBooks:_Business_and_Management_2017',
      resourceCount: 489,
      class: 'org.olf.kb.Pkg'
    },
    rowIndex: 1
  }],
  query: {
    query: '',
    filters: 'type.monograph',
    sort: 'name'
  }
};

export { resources as default };
