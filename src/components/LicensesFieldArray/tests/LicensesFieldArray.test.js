import { waitFor, within } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { Button, renderWithIntl, Select, TestForm } from '@folio/stripes-erm-testing';

import { FieldArray } from 'react-final-form-arrays';
import LicensesFieldArray from '..';

import translationsProperties from '../../../../test/helpers';

const onSubmit = jest.fn();

jest.mock('../LicenseField', () => () => <div>LicenseField</div>);
jest.mock('../AmendmentsFieldArray', () => () => <div>AmendmentsFieldArray</div>);

const licenseStatusValues = [
  {
    id: '2c9180c27c0668c1017c06695692000a',
    value: 'controlling',
    label: 'Controlling'
  },
  {
    id: '2c9180c27c0668c1017c0669569a000b',
    value: 'future',
    label: 'Future'
  },
  {
    id: '2c9180c27c0668c1017c066956a4000c',
    value: 'historical',
    label: 'Historical'
  }
];

const linkedLicenses = [
  {
    id: '2c9180c27c0668c1017c090f371f004a',
    remoteId: '6223a9a1-38d5-4c74-9848-04804d139ea6',
    remoteId_object: {
      id: '6223a9a1-38d5-4c74-9848-04804d139ea6',
      endDateSemantics: {
        id: '2c9180c07c0668a3017c066970cc0014',
        value: 'implicit',
        label: 'Implicit',
        owner: {
          id: '2c9180c07c0668a3017c066970ba0011',
          desc: 'License.EndDateSemantics',
          internal: true
        }
      },
      dateCreated: '2021-09-21T15:52:06Z',
      customProperties: {},
      contacts: [],
      tags: [],
      lastUpdated: '2021-09-21T15:52:06Z',
      docs: [],
      name: 'AM license 2',
      status: {
        id: '2c9180c07c0668a3017c066970e20018',
        value: 'active',
        label: 'Active',
        owner: {
          id: '2c9180c07c0668a3017c066970d20015',
          desc: 'License.Status',
          internal: true
        }
      },
      supplementaryDocs: [],
      openEnded: false,
      amendments: [],
      orgs: [],
      type: {
        id: '2c9180c07c0668a3017c066970550001',
        value: 'local',
        label: 'Local',
        owner: {
          id: '2c9180c07c0668a3017c06696ffb0000',
          desc: 'License.Type',
          internal: false
        }
      },
      alternateNames: []
    },
    owner: {
      id: '87ad00f4-520e-4400-a980-cb10c3b64171'
    },
    amendments: [],
    status: 'future',
    note: 'test note 1'
  },
  {
    id: '2c9180c27c0668c1017c090f371f004b',
    remoteId: 'f3c7e090-c4de-401d-8f51-e7fbdbbba2e8',
    remoteId_object: {
      id: 'f3c7e090-c4de-401d-8f51-e7fbdbbba2e8',
      endDateSemantics: {
        id: '2c9180c07c0668a3017c066970cc0014',
        value: 'implicit',
        label: 'Implicit',
        owner: {
          id: '2c9180c07c0668a3017c066970ba0011',
          desc: 'License.EndDateSemantics',
          internal: true
        }
      },
      dateCreated: '2021-09-21T15:51:51Z',
      customProperties: {},
      contacts: [],
      tags: [],
      lastUpdated: '2021-09-21T15:51:51Z',
      docs: [],
      name: 'am license 1',
      status: {
        id: '2c9180c07c0668a3017c066970e20018',
        value: 'active',
        label: 'Active',
        owner: {
          id: '2c9180c07c0668a3017c066970d20015',
          desc: 'License.Status',
          internal: true
        }
      },
      supplementaryDocs: [],
      startDate: '2021-09-21',
      openEnded: false,
      amendments: [],
      orgs: [],
      type: {
        id: '2c9180c07c0668a3017c066970550001',
        value: 'local',
        label: 'Local',
        owner: {
          id: '2c9180c07c0668a3017c06696ffb0000',
          desc: 'License.Type',
          internal: false
        }
      },
      alternateNames: []
    },
    owner: {
      id: '87ad00f4-520e-4400-a980-cb10c3b64171'
    },
    amendments: [],
    status: 'controlling',
    note: 'test note 2'
  }
];

describe('LicensesFieldArray', () => {
  describe('render with empty initial values', () => {
    let renderComponent;
    beforeEach(async () => {
      renderComponent = renderWithIntl(
        <TestForm
          initialValues={{}}
          onSubmit={onSubmit}
        >
          <FieldArray
            component={LicensesFieldArray}
            name="linkedLicenses"
          />
        </TestForm>, translationsProperties
      );
    });

    it('renders empty field', () => {
      const { getByText } = renderComponent;
      expect(getByText('No licenses for this agreement')).toBeInTheDocument();
    });

    it('clicking the add button renders the licenseField field', async () => {
      const { getByText } = renderComponent;
      await waitFor(async () => {
        await Button('Add license').click();
      });

      await waitFor(async () => {
        expect(getByText('LicenseField')).toBeInTheDocument();
      });
    });

    it('clicking and blurring the Status select dropdown should render an error', async () => {
      const { getByText } = renderComponent;
      await waitFor(async () => {
        await Button('Add license').click();
      });

      await waitFor(async () => {
        await Select('Status (this agreement)*').focus();
        await Select('Status (this agreement)*').blur();
        await expect(getByText('Please fill this in to continue')).toBeInTheDocument();
      });
    });

    it('adding/removing fields using the add/remove works as expected', async () => {
      const { getByRole, queryAllByTestId } = renderComponent;
      const addButton = Button('Add license');

      await addButton.exists();
      await waitFor(async () => {
        await addButton.click();
      });

      await waitFor(async () => {
        expect(queryAllByTestId(/licensesFieldArray\[.*\]/i).length).toEqual(1);
      });

      await waitFor(async () => {
        await addButton.click();
      });

      await waitFor(async () => {
        expect(queryAllByTestId(/licensesFieldArray\[.*\]/i).length).toEqual(2);
      });

      const trashButton = getByRole('button', { name: 'Remove license 2' });
      await waitFor(async () => {
        await userEvent.click(trashButton);
      });
      await waitFor(async () => {
        expect(queryAllByTestId(/licensesFieldArray\[.*\]/i).length).toEqual(1);
      });
    });
  });

  describe('rendering with initial values set', () => {
    let renderComponent;
    beforeEach(async () => {
      renderComponent = renderWithIntl(
        <TestForm
          initialValues={{ linkedLicenses }}
          onSubmit={onSubmit}
        >
          <FieldArray
            component={LicensesFieldArray}
            licenseStatusValues={licenseStatusValues}
            name="linkedLicenses"
          />
        </TestForm>, translationsProperties
      );
    });

    it('renders expected number of fields', () => {
      const { queryAllByTestId } = renderComponent;
      expect(queryAllByTestId(/licensesFieldArray\[.*\]/).length).toEqual(linkedLicenses.length);
    });

    it('renders the expected status in each field', async () => {
      await Select({ id: 'linkedLicenses-status-0' }).has({ value: 'future' });
      await Select({ id: 'linkedLicenses-status-1' }).has({ value: 'controlling' });
    });

    it('renders the expected note in each field', () => {
      const { getByTestId } = renderComponent;
      expect(within(getByTestId('licensesFieldArray[0]')).getByRole('textbox', { name: /Note/i }).value).toEqual('test note 1');
      expect(within(getByTestId('licensesFieldArray[1]')).getByRole('textbox', { name: /Note/i }).value).toEqual('test note 2');
    });
  });
});
