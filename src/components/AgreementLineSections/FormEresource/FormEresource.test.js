import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { render } from '@testing-library/react';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import { Button } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import { initialValues, handlers, data, data2, emptyData } from './testResources';
import FormEresource from './FormEresource';

jest.mock('../EresourceSelector', () => () => <div>EresourceSelector</div>);
jest.mock('../FormEresourceCard', () => () => <div>FormEresourceCard</div>);
jest.mock('../../BasketSelector', () => () => <div>BasketSelector</div>);

const onSubmit = jest.fn();

describe('FormEresource', () => {
  let renderComponent;
  describe('with initialValues', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm initialValues={initialValues} onSubmit={onSubmit}>
          <FormEresource handlers={handlers} />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the submit button', async () => {
      await Button('Submit').exists();
    });

    test('renders the EresourceSelector component', () => {
      const { getByText } = renderComponent;
      expect(getByText('EresourceSelector')).toBeInTheDocument();
    });
  });

  describe('renders agreementLineSource type basket', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormEresource agreementLineSource={data.agreementLineSource} basket={data.basket} line={data.line} values={data.values} />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders link e-resource button', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    test('renders the BasketSelector component', () => {
      const { getByText } = renderComponent;
      expect(getByText('BasketSelector')).toBeInTheDocument();
    });
  });

  describe('renders agreementLineSource type eholdings', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormEresource agreementLineSource={data2.agreementLineSource} basket={data2.basket} line={data2.line} values={data2.values} />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the BasketSelector component', () => {
      const { getByText } = renderComponent;
      expect(getByText('BasketSelector')).toBeInTheDocument();
    });
  });

  describe('renders agreementLineSource with no data', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormEresource basket={emptyData.basket} line={emptyData.line} values={emptyData.values} />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders null', () => {
      const { queryByText } = renderComponent;
      expect(queryByText('FormEresource')).toBeNull();
    });
  });
});
