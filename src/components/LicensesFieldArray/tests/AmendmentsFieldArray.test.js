import { FieldArray } from 'react-final-form-arrays';
import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { mockErmComponents, renderWithIntl, TestForm, KeyValue, Select } from '@folio/stripes-erm-testing';

import AmendmentsFieldArray from '../AmendmentsFieldArray';

import translationsProperties from '../../../../test/helpers';

/* For this test we would like to retain the actual stripes-erm-components version of LicenseEndDate */
/* See LicenseAmendmentList.test.js for the full breakdown */
jest.unmock('@folio/stripes-erm-components');
const { LicenseEndDate: _mockLicenseEndDate, ...mockedERMComps } = mockErmComponents;
jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  ...mockedERMComps
}));

const onSubmit = jest.fn();

/* const form = {
  mutators: {
    setFieldData: jest.fn()
  }
}; */

const amendments = [
  {
    'id': 'a4080fe1-bdc7-4729-93d1-24175cdb8f6a',
    'owner': {
      'id': '2c91809c7c060664017c09dc83ec0048'
    },
    'status': 'future',
    'amendmentId': 'd9f4ec22-68fa-46e2-ad8b-39c236df7853',
    'note': 'test amendment note'
  }
];

const amendmentStatusValues = [
  {
    'id': '2c91809c7c060664017c060e35a20035',
    'value': 'current',
    'label': 'Current'
  },
  {
    'id': '2c91809c7c060664017c060e35a70036',
    'value': 'future',
    'label': 'Future'
  },
  {
    'id': '2c91809c7c060664017c060e35ac0037',
    'value': 'historical',
    'label': 'Historical'
  }
];

const license = {
  'id': 'ffbf6e5d-29a2-4e32-9771-c3a2eca4a213',
  'endDateSemantics': {
    'id': '2c91809d7c0606cd017c060e4c3d0003',
    'value': 'implicit',
    'label': 'Implicit',
    'owner': {
      'id': '2c91809d7c0606cd017c060e4bec0000',
      'desc': 'License.EndDateSemantics',
      'internal': true
    }
  },
  'dateCreated': '2021-09-21T19:36:43Z',
  'customProperties': {},
  'contacts': [],
  'tags': [],
  'lastUpdated': '2021-09-21T21:20:02Z',
  'docs': [],
  'name': 'am license 1',
  'status': {
    'id': '2c91809d7c0606cd017c060e4c570007',
    'value': 'active',
    'label': 'Active',
    'owner': {
      'id': '2c91809d7c0606cd017c060e4c430004',
      'desc': 'License.Status',
      'internal': true
    }
  },
  'supplementaryDocs': [],
  'openEnded': false,
  'amendments': [
    {
      'id': 'd9f4ec22-68fa-46e2-ad8b-39c236df7853',
      'endDateSemantics': {
        'id': '2c91809d7c0606cd017c060e4c2d0001',
        'value': 'explicit',
        'label': 'Explicit',
        'owner': {
          'id': '2c91809d7c0606cd017c060e4bec0000',
          'desc': 'License.EndDateSemantics',
          'internal': true
        }
      },
      'dateCreated': '2021-09-21T21:01:21Z',
      'customProperties': {},
      'contacts': [],
      'tags': [],
      'lastUpdated': '2021-09-21T21:20:02Z',
      'docs': [],
      'name': 'am amendment 1',
      'status': {
        'id': '2c91809d7c0606cd017c060e4c570007',
        'value': 'active',
        'label': 'Active',
        'owner': {
          'id': '2c91809d7c0606cd017c060e4c430004',
          'desc': 'License.Status',
          'internal': true
        }
      },
      'supplementaryDocs': [],
      'startDate': '2021-09-21',
      'endDate': '2021-09-29',
      'openEnded': false
    }
  ],
  'orgs': [],
  'type': {
    'id': '2c91809d7c0606cd017c060e4c8c0011',
    'value': 'local',
    'label': 'Local',
    'owner': {
      'id': '2c91809d7c0606cd017c060e4c8a0010',
      'desc': 'License.Type',
      'internal': false
    }
  },
  'alternateNames': []
};

const amendmentWithFutureStatus = [
  {
    'id': 'a4080fe1-bdc7-4729-93d1-24175cdb8f6a',
    'owner': {
      'id': '2c91809c7c060664017c09dc83ec0048'
    },
    'status': 'future',
    'amendmentId': 'd9f4ec22-68fa-46e2-ad8b-39c236df7853',
    'note': 'test amendment note'
  }
];


