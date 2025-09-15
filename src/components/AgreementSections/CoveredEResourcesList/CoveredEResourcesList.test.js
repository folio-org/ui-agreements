import { MemoryRouter } from 'react-router';
import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

// EXAMPLE tweaking the default mock for mockKyJson (In this case object -> array
import { mockKyJson } from '@folio/stripes/core';

import { Button, Dropdown, MultiColumnList, renderWithIntl } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../../test/helpers';
import CoveredEResourcesList from './CoveredEResourcesList';
import agreement from './testResources';
import { pcis } from '../../../../test/jest/eresources';

// Use manual mocks set up in hooks/__mocks__ folder (small correction to the way this was done before)
jest.mock('../../../hooks/useAgreementsDisplaySettings');
jest.mock('../../../hooks/useEresourcesEnabled');

const handlers = {
  onFilterEResources: jest.fn(),
  onExportEResourcesAsJSON: jest.fn().mockImplementation(() => Promise.resolve()),
  onExportEResourcesAsKBART: jest.fn().mockImplementation(() => Promise.resolve()),
};

describe('CoveredEResourcesList', () => {
  beforeEach(async () => {
    // Mock the return to simply be all the PCIs (is a bit weird wih prev and next page but hey ho)
    mockKyJson.mockImplementation(() => Promise.resolve(pcis));

    renderWithIntl(
      <MemoryRouter>
        <CoveredEResourcesList
          agreement={agreement}
          eresourcesFilterPath="current"
          {...handlers}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  describe.each(['Future', 'Current', 'Dropped', 'All'])('%s filter button', (filterLabel) => {
    test(`renders the ${filterLabel} button`, async () => {
      await waitFor(async () => {
        await Button(filterLabel).exists();
      });
    });

    describe(`clicking the ${filterLabel} button`, () => {
      beforeEach(async () => {
        handlers.onFilterEResources.mockClear();

        expect(handlers.onFilterEResources.mock.calls.length).toBe(0);

        await waitFor(async () => {
          await Button(filterLabel).click();
        });
      });

      test('onFilterEResources callback called', async () => {
        await waitFor(async () => {
          expect(handlers.onFilterEResources.mock.calls.length).toBe(1);
        });
      });
    });
  });

  test('renders the Export dropdown', async () => {
    await waitFor(async () => {
      await Dropdown('Export as...').exists();
    });
  });

  describe.each([
    { dropdownChoice: 'JSON', mockHandler: handlers.onExportEResourcesAsJSON },
    { dropdownChoice: 'KBART', mockHandler: handlers.onExportEResourcesAsKBART }
  ])('choosing export as $dropdownChoice', ({ dropdownChoice, mockHandler }) => {
    beforeEach(async () => {
      await waitFor(async () => {
        await Dropdown('Export as...').choose(dropdownChoice);
      });
    });

    test('correct onExportResources handler called', async () => {
      await waitFor(async () => {
        expect(mockHandler.mock.calls.length).toBe(1);
      });
    });
  });

  test('renders the CoveredEResourcesList MCL', async () => {
    await MultiColumnList('eresources-covered').exists();
  });

  test('renders expected column count', async () => {
    await MultiColumnList({ columnCount: 8 }).exists();
  });

  test('renders expected columns', async () => {
    await MultiColumnList({ columns: ['Name', 'eISSN/ISSN', 'Platform', 'Package', 'Coverage', ' ', 'Access start', 'Access end'] }).exists();
  });
});
