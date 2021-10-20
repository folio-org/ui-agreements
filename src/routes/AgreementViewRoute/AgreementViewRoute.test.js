
import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { noop } from 'lodash';
import translationsProperties from '../../../test/helpers';
import AgreementViewRoute from './AgreementViewRoute';


const agreement = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [
      {
        'id': '373437a0-0023-48ce-b516-c4f8330576a6',
        'cancellationDeadline': '2021-10-26',
        'dateCreated': '2021-10-20T08:09:15Z',
        'isPerpetual': {
          'id': '2c91809c7c9b5f3a017c9b67f96a0001',
          'value': 'yes',
          'label': 'Yes'
        },
        'items': [
          {
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
              {
                'id': '35825e38-5658-4e58-9b1d-1e99ed54e61d',
                'poLineId': '556abc25-ebbf-3fb2-b478-1bfaff0af4dc',
                'owner': {
                  'id': 'c1b59b66-8ab6-4008-8b63-57160fc7f66c'
                }
              }
            ],
            'suppressFromDiscovery': false,
            'note': 'agreement line note',
            'coverage': [
              {
                'id': '16368d18-aa90-472d-a87d-013b2697a0ea',
                'startDate': '2021-10-03',
                'endDate': '2021-10-26',
                'startVolume': '12',
                'startIssue': '6',
                'endVolume': '13',
                'endIssue': '11',
                'summary': 'v12/i6/2021-10-03 - v13/i11/2021-10-26'
              }
            ],
            'customCoverage': true,
            'explanation': 'Agreement includes this item from a package specifically',
            'startDate': '2021-10-08',
            'endDate': '2021-10-24',
            'contentUpdated': null,
            'haveAccess': true
          }
        ],
        'name': 'MR agreement test',
        'orgs': [],
        'externalLicenseDocs': [],
        'outwardRelationships': [
          {
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
          }
        ],
        'customProperties': {},
        'contacts': [
          {
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
          }
        ],
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
        'periods': [
          {
            'id': 'b40fe1bf-4d2f-461d-8236-81c934c0120a',
            'startDate': '2021-10-01',
            'cancellationDeadline': '2021-10-26',
            'owner': {
              'id': '373437a0-0023-48ce-b516-c4f8330576a6'
            },
            'note': 'agreement period note',
            'endDate': '2021-10-31',
            'periodStatus': 'current'
          }
        ],
        'usageDataProviders': [],
        'agreementStatus': {
          'id': '2c91809c7c9b5f3a017c9b67f9ef0011',
          'value': 'active',
          'label': 'Active'
        },
        'supplementaryDocs': [],
        'description': 'agreement description',
        'alternateNames': [],
        'relatedAgreements': [
          {
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
          }
        ]
      }
    ],
    'successfulMutations': [],
    'failedMutations': [],
    'pendingMutations': [],
    'loadedAt': 'Wed Oct 20 2021 13:18:57 GMT+0100 (British Summer Time)',
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

// const data = {
//     handlers: {
//         onDownloadFile: () => {},
//         onUploadFile: () => {}
//     },
//     history: {
//         push: () => jest.fn()
//     },
//     intel: {},
//     location: {},
//     match: {
//         params: {},
//     },
//     mutator: {
//         agreement: {
//             DELETE: noop
//         },
//         eresourcesFilterPath: {
//             replace: noop
//         },
//         interfaceRecord: {
//             replace: noop
//         },
//         agreementEresourcesOffset: {
//             replace: noop
//         },
//         agreementLinesOffset: {
//             replace: noop
//         },
//         query: {
//             update: noop
//         },
//     },
//     resources: {
//         agreement
//     }
// };

describe('AgreementViewRoute', () => {
  describe('rendering the agreementViewRoute', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementViewRoute resources={agreement} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the agreement component', () => {
        screen.debug();
      const { getByTestId } = renderComponent;
      expect(getByTestId('agreement')).toBeInTheDocument();
    });
  });
});
