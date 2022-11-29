import { waitFor } from '@testing-library/dom';


import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Accordion, Checkbox } from '@folio/stripes-testing';
import translationsProperties from '../../../test/helpers';
import { activeFilters, data } from './testResources';
import PackageFilters from './PackageFilters';

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

describe('PackageFilters', () => {
  describe('renders the PackageFilters', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <PackageFilters
            activeFilters={activeFilters}
            data={data}
            filterHandlers={filterHandlers}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the External data source Accordion', async () => {
      await Accordion('External data source').exists();
    });

    test('renders the Status Accordion', async () => {
      await Accordion('Status').exists();
    });

    test('renders the Scope Accordion', async () => {
      await Accordion('Scope').exists();
    });

    test('renders the Availability Accordion', async () => {
      await Accordion('Availability').exists();
    });

    test('renders the Content type Accordion', async () => {
      await Accordion('Content type').exists();
    });

    test('renders the Tags Accordion', async () => {
      await Accordion('Tags').exists();
    });

    let index = 1;
    const testPackageFilterCheckbox = (field, value) => (
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

    // Dummy data to check status checkbox filters
    testPackageFilterCheckbox('status', 'current');
    testPackageFilterCheckbox('status', 'deleted');
    testPackageFilterCheckbox('status', 'expected');
    testPackageFilterCheckbox('status', 'retired');

    // // Dummy data to check scope checkbox filters
    testPackageFilterCheckbox('scope', 'consortium');
    testPackageFilterCheckbox('scope', 'global');
    testPackageFilterCheckbox('scope', 'local');
    testPackageFilterCheckbox('scope', 'other');
    testPackageFilterCheckbox('scope', 'regional');

    // // Dummy data to check content type checkbox filters
    testPackageFilterCheckbox('contentType', 'book');
    testPackageFilterCheckbox('contentType', 'database');
    testPackageFilterCheckbox('contentType', 'journal');
    testPackageFilterCheckbox('contentType', 'mixed');
  });
});
