const refdata = [
  {
    id: '8a817870818666b10181866d496b000f',
    desc: 'AgreementRelationship.Type',
    internal: true,
    values: [
      {
        id: '8a817870818666b10181866d49da0013',
        value: 'related_to',
        label: 'Related to'
      },
      {
        id: '8a817870818666b10181866d49bb0012',
        value: 'tracks_demand-driven_acquisitions_for',
        label: 'Tracks demand-driven acquisitions for'
      },
      {
        id: '8a817870818666b10181866d49740010',
        value: 'supersedes',
        label: 'Supersedes'
      },
      {
        id: '8a817870818666b10181866d49960011',
        value: 'provides_post-cancellation_access_for',
        label: 'Provides post-cancellation access for'
      },
      {
        id: '8a817870818666b10181866d4a000014',
        value: 'has_backfile_in',
        label: 'Has backfile in'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d51b90050',
    desc: 'AuthIdent',
    internal: false,
    values: [
      {
        id: '8a817870818666b10181866d51bd0051',
        value: 'other',
        label: 'Other'
      },
      {
        id: '8a817870818666b10181866d51c50053',
        value: 'orcid',
        label: 'ORCID'
      },
      {
        id: '8a817870818666b10181866d51cd0055',
        value: 'over_ip_range',
        label: 'Over IP Range'
      },
      {
        id: '8a817870818666b10181866d51c90054',
        value: 'over_institute',
        label: 'Over Institute'
      },
      {
        id: '8a817870818666b10181866d51d20056',
        value: 'ringgold_id',
        label: 'Ringgold ID'
      },
      {
        id: '8a817870818666b10181866d51c10052',
        value: 'email_domain',
        label: 'Email Domain'
      },
      {
        id: '8a817870818666b10181866d51d60057',
        value: 'ror_id',
        label: 'ROR ID'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d4900000b',
    desc: 'DocumentAttachment.AtType',
    internal: false,
    values: [
      {
        id: '8a817870818666b10181866d4945000e',
        value: 'consortium_negotiation_document',
        label: 'Consortium negotiation document'
      },
      {
        id: '8a817870818666b10181866d4923000d',
        value: 'misc',
        label: 'Misc'
      },
      {
        id: '8a817870818666b10181866d4908000c',
        value: 'license',
        label: 'License'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d51080042',
    desc: 'FileStorageEngines',
    internal: false,
    values: [
      {
        id: '8a817870818666b10181866d51120044',
        value: 's3',
        label: 'S3'
      },
      {
        id: '8a817870818666b10181866d510d0043',
        value: 'lob',
        label: 'LOB'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d4a9f001a',
    desc: 'Global.Yes_No',
    internal: true,
    values: [
      {
        id: '8a817870818666b10181866d4aa8001b',
        value: 'yes',
        label: 'Yes'
      },
      {
        id: '8a817870818666b10181866d4ac3001c',
        value: 'no',
        label: 'No'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d48690006',
    desc: 'InternalContact.Role',
    internal: false,
    values: [
      {
        id: '8a817870818666b10181866d48c70009',
        value: 'erm_librarian',
        label: 'ERM librarian'
      },
      {
        id: '8a817870818666b10181866d48720007',
        value: 'agreement_owner',
        label: 'Agreement owner'
      },
      {
        id: '8a817870818666b10181866d489e0008',
        value: 'authorized_signatory',
        label: 'Authorized signatory'
      },
      {
        id: '8a817870818666b10181866d48e1000a',
        value: 'subject_specialist',
        label: 'Subject specialist'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d4e010030',
    desc: 'LicenseAmendmentStatus.Status',
    internal: true,
    values: [
      {
        id: '8a817870818666b10181866d4e4c0032',
        value: 'future',
        label: 'Future'
      },
      {
        id: '8a817870818666b10181866d4e070031',
        value: 'current',
        label: 'Current'
      },
      {
        id: '8a817870818666b10181866d4e920033',
        value: 'historical',
        label: 'Historical'
      },
      {
        id: '8a817870818666b10181866d4ec50034',
        value: 'does_not_apply',
        label: 'Does not apply'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d4ee70035',
    desc: 'PersistentJob.Result',
    internal: true,
    values: [
      {
        id: '8a817870818666b10181866d4f650039',
        value: 'interrupted',
        label: 'Interrupted'
      },
      {
        id: '8a817870818666b10181866d4eed0036',
        value: 'success',
        label: 'Success'
      },
      {
        id: '8a817870818666b10181866d4f0d0037',
        value: 'partial_success',
        label: 'Partial success'
      },
      {
        id: '8a817870818666b10181866d4f370038',
        value: 'failure',
        label: 'Failure'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d4f8e003a',
    desc: 'PersistentJob.Status',
    internal: true,
    values: [
      {
        id: '8a817870818666b10181866d4fdd003d',
        value: 'ended',
        label: 'Ended'
      },
      {
        id: '8a817870818666b10181866d4f96003b',
        value: 'queued',
        label: 'Queued'
      },
      {
        id: '8a817870818666b10181866d4fbe003c',
        value: 'in_progress',
        label: 'In progress'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d4d78002c',
    desc: 'Pkg.Type',
    internal: false,
    values: [
      {
        id: '8a817870818666b10181866d4da7002e',
        value: 'abstracts_and_index',
        label: 'Abstracts and Index'
      },
      {
        id: '8a817870818666b10181866d4dd8002f',
        value: 'package',
        label: 'Package'
      },
      {
        id: '8a817870818666b10181866d4d7f002d',
        value: 'aggregated_full_text',
        label: 'Aggregated Full Text'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d500b003e',
    desc: 'RemoteLicenseLink.Status',
    internal: true,
    values: [
      {
        id: '8a817870818666b10181866d50860041',
        value: 'historical',
        label: 'Historical'
      },
      {
        id: '8a817870818666b10181866d50430040',
        value: 'future',
        label: 'Future'
      },
      {
        id: '8a817870818666b10181866d5011003f',
        value: 'controlling',
        label: 'Controlling'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d4a250015',
    desc: 'StringTemplate.Context',
    internal: false,
    values: [
      {
        id: '8a817870818666b10181866d4a2c0016',
        value: 'urlproxier',
        label: 'urlProxier'
      },
      {
        id: '8a817870818666b10181866d4a4d0017',
        value: 'urlcustomiser',
        label: 'urlCustomiser'
      }
    ]
  },
  {
    id: '95172c43c2bf1b51d46f5870eec64fe0',
    desc: 'SubscriptionAgreement.AgreementStatus',
    internal: true,
    values: [
      {
        id: '8a817870818666b10181866d4cc00028',
        value: 'draft',
        label: 'Draft'
      },
      {
        id: '8a817870818666b10181866d4cf9002a',
        value: 'in_negotiation',
        label: 'In negotiation'
      },
      {
        id: '8a817870818666b10181866d4d2b002b',
        value: 'active',
        label: 'Active'
      },
      {
        id: '8a817870818666b10181866d4cd70029',
        value: 'requested',
        label: 'Requested'
      },
      {
        id: 'e8166482e01afc585b4534f298fdb9af',
        value: 'closed',
        label: 'Closed'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d4af4001d',
    desc: 'SubscriptionAgreement.AgreementType',
    internal: false,
    values: [
      {
        id: '8a817870818666b10181866d4afb001e',
        value: 'draft',
        label: 'Draft'
      },
      {
        id: '8a817870818666b10181866d4b18001f',
        value: 'trial',
        label: 'Trial'
      },
      {
        id: '8a817870818666b10181866d4b3a0020',
        value: 'current',
        label: 'Current'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d4a7a0018',
    desc: 'SubscriptionAgreementOrg.Role',
    internal: false,
    values: [
      {
        id: '8a817870818666b10181866d4a810019',
        value: 'content_provider',
        label: 'Content provider'
      }
    ]
  },
  {
    id: '534fb09948fb4ab6d7966f28d0479dd2',
    desc: 'SubscriptionAgreement.ReasonForClosure',
    internal: false,
    values: [
      {
        id: '8a817870818666b10181866d4c270025',
        value: 'cancelled',
        label: 'Cancelled'
      },
      {
        id: '8a817870818666b10181866d4c850027',
        value: 'superseded',
        label: 'Superseded'
      },
      {
        id: '8a817870818666b10181866d4c5c0026',
        value: 'ceased',
        label: 'Ceased'
      },
      {
        id: 'e258a41d2a9e81bc703b0e0ac40277e9',
        value: 'rejected',
        label: 'Rejected'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d4b6f0021',
    desc: 'SubscriptionAgreement.RenewalPriority',
    internal: false,
    values: [
      {
        id: '8a817870818666b10181866d4b950023',
        value: 'for_review',
        label: 'For review'
      },
      {
        id: '8a817870818666b10181866d4b770022',
        value: 'definitely_renew',
        label: 'Definitely renew'
      },
      {
        id: '8a817870818666b10181866d4bc60024',
        value: 'definitely_cancel',
        label: 'Definitely cancel'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d47230000',
    desc: 'TitleInstance.SubType',
    internal: true,
    values: [
      {
        id: '8a817870818666b10181866d47850001',
        value: 'print',
        label: 'Print'
      },
      {
        id: '8a817870818666b10181866d47e20002',
        value: 'electronic',
        label: 'Electronic'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d48070003',
    desc: 'TitleInstance.Type',
    internal: true,
    values: [
      {
        id: '8a817870818666b10181866d48430005',
        value: 'serial',
        label: 'Serial'
      },
      {
        id: '8a817870818666b10181866d48110004',
        value: 'monograph',
        label: 'Monograph'
      }
    ]
  },
  {
    id: '8a817870818666b10181866d51a8004c',
    desc: 'Yes/No/Other',
    internal: false,
    values: [
      {
        id: '8a817870818666b10181866d51ab004d',
        value: 'yes',
        label: 'Yes'
      },
      {
        id: '8a817870818666b10181866d51b5004f',
        value: 'other_(see_notes)',
        label: 'Other (see notes)'
      },
      {
        id: '8a817870818666b10181866d51b0004e',
        value: 'no',
        label: 'No'
      }
    ]
  },
  {
    id: '2c9180a6869d971801869d9cee040049',
    des: 'SubscriptionAgreement.ContentType',
    internal: false,
    values: [
      {
        id: '2c9180a6869d971801869d9cee13004d',
        value: 'audio',
        label: 'Audio'
      },
      {
        id: '2c9180a6869d971801869d9cee06004a',
        value: 'books',
        label: 'Books'
      },
      {
        id: '2c9180a6869d971801869d9cee0f004c',
        value: 'database',
        label: 'Database'
      },
      {
        id: '2c9180a6869d971801869d9cee0b004b',
        value: 'journals',
        label: 'Journals'
      },
      {
        id: '2c9180a6869d971801869d9cee17004e',
        value: 'video',
        label: 'Video'
      }
    ]
  }
];

export default refdata;
