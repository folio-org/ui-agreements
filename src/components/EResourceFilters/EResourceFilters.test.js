import React from 'react';
import { waitFor } from '@testing-library/dom';

import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Accordion, Checkbox } from '@folio/stripes-testing';
import translationsProperties from '../../../test/helpers';
import { activeFilters, data } from './testResources';
import EResourceFilters from './EResourceFilters';

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

describe('EResourceFilters', () => {
  describe('renders the EResourceFilters', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <EResourceFilters
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

    test('renders the Is package Accordion', async () => {
      await Accordion('Is package').exists();
    });

    test('renders the External data source Accordion', async () => {
      await Accordion('External data source').exists();
    });

    test('renders the Tags Accordion', async () => {
      await Accordion('Tags').exists();
    });

    test('renders the Availability Accordion', async () => {
      await Accordion('Availability').exists();
    });


    let index = 1;
    const testEresourceFilterCheckbox = (field, value) => (
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

    testEresourceFilterCheckbox('type', 'monograph');
    testEresourceFilterCheckbox('type', 'serial');

    testEresourceFilterCheckbox('publicationType', 'journal');
    testEresourceFilterCheckbox('publicationType', 'book');
    testEresourceFilterCheckbox('publicationType', 'database');

    testEresourceFilterCheckbox('class', 'package');
    testEresourceFilterCheckbox('class', 'nopackage');

    // Dummy data to check scope checkbox filters
    testEresourceFilterCheckbox('scope', 'scope-1');
    testEresourceFilterCheckbox('scope', 'scope-2');

    // Dummy data to check status checkbox filters
    testEresourceFilterCheckbox('status', 'status-1');
    testEresourceFilterCheckbox('status', 'status-2');

    // Dummy data to check content type checkbox filters
    testEresourceFilterCheckbox('contentType', 'content-type-1');
    testEresourceFilterCheckbox('contentType', 'content-type-2');
  });
});
