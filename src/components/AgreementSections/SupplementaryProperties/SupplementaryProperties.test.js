import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Accordion } from '@folio/stripes-testing';
import SupplementaryProperties from './SupplementaryProperties';
import translationsProperties from '../../../../test/helpers';

const agreement = {
  'id': 'b18552eb-c3cf-4283-961c-cf1c8a2a9aa0',
  'dateCreated': '2021-07-22T20:15:18Z',
  'name': 'AM ag 1',
  'orgs': [],
  'externalLicenseDocs': [],
  'outwardRelationships': [],
  'customProperties': {
    'test': [
      {
        'id': 5,
        'internal': true,
        'value': 'test',
        'type': {
          'id': '2c9180bc7acc43e3017acfdbf963004a',
          'name': 'test',
          'primary': true,
          'defaultInternal': true,
          'label': 'SupplementaryProperty2',
          'description': 'test',
          'weight': 0,
          'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
        }
      }
    ],
    'testnew': [
      {
        'id': 4,
        'internal': true,
        'value': 1,
        'type': {
          'id': '2c9180bc7acc43e3017acfe3409a004b',
          'name': 'testnew',
          'primary': true,
          'defaultInternal': true,
          'label': 'SupplementaryProperty1',
          'description': 'test1',
          'weight': 0,
          'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger'
        }
      }
    ]
  },
  'contacts': [],
  'tags': [],
  'lastUpdated': '2021-07-22T20:54:56Z',
  'inwardRelationships': [],
  'startDate': '2021-07-23',
  'linkedLicenses': [],
  'docs': [],
  'periods': [
    {
      'id': '541326bf-581f-4710-bfd1-1233fbd13fc5',
      'startDate': '2021-07-23',
      'owner': {
        'id': 'b18552eb-c3cf-4283-961c-cf1c8a2a9aa0'
      },
      'periodStatus': 'next'
    }
  ],
  'usageDataProviders': [],
  'agreementStatus': {
    'id': '2c9180bc7acc43e3017acc44709a0037',
    'value': 'active',
    'label': 'Active'
  },
  'supplementaryDocs': [],
  'endDate': null,
  'cancellationDeadline': null,
  'alternateNames': [],
  'relatedAgreements': [],
  'lines': [],
  'agreementLinesCount': 0,
  'eresources': [],
  'eresourcesCount': 0,
  'orderLines': []
};

