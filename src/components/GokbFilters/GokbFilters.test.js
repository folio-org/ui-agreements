import { waitFor, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { renderWithIntl, Accordion, RadioButton } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { upperFirst } from 'lodash';

import translationsProperties from '../../../test/helpers';

import GokbFilters from './GokbFilters';
import gokbConfig from '../../../docs/gokb-search-v1';

const stateMock = jest.fn();

const filterHandlers = {
  clear: jest.fn(),
  clearGroup: jest.fn(),
  reset: jest.fn(),
  state: stateMock,
};

const activeFilters = {
  type: [],
};

describe('GokbFilters', () => {
  describe('renders the GokbFilters', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <GokbFilters
            activeFilters={activeFilters}
            filterHandlers={filterHandlers}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the Type Accordion', async () => {
      await Accordion('Type').exists();
    });

    let index = 1;
    const filter = gokbConfig.configuration.results.fetch.filters.find(f => f.name === 'type');
    const options = filter.enumValues;

    const testRadioClick = (name) => (
      test(`clicking the ${name} radio button`, async () => {
        await waitFor(async () => {
          await RadioButton(name).click();
        });

        await waitFor(() => {
          expect(stateMock.mock.calls.length).toEqual(index);
        });

        index++;
      })
    );

    options.forEach(opt => {
      testRadioClick(upperFirst(opt.name));
    });
  });

  describe('clear button', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <GokbFilters
            activeFilters={{ type: ['Book'] }}
            filterHandlers={filterHandlers}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('clicking the clear filters button calls clearGroup', async () => {
      const clearButton = document.querySelector('[data-test-clear-button=true]');
      expect(clearButton).toBeTruthy();
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(filterHandlers.clearGroup).toHaveBeenCalledWith('type');
      });
    });
  });
});
