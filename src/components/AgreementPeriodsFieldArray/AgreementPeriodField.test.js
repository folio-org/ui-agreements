import React from 'react';
import { waitFor } from '@testing-library/react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import { Field } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';
import { Datepicker, TextArea } from '@folio/stripes-testing';
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
      await Datepicker({ id: 'period-start-date-0' }).exists();
      await Datepicker({ id: 'period-end-date-0' }).exists();
      await Datepicker({ id: 'period-cancellation-deadline-0' }).exists();
      await TextArea({ id: 'period-note-0' }).exists();
    });

    test('expected fields have no values', async () => {
      await Datepicker({ id: 'period-start-date-0' }).has({ inputValue: '' });
      await Datepicker({ id: 'period-end-date-0' }).has({ inputValue: '' });
      await Datepicker({ id: 'period-cancellation-deadline-0' }).has({ inputValue: '' });
      await TextArea({ id: 'period-note-0' }).has({ value: '' });
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
      await Datepicker({ id: 'period-start-date-0' }).has({ inputValue: '10/10/1996' });
      await Datepicker({ id: 'period-end-date-0' }).has({ inputValue: '02/06/1999' });
      await Datepicker({ id: 'period-cancellation-deadline-0' }).has({ inputValue: '01/01/1999' });
      await TextArea({ id: 'period-note-0' }).has({ value: 'Agreement period field note' });
    });

    test('date validation fires for invalid end date', async () => {
      const { getAllByText, queryByText } = renderComponent;
      // set end date to invalid date
      await Datepicker({ id: 'period-end-date-0' }).clear();
      await Datepicker({ id: 'period-end-date-0' }).fillIn('02/06/1996');
      await waitFor(() => expect(getAllByText(/End date must be after the start date./i)?.[0]).toBeInTheDocument());
      // set back to valid date
      await Datepicker({ id: 'period-end-date-0' }).clear();
      await Datepicker({ id: 'period-end-date-0' }).fillIn('02/06/1999');
      await waitFor(() => expect(queryByText(/End date must be after the start date./i)).not.toBeInTheDocument());
    });
  });
});
