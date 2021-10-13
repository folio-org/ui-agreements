
import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes-testing';
import { noop } from 'lodash';
import translationsProperties from '../../../test/helpers';
import AgreementCreateRoute from './AgreementCreateRoute';

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

const data = {
  checkAsyncValidation: () => {},
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
    agreements: {
      POST: noop
    },
    query: {
      update: noop
    },
  },
  resources: {
    agreements
  }
};

describe('AgreementCreateRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementCreateRoute {...data} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('displays the new agreement', () => {
      const { getByText } = renderComponent;
      expect(getByText('New agreement')).toBeInTheDocument();
    });

    test('displays the name label', () => {
      const { getByText } = renderComponent;
      expect(getByText('Name')).toBeInTheDocument();
    });

    test('display the * symbol', () => {
      const { getAllByText } = renderComponent;
      expect(getAllByText('*'));
    });

    test('renders the submit button', async () => {
      await Button('stripes-components.collapseAll').exists();
    });
  });

  describe('rendering with no permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementCreateRoute
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
