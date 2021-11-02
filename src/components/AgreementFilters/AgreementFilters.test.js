import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
// import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { Accordion, Checkbox } from '@folio/stripes-testing';
import translationsProperties from '../../../test/helpers';
import { activeFilters, data } from './testResources';
import AgreementFilters from './AgreementFilters';

jest.mock('@folio/stripes-erm-components', () => ({
   ...jest.requireActual('@folio/stripes-erm-components'),
   OrganizationSelection: () => <div>OrganizationSelection</div>,
}));

jest.mock('@folio/stripes/smart-components');
const stateMock = jest.fn(() => Promise.resolve());

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

    test('renders the Supplementary properties Accordion', async () => {
        await Accordion('Supplementary properties').exists();
    });

    test('renders the OrganizationSelection component', () => {
      const { getByText } = renderComponent;
      expect(getByText('OrganizationSelection')).toBeInTheDocument();
    });

    test('renders the checkboxes', async () => {
        await Checkbox({ id: 'clickable-filter-agreementStatus-closed' }).click();
        await Checkbox({ id: 'clickable-filter-agreementStatus-draft' }).click();
        await Checkbox({ id: 'clickable-filter-agreementStatus-requested' }).click();
        await Checkbox({ id: 'clickable-filter-agreementStatus-in-negotiation' }).click();
        await Checkbox({ id: 'clickable-filter-agreementStatus-active' }).click();
        await Checkbox({ id: 'clickable-filter-renewalPriority-for-review' }).click();
        await Checkbox({ id: 'clickable-filter-renewalPriority-definitely-renew' }).click();
        await Checkbox({ id: 'clickable-filter-renewalPriority-definitely-cancel' }).click();
        await Checkbox({ id: 'clickable-filter-isPerpetual-yes' }).click();
        await Checkbox({ id: 'clickable-filter-isPerpetual-no' }).click();
        // await waitForElementToBeRemoved(() => screen.getByText('OrganizationSelection'));
        expect(stateMock).toHaveBeenCalled();
      });
  });
