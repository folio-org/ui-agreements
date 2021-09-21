import React from 'react';
import { waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import { FieldArray } from 'react-final-form-arrays';

import AgreementPeriodsFieldArray from './AgreementPeriodsFieldArray';

import translationsProperties from '../../../test/helpers';

const onSubmit = jest.fn();

const singlePeriod = [
    {
        _delete: false,
        endDate: '2022-01-26',
        startDate: '2021-01-20',
        cancellationDeadline: '2022-01-01',
        note: ''
    }
];

const multiplePeriods = [
    {
        _delete: false,
        endDate: '2022-01-25',
        startDate: '2021-01-26',
        cancellationDeadline: '2022-01-01',
        note: 'multiple period note 1'
    },
    {
        _delete: false,
        endDate: '2023-01-25',
        startDate: '2022-01-26',
        cancellationDeadline: '2023-01-01',
        note: 'multiple period note 2'
    }
];

describe('AgreementPeriodsFieldArray', () => {
  test('renders expected fields', () => {
    const { getByTestId } = renderWithIntl(
      <TestForm
        initialValues={{ agreementPeriodsFieldArrayTest:singlePeriod }}
        onSubmit={onSubmit}
      >
        <FieldArray
          component={AgreementPeriodsFieldArray}
          id="agreement-periods-test"
          name="agreementPeriodsFieldArrayTest"
        />
      </TestForm>, translationsProperties
    );

    // renders field array component
    expect(getByTestId('agreementPeriodsFieldArray')).toBeInTheDocument();
    // renders a agreementPeriod component within that
    expect(getByTestId('agreementPeriodsFieldArray[0]')).toBeInTheDocument();
    // Check all the expected fields render with correct values
    expect(within(getByTestId('agreementPeriodsFieldArray[0]')).getByRole('textbox', { name: /start date/i })).toBeInTheDocument();
    expect(within(getByTestId('agreementPeriodsFieldArray[0]')).getByRole('textbox', { name: /end date/i })).toBeInTheDocument();
    expect(within(getByTestId('agreementPeriodsFieldArray[0]')).getByRole('textbox', { name: /cancellation deadline/i })).toBeInTheDocument();
    expect(within(getByTestId('agreementPeriodsFieldArray[0]')).getByRole('textbox', { name: /period note/i })).toBeInTheDocument();
  });

  test('add period/delete period buttons work as expected', () => {
    const { getByRole, queryAllByTestId } = renderWithIntl(
      <TestForm
        initialValues={{ agreementPeriodsFieldArrayTest:multiplePeriods }}
        onSubmit={onSubmit}
      >
        <FieldArray
          component={AgreementPeriodsFieldArray}
          id="agreement-periods-test"
          name="agreementPeriodsFieldArrayTest"
        />
      </TestForm>, translationsProperties
    );

    // Expect remove agreement period button 2
    expect(getByRole('button', { name: /remove agreement period 2/i })).toBeInTheDocument();
    // Expect remove agreement period tooltip 2
    expect(getByRole('tooltip', { name: /remove agreement period 2/i })).toBeInTheDocument();

    // Double check we currently have 2 agreement period edit cards
    // use length of queryAllBy to avoid relying on indexes which may give false positives
    expect(queryAllByTestId(/agreementPeriodsFieldArray\[.*\]/i).length).toEqual(2);
    // Remove second card from form
    userEvent.click(getByRole('button', { name: /remove agreement period 2/i }));
    expect(queryAllByTestId(/agreementPeriodsFieldArray\[.*\]/i).length).toEqual(1);

    // Expect add agreement period button
    expect(getByRole('button', { name: /add agreement period/i })).toBeInTheDocument();
    userEvent.click(getByRole('button', { name: /add agreement period/i }));
    expect(queryAllByTestId(/agreementPeriodsFieldArray\[.*\]/i).length).toEqual(2);
  });

  test('multiple agreement periods render as expected', () => {
    const { getByTestId, queryAllByTestId } = renderWithIntl(
      <TestForm
        initialValues={{ agreementPeriodsFieldArrayTest:multiplePeriods }}
        onSubmit={onSubmit}
      >
        <FieldArray
          component={AgreementPeriodsFieldArray}
          id="agreement-periods-test"
          name="agreementPeriodsFieldArrayTest"
        />
      </TestForm>, translationsProperties
    );

    expect(queryAllByTestId(/agreementPeriodsFieldArray\[.*\]/i).length).toEqual(2);
    expect(within(getByTestId('agreementPeriodsFieldArray[0]')).getByRole('textbox', { name: /start date/i }).value).toEqual('01/26/2021');
    expect(within(getByTestId('agreementPeriodsFieldArray[0]')).getByRole('textbox', { name: /end date/i }).value).toEqual('01/25/2022');
    expect(within(getByTestId('agreementPeriodsFieldArray[0]')).getByRole('textbox', { name: /cancellation deadline/i }).value).toEqual('01/01/2022');
    expect(within(getByTestId('agreementPeriodsFieldArray[0]')).getByRole('textbox', { name: /period note/i }).value).toEqual('multiple period note 1');

    expect(within(getByTestId('agreementPeriodsFieldArray[1]')).getByRole('textbox', { name: /start date/i }).value).toEqual('01/26/2022');
    expect(within(getByTestId('agreementPeriodsFieldArray[1]')).getByRole('textbox', { name: /end date/i }).value).toEqual('01/25/2023');
    expect(within(getByTestId('agreementPeriodsFieldArray[1]')).getByRole('textbox', { name: /cancellation deadline/i }).value).toEqual('01/01/2023');
    expect(within(getByTestId('agreementPeriodsFieldArray[1]')).getByRole('textbox', { name: /period note/i }).value).toEqual('multiple period note 2');
  });

  test('overlapping period warning works as expected', async () => {
    const { getByTestId, queryByText, queryAllByText } = renderWithIntl(
      <TestForm
        initialValues={{ agreementPeriodsFieldArrayTest:multiplePeriods }}
        onSubmit={onSubmit}
      >
        <FieldArray
          component={AgreementPeriodsFieldArray}
          id="agreement-periods-test"
          name="agreementPeriodsFieldArrayTest"
        />
      </TestForm>, translationsProperties
    );

    userEvent.clear(within(getByTestId('agreementPeriodsFieldArray[0]')).getByRole('textbox', { name: /end date/i }));
    // This one currently only fires in the UI if you click away
    userEvent.click(within(getByTestId('agreementPeriodsFieldArray[0]')).getByRole('textbox', { name: /start date/i }));

    await waitFor(() => expect(queryAllByText(/The following periods have overlapping dates:/i)[0]).toBeInTheDocument());
    await waitFor(() => expect(queryAllByText(/The following periods have overlapping dates:/i)[1]).toBeInTheDocument());
    userEvent.type(within(getByTestId('agreementPeriodsFieldArray[0]')).getByRole('textbox', { name: /end date/i }), '01/25/2022');
    await waitFor(() => expect(queryByText(/The following coverages have overlapping dates:/i)).not.toBeInTheDocument());
  });

  test('expected values are submitted', () => {
    const { getByTestId } = renderWithIntl(
      <TestForm
        initialValues={{ agreementPeriodsFieldArrayTest:multiplePeriods }}
        onSubmit={onSubmit}
      >
        <FieldArray
          component={AgreementPeriodsFieldArray}
          id="agreement-periods-test"
          name="agreementPeriodsFieldArrayTest"
        />
      </TestForm>, translationsProperties
    );

    userEvent.click(getByTestId('submit'));
    expect(onSubmit.mock.calls.length).toBe(1);
    const submittedValues = onSubmit.mock.calls[0][0];
    const expectedPayload = {
      agreementPeriodsFieldArrayTest: [
        {
            _delete: false,
            endDate: '2022-01-25',
            startDate: '2021-01-26',
            cancellationDeadline: '2022-01-01',
            note: 'multiple period note 1'
        },
        {
            _delete: false,
            endDate: '2023-01-25',
            startDate: '2022-01-26',
            cancellationDeadline: '2023-01-01',
            note: 'multiple period note 2'
        }
      ]
    };
    expect(submittedValues).toEqual(expectedPayload);
  });
});
