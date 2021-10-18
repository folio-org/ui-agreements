
import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { noop } from 'lodash';
import translationsProperties from '../../../test/helpers';
import AgreementEditRoute from './AgreementEditRoute';

const agreements = {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [{
        'id': '61982b9a-5688-44ce-8ef2-2268e4c43c0a',
        'cancellationDeadline': '2021-10-26',
        'dateCreated': '2021-10-18T06:39:13Z',
        'isPerpetual': {
            'id': '2c91809c7c9112ac017c911abc33002f',
            'value': 'yes',
            'label': 'Yes'
        },
        'items': [{
                'id': '364cadf6-7919-444a-ad28-eeb48f43416a',
                'dateCreated': '2021-10-18T06:39:13Z',
                'activeTo': '2021-10-27',
                'tags': [],
                'lastUpdated': '2021-10-18T07:46:17Z',
                'owner': {
                    'id': '61982b9a-5688-44ce-8ef2-2268e4c43c0a'
                },
                'resource': {
                    'id': 'de686c29-46f6-4676-9e83-e3c2928d4419',
                    'class': 'org.olf.kb.PackageContentItem',
                    'name': "'(De)mobilizing the entrepreneurship discourse: exploring entreprene...' on Platform 'Elgaronline' in Package Edward Elgar:Edward Elgar E-Book Archive in Business & Management, ...",
                    'suppressFromDiscovery': false,
                    'tags': '[]',
                    'customCoverage': false,
                    '_object': '{accessEnd: "2020-09-02", accessStart: "2013-01-01"…}'
                },
                'activeFrom': '2021-10-06',
                'poLines': [],
                'suppressFromDiscovery': false,
                'note': 'agreement line note',
                'customCoverage': false,
                'explanation': 'Agreement includes this item from a package specifically',
                'startDate': '2021-10-06',
                'endDate': '2021-10-27',
                'contentUpdated': null,
                'haveAccess': true
            },
            {
                'id': '4e671a96-e6b7-4775-99b2-066d5bc2a8a6',
                'dateCreated': '2021-10-18T06:39:13Z',
                'activeTo': '2021-10-24',
                'tags': [],
                'lastUpdated': '2021-10-18T07:46:17Z',
                'owner': {
                    'id': '61982b9a-5688-44ce-8ef2-2268e4c43c0a'
                },
                'resource': {
                    'id': '4f9a8cfd-8a93-45ab-b2a1-37f367f9bfc9',
                    'class': 'org.olf.kb.Pkg',
                    'name': 'Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz',
                    'suppressFromDiscovery': false,
                    'tags': '[]',
                    'customCoverage': false,
                    '_object': '{class: "org.olf.kb.Pkg", coverage: Array(0), dateC…}'
                },
                'activeFrom': '2021-10-02',
                'poLines': [],
                'suppressFromDiscovery': false,
                'note': 'agreement line note',
                'customCoverage': false,
                'explanation': 'Agreement includes a package containing this item',
                'startDate': '2021-10-02',
                'endDate': '2021-10-24',
                'contentUpdated': null,
                'haveAccess': true
            },
            {
                'id': 'a770776e-87a8-436c-b6da-04096081df4e',
                'dateCreated': '2021-10-18T07:46:17Z',
                'tags': [],
                'lastUpdated': '2021-10-18T07:46:17Z',
                'owner': {
                    'id': '61982b9a-5688-44ce-8ef2-2268e4c43c0a'
                },
                'resource': {
                    'id': '4f9a8cfd-8a93-45ab-b2a1-37f367f9bfc9',
                    'class': 'org.olf.kb.Pkg',
                    'name': 'Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz',
                    'suppressFromDiscovery': false,
                    'tags': '[]',
                    'customCoverage': false,
                    '_object': '{class: "org.olf.kb.Pkg", coverage: Array(0), dateC…}'
                },
                'poLines': [],
                'suppressFromDiscovery': false,
                'customCoverage': false,
                'explanation': 'Agreement includes a package containing this item',
                'startDate': null,
                'endDate': null,
                'activeFrom': null,
                'activeTo': null,
                'contentUpdated': null,
                'haveAccess': true
            },
            {
                'id': 'c4857c85-6123-4610-84bc-af4d7afecbe2',
                'dateCreated': '2021-10-18T07:46:17Z',
                'tags': [],
                'lastUpdated': '2021-10-18T07:46:17Z',
                'owner': {
                    'id': '61982b9a-5688-44ce-8ef2-2268e4c43c0a'
                },
                'resource': {
                    'id': 'de686c29-46f6-4676-9e83-e3c2928d4419',
                    'class': 'org.olf.kb.PackageContentItem',
                    'name': "'(De)mobilizing the entrepreneurship discourse: exploring entreprene...' on Platform 'Elgaronline' in Package Edward Elgar:Edward Elgar E-Book Archive in Business & Management, ...",
                    'suppressFromDiscovery': false,
                    'tags': '[]',
                    'customCoverage': false,
                    '_object': '{accessEnd: "2020-09-02", accessStart: "2013-01-01"…}'
                },
                'poLines': [],
                'suppressFromDiscovery': false,
                'customCoverage': false,
                'explanation': 'Agreement includes this item from a package specifically',
                'startDate': null,
                'endDate': null,
                'activeFrom': null,
                'activeTo': null,
                'contentUpdated': null,
                'haveAccess': true
            }
        ],
        'name': 'MR agreement test',
        'orgs': [],
        'externalLicenseDocs': [],
        'outwardRelationships': [],
        'customProperties': {},
        'contacts': [],
        'tags': [],
        'lastUpdated': '2021-10-18T07:46:17Z',
        'inwardRelationships': [],
        'renewalPriority': {
            'id': '2c91809c7c9112ac017c911abc590037',
            'value': 'for_review',
            'label': 'For review'
        },
        'endDate': '2021-10-20',
        'startDate': '2021-10-01',
        'linkedLicenses': [],
        'docs': [],
        'periods': [
            '{cancellationDeadline: "2021-10-26", endDate: "2021…}'
        ],
        'usageDataProviders': [],
        'agreementStatus': {
            'id': '2c91809c7c9112ac017c911abc94003f',
            'value': 'active',
            'label': 'Active'
        },
        'supplementaryDocs': [],
        'description': 'agreement description',
        'alternateNames': []
    }],
    'successfulMutations': [],
    'failedMutations': [],
    'pendingMutations': [],
    'loadedAt': 'Mon Oct 18 2021 08:48:26 GMT+0100 (British Summer Time)',
    'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/sas/61982b9a-5688-44ce-8ef2-2268e4c43c0a',
    'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
    'httpStatus': 200,
    'other': {
        'totalRecords': null
    },
    'resource': 'agreement',
    'module': '@folio/agreements',
    'throwErrors': true
};

