import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { KeyValue } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import Info from './Info';

jest.mock('../../PackageCard', () => () => <div>PackageCard</div>);
jest.mock('../../PackageCardExternal', () => () => <div>PackageCardExternal</div>);
jest.mock('../../TitleCard', () => () => <div>TitleCard</div>);
jest.mock('../../TitleCardExternal', () => () => <div>TitleCardExternal</div>);

const line = {
    'id': '4ecd2dfb-40da-49bf-84ce-afe3b2d7df5d',
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
        'id': 'b1631c53-c383-4e71-b5bd-50e23ee96b8e',
        'cancellationDeadline': '2021-08-09',
        'dateCreated': '2021-08-20T09:08:41Z',
        'isPerpetual': {
        'id': '2c91809c7b613a80017b614140780018',
        'value': 'yes',
        'label': 'Yes'
        },
        'name': 'MR test Info',
        'orgs': [],
        'licenseNote': "note about agreement's license",
        'externalLicenseDocs': [],
        'outwardRelationships': [],
        'customProperties': {},
        'contacts': [
        '{id: "1f05a876-96d0-488e-93d1-f27a1ec7171e", owner:…}'
        ],
        'tags': [],
        'lastUpdated': '2021-08-20T09:08:41Z',
        'inwardRelationships': [],
        'renewalPriority': {
        'id': '2c91809c7b613a80017b61414094001f',
        'value': 'definitely_renew',
        'label': 'Definitely renew'
        },
        'endDate': '2021-08-26',
        'startDate': '2021-08-06',
        'linkedLicenses': [],
        'docs': [],
        'periods': [
        '{cancellationDeadline: "2021-08-09", endDate: "2021…}'
        ],
        'usageDataProviders': [],
        'agreementStatus': {
        'id': '2c91809c7b613a80017b614140d20028',
        'value': 'active',
        'label': 'Active'
        },
        'supplementaryDocs': [],
        'items': [
        '{id: "4ecd2dfb-40da-49bf-84ce-afe3b2d7df5d"}'
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
          <Info
            id="lineInfo"
            line={line}
          />,
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
    await KeyValue('Suppress from discovery').has({ value: true });
    });

    test('dispalys parent agreement note', async () => {
    await KeyValue('Note').has({ value: 'This is note.' });
    });

    test('dispalys parent agreement description', async () => {
    await KeyValue('Description').has({ value: 'This is description.' });
    });

    test('renders the TitleCardExternal components', () => {
    const { getByText } = renderComponent;
    expect(getByText('TitleCardExternal')).toBeInTheDocument();
    });

    test('renders the PackageCard components', () => {
    const { getByText } = renderComponent;
    expect(getByText('PackageCard')).toBeInTheDocument();
    });

    test('renders the PackageCardExternal components', () => {
    const { getByText } = renderComponent;
    expect(getByText('PackageCardExternal')).toBeInTheDocument();
    });

    test('renders the TitleCard components', () => {
    const { getByText } = renderComponent;
    expect(getByText('TitleCard')).toBeInTheDocument();
    });
});
