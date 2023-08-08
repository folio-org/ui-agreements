import { waitFor } from '@folio/jest-config-stripes/testing-library/react';


import { renderWithIntl, Accordion, Checkbox } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import { activeFilters, data } from './testResources';
import TitleFilters from './TitleFilters';

// onChange on the filter sets the filterHandlers state passed to us via the search and sort query component.
// We mock the filterhandlers.state callback to see if that gets invoked
const stateMock = jest.fn();

const filterHandlers = {
  state: stateMock,
  checkbox: () => {},
  clear: () => {},
  clearGroup: () => {},
  reset: () => {},
};

describe('TitleFilters', () => {
  describe('renders the TitleFilters', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <TitleFilters
            activeFilters={activeFilters}
            data={data}
            filterHandlers={filterHandlers}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the Type Accordion', async () => {
      await Accordion('Type').exists();
    });

    test('renders the Publication type Accordion', async () => {
      await Accordion('Publication type').exists();
    });

    test('renders the Tags Accordion', async () => {
      await Accordion('Tags').exists();
    });

    let index = 1;
    const testTitleFilterCheckbox = (field, value) => (
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

    testTitleFilterCheckbox('type', 'monograph');
    testTitleFilterCheckbox('type', 'serial');

    testTitleFilterCheckbox('publicationType', 'journal');
    testTitleFilterCheckbox('publicationType', 'book');
    testTitleFilterCheckbox('publicationType', 'database');
  });
});