const initialValues = {
    'id': 'd55466eb-4e81-43d3-8c3b-ea85dc61ef9f',
    'cancellationDeadline': '2021-10-26',
    'dateCreated': '2021-10-15T08:29:35Z',
    'isPerpetual': 'yes',
    'name': 'MR agreement test',
    'orgs': '[]',
    'licenseNote': "agreement's license information",
    'externalLicenseDocs': '[]',
    'outwardRelationships': '[]',
    'customProperties': '{}',
    'contacts': [{
        'id': '13222cb6-1c91-4b6d-a7b9-2f3294dbed40',
        'owner': {
            'id': 'd55466eb-4e81-43d3-8c3b-ea85dc61ef9f'
        },
        'role': 'erm_librarian',
        'user': '2a823816-c059-4703-becf-0cc68a734189'
    }],
    'tags': '[]',
    'lastUpdated': '2021-10-15T14:17:19Z',
    'inwardRelationships': '[]',
    'renewalPriority': 'for_review',
    'endDate': '2021-10-31',
    'startDate': '2021-10-01',
    'linkedLicenses': '[]',
    'docs': '[]',
    'periods': [{
        'id': '53583b44-a4f9-4c0c-8607-2a503d83e5db',
        'startDate': '2021-10-01',
        'cancellationDeadline': '2021-10-26',
        'owner': {
            'id': 'd55466eb-4e81-43d3-8c3b-ea85dc61ef9f'
        },
        'note': 'agreement period note',
        'endDate': '2021-10-31',
        'periodStatus': 'current'
    }],
    'usageDataProviders': '[]',
    'agreementStatus': 'active',
    'supplementaryDocs': '[]',
    'description': 'agreement description',
    'alternateNames': '[]',
    'relatedAgreements': '[]'
};

const data = {
  checkAsyncValidation: () => jest.fn(),
  handlers: {
    onDownloadFile: () => {},
    onUploadFile: () => {}
  },
  history: {
    push: () => jest.fn()
  },
  location: {},
  match: {
    params: {},
  },
  mutator: {
    agreement: {
      PUT: noop
    },
    agreements: {
      PUT: noop
    },
    query: {
      update: noop
    },
  },
  resources: {
    agreements
  }
};

describe('AgreementEditRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementEditRoute {...data} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the agreementForm component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('agreements')).toBeInTheDocument();
    });
  });


  describe('rendering the route with initialValues', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementEditRoute {...data} initialValues={initialValues} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the agreementForm component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('agreements')).toBeInTheDocument();
    });
  });

  describe('rendering with no permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementEditRoute
            {...data}
            stripes={{ hasPerm: () => false }}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('displays the permission error', () => {
      const { getByText } = renderComponent;
      expect(getByText('stripes-smart-components.permissionError')).toBeInTheDocument();
    });
  });
});
