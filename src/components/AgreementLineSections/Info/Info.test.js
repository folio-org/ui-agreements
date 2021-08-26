import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { KeyValue } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import Info from './Info';

jest.mock('../../PackageCardExternal', () => () => <div>PackageCardExternal</div>);

const isSuppressFromDiscoveryEnabled = jest.fn().mockImplementation(resource => resource);

const line = {
    'id': '0bc141e5-9cb8-432f-bd61-69069ada4f03',
    'type': 'external',
    'description': 'This is description.',
    'authority': 'EKB-PACKAGE',
    'reference': '122380-2556389',
    'explanation': null,
    'startDate': '2021-08-04',
    'endDate': '2021-08-28',
    'activeFrom': '2021-08-04',
    'activeTo': '2021-08-28',
    'contentUpdated': null,
    'haveAccess': true,
    'suppressFromDiscovery': true,
    'note': 'This is note.',
    'tags': '[]',
    'owner': {
      'id': '59cf8946-1496-4434-8c9c-4dbe218ad83c',
      'dateCreated': '2021-08-23T08:13:21Z',
      'isPerpetual': {
        'id': '2c91809c7b70aeb1017b70b5e700001d',
        'value': 'yes',
        'label': 'Yes'
      },
      'name': 'MR test Info',
      'orgs': [],
      'externalLicenseDocs': [],
      'outwardRelationships': [],
      'customProperties': {},
      'contacts': [],
      'tags': [],
      'lastUpdated': '2021-08-23T08:13:21Z',
      'inwardRelationships': [],
      'renewalPriority': {
        'id': '2c91809c7b70aeb1017b70b5e71d0024',
        'value': 'definitely_renew',
        'label': 'Definitely renew'
      },
      'endDate': '2021-08-28',
      'startDate': '2021-08-04',
      'linkedLicenses': [],
      'docs': [],
      'periods': [
        '{endDate: "2021-08-28", id: "6b1b4903-3f14-4f51-add…}'
      ],
      'usageDataProviders': [],
      'agreementStatus': {
        'id': '2c91809c7b70aeb1017b70b5e767002d',
        'value': 'active',
        'label': 'Active'
      },
      'supplementaryDocs': [],
      'description': 'This is description.',
      'cancellationDeadline': null,
      'items': [
        '{id: "0bc141e5-9cb8-432f-bd61-69069ada4f03"}'
      ],
      'alternateNames': []
    },
    'customCoverage': false,
    'reference_object': {
      'label': 'i-Scholar',
      'type': 'Package',
      'provider': 'Informatics Publishing Limited',
      'titleCount': 1028,
      'selectedCount': 0,
      'contentType': 'E-Journal',
      'providerName': 'Informatics Publishing Limited'
    },
    'poLines': '[]'
  };

 const resource = {
    'id': '0bc141e5-9cb8-432f-bd61-69069ada4f03',
    'type': 'external',
    'description': 'This is description.',
    'authority': 'EKB-PACKAGE',
    'reference': '122380-2556389',
    'explanation': null,
    'startDate': '2021-08-04',
    'endDate': '2021-08-28',
    'activeFrom': '2021-08-04',
    'activeTo': '2021-08-28',
    'contentUpdated': null,
    'haveAccess': true,
    'suppressFromDiscovery': true,
    'note': 'This is note.',
    'tags': '[]',
    'owner': {
      'id': '59cf8946-1496-4434-8c9c-4dbe218ad83c',
      'dateCreated': '2021-08-23T08:13:21Z',
      'isPerpetual': {
        'id': '2c91809c7b70aeb1017b70b5e700001d',
        'value': 'yes',
        'label': 'Yes'
      },
      'name': 'Mr test Info',
      'orgs': [],
      'externalLicenseDocs': [],
      'outwardRelationships': [],
      'customProperties': {},
      'contacts': [],
      'tags': [],
      'lastUpdated': '2021-08-23T08:13:21Z',
      'inwardRelationships': [],
      'renewalPriority': {
        'id': '2c91809c7b70aeb1017b70b5e71d0024',
        'value': 'definitely_renew',
        'label': 'Definitely renew'
      },
      'endDate': '2021-08-28',
      'startDate': '2021-08-04',
      'linkedLicenses': [],
      'docs': [],
      'periods': [
        '{endDate: "2021-08-28", id: "6b1b4903-3f14-4f51-add…}'
      ],
      'usageDataProviders': [],
      'agreementStatus': {
        'id': '2c91809c7b70aeb1017b70b5e767002d',
        'value': 'active',
        'label': 'Active'
      },
      'supplementaryDocs': [],
      'description': 'This is description.',
      'cancellationDeadline': null,
      'items': [
        '{id: "0bc141e5-9cb8-432f-bd61-69069ada4f03"}'
      ],
      'alternateNames': []
    },
    'customCoverage': false,
    'reference_object': '{contentType: "E-Journal", label: "i-Scholar", prov…}',
    'poLines': '[]'
};

    let renderComponent;
    describe('Info', () => {
    beforeEach(() => {
        renderComponent = renderWithIntl(
          <MemoryRouter>
            <Info
              isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled}
              line={line}
              resource={resource}
            />
          </MemoryRouter>,
        translationsProperties
        );
    });

    test('renders Info component', async () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('lineInfo')).toBeInTheDocument();
    });

    test('displays parent agreements name', async () => {
        await KeyValue('Parent agreement').has({ value: 'MR test Info' });
    });

    test('displays parent agreement activeFrom date', async () => {
      await KeyValue('Active from').has({ value: '2021-08-04' });
    });

    test('displays parent agreement activeTo date', async () => {
      await KeyValue('Active to').has({ value: '2021-08-28' });
    });

    test('displays parent agreement suppressFromDiscovery', async () => {
      await KeyValue('Suppress from discovery').has({ value: 'Yes' });
    });

    test('dispalys parent agreement note', async () => {
      await KeyValue('Note').has({ value: 'This is note.' });
    });

    test('dispalys parent agreement description', async () => {
      await KeyValue('Description').has({ value: 'This is description.' });
    });

    test('renders the PackageCardExternal component', () => {
      const { getByText } = renderComponent;
      expect(getByText('PackageCardExternal')).toBeInTheDocument();
    });
});
