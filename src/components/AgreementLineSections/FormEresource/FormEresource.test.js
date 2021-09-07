import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import {
  renderWithIntl,
  TestForm,
} from '@folio/stripes-erm-components/test/jest/helpers';
import { Button } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import { values, line, handlers, initialValues, eholdingData } from './testResources';
import FormEresource from './FormEresource';

jest.mock('../EresourceSelector', () => () => <div>EresourceSelector</div>);
jest.mock('../FormEresourceCard', () => () => <div>FormEresourceCard</div>);

const onSubmit = jest.fn();

describe('FormEresource', () => {
  let renderComponent;
  describe('with no initialValues', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormEresource
            line={line}
            values={values}
          />
        </TestForm>,
        translationsProperties
      );
    });
    test('renders link e-resource button', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    test('renders the Submit button', async () => {
      await Button('Submit').exists();
    });
    test('renders the EresourceSelector component', () => {
      const { getByText } = renderComponent;
      expect(getByText('EresourceSelector')).toBeInTheDocument();
    });
  });

  describe('with initialValues', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm initialValues={initialValues} onSubmit={onSubmit}>
          <FormEresource handlers={handlers} line={line} values={values} />
        </TestForm>,
        translationsProperties
      );
      test('renders the FormEresourceCard component', () => {
        const { getByText } = renderComponent;
        expect(getByText('FormEresourceCard')).toBeInTheDocument();
      });
    });
  });

  describe('with agreementLine type eholdings', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormEresource data={eholdingData} />
        </TestForm>,
        translationsProperties
      );
      test('renders the EresourceSelector component', () => {
        const { getByText } = renderComponent;
        expect(getByText('EresourceSelector')).toBeInTheDocument();
      });
    });
  });
});