const supplementaryPropertiesData = {
  'agreement': {
    'id': 'b18552eb-c3cf-4283-961c-cf1c8a2a9aa0',
    'dateCreated': '2021-07-22T20:15:18Z',
    'name': 'AM ag 1',
    'orgs': [],
    'externalLicenseDocs': [],
    'outwardRelationships': [],
    'customProperties': {
      'test': [
        {
          'id': 5,
          'internal': true,
          'value': 'test',
          'type': {
            'id': '2c9180bc7acc43e3017acfdbf963004a',
            'name': 'test',
            'primary': true,
            'defaultInternal': true,
            'label': 'SupplementaryProperty2',
            'description': 'test',
            'weight': 0,
            'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
          }
        }
      ],
      'testnew': [
        {
          'id': 4,
          'internal': true,
          'value': 1,
          'type': {
            'id': '2c9180bc7acc43e3017acfe3409a004b',
            'name': 'testnew',
            'primary': true,
            'defaultInternal': true,
            'label': 'SupplementaryProperty1',
            'description': 'test1',
            'weight': 0,
            'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger'
          }
        }
      ]
    },
    'contacts': [],
    'tags': [],
    'lastUpdated': '2021-07-22T20:54:56Z',
    'inwardRelationships': [],
    'startDate': '2021-07-23',
    'linkedLicenses': [],
    'docs': [],
    'periods': [
      {
        'id': '541326bf-581f-4710-bfd1-1233fbd13fc5',
        'startDate': '2021-07-23',
        'owner': {
          'id': 'b18552eb-c3cf-4283-961c-cf1c8a2a9aa0'
        },
        'periodStatus': 'next'
      }
    ],
    'usageDataProviders': [],
    'agreementStatus': {
      'id': '2c9180bc7acc43e3017acc44709a0037',
      'value': 'active',
      'label': 'Active'
    },
    'supplementaryDocs': [],
    'endDate': null,
    'cancellationDeadline': null,
    'alternateNames': [],
    'relatedAgreements': [],
    'lines': [],
    'agreementLinesCount': 0,
    'eresources': [],
    'eresourcesCount': 0,
    'orderLines': []
  },
  'eresourcesFilterPath': 'current',
  'searchString': '?filters=agreementStatus.active%2CagreementStatus.draft%2CagreementStatus.in_negotiation%2CagreementStatus.requested&sort=name',
  'supplementaryProperties': [
    {
      'id': '2c9180bc7acc43e3017acfe3409a004b',
      'name': 'testnew',
      'primary': true,
      'defaultInternal': true,
      'label': 'SupplementaryProperty1',
      'description': 'test1',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger'
    },
    {
      'id': '2c9180bc7acc43e3017acfdbf963004a',
      'name': 'test',
      'primary': true,
      'defaultInternal': true,
      'label': 'SupplementaryProperty2',
      'description': 'test',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
    }
  ],
  'terms': [
    {
      'id': '2c9180c17acc43d9017acc448d6b0027',
      'name': 'authorisedUsers',
      'primary': true,
      'defaultInternal': true,
      'label': 'Definition of authorised user',
      'description': 'The definition of an authorised user for a resource',
      'weight': -1,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
    },
    {
      'id': '2c9180c17acc43d9017acc448e650029',
      'name': 'remoteAccess',
      'primary': true,
      'category': {
        'id': '2c9180c17acc43d9017acc448c68001a',
        'desc': 'Yes/No/Other',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c80001c',
            'value': 'no',
            'label': 'No'
          },
          {
            'id': '2c9180c17acc43d9017acc448c6d001b',
            'value': 'yes',
            'label': 'Yes'
          },
          {
            'id': '2c9180c17acc43d9017acc448c87001d',
            'value': 'other_(see_notes)',
            'label': 'Other (see notes)'
          }
        ]
      },
      'defaultInternal': true,
      'label': 'Access restricted to on-campus/campus network?',
      'description': 'Can access to the resource be provided from outside the library or institutional location / network',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      'id': '2c9180c17acc43d9017acc448e6a002a',
      'name': 'illElectronic',
      'primary': true,
      'category': {
        'id': '2c9180c17acc43d9017acc448c8c001e',
        'desc': 'Permitted/Prohibited',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c9a0020',
            'value': 'permitted_(explicit)_under_conditions',
            'label': 'Permitted (explicit) under conditions'
          },
          {
            'id': '2c9180c17acc43d9017acc448ca10021',
            'value': 'permitted_(interpreted)',
            'label': 'Permitted (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cb30023',
            'value': 'prohibited_(interpreted)',
            'label': 'Prohibited (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cc90025',
            'value': 'not_applicable',
            'label': 'Not applicable'
          },
          {
            'id': '2c9180c17acc43d9017acc448caa0022',
            'value': 'prohibited_(explicit)',
            'label': 'Prohibited (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448c91001f',
            'value': 'permitted_(explicit)',
            'label': 'Permitted (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cbf0024',
            'value': 'unmentioned',
            'label': 'Unmentioned'
          }
        ]
      },
      'defaultInternal': true,
      'label': 'Electronic ILL',
      'description': 'The right to provide the licensed materials via interlibrary loan by way of electronic copies',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      'id': '2c9180c17acc43d9017acc448e900030',
      'name': 'copyDigital',
      'primary': true,
      'category': {
        'id': '2c9180c17acc43d9017acc448c8c001e',
        'desc': 'Permitted/Prohibited',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c9a0020',
            'value': 'permitted_(explicit)_under_conditions',
            'label': 'Permitted (explicit) under conditions'
          },
          {
            'id': '2c9180c17acc43d9017acc448ca10021',
            'value': 'permitted_(interpreted)',
            'label': 'Permitted (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cb30023',
            'value': 'prohibited_(interpreted)',
            'label': 'Prohibited (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cc90025',
            'value': 'not_applicable',
            'label': 'Not applicable'
          },
          {
            'id': '2c9180c17acc43d9017acc448caa0022',
            'value': 'prohibited_(explicit)',
            'label': 'Prohibited (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448c91001f',
            'value': 'permitted_(explicit)',
            'label': 'Permitted (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cbf0024',
            'value': 'unmentioned',
            'label': 'Unmentioned'
          }
        ]
      },
      'defaultInternal': true,
      'label': 'Making digital copies',
      'description': 'The right of the licensee and authorized users to download and digitally copy a reasonable portion of the licensed materials',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      'id': '2c9180c17acc43d9017acc448e930031',
      'name': 'copyPrint',
      'primary': true,
      'category': {
        'id': '2c9180c17acc43d9017acc448c8c001e',
        'desc': 'Permitted/Prohibited',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c9a0020',
            'value': 'permitted_(explicit)_under_conditions',
            'label': 'Permitted (explicit) under conditions'
          },
          {
            'id': '2c9180c17acc43d9017acc448ca10021',
            'value': 'permitted_(interpreted)',
            'label': 'Permitted (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cb30023',
            'value': 'prohibited_(interpreted)',
            'label': 'Prohibited (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cc90025',
            'value': 'not_applicable',
            'label': 'Not applicable'
          },
          {
            'id': '2c9180c17acc43d9017acc448caa0022',
            'value': 'prohibited_(explicit)',
            'label': 'Prohibited (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448c91001f',
            'value': 'permitted_(explicit)',
            'label': 'Permitted (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cbf0024',
            'value': 'unmentioned',
            'label': 'Unmentioned'
          }
        ]
      },
      'defaultInternal': true,
      'label': 'Making print copies',
      'description': 'The right of the licensee and authorized users to print a reasonable portion of the licensed materials',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      'id': '2c9180c17acc43d9017acc448d620026',
      'name': 'concurrentAccess',
      'primary': true,
      'defaultInternal': true,
      'label': 'Number of concurrent users allowed',
      'description': 'The number of concurrent users allowed by the resource',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger'
    },
    {
      'id': '2c9180c17acc43d9017acc448e7d002c',
      'name': 'illPrint',
      'primary': true,
      'category': {
        'id': '2c9180c17acc43d9017acc448c8c001e',
        'desc': 'Permitted/Prohibited',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c9a0020',
            'value': 'permitted_(explicit)_under_conditions',
            'label': 'Permitted (explicit) under conditions'
          },
          {
            'id': '2c9180c17acc43d9017acc448ca10021',
            'value': 'permitted_(interpreted)',
            'label': 'Permitted (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cb30023',
            'value': 'prohibited_(interpreted)',
            'label': 'Prohibited (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cc90025',
            'value': 'not_applicable',
            'label': 'Not applicable'
          },
          {
            'id': '2c9180c17acc43d9017acc448caa0022',
            'value': 'prohibited_(explicit)',
            'label': 'Prohibited (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448c91001f',
            'value': 'permitted_(explicit)',
            'label': 'Permitted (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cbf0024',
            'value': 'unmentioned',
            'label': 'Unmentioned'
          }
        ]
      },
      'defaultInternal': true,
      'label': 'Print ILL',
      'description': 'The right to provide the licensed materials via interlibrary loan by way of print copies or facsimile transmission',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      'id': '2c9180c17acc43d9017acc448e72002b',
      'name': 'illSecureElectronic',
      'primary': true,
      'category': {
        'id': '2c9180c17acc43d9017acc448c8c001e',
        'desc': 'Permitted/Prohibited',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c9a0020',
            'value': 'permitted_(explicit)_under_conditions',
            'label': 'Permitted (explicit) under conditions'
          },
          {
            'id': '2c9180c17acc43d9017acc448ca10021',
            'value': 'permitted_(interpreted)',
            'label': 'Permitted (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cb30023',
            'value': 'prohibited_(interpreted)',
            'label': 'Prohibited (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cc90025',
            'value': 'not_applicable',
            'label': 'Not applicable'
          },
          {
            'id': '2c9180c17acc43d9017acc448caa0022',
            'value': 'prohibited_(explicit)',
            'label': 'Prohibited (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448c91001f',
            'value': 'permitted_(explicit)',
            'label': 'Permitted (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cbf0024',
            'value': 'unmentioned',
            'label': 'Unmentioned'
          }
        ]
      },
      'defaultInternal': true,
      'label': 'Secure Electronic ILL',
      'description': 'The right to provide the licensed materials via interlibrary loan by way of secure electronic transmission',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      'id': '2c9180c17acc43d9017acc448e82002d',
      'name': 'reservesElectronic',
      'primary': true,
      'category': {
        'id': '2c9180c17acc43d9017acc448c8c001e',
        'desc': 'Permitted/Prohibited',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c9a0020',
            'value': 'permitted_(explicit)_under_conditions',
            'label': 'Permitted (explicit) under conditions'
          },
          {
            'id': '2c9180c17acc43d9017acc448ca10021',
            'value': 'permitted_(interpreted)',
            'label': 'Permitted (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cb30023',
            'value': 'prohibited_(interpreted)',
            'label': 'Prohibited (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cc90025',
            'value': 'not_applicable',
            'label': 'Not applicable'
          },
          {
            'id': '2c9180c17acc43d9017acc448caa0022',
            'value': 'prohibited_(explicit)',
            'label': 'Prohibited (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448c91001f',
            'value': 'permitted_(explicit)',
            'label': 'Permitted (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cbf0024',
            'value': 'unmentioned',
            'label': 'Unmentioned'
          }
        ]
      },
      'defaultInternal': true,
      'label': 'Storage of electronic copies on secure network',
      'description': 'The right to make electronic copies of the licensed materials and store them on a secure network',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      'id': '2c9180c17acc43d9017acc448e87002e',
      'name': 'coursePackElectronic',
      'primary': true,
      'category': {
        'id': '2c9180c17acc43d9017acc448c8c001e',
        'desc': 'Permitted/Prohibited',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c9a0020',
            'value': 'permitted_(explicit)_under_conditions',
            'label': 'Permitted (explicit) under conditions'
          },
          {
            'id': '2c9180c17acc43d9017acc448ca10021',
            'value': 'permitted_(interpreted)',
            'label': 'Permitted (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cb30023',
            'value': 'prohibited_(interpreted)',
            'label': 'Prohibited (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cc90025',
            'value': 'not_applicable',
            'label': 'Not applicable'
          },
          {
            'id': '2c9180c17acc43d9017acc448caa0022',
            'value': 'prohibited_(explicit)',
            'label': 'Prohibited (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448c91001f',
            'value': 'permitted_(explicit)',
            'label': 'Permitted (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cbf0024',
            'value': 'unmentioned',
            'label': 'Unmentioned'
          }
        ]
      },
      'defaultInternal': false,
      'label': 'Use in electronic coursepacks',
      'description': 'The right to use licensed materials in collections or compilations of materials assembled in an electronic format by faculty members for use by students in a class for purposes of instruction',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      'id': '2c9180c17acc43d9017acc448e8c002f',
      'name': 'coursePackPrint',
      'primary': true,
      'category': {
        'id': '2c9180c17acc43d9017acc448c8c001e',
        'desc': 'Permitted/Prohibited',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c9a0020',
            'value': 'permitted_(explicit)_under_conditions',
            'label': 'Permitted (explicit) under conditions'
          },
          {
            'id': '2c9180c17acc43d9017acc448ca10021',
            'value': 'permitted_(interpreted)',
            'label': 'Permitted (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cb30023',
            'value': 'prohibited_(interpreted)',
            'label': 'Prohibited (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cc90025',
            'value': 'not_applicable',
            'label': 'Not applicable'
          },
          {
            'id': '2c9180c17acc43d9017acc448caa0022',
            'value': 'prohibited_(explicit)',
            'label': 'Prohibited (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448c91001f',
            'value': 'permitted_(explicit)',
            'label': 'Permitted (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cbf0024',
            'value': 'unmentioned',
            'label': 'Unmentioned'
          }
        ]
      },
      'defaultInternal': false,
      'label': 'Use in print course packs',
      'description': 'The right to use licensed materials in collections or compilations of materials assembled in a print format by faculty members for use by students in a class for purposes of instruction',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      'id': '2c9180c17acc43d9017acc448e5d0028',
      'name': 'walkInAccess',
      'primary': true,
      'category': {
        'id': '2c9180c17acc43d9017acc448c68001a',
        'desc': 'Yes/No/Other',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c80001c',
            'value': 'no',
            'label': 'No'
          },
          {
            'id': '2c9180c17acc43d9017acc448c6d001b',
            'value': 'yes',
            'label': 'Yes'
          },
          {
            'id': '2c9180c17acc43d9017acc448c87001d',
            'value': 'other_(see_notes)',
            'label': 'Other (see notes)'
          }
        ]
      },
      'defaultInternal': false,
      'label': 'Walk-in access permitted?',
      'description': 'Can non-members of the library/instittuion use the resource when in the library',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      'id': '2c9180c17acc43d9017acc448ea90037',
      'name': 'authProxy',
      'primary': false,
      'category': {
        'id': '2c9180c17acc43d9017acc448c68001a',
        'desc': 'Yes/No/Other',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c80001c',
            'value': 'no',
            'label': 'No'
          },
          {
            'id': '2c9180c17acc43d9017acc448c6d001b',
            'value': 'yes',
            'label': 'Yes'
          },
          {
            'id': '2c9180c17acc43d9017acc448c87001d',
            'value': 'other_(see_notes)',
            'label': 'Other (see notes)'
          }
        ]
      },
      'defaultInternal': true,
      'label': 'Access via a proxy supported?',
      'description': 'Whether authentication via a reverse proxy is supported',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      'id': '2c9180c17acc43d9017acc448eb4003a',
      'name': 'annualOptOut',
      'primary': false,
      'category': {
        'id': '2c9180c17acc43d9017acc448c68001a',
        'desc': 'Yes/No/Other',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c80001c',
            'value': 'no',
            'label': 'No'
          },
          {
            'id': '2c9180c17acc43d9017acc448c6d001b',
            'value': 'yes',
            'label': 'Yes'
          },
          {
            'id': '2c9180c17acc43d9017acc448c87001d',
            'value': 'other_(see_notes)',
            'label': 'Other (see notes)'
          }
        ]
      },
      'defaultInternal': true,
      'label': 'Annual opt-out clause included?',
      'description': "Whether the license includes an 'annual opt-out' clause within a multi-year agreement",
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      'id': '2c9180c17acc43d9017acc448ea60036',
      'name': 'authIP',
      'primary': false,
      'category': {
        'id': '2c9180c17acc43d9017acc448c68001a',
        'desc': 'Yes/No/Other',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c80001c',
            'value': 'no',
            'label': 'No'
          },
          {
            'id': '2c9180c17acc43d9017acc448c6d001b',
            'value': 'yes',
            'label': 'Yes'
          },
          {
            'id': '2c9180c17acc43d9017acc448c87001d',
            'value': 'other_(see_notes)',
            'label': 'Other (see notes)'
          }
        ]
      },
      'defaultInternal': true,
      'label': 'IP authentication supported?',
      'description': 'Whether authentication via IP range is supported',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      'id': '2c9180c17acc43d9017acc448ea20035',
      'name': 'metadataUsage',
      'primary': false,
      'defaultInternal': true,
      'label': 'Metadata usage',
      'description': 'Any restrictions expressed related to the use of metadata in the platforms',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
    },
    {
      'id': '2c9180c17acc43d9017acc448e9a0033',
      'name': 'otherRestrictions',
      'primary': false,
      'defaultInternal': true,
      'label': 'Other restrictions',
      'description': 'Other restrictions expressed in the license',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
    },
    {
      'id': '2c9180c17acc43d9017acc448eb00039',
      'name': 'authSAML',
      'primary': false,
      'category': {
        'id': '2c9180c17acc43d9017acc448c68001a',
        'desc': 'Yes/No/Other',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c80001c',
            'value': 'no',
            'label': 'No'
          },
          {
            'id': '2c9180c17acc43d9017acc448c6d001b',
            'value': 'yes',
            'label': 'Yes'
          },
          {
            'id': '2c9180c17acc43d9017acc448c87001d',
            'value': 'other_(see_notes)',
            'label': 'Other (see notes)'
          }
        ]
      },
      'defaultInternal': true,
      'label': 'SAML compliant authentication supported?',
      'description': 'Whether authentication via SAML compliant method is supported',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      'id': '2c9180c17acc43d9017acc448e960032',
      'name': 'scholarlySharing',
      'primary': false,
      'category': {
        'id': '2c9180c17acc43d9017acc448c8c001e',
        'desc': 'Permitted/Prohibited',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c9a0020',
            'value': 'permitted_(explicit)_under_conditions',
            'label': 'Permitted (explicit) under conditions'
          },
          {
            'id': '2c9180c17acc43d9017acc448ca10021',
            'value': 'permitted_(interpreted)',
            'label': 'Permitted (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cb30023',
            'value': 'prohibited_(interpreted)',
            'label': 'Prohibited (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cc90025',
            'value': 'not_applicable',
            'label': 'Not applicable'
          },
          {
            'id': '2c9180c17acc43d9017acc448caa0022',
            'value': 'prohibited_(explicit)',
            'label': 'Prohibited (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448c91001f',
            'value': 'permitted_(explicit)',
            'label': 'Permitted (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cbf0024',
            'value': 'unmentioned',
            'label': 'Unmentioned'
          }
        ]
      },
      'defaultInternal': true,
      'label': 'Sharing for scholarly use',
      'description': 'The right of authorized users and/or licensee to transmit hard copy or electronic copy of reasonable amounts of licensed materials to a third party for personal, scholarly, educational, scientific or professional use',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      'id': '2c9180c17acc43d9017acc448e9e0034',
      'name': 'textAndDataMining',
      'primary': false,
      'category': {
        'id': '2c9180c17acc43d9017acc448c8c001e',
        'desc': 'Permitted/Prohibited',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c9a0020',
            'value': 'permitted_(explicit)_under_conditions',
            'label': 'Permitted (explicit) under conditions'
          },
          {
            'id': '2c9180c17acc43d9017acc448ca10021',
            'value': 'permitted_(interpreted)',
            'label': 'Permitted (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cb30023',
            'value': 'prohibited_(interpreted)',
            'label': 'Prohibited (interpreted)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cc90025',
            'value': 'not_applicable',
            'label': 'Not applicable'
          },
          {
            'id': '2c9180c17acc43d9017acc448caa0022',
            'value': 'prohibited_(explicit)',
            'label': 'Prohibited (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448c91001f',
            'value': 'permitted_(explicit)',
            'label': 'Permitted (explicit)'
          },
          {
            'id': '2c9180c17acc43d9017acc448cbf0024',
            'value': 'unmentioned',
            'label': 'Unmentioned'
          }
        ]
      },
      'defaultInternal': false,
      'label': 'Text and Data mining',
      'description': 'Whether it is permitted to use text and data mining processes on the content of the resource',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    },
    {
      'id': '2c9180c17acc43d9017acc448eb6003b',
      'name': 'APCAndOffsetting',
      'primary': false,
      'defaultInternal': true,
      'label': 'Whether the resource is subject to an APC discount or subscription cost offsetting agreement',
      'description': 'Whether the resource is subject to an APC discount or subscription cost offsetting agreement',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
    },
    {
      'id': '2c9180c17acc43d9017acc448eac0038',
      'name': 'postCancellationAccess',
      'primary': false,
      'category': {
        'id': '2c9180c17acc43d9017acc448c68001a',
        'desc': 'Yes/No/Other',
        'internal': false,
        'values': [
          {
            'id': '2c9180c17acc43d9017acc448c80001c',
            'value': 'no',
            'label': 'No'
          },
          {
            'id': '2c9180c17acc43d9017acc448c6d001b',
            'value': 'yes',
            'label': 'Yes'
          },
          {
            'id': '2c9180c17acc43d9017acc448c87001d',
            'value': 'other_(see_notes)',
            'label': 'Other (see notes)'
          }
        ]
      },
      'defaultInternal': true,
      'label': 'Post-cancellation terms included?',
      'description': 'Does the license include post-cancellation terms?',
      'weight': 1,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    }
  ]
};

let renderComponent;

describe('SupplementaryProperties', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <SupplementaryProperties
        agreement={agreement}
        data={supplementaryPropertiesData}
        id="supplementaryProperties"
      />,
      translationsProperties
    );
  });

  test('renders the expected Accordion', async () => {
    await Accordion('Supplementary properties').exists();
  });

  test('renders the first Supplementary property', () => {
    const { getByText } = renderComponent;
    expect(getByText('SupplementaryProperty1'));
  });

  test('renders the second Supplementary property', () => {
    const { getByText } = renderComponent;
    expect(getByText('SupplementaryProperty2'));
  });
});
