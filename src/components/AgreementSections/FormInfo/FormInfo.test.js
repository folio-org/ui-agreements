import { Select, TextArea, TextField, TestForm, renderWithIntl } from '@folio/stripes-erm-testing';
import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { useAsyncValidation } from '@folio/stripes-erm-components';

import FormInfo from './FormInfo';
import translationsProperties from '../../../../test/helpers';
import { data, initialValues } from './testResources';

jest.mock('../../AgreementPeriodsFieldArray', () => () => <div>AgreementPeriodsFieldArray</div>);
jest.mock('../ContentTypesFieldArray', () => () => <div>ContentTypesFieldArray</div>);

const onSubmit = jest.fn();
const onAsyncValidate = jest.fn();

let renderComponent;

describe('FormInfo', () => {
  useAsyncValidation.mockImplementation(() => (onAsyncValidate));
  describe('with no initial values', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm
          onSubmit={onSubmit}
        >
          {({ form, values }) => (
            <FormInfo data={data} form={form} values={values} />
          )}
        </TestForm>, translationsProperties
      );
    });

    test('renders the Name field', async () => {
      await TextField('Name*').exists();
    });

    test('renders the Description field', async () => {
      await TextArea('Description').exists();
    });

    test('renders the Status dropdown with correct options', async () => {
      await Select('Status*').exists();
      await waitFor(async () => {
        await Select('Status*').choose('Active');
        await Select('Status*').choose('Closed');
        await Select('Status*').choose('Draft');
        await Select('Status*').choose('In negotiation');
        await Select('Status*').choose('Requested');
      });
    });

    test('renders a disabled Reason for closure dropdown', async () => {
      await Select('Reason for closure').has({ disabled: true });
    });

    test('Reason for closure dropdown activates when correct status is selected and has correct options', async () => {
      await waitFor(async () => {
        await Select('Status*').choose('Active');
      });
      await Select('Reason for closure').has({ disabled: true });

      await waitFor(async () => {
        await Select('Status*').choose('Closed');
        await Select('Status*').blur();
      });

      await Select('Reason for closure').has({ disabled: false });

      await waitFor(async () => {
        await Select('Reason for closure').choose('Cancelled');
        await Select('Reason for closure').choose('Ceased');
        await Select('Reason for closure').choose('Rejected');
        await Select('Reason for closure').choose('Superseded');
      });
    });

    /* EXAMPLE -- Testing warning set by setFieldData (When using stripes Select interactor as is) */
    /* test('Reason for closure warning shows up when set and status !== closed', async () => {
      // First set status to closed
      await Select('Status*').choose('Closed');

      // Now set reason for closure, ensure we FOCUS, so that meta.touched works as expected
      await Select('Reason for closure').focus();
      await Select('Reason for closure').choose('Cancelled');

      // Now set Status away from 'Closed'. Focus here because 'blur' action DOES NOT WORK as expected,
      // so this is the equivalent of bluring
      await Select('Status*').focus();
      await Select('Status*').choose('Active');

      // Finally test the warning itself
      await Select('Reason for closure').has({ warning: 'This reason will be cleared as status is not closed' });
    }); */

    /* EXAMPLE -- Testing warning set by setFieldData (using stripes-erm-testing Select Interactor) */
    test('Reason for closure warning shows up when set and status !== closed', async () => {
      await waitFor(async () => {
        // First set status to closed
        await Select('Status*').choose('Closed');
        // Next set the reason for closure dropdown USING CHOOSEANDBLUR to ensure 'touched' meta value is set
        await Select('Reason for closure').chooseAndBlur('Cancelled');

        // Now set Status away from 'Closed'.
        await Select('Status*').choose('Active');
      });


      // Finally test the warning itself
      await Select('Reason for closure').has({ warning: 'This reason will be cleared as status is not closed' });
    });

    test('renders the Renewal priority dropdown  with correct options', async () => {
      await Select('Renewal priority').exists();
      await waitFor(async () => {
        await Select('Renewal priority').choose('Definitely renew');
        await Select('Renewal priority').choose('For review');
        await Select('Renewal priority').choose('Definitely cancel');
      });
    });

    test('renders the Is perpetual dropdown with correct options', async () => {
      await Select('Is perpetual').exists();
      await waitFor(async () => {
        await Select('Is perpetual').choose('Yes');
        await Select('Is perpetual').choose('No');
      });
    });

    test('renders the ContentTypes FieldArray', () => {
      const { getByText } = renderComponent;
      expect(getByText('ContentTypesFieldArray')).toBeInTheDocument();
    });

    test('renders the AlternativeNames FieldArray', () => {
      const { getByText } = renderComponent;
      expect(getByText('AlternativeNamesFieldArray')).toBeInTheDocument();
    });

    test('renders the AgreementPeriods FieldArray', () => {
      const { getByText } = renderComponent;
      expect(getByText('AgreementPeriodsFieldArray')).toBeInTheDocument();
    });
  });

  describe('with initial values', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm
          initialValues={initialValues}
          onSubmit={onSubmit}
        >
          {({ form, values }) => (
            <FormInfo data={data} form={form} values={values} />
          )}
        </TestForm>, translationsProperties
      );
    });

    test('renders the expected value in the Name field', async () => {
      await TextField('Name*').has({ value: 'AM ag 1' });
    });

    test('renders the expected value in the Description field', async () => {
      await TextArea('Description').has({ value: 'description for this agreement' });
    });

    test('renders the expected value in the Status dropdown', async () => {
      await Select('Status*').has({ value: 'active' });
    });

    test('renders a disabled Reason for closure dropdown', async () => {
      await Select('Reason for closure').has({ disabled: true });
    });

    test('renders the expected value in the Renewal priority dropdown', async () => {
      await Select('Renewal priority').has({ value: 'definitely_renew' });
    });

    test('renders the expected value in the Is perpetual dropdown', async () => {
      await Select('Is perpetual').has({ value: 'yes' });
    });

    test('renders the ContentTypes FieldArray', () => {
      const { getByText } = renderComponent;
      expect(getByText('ContentTypesFieldArray')).toBeInTheDocument();
    });

    test('renders the AlternativeNames FieldArray', () => {
      const { getByText } = renderComponent;
      expect(getByText('AlternativeNamesFieldArray')).toBeInTheDocument();
    });

    test('renders the AgreementPeriods FieldArray', () => {
      const { getByText } = renderComponent;
      expect(getByText('AgreementPeriodsFieldArray')).toBeInTheDocument();
    });

    test('typing in the name field should fire the onAsyncValidate callback', async () => {
      await waitFor(async () => {
        await TextField('Name*').fillIn('a');
      });

      expect(onAsyncValidate).toHaveBeenCalled();
    });
  });
});
