import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import userEvent from '@testing-library/user-event';
import { Button } from '@folio/stripes-testing';
import { within } from '@testing-library/react';
import { FieldArray } from 'react-final-form-arrays';
import usageDataProviders from './testResources';
import translationsProperties from '../../../../test/helpers';
import UsageDataProvidersFieldArray from './UsageDataProvidersFieldArray';

jest.mock('../UsageDataProviderField/UsageDataProviderField', () => () => <div>UsageDataProviderField</div>);

const onSubmit = jest.fn();

let renderComponent;
describe('UsageDataProvidersFieldArray', () => {
  describe('render with empty initial values', () => {
    beforeEach(async () => {
      renderComponent = renderWithIntl(
        <TestForm
          onSubmit={onSubmit}
        >
          <FieldArray
            component={UsageDataProvidersFieldArray}
            name="usageDataProviders"
          />
        </TestForm>, translationsProperties
      );
    });

    it('renders empty field', () => {
      const { getByText } = renderComponent;
      expect(getByText('No usage data providers for this agreement')).toBeInTheDocument();
    });

    test('renders the Add usage data provider button', async () => {
      await Button('Add usage data provider').exists();
    });

    it('clicking the add button renders the usage data provider field', () => {
      const { getByText, getByRole } = renderComponent;
      userEvent.click(getByRole('button', { name: /Add usage data provider/i }));
      expect(getByText('UsageDataProviderField')).toBeInTheDocument();
    });

    it('adding/removing fields using the add/remove works as expected', () => {
      const { getByRole, queryAllByTestId } = renderComponent;
      expect(getByRole('button', { name: /Add usage data provider/i })).toBeInTheDocument();
      userEvent.click(getByRole('button', { name: /Add usage data provider/i }));
      expect(queryAllByTestId(/usageDataProvidersFieldArray\[.*\]/i).length).toEqual(1);
      userEvent.click(getByRole('button', { name: /Add usage data provider/i }));
      expect(queryAllByTestId(/usageDataProvidersFieldArray\[.*\]/i).length).toEqual(2);
      userEvent.click(getByRole('button', { name: /usage data provider 1/i }));
      expect(queryAllByTestId(/usageDataProvidersFieldArray\[.*\]/i).length).toEqual(1);
    });
  });

  describe('rendering with initial values set', () => {
    beforeEach(async () => {
      renderComponent = renderWithIntl(
        <TestForm
          initialValues={{ usageDataProviders }}
          onSubmit={onSubmit}
        >
          <FieldArray
            component={UsageDataProvidersFieldArray}
            name="usageDataProviders"
          />
        </TestForm>, translationsProperties
      );
    });

    it('renders expected number of fields', () => {
      const { queryAllByTestId } = renderComponent;
      expect(queryAllByTestId(/usageDataProvidersFieldArray\[.*\]/).length).toEqual(usageDataProviders.length);
    });

    it('renders the expected note in each field', () => {
      const { getByTestId } = renderComponent;
      expect(within(getByTestId('usageDataProvidersFieldArray[0]')).getByRole('textbox', { name: /Note/i }).value).toEqual('test note 1');
      expect(within(getByTestId('usageDataProvidersFieldArray[1]')).getByRole('textbox', { name: /Note/i }).value).toEqual('test note 2');
    });
  });
});
