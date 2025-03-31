
import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useHandleSubmitSearch } from '@folio/stripes-erm-components';
import { Button, MultiColumnList, Pane, renderWithIntl, TextField, Checkbox } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../../test/helpers';
import Packages from './Packages';
import { data, source, searchString, selectedRecordId } from './testResources';

jest.mock('../../EResourceProvider', () => () => <div>EResourceProvider</div>);
jest.mock('../../PackageFilters', () => () => <div>PackageFilters</div>);

const mockSubmit = jest.fn(e => e.preventDefault());
const queryGetter = jest.fn();
const querySetter = jest.fn();
const onSelectPackageIds = jest.fn();
const handleSyncPackages = jest.fn();

describe('Packages', () => {
  useHandleSubmitSearch.mockImplementation(() => ({
    handleSubmitSearch: mockSubmit,
    resultsPaneTitleRef: null
  }));

  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <Packages
          data={data}
          handleSyncPackages={handleSyncPackages}
          history={{ push: jest.fn() }}
          onSelectPackageIds={onSelectPackageIds}
          queryGetter={queryGetter}
          querySetter={querySetter}
          searchString={searchString}
          selectedRecordId={selectedRecordId}
          source={source}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  describe('Rendering the component', () => {
    test('renders the expected Search and Filter Pane', async () => {
      await Pane('Search and filter').is({ visible: true });
    });

    test('renders the expected Titles/Platforms buttons', async () => {
      await Button('Titles').exists();
      await Button('Platforms').exists();
    });

    test('renders the expected Search and Reset all Button', async () => {
      await waitFor(async () => {
        await Button('Packages').click();
        await TextField({ id: 'input-package-search' }).fillIn('test'); // enables the disabled buttons
      });

      await Button('Search').exists();
      await Button('Reset all').exists();
    });

    test('renders the expected Packages Pane', async () => {
      await waitFor(async () => {
        await Button('Packages').click();
      });
      await Pane('Packages').is({ visible: true });
    });

    test('renders the expected Actions button', async () => {
      await waitFor(async () => {
        await Button('Packages').click();
      });
      await Button('Actions').exists();
    });

    test('renders the expected number of MCL columns', async () => {
      await MultiColumnList({ columnCount: 6 }).exists();
    });

    test('renders the expected number of MCL rows', async () => {
      await MultiColumnList({ rowCount: 2 }).exists();
    });

    test('renders expected packages columns', async () => {
      await MultiColumnList({
        columns: [
          '',
          'Name',
          'Provider',
          'Source (external data source)',
          'Status',
          'Synchronisation status',
        ],
      }).exists();
    });

    it('renders the EResourceProvider component', () => {
      const { queryAllByText } = renderComponent;
      expect(queryAllByText('EResourceProvider')).toHaveLength(2);
    });

    it('renders the PackageFilters component', () => {
      const { getByText } = renderComponent;
      expect(getByText('PackageFilters')).toBeInTheDocument();
    });
  });

  describe('Interacting with the search functionality', () => {
    test('triggering the search should invoke the useHandleSubmitSearch hook', async () => {
      await waitFor(async () => {
        await Button('Packages').click();
        await TextField({ id: 'input-package-search' }).fillIn('test'); // enables the disabled buttons
        await Button('Search').click();
      });

      await waitFor(async () => {
        expect(mockSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('Selecting Packages', () => {
    beforeEach(async () => {
      await Button('Packages').click();
    });

    describe('Selecting a single package', () => {
      test('clicking a package checkbox only selects that package', async () => {
        await Checkbox({ name: `select-${data.packages[0].id}` }).click();
        expect(onSelectPackageIds).toHaveBeenCalledWith([data.packages[0].id]);
        await Checkbox({ name: `select-${data.packages[1].id}` }).is({ checked: false });
      });
    });

    describe('Selecting all packages', () => {
      beforeEach(async () => {
        await Checkbox({ name: 'select-all' }).click();
      });

      test('clicking select-all selects all rows', async () => {
        data.packages.forEach(async (pkg) => {
          await Checkbox({ name: `select-${pkg.id}` }).is({ checked: true });
        });
        expect(onSelectPackageIds).toHaveBeenCalled();
      });

      test('clicking select-all again deselects all rows', async () => {
        await Checkbox({ name: 'select-all' }).click();
        data.packages.forEach(async (pkg) => {
          await Checkbox({ name: `select-${pkg.id}` }).is({ checked: false });
        });
        expect(onSelectPackageIds).toHaveBeenCalled();
      });
    });
  });
});
