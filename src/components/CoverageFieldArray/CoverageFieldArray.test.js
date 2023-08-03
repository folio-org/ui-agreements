import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import {
  Button,
  Datepicker,
  TestForm,
  TextField,
  renderWithIntl
} from '@folio/stripes-erm-testing';

import { FieldArray } from 'react-final-form-arrays';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
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

let renderComponent;
let addButton;
let removeButton;
describe('CoverageFieldArray', () => {
  describe('Single coverage', () => {
    beforeEach(async () => {
      renderComponent = renderWithIntl(
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
      const { getByRole } = renderComponent;

      removeButton = getByRole('button', { name: 'Remove custom coverage 1' });
      addButton = Button('Add custom coverage');
    });

    test('renders expected fields', async () => {
      const { getByTestId } = renderComponent;
      // renders field array component
      expect(getByTestId('coverageFieldArray')).toBeInTheDocument();
      // renders a coverageField component within that
      expect(getByTestId('coverageFieldArray[0]')).toBeInTheDocument();
      // Check all the expected fields render with correct values
      await Datepicker({ id: 'cc-start-date-0' }).exists();
      await TextField({ id: 'cc-start-volume-0' }).exists();
      await TextField({ id: 'cc-start-issue-0' }).exists();
      await Datepicker({ id: 'cc-end-date-0' }).exists();
      await TextField({ id: 'cc-end-volume-0' }).exists();
      await TextField({ id: 'cc-end-issue-0' }).exists();
    });

    test('expect add and remove coverage buttons to exist', async () => {
      // IconButton can't be located by tooltip label right now
      // IconButton can't be located by tooltip label right now
      // await removeButton.exists();
      expect(removeButton).toBeInTheDocument();
      await addButton.exists();
    });

    test('expect tooltip to exist on remove button', () => {
      const { getByRole } = renderComponent;
      // Tooltip calls seem to not work right now
      // await Tooltip('Remove custom coverage 1').exists();
      expect(getByRole('tooltip', { name: /remove custom coverage 1/i })).toBeInTheDocument();
    });

    test('expect a single rendered edit card', () => {
      const { queryAllByTestId } = renderComponent;
      // use length of queryAllBy to avoid relying on indexes which may give false positives
      expect(queryAllByTestId(/coverageFieldArray\[\d+\]/i).length).toEqual(1);
    });

    describe('removing a coverage', () => {
      // IconButton can't be located by tooltip label right now
      beforeEach(async () => {
        // Remove it from form
        // IconButton can't be located by tooltip label right now
        await waitFor(async () => {
          await userEvent.click(removeButton);
        });
      });

      test('expect no rendered edit cards', () => {
        const { queryAllByTestId } = renderComponent;
        expect(queryAllByTestId(/coverageFieldArray\[\d+\]/i).length).toEqual(0);
      });

      describe('adding a coverage card', () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await addButton.click();
          });
        });

        test('expect a single rendered edit card again', () => {
          const { queryAllByTestId } = renderComponent;
          expect(queryAllByTestId(/coverageFieldArray\[\d+\]/i).length).toEqual(1);
        });
      });
    });
  });

  describe('Multiple coverages', () => {
    beforeEach(async () => {
      renderComponent = renderWithIntl(
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
    });

    test('multiple coverages render as expected', async () => {
      const { queryAllByTestId } = renderComponent;

      expect(queryAllByTestId(/coverageFieldArray\[\d+\]/i).length).toEqual(2);
      await Datepicker({ id: 'cc-start-date-0' }).has({ inputValue: '01/20/2021' });
      await TextField({ id: 'cc-start-volume-0' }).has({ value: '12' });
      await TextField({ id: 'cc-start-issue-0' }).has({ value: '1' });
      await Datepicker({ id: 'cc-end-date-0' }).has({ inputValue: '01/26/2021' });
      await TextField({ id: 'cc-end-volume-0' }).has({ value: '15' });
      await TextField({ id: 'cc-end-issue-0' }).has({ value: '7' });


      await Datepicker({ id: 'cc-start-date-1' }).has({ inputValue: '12/06/2001' });
      await TextField({ id: 'cc-start-volume-1' }).has({ value: '4' });
      await TextField({ id: 'cc-start-issue-1' }).has({ value: '2' });
      await Datepicker({ id: 'cc-end-date-1' }).has({ inputValue: '10/05/2007' });
      await TextField({ id: 'cc-end-volume-1' }).has({ value: '6' });
      await TextField({ id: 'cc-end-issue-1' }).has({ value: '3' });
    });

    test('multiple open ended coverages warning works as expected', async () => {
      await waitFor(async () => {
        await Datepicker({ id: 'cc-end-date-0' }).clear();
        await Datepicker({ id: 'cc-end-date-1' }).clear();
      });

      await Datepicker({ id: 'cc-end-date-0' }).has({ errorText: 'Cannot have multiple open-ended coverage statements.' });

      await waitFor(async () => {
        await Datepicker({ id: 'cc-end-date-0' }).fillIn('01/26/2021');
        await Datepicker({ id: 'cc-end-date-1' }).fillIn('10/05/2007');
      });

      await Datepicker({ id: 'cc-end-date-0' }).has({ errorText: undefined });
    });

    test('overlapping coverages warning works as expected', async () => {
      await waitFor(async () => {
        await Datepicker({ id: 'cc-end-date-1' }).clear();
        await Datepicker({ id: 'cc-start-date-1' }).focus();
      });

      await Datepicker({ id: 'cc-end-date-0' }).has({ errorText: 'The following coverages have overlapping dates: 1 & 2' });

      await waitFor(async () => {
        await Datepicker({ id: 'cc-end-date-1' }).fillIn('05/10/2007');
        await Datepicker({ id: 'cc-end-date-1' }).blur();
      });

      await Datepicker({ id: 'cc-end-date-0' }).has({ errorText: undefined });
    });

    describe('Submitting the form', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('Submit').click();
        });
      });

      test('expected values are submitted', async () => {
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
  });
});
