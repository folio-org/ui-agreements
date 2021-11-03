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

    test('clicking the closed checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-agreementStatus-closed' }).click();
        expect(stateMock).toHaveBeenCalled();
      });

      test('clicking the draft checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-agreementStatus-draft' }).click();
        expect(stateMock).toHaveBeenCalled();
      });

      test('clicking the requested checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-agreementStatus-requested' }).click();
        expect(stateMock).toHaveBeenCalled();
      });

      test('clicking the in negotiation checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-agreementStatus-in-negotiation' }).click();
        expect(stateMock).toHaveBeenCalled();
      });

      test('clicking the active checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-agreementStatus-active' }).click();
        expect(stateMock).toHaveBeenCalled();
      });

      test('clicking the for review checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-renewalPriority-for-review' }).click();
        expect(stateMock).toHaveBeenCalled();
      });

      test('clicking the definitely renew checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-renewalPriority-definitely-renew' }).click();
        expect(stateMock).toHaveBeenCalled();
      });

      test('clicking the definitely cancel checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-renewalPriority-definitely-cancel' }).click();
        expect(stateMock).toHaveBeenCalled();
      });

      test('clicking the yes checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-isPerpetual-yes' }).click();
        expect(stateMock).toHaveBeenCalled();
      });

      test('clicking the no checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-isPerpetual-no' }).click();
        // await waitForElementToBeRemoved(() => screen.getByText('OrganizationSelection'));
        expect(stateMock).toHaveBeenCalled();
      });
  });
