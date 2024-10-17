import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { renderWithIntl, TestForm, Datepicker, TextArea } from '@folio/stripes-erm-testing';
import { Field } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import AgreementPeriodField from './AgreementPeriodField';

const onSubmit = jest.fn();

const period = {
  startDate: '1996-10-10',
  endDate: '1999-02-06',
  cancellationDeadline: '1999-01-01',
  note: 'Agreement period field note'
};

describe('AgreementPeriodField', () => {
  let renderComponent;
  describe('no initial values set', () => {
    beforeEach(() => {
      renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <MemoryRouter>
            <Field
              component={AgreementPeriodField}
              index={0}
              name="period"
            />
          </MemoryRouter>
        </TestForm>,
        translationsProperties
      );
    });

    test('expected fields exist', async () => {
      await Datepicker('Start date*').exists();
      await Datepicker('End date').exists();
      await Datepicker('Cancellation deadline').exists();
      await TextArea({ id: 'period-note-0' }).exists();
    });
  });

  describe('initial values set', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm initialValues={{ period }} onSubmit={onSubmit}>
          <MemoryRouter>
            <Field
              component={AgreementPeriodField}
              index={0}
              name="period"
            />
          </MemoryRouter>
        </TestForm>,
        translationsProperties
      );
    });

    test('renders expected values', async () => {
      await Datepicker('Start date*').has({ inputValue: '10/10/1996' });
      await Datepicker('End date').has({ inputValue: '02/06/1999' });
      await Datepicker('Cancellation deadline').has({ inputValue: '01/01/1999' });
      await TextArea({ id: 'period-note-0' }).has({ value: 'Agreement period field note' });
    });

    test('date validation fires for invalid end date', async () => {
      const { getAllByText, queryByText } = renderComponent;
      // set end date to invalid date
      await waitFor(async () => {
        await Datepicker('End date').clear();
        await Datepicker('End date').fillIn('02/06/1996');
      });

      await waitFor(() => expect(getAllByText(/End date must be after the start date./i)?.[0]).toBeInTheDocument());
      // set back to valid date
      await waitFor(async () => {
        await Datepicker('End date').clear();
        await Datepicker('End date').fillIn('02/06/1999');
      });

      await waitFor(() => expect(queryByText(/End date must be after the start date./i)).not.toBeInTheDocument());
    });
  });
});
