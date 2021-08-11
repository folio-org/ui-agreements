import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import userEvent from '@testing-library/user-event';
import FormInfo from './FormInfo';
import translationsProperties from '../../../../test/helpers';
import { data, form, handlers, initialValues, values } from './testResources';

jest.mock('../../AgreementPeriodsFieldArray', () => () => <div>AgreementPeriodsFieldArray</div>);

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  AlternativeNamesFieldArray: () => <div>AlternativeNamesFieldArray</div>,
}));

const onSubmit = jest.fn();

let renderComponent;

describe('FormInfo', () => {
  describe('with no initial values', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormInfo data={data} form={form} handlers={handlers} values={values} />
        </TestForm>, translationsProperties
      );
    });

    test('renders the Name field', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('textbox', { name: 'Name' }));
    });

    test('renders the Description field', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('textbox', { name: 'Description' }));
    });

    test('renders the Status dropdown', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('combobox', { name: 'Status' }));
    });

    test('renders the Reason for closure dropdown', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('combobox', { name: 'Reason for closure' }));
    });

    test('renders a disabled Reason for closure dropdown', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('combobox', { name: 'Reason for closure' })).toBeDisabled();
    });

    test('renders the Renewal priority dropdown', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('combobox', { name: 'Renewal priority' }));
    });

    test('renders the Is perpertual dropdown', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('combobox', { name: 'Is perpetual' }));
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
      renderWithIntl(
        <TestForm initialValues={initialValues} onSubmit={onSubmit}>
          <FormInfo data={data} form={form} handlers={handlers} values={values} />
        </TestForm>, translationsProperties
      );
    });

    test('renders the expected value in the Name field', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('textbox', { name: 'Name' })).toHaveDisplayValue('AM ag 1');
    });

    test('renders the expected value in the Description field', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('textbox', { name: 'Description' })).toHaveDisplayValue('description for this agreement');
    });

    test('renders the expected value in the Status dropdown', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('combobox', { name: 'Status' })).toHaveDisplayValue('Active');
    });

    test('renders a disabled Reason for closure dropdown', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('combobox', { name: 'Reason for closure' })).toBeDisabled();
    });

    test('renders the expected value in the Renewal priority dropdown', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('combobox', { name: 'Renewal priority' })).toHaveDisplayValue('Definitely renew');
    });

    test('renders the expected value in the Is perpertual dropdown', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('combobox', { name: 'Is perpetual' })).toHaveDisplayValue('Yes');
    });

    test('renders the AlternativeNames FieldArray', () => {
      const { getByText } = renderComponent;
      expect(getByText('AlternativeNamesFieldArray')).toBeInTheDocument();
    });

    test('renders the AgreementPeriods FieldArray', () => {
      const { getByText } = renderComponent;
      expect(getByText('AgreementPeriodsFieldArray')).toBeInTheDocument();
    });

    test('typing in the name field should fire the onAsyncValidate callback', () => {
      const { getByRole } = renderComponent;
      userEvent.type(getByRole('textbox', { name: 'Name' }), 'a');
      expect(handlers.onAsyncValidate).toHaveBeenCalled();
    });
  });
});
