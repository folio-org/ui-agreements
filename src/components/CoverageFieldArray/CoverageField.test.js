import React from 'react';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { Button, Datepicker, TextField } from '@folio/stripes-testing';

import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import CoverageField from './CoverageField';

import translationsProperties from '../../../test/helpers';

const onSubmit = jest.fn();

describe('CoverageField', () => {
  test('renders expected fields', () => {
    const { getByTestId, getByRole } = renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <CoverageField
          index={0}
          input={{
            name: 'coverageTest'
          }}
        />
      </TestForm>, translationsProperties
    );

    expect(getByTestId('coverageField')).toBeInTheDocument();
    expect(getByRole('textbox', { name: /start date/i })).toBeInTheDocument();
    expect(getByRole('textbox', { name: /start volume/i })).toBeInTheDocument();
    expect(getByRole('textbox', { name: /start issue/i })).toBeInTheDocument();
    expect(getByRole('textbox', { name: /end date/i })).toBeInTheDocument();
    expect(getByRole('textbox', { name: /end volume/i })).toBeInTheDocument();
    expect(getByRole('textbox', { name: /end issue/i })).toBeInTheDocument();
  });

  // Test start date/end date validation.
  // Overlapping and multiple open ended coverage validation to be covered in CoverageFieldArrayTest
  test('date validation fires for invalid end date', async () => {
    const { getAllByText, queryByText } = renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <CoverageField
          index={0}
          input={{
            name: 'coverageTest'
          }}
        />
      </TestForm>, translationsProperties
    );

    await Datepicker('Start date*').fillIn('01/01/2021');
    await Datepicker('End date').fillIn('01/01/2002');

    /*
     * This actually works with getByText, because currently the validation only
     * appears on the startDate field until you click away from the endDate field.
     * This behaviour should not be relied upon though, since the validation is set up on two fields.
     * getAllByText returns an array, so just check it has any values in it.
     */
    await waitFor(() => expect(getAllByText(/End date must be after the start date./i)?.[0]).toBeInTheDocument());
    // amend end date (Have to clear it first)
    await Datepicker('End date').clear();
    await Datepicker('End date').fillIn('01/01/2022');

    await waitFor(() => expect(queryByText(/End date must be after the start date./i)).not.toBeInTheDocument());
  });

  test('expected values are submitted', async () => {
    const { getByRole } = renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <CoverageField
          index={0}
          input={{
            name: 'coverageTest'
          }}
        />
      </TestForm>, translationsProperties
    );

    await Datepicker('Start date*').fillIn('10/10/1996');
    await Datepicker('End date').fillIn('02/06/1999');
    await TextField('Start volume').fillIn('1');
    await TextField('End volume').fillIn('5');
    await TextField('Start issue').fillIn('3rd');
    await TextField('End issue').fillIn('9th');

    await Button('Submit').click();

    expect(onSubmit.mock.calls.length).toBe(1);
    const submittedValues = onSubmit.mock.calls[0][0];
    const expectedPayload = {
      coverageTest: {
        startDate: '1996-10-10',
        endDate: '1999-02-06',
        startVolume: '1',
        endVolume: '5',
        startIssue: '3rd',
        endIssue: '9th'
      }
    };
    expect(submittedValues).toEqual(expectedPayload);
  });
});
