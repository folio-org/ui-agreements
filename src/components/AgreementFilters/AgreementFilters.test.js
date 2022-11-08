import React from 'react';
import { waitFor } from '@testing-library/dom';

import '@folio/stripes-erm-testing/jest/directMocks';
import { mockErmComponents, renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Accordion, Checkbox } from '@folio/stripes-testing';
import translationsProperties from '../../../test/helpers';
import { activeFilters, data } from './testResources';
import AgreementFilters from './AgreementFilters';

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  ...mockErmComponents,
  OrganizationSelection: () => <div>OrganizationSelection</div>,
}));

const stateMock = jest.fn();

const filterHandlers = {
  state: stateMock,
  checkbox: () => {},
  clear: () => {},
  clearGroup: () => {},
  reset: () => {},
};
describe('AgreementFilters', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <AgreementFilters
          activeFilters={activeFilters}
          data={data}
          filterHandlers={filterHandlers}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the Status Accordion', async () => {
    await Accordion('Status').exists();
  });

  test('renders the Renewal priority Accordion', async () => {
    await Accordion('Renewal priority').exists();
  });

  test('renders the Is perpetual Accordion', async () => {
    await Accordion('Is perpetual').exists();
  });

  test('renders the Start date Accordion', async () => {
    await Accordion('Start date').exists();
  });

  test('renders the End date Accordion', async () => {
    await Accordion('End date').exists();
  });

  test('renders the Organizations Accordion', async () => {
    await Accordion('Organizations').exists();
  });

  test('renders the Organization role Accordion', async () => {
    await Accordion('Organization role').exists();
  });

  test('renders the Internal contacts Accordion', async () => {
    await Accordion('Internal contacts').exists();
  });

  test('renders the Internal contact role Accordion', async () => {
    await Accordion('Internal contact role').exists();
  });

  test('renders the Tags Accordion', async () => {
    await Accordion('Tags').exists();
  });

  test('renders the CustomPropertiesFilter component', () => {
    const { getByText } = renderComponent;
    expect(getByText('CustomPropertiesFilter')).toBeInTheDocument();
  });

  test('renders the OrganizationSelection component', () => {
    const { getByText } = renderComponent;
    expect(getByText('OrganizationSelection')).toBeInTheDocument();
  });

  let index = 1;
  const testAgreementFilterCheckbox = (field, value) => (
    test(`clicking the ${value} checkbox`, async () => {
      await waitFor(async () => {
        await Checkbox({ id: `clickable-filter-${field}-${value}` }).click();
      });

      await waitFor(() => {
        expect(stateMock.mock.calls.length).toEqual(index);
      });

      index++;
    })
  );

  testAgreementFilterCheckbox('agreementStatus', 'closed');
  testAgreementFilterCheckbox('agreementStatus', 'draft');
  testAgreementFilterCheckbox('agreementStatus', 'requested');
  testAgreementFilterCheckbox('agreementStatus', 'in-negotiation');
  testAgreementFilterCheckbox('agreementStatus', 'active');

  testAgreementFilterCheckbox('renewalPriority', 'for-review');
  testAgreementFilterCheckbox('renewalPriority', 'definitely-renew');
  testAgreementFilterCheckbox('renewalPriority', 'definitely-cancel');

  testAgreementFilterCheckbox('isPerpetual', 'yes');
  testAgreementFilterCheckbox('isPerpetual', 'no');
});
