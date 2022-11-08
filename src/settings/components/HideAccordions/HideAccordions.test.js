import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Checkbox } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import HideAccordions from './HideAccordions';

const onSubmit = jest.fn();

const initialValues = {
  hideAccordions: { usageData: true },
};

describe('HideAccordions', () => {
  let renderComponent;
  describe('no initial values set', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <MemoryRouter>
            <HideAccordions
              name="hideAccordions"
            />
          </MemoryRouter>
        </TestForm>,
        translationsProperties
      );
    });

    test('renders expected heading', () => {
      const { getByText } = renderComponent;
      expect(getByText('Hide accordions in agreement edit view')).toBeInTheDocument();
    });

    test('renders the "Usage data" checkbox', async () => {
      await Checkbox({ id: 'hideAccordionsUsageData' }).exists();
    });

    test('renders the "Usage data" checkbox as not checked', async () => {
      await Checkbox({ id: 'hideAccordionsUsageData' }).is({ checked: false });
    });
  });

  describe('with initial values set', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm initialValues={initialValues} onSubmit={onSubmit}>
          <MemoryRouter>
            <HideAccordions
              name="hideAccordions"
            />
          </MemoryRouter>
        </TestForm>,
        translationsProperties
      );
    });

    test('renders expected heading', () => {
      const { getByText } = renderComponent;
      expect(getByText('Hide accordions in agreement edit view')).toBeInTheDocument();
    });

    test('renders the "Usage data" checkbox', async () => {
      await Checkbox({ id: 'hideAccordionsUsageData' }).exists();
    });

    test('renders the "Usage data" checkbox as checked', async () => {
      await Checkbox({ id: 'hideAccordionsUsageData' }).is({ checked: true });
    });
  });
});
