import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import {
  Accordion,
  Checkbox,
  RadioButton,
  renderWithIntl,
} from '@folio/stripes-erm-testing';

import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import GokbFilters from './GokbFilters';

const stateMock = jest.fn();

const filterHandlers = {
  state: stateMock,
  clear: jest.fn(),
  clearGroup: jest.fn(),
  reset: jest.fn()
};

const activeFilters = {
  type: [],
  subject: []
};

jest.mock('../utilities/', () => ({
  __esModule: true,
  getFilterConfig: () => ({
    filterMap: {
      type: 'componentType',
      subjects: 'subjects',
    },
    filterNames: ['type', 'subjects'],
    filterOptions: {
      type: [
        { label: 'Book', value: 'book' },
        { label: 'Journal', value: 'journal' },
      ],
      subjects: [
        { label: 'Law', value: 'law' },
        { label: 'Economics', value: 'economics' },
      ],
    },
    initialFilterState: {
      type: ['book'],
      subjects: [],
    },
    filterTypes: {
      type: 'singleSelect',
      subjects: 'multiSelect',
    },
  }),
}));

describe('GokbFilters', () => {
  beforeEach(() => {
    stateMock.mockClear();
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

  test('renders the Type accordion (radio)', async () => {
    await Accordion('Type').exists();
  });

  test('renders the Subject accordion (checkbox)', async () => {
    await Accordion('ui-agreements.gokb.filters.subjects').exists();
  });

  test('clicking the Book radio button calls state handler', async () => {
    await waitFor(async () => {
      await RadioButton('Book').click();
    });

    await waitFor(() => {
      expect(stateMock).toHaveBeenCalledWith({
        ...activeFilters,
        type: ['book']
      });
    });
  });

  test('clicking the Journal radio button calls state handler', async () => {
    await waitFor(async () => {
      await RadioButton('Journal').click();
    });

    await waitFor(() => {
      expect(stateMock).toHaveBeenCalledWith({
        ...activeFilters,
        type: ['journal']
      });
    });
  });

  test('clicking the Law checkbox calls state handler', async () => {
    await Checkbox({ id: 'clickable-filter-subjects-law' }).click();

    await waitFor(() => {
      expect(stateMock).toHaveBeenCalled();
    });
  });

  test('clicking the Economics checkbox calls state handler', async () => {
    await Checkbox({ id: 'clickable-filter-subjects-economics' }).click();

    await waitFor(() => {
      expect(stateMock).toHaveBeenCalled();
    });
  });
});