const licenseWithRejectedStatus = {
  'id': 'ffbf6e5d-29a2-4e32-9771-c3a2eca4a213',
  'endDateSemantics': {
    'id': '2c91809d7c0606cd017c060e4c3d0003',
    'value': 'implicit',
    'label': 'Implicit',
    'owner': {
      'id': '2c91809d7c0606cd017c060e4bec0000',
      'desc': 'License.EndDateSemantics',
      'internal': true
    }
  },
  'dateCreated': '2021-09-21T19:36:43Z',
  'customProperties': {},
  'contacts': [],
  'tags': [],
  'lastUpdated': '2021-09-22T00:19:10Z',
  'docs': [],
  'name': 'am license 1',
  'status': {
    'id': '2c91809d7c0606cd017c060e4c5d0008',
    'value': 'rejected',
    'label': 'Rejected',
    'owner': {
      'id': '2c91809d7c0606cd017c060e4c430004',
      'desc': 'License.Status',
      'internal': true
    }
  },
  'supplementaryDocs': [],
  'openEnded': false,
  'amendments': [
    {
      'id': 'd9f4ec22-68fa-46e2-ad8b-39c236df7853',
      'endDateSemantics': {
        'id': '2c91809d7c0606cd017c060e4c2d0001',
        'value': 'explicit',
        'label': 'Explicit',
        'owner': {
          'id': '2c91809d7c0606cd017c060e4bec0000',
          'desc': 'License.EndDateSemantics',
          'internal': true
        }
      },
      'dateCreated': '2021-09-21T21:01:21Z',
      'customProperties': {},
      'contacts': [],
      'tags': [],
      'lastUpdated': '2021-09-22T00:19:10Z',
      'docs': [],
      'name': 'am amendment 1',
      'status': {
        'id': '2c91809d7c0606cd017c060e4c640009',
        'value': 'expired',
        'label': 'Expired',
        'owner': {
          'id': '2c91809d7c0606cd017c060e4c430004',
          'desc': 'License.Status',
          'internal': true
        }
      },
      'supplementaryDocs': [],
      'startDate': '2021-09-23',
      'endDate': '2021-09-29',
      'openEnded': false
    }
  ],
  'orgs': [],
  'type': {
    'id': '2c91809d7c0606cd017c060e4c8c0011',
    'value': 'local',
    'label': 'Local',
    'owner': {
      'id': '2c91809d7c0606cd017c060e4c8a0010',
      'desc': 'License.Type',
      'internal': false
    }
  },
  'alternateNames': []
};

describe('AmendmentsFieldArray', () => {
  describe('with empty initial values', () => {
    let renderComponent;
    beforeEach(async () => {
      renderComponent = renderWithIntl(
        <TestForm
          initialValues={{}}
          onSubmit={onSubmit}
        >
          {({ form }) => (
            <FieldArray
              component={AmendmentsFieldArray}
              form={form}
              name="amendments"
            />
          )}
        </TestForm>, translationsProperties
      );
    });

    it('renders empty field', () => {
      const { queryAllByTestId } = renderComponent;
      expect(queryAllByTestId(/amendmentsFieldArray\[.*\]/).length).toEqual(0);
    });
  });

  describe('with initial values set', () => {
    let renderComponent;
    beforeEach(async () => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <TestForm
            initialValues={{ amendments }}
            onSubmit={onSubmit}
          >
            {({ form }) => (
              <FieldArray
                amendmentStatusValues={amendmentStatusValues}
                component={AmendmentsFieldArray}
                form={form}
                license={license}
                name="amendments"
              />
            )}
          </TestForm>
        </MemoryRouter>,
        translationsProperties
      );
    });

    it('renders expected number of fields', () => {
      const { queryAllByTestId } = renderComponent;
      expect(queryAllByTestId(/amendmentsFieldArray\[.*\]/).length).toEqual(amendments.length);
    });

    it('renders expected values', async () => {
      await KeyValue('Status').has({ value: 'Active' });
      await KeyValue('Start date').has({ value: '9/21/2021' });
      await KeyValue('End date').has({ value: '9/29/2021' });
      await Select().has({ value: 'future' });
    });

    describe('select a status of current', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Select().choose('Current');
        });
      });

      it('renders expected status of current', async () => {
        await Select().has({ value: 'current' });
      });
    });
  });


  describe('rendered with a license with rejected status and future amendment', () => {
    let renderComponent;
    beforeEach(async () => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <TestForm
            initialValues={{ amendments: amendmentWithFutureStatus }}
            onSubmit={onSubmit}
          >
            {({ form }) => (
              <FieldArray
                amendmentStatusValues={amendmentStatusValues}
                component={AmendmentsFieldArray}
                form={form}
                license={licenseWithRejectedStatus}
                name="amendments"
              />
            )}
          </TestForm>
        </MemoryRouter>,
        translationsProperties
      );
    });

    describe('selecting a status of current', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Select().choose('Current');
        });
      });

      it('renders a conflict warning message', () => {
        const { getByText } = renderComponent;
        expect(getByText('Conflicting statuses: Amendment status is "Expired" while "Status (this agreement)" is "Current."')).toBeInTheDocument();
      });
    });
  });
});
