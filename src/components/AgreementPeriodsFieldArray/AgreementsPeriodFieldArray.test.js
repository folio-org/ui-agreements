import { waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button, TextArea, TextField } from '@folio/stripes-testing';

import { renderWithIntl, DatepickerInteractor as Datepicker, TestForm } from '@folio/stripes-erm-testing';
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

  test('add period/delete period buttons work as expected', async () => {
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
    // IconButton calls seem to not work right now
    // await IconButton('Remove agreement period 2').exists();
    expect(getByRole('button', { name: /remove agreement period 2/i })).toBeInTheDocument();
    // Expect remove agreement period tooltip 2
    // Tooltip calls seem to not work right now
    // await Tooltip('Remove agreement period 2').exists();
    expect(getByRole('tooltip', { name: /remove agreement period 2/i })).toBeInTheDocument();

    // Double check we currently have 2 agreement period edit cards
    // use length of queryAllBy to avoid relying on indexes which may give false positives
    expect(queryAllByTestId(/agreementPeriodsFieldArray\[.*\]/i).length).toEqual(2);
    // Remove second card from form
    await waitFor(() => userEvent.click(getByRole('button', { name: /remove agreement period 2/i })));
    expect(queryAllByTestId(/agreementPeriodsFieldArray\[.*\]/i).length).toEqual(1);

    // Expect add agreement period button
    await Button('Add agreement period').exists();
    await Button('Add agreement period').click();
    expect(queryAllByTestId(/agreementPeriodsFieldArray\[.*\]/i).length).toEqual(2);
  });

  test('multiple agreement periods render as expected', async () => {
    const { queryAllByTestId } = renderWithIntl(
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

    // Interactors inside field arrays aren't super helpful
    expect(queryAllByTestId(/agreementPeriodsFieldArray\[.*\]/i).length).toEqual(2);

    await Datepicker({ id: 'period-start-date-0' }).has({ inputValue: '01/26/2021' });
    await Datepicker({ id: 'period-end-date-0' }).has({ inputValue: '01/25/2022' });

    await TextField({ id: 'period-cancellation-deadline-0' }).has({ value: '01/01/2022' });
    await TextArea({ id: 'period-note-0' }).has({ value: 'multiple period note 1' });

    await Datepicker({ id: 'period-start-date-1' }).has({ inputValue: '01/26/2022' });
    await Datepicker({ id: 'period-end-date-1' }).has({ inputValue: '01/25/2023' });

    await TextField({ id: 'period-cancellation-deadline-1' }).has({ value: '01/01/2023' });
    await TextArea({ id: 'period-note-1' }).has({ value: 'multiple period note 2' });
  });

  test('overlapping period warning works as expected', async () => {
    renderWithIntl(
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

    await waitFor(async () => {
      await Datepicker({ id: 'period-end-date-0' }).clear();
    });

    await waitFor(async () => {
      await Datepicker({ id: 'period-start-date-0' }).focus();
    });

    await waitFor(async () => {
      await Datepicker({ id: 'period-end-date-0' }).has({ errorText: 'The following periods have overlapping dates: 2 & 1' });
    });

    await waitFor(async () => {
      await Datepicker({ id: 'period-end-date-0' }).fillIn('01/25/2022');
    });

    await waitFor(async () => {
      await Datepicker({ id: 'period-end-date-0' }).has({ errorText: undefined });
    });
  });

  test('expected values are submitted', async () => {
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

    await Button('Submit').click();

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
