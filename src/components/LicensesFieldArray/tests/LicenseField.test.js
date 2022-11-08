import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Field } from 'react-final-form';
import { KeyValue } from '@folio/stripes-testing';
import LicenseField from '../LicenseField';

import translationsProperties from '../../../../test/helpers';

const onLicenseSelected = jest.fn();
const onSubmit = jest.fn();

const license = {
  'id': 'f3c7e090-c4de-401d-8f51-e7fbdbbba2e8',
  'endDateSemantics': {
    'id': '2c9180c07c0668a3017c066970cc0014',
    'value': 'implicit',
    'label': 'Implicit',
    'owner': {
      'id': '2c9180c07c0668a3017c066970ba0011',
      'desc': 'License.EndDateSemantics',
      'internal': true
    }
  },
  'dateCreated': '2021-09-21T15:51:51Z',
  'customProperties': {},
  'contacts': [],
  'tags': [],
  'lastUpdated': '2021-09-21T15:51:51Z',
  'docs': [],
  'name': 'am license 1',
  'status': {
    'id': '2c9180c07c0668a3017c066970e20018',
    'value': 'active',
    'label': 'Active',
    'owner': {
      'id': '2c9180c07c0668a3017c066970d20015',
      'desc': 'License.Status',
      'internal': true
    }
  },
  'supplementaryDocs': [],
  'startDate': '2021-09-21',
  'endDate': '2021-09-22',
  'openEnded': false,
  'amendments': [],
  'orgs': [],
  'type': {
    'id': '2c9180c07c0668a3017c066970550001',
    'value': 'local',
    'label': 'Local',
    'owner': {
      'id': '2c9180c07c0668a3017c06696ffb0000',
      'desc': 'License.Type',
      'internal': false
    }
  },
  'alternateNames': []
};

describe('LicenseField', () => {
  let renderComponent;
  describe('renders expected fields with no initial values', () => {
    renderComponent = renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <MemoryRouter>
          <Field
            component={LicenseField}
            license={{}}
            name="license"
            onLicenseSelected={onLicenseSelected}
            validate={() => { }}
          />
        </MemoryRouter>
      </TestForm>,
      translationsProperties
    );

    it('renders the default message', () => {
      const { getByText } = renderComponent;
      expect(getByText('Link a license to get started')).toBeInTheDocument();
    });
  });

  describe('renders expected fields/values with initial values set', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm initialValues={{ license }} onSubmit={onSubmit}>
          <MemoryRouter>
            <Field
              component={LicenseField}
              input={{ value: license.id }}
              license={license}
              name="license"
              onLicenseSelected={onLicenseSelected}
              validate={() => { }}
            />
          </MemoryRouter>
        </TestForm>,
        translationsProperties
      );
    });

    it('renders expected values', async () => {
      await KeyValue('Type').has({ value: 'Local' });
      await KeyValue('Status').has({ value: 'Active' });
      await KeyValue('Start date').has({ value: '9/21/2021' });
      await KeyValue('End date').has({ value: '9/22/2021' });
    });
  });
});
