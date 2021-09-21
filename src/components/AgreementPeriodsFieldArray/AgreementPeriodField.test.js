import React from 'react';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';

import translationsProperties from '../../../test/helpers';
import AgreementPeriodField from './AgreementPeriodField';

const onSubmit = jest.fn();

describe('AgreementPeriodField', () => {
  test('renders expected fields', () => {
    const { getByTestId, getByRole } = renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <AgreementPeriodField
          index={0}
          input={{
            name: 'agreementPeriodTest'
          }}
        />
      </TestForm>, translationsProperties
    );

    expect(getByTestId('agreementPeriodField')).toBeInTheDocument();
    expect(getByRole('textbox', { name: /start date/i })).toBeInTheDocument();
    expect(getByRole('textbox', { name: /end date/i })).toBeInTheDocument();
    expect(getByRole('textbox', { name: /cancellation deadline/i })).toBeInTheDocument();
    expect(getByRole('textbox', { name: /period note/i })).toBeInTheDocument();
  });

  // Test start date/end date validation.
  // Overlapping agreement period validation to be covered in AgreementPeriodFieldArrayTest
  test('date validation fires for invalid end date', async () => {
    const { getAllByText, getByRole, queryByText } = renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <AgreementPeriodField
          index={0}
          input={{
            name: 'agreementPeriodTest'
          }}
        />
      </TestForm>, translationsProperties
    );
    userEvent.type(getByRole('textbox', { name: /start date/i }), '01/01/2021');
    userEvent.type(getByRole('textbox', { name: /end date/i }), '01/01/2002');

    /*
     * This actually works with getByText, because currently the validation only
     * appears on the startDate field until you click away from the endDate field.
     * This behaviour should not be relied upon though, since the validation is set up on two fields.
     * getAllByText returns an array, so just check it has any values in it.
     */
    await waitFor(() => expect(getAllByText(/End date must be after the start date./i)?.[0]).toBeInTheDocument());
    // amend end date (Have to clear it first)
    // TODO use interactors when they become available, for fillAndBlur
    userEvent.clear(getByRole('textbox', { name: /end date/i }));
    userEvent.type(getByRole('textbox', { name: /end date/i }), '01/01/2022');
    await waitFor(() => expect(queryByText(/End date must be after the start date./i)).not.toBeInTheDocument());
  });

  test('expected values are submitted', () => {
    const { getByRole, getByTestId } = renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <AgreementPeriodField
          index={0}
          input={{
            name: 'agreementPeriodTest'
          }}
        />
      </TestForm>, translationsProperties
    );
    userEvent.type(getByRole('textbox', { name: /start date/i }), '10/10/1996');
    userEvent.type(getByRole('textbox', { name: /end date/i }), '02/06/1999');
    userEvent.type(getByRole('textbox', { name: /cancellation deadline/i }), '01/01/1999');
    userEvent.type(getByRole('textbox', { name: /period note/i }), 'Agreement period field note');

    userEvent.click(getByTestId('submit'));
    expect(onSubmit.mock.calls.length).toBe(1);
    const submittedValues = onSubmit.mock.calls[0][0];
    const expectedPayload = {
      agreementPeriodTest: {
        startDate: '1996-10-10',
        endDate: '1999-02-06',
        cancellationDeadline: '1999-01-01',
        note: 'Agreement period field note'
      }
    };
    expect(submittedValues).toEqual(expectedPayload);
  });
});
