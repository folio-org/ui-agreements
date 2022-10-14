import React from 'react';
import { waitFor, within, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { Button, Datepicker, TextField } from '@folio/stripes-testing';

import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import { FieldArray } from 'react-final-form-arrays';

import CoverageFieldArray from './CoverageFieldArray';

import translationsProperties from '../../../test/helpers';

const onSubmit = jest.fn();
const singleCoverage = [
  {
    _delete: false,
    endDate: '2021-01-26',
    endIssue: '7',
    endVolume: '15',
    startDate:'2021-01-20',
    startIssue: '1',
    startVolume: '12'
  }
];

const doubleCoverage = [
  {
    _delete: false,
    endDate: '2021-01-26',
    endIssue: '7',
    endVolume: '15',
    startDate:'2021-01-20',
    startIssue: '1',
    startVolume: '12'
  },
  {
    _delete: false,
    endDate: '2007-10-05',
    endIssue: '3',
    endVolume: '6',
    startDate:'2001-12-06',
    startIssue: '2',
    startVolume: '4'
  }
];

describe('CoverageFieldArray', () => {
  test('renders expected fields', () => {
    const { getByTestId } = renderWithIntl(
      <TestForm
        initialValues={{ coverageFieldArrayTest:singleCoverage }}
        onSubmit={onSubmit}
      >
        <FieldArray
          addButtonId="addButtonId"
          addButtonTooltipId="ui-agreements.agreementLine.addCustomCoverageTootlip"
          addLabelId="ui-agreements.agreementLines.addCustomCoverage"
          component={CoverageFieldArray}
          deleteButtonTooltipId="ui-agreements.agreementLines.removeCustomCoverage"
          headerId="ui-agreements.agreementLines.customCoverageTitle"
          id="custom-coverage-test"
          name="coverageFieldArrayTest"
        />
      </TestForm>, translationsProperties
    );

    // renders field array component
    expect(getByTestId('coverageFieldArray')).toBeInTheDocument();
    // renders a coverageField component within that
    expect(getByTestId('coverageFieldArray[0]')).toBeInTheDocument();
    // Check all the expected fields render with correct values
    expect(within(getByTestId('coverageFieldArray[0]')).getByRole('textbox', { name: /start date/i })).toBeInTheDocument();
    expect(within(getByTestId('coverageFieldArray[0]')).getByRole('textbox', { name: /start volume/i })).toBeInTheDocument();
    expect(within(getByTestId('coverageFieldArray[0]')).getByRole('textbox', { name: /start issue/i })).toBeInTheDocument();
    expect(within(getByTestId('coverageFieldArray[0]')).getByRole('textbox', { name: /end date/i })).toBeInTheDocument();
    expect(within(getByTestId('coverageFieldArray[0]')).getByRole('textbox', { name: /end volume/i })).toBeInTheDocument();
    expect(within(getByTestId('coverageFieldArray[0]')).getByRole('textbox', { name: /end issue/i })).toBeInTheDocument();
  });

  test('add coverage/delete coverage buttons work as expected', async () => {
    const { getByRole, queryAllByTestId } = renderWithIntl(
      <TestForm
        initialValues={{ coverageFieldArrayTest:singleCoverage }}
        onSubmit={onSubmit}
      >
        <FieldArray
          addButtonId="addButtonId"
          addButtonTooltipId="ui-agreements.agreementLine.addCustomCoverageTootlip"
          addLabelId="ui-agreements.agreementLines.addCustomCoverage"
          component={CoverageFieldArray}
          deleteButtonTooltipId="ui-agreements.agreementLines.removeCustomCoverage"
          headerId="ui-agreements.agreementLines.customCoverageTitle"
          id="custom-coverage-test"
          name="coverageFieldArrayTest"
        />
      </TestForm>, translationsProperties
    );

    // Expect remove coverage button
    expect(getByRole('button', { name: /remove custom coverage 1/i })).toBeInTheDocument();

    // IconButton calls seem to not work right now
    const removeButton = getByRole('button', { name: 'Remove custom coverage 1' });
    // const removeButton = IconButton('Remove custom coverage 1');

    const addButton = Button('Add custom coverage');

    // Expect add and remove buttons to exist
    // IconButton calls seem to not work right now
    // await removeButton.exists();
    expect(removeButton).toBeInTheDocument();
    await addButton.exists();

    // Expect tooltip to exist on remove button
    // Tooltip calls seem to not work right now
    // await Tooltip('Remove custom coverage 1').exists();
    expect(getByRole('tooltip', { name: /remove custom coverage 1/i })).toBeInTheDocument();

    // Double check we currently have a coverage edit card
    // use length of queryAllBy to avoid relying on indexes which may give false positives
    expect(queryAllByTestId(/coverageFieldArray\[.*\]/i).length).toEqual(1);

    // Remove it from form
    // IconButton calls seem to not work right now
    // await removeButton.click();
    await userEvent.click(removeButton);
    expect(queryAllByTestId(/coverageFieldArray\[.*\]/i).length).toEqual(0);

    // Expect adding to work
    await addButton.click();
    expect(queryAllByTestId(/coverageFieldArray\[.*\]/i).length).toEqual(1);
  });

  test('multiple coverages render as expected', () => {
    const { getByTestId, queryAllByTestId } = renderWithIntl(
      <TestForm
        initialValues={{ coverageFieldArrayTest:doubleCoverage }}
        onSubmit={onSubmit}
      >
        <FieldArray
          addButtonId="addButtonId"
          addButtonTooltipId="ui-agreements.agreementLine.addCustomCoverageTootlip"
          addLabelId="ui-agreements.agreementLines.addCustomCoverage"
          component={CoverageFieldArray}
          deleteButtonTooltipId="ui-agreements.agreementLines.removeCustomCoverage"
          headerId="ui-agreements.agreementLines.customCoverageTitle"
          id="custom-coverage-test"
          name="coverageFieldArrayTest"
        />
      </TestForm>, translationsProperties
    );

    expect(queryAllByTestId(/coverageFieldArray\[.*\]/i).length).toEqual(2);
    expect(within(getByTestId('coverageFieldArray[0]')).getByRole('textbox', { name: /start date/i }).value).toEqual('01/20/2021');
    expect(within(getByTestId('coverageFieldArray[0]')).getByRole('textbox', { name: /start volume/i }).value).toEqual('12');
    expect(within(getByTestId('coverageFieldArray[0]')).getByRole('textbox', { name: /start issue/i }).value).toEqual('1');
    expect(within(getByTestId('coverageFieldArray[0]')).getByRole('textbox', { name: /end date/i }).value).toEqual('01/26/2021');
    expect(within(getByTestId('coverageFieldArray[0]')).getByRole('textbox', { name: /end volume/i }).value).toEqual('15');
    expect(within(getByTestId('coverageFieldArray[0]')).getByRole('textbox', { name: /end issue/i }).value).toEqual('7');

    expect(within(getByTestId('coverageFieldArray[1]')).getByRole('textbox', { name: /start date/i }).value).toEqual('12/06/2001');
    expect(within(getByTestId('coverageFieldArray[1]')).getByRole('textbox', { name: /start volume/i }).value).toEqual('4');
    expect(within(getByTestId('coverageFieldArray[1]')).getByRole('textbox', { name: /start issue/i }).value).toEqual('2');
    expect(within(getByTestId('coverageFieldArray[1]')).getByRole('textbox', { name: /end date/i }).value).toEqual('10/05/2007');
    expect(within(getByTestId('coverageFieldArray[1]')).getByRole('textbox', { name: /end volume/i }).value).toEqual('6');
    expect(within(getByTestId('coverageFieldArray[1]')).getByRole('textbox', { name: /end issue/i }).value).toEqual('3');
  });

  test('multiple open ended coverages warning works as expected', async () => {
    const { queryByText, queryAllByText } = renderWithIntl(
      <TestForm
        initialValues={{ coverageFieldArrayTest:doubleCoverage }}
        onSubmit={onSubmit}
      >
        <FieldArray
          addButtonId="addButtonId"
          addButtonTooltipId="ui-agreements.agreementLine.addCustomCoverageTootlip"
          addLabelId="ui-agreements.agreementLines.addCustomCoverage"
          component={CoverageFieldArray}
          deleteButtonTooltipId="ui-agreements.agreementLines.removeCustomCoverage"
          headerId="ui-agreements.agreementLines.customCoverageTitle"
          id="custom-coverage-test"
          name="coverageFieldArrayTest"
        />
      </TestForm>, translationsProperties
    );

    await Datepicker({ id: 'cc-end-date-0' }).clear();
    await Datepicker({ id: 'cc-end-date-1' }).clear();

    await waitFor(() => expect(queryAllByText(/Cannot have multiple open-ended coverage statements./i)[0]).toBeInTheDocument());

    await Datepicker({ id: 'cc-end-date-0' }).fillIn('01/26/2021');
    await waitFor(() => expect(queryByText(/Cannot have multiple open-ended coverage statements./i)).not.toBeInTheDocument());
  });

  test('overlapping coverages warning works as expected', async () => {
    const { getByTestId, queryByText, queryAllByText } = renderWithIntl(
      <TestForm
        initialValues={{ coverageFieldArrayTest:doubleCoverage }}
        onSubmit={onSubmit}
      >
        <FieldArray
          addButtonId="addButtonId"
          addButtonTooltipId="ui-agreements.agreementLine.addCustomCoverageTootlip"
          addLabelId="ui-agreements.agreementLines.addCustomCoverage"
          component={CoverageFieldArray}
          deleteButtonTooltipId="ui-agreements.agreementLines.removeCustomCoverage"
          headerId="ui-agreements.agreementLines.customCoverageTitle"
          id="custom-coverage-test"
          name="coverageFieldArrayTest"
        />
      </TestForm>, translationsProperties
    );



    userEvent.clear(within(getByTestId('coverageFieldArray[1]')).getByRole('textbox', { name: /end date/i }));
    userEvent.click(within(getByTestId('coverageFieldArray[1]')).getByRole('textbox', { name: /start date/i }));

    await waitFor(() => expect(queryAllByText(/The following coverages have overlapping dates:/i)[0]).toBeInTheDocument());
    userEvent.type(within(getByTestId('coverageFieldArray[1]')).getByRole('textbox', { name: /end date/i }), '05/10/2007');
    await TextField({ id: 'cc-end-date-0' }).fillIn('The following coverages have overlapping dates:');
    await waitFor(() => expect(queryByText(/The following coverages have overlapping dates:/i)).not.toBeInTheDocument());
  });


  test('expected values are submitted', async () => {
    renderWithIntl(
      <TestForm
        initialValues={{ coverageFieldArrayTest:doubleCoverage }}
        onSubmit={onSubmit}
      >
        <FieldArray
          addButtonId="addButtonId"
          addButtonTooltipId="ui-agreements.agreementLine.addCustomCoverageTootlip"
          addLabelId="ui-agreements.agreementLines.addCustomCoverage"
          component={CoverageFieldArray}
          deleteButtonTooltipId="ui-agreements.agreementLines.removeCustomCoverage"
          headerId="ui-agreements.agreementLines.customCoverageTitle"
          id="custom-coverage-test"
          name="coverageFieldArrayTest"
        />
      </TestForm>, translationsProperties
    );

    await Button('Submit').click();
    expect(onSubmit.mock.calls.length).toBe(1);
    const submittedValues = onSubmit.mock.calls[0][0];
    const expectedPayload = {
      coverageFieldArrayTest: [
        {
          _delete: false,
          endDate: '2021-01-26',
          endIssue: '7',
          endVolume: '15',
          startDate:'2021-01-20',
          startIssue: '1',
          startVolume: '12'
        },
        {
          _delete: false,
          endDate: '2007-10-05',
          endIssue: '3',
          endVolume: '6',
          startDate:'2001-12-06',
          startIssue: '2',
          startVolume: '4'
        }
      ]
    };
    expect(submittedValues).toEqual(expectedPayload);
  });
});
