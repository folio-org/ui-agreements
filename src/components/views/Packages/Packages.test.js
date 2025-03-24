
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

  it('renders the EResourceProvider component', () => {
    const { queryAllByText } = renderComponent;
    expect(queryAllByText('EResourceProvider')).toHaveLength(2);
  });

  it('renders the PackageFilters component', () => {
    const { getByText } = renderComponent;
    expect(getByText('PackageFilters')).toBeInTheDocument();
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

  test('selects a package and calls onSelectPackageIds', async () => {
    await waitFor(async () => {
      await Button('Packages').click();
    });
    await Checkbox({ name: `select-${data.packages[0].id}` }).exists();
    await Checkbox({ name: `select-${data.packages[0].id}` }).click();
    expect(onSelectPackageIds).toHaveBeenCalled();
  });

  test('selects multiple packages', async () => {
    await waitFor(async () => {
      await Button('Packages').click();
    });
    await Checkbox({ name: `select-${data.packages[0].id}` }).exists();
    await Checkbox({ name: `select-${data.packages[1].id}` }).exists();
    await Checkbox({ name: `select-${data.packages[0].id}` }).click();
    await Checkbox({ name: `select-${data.packages[1].id}` }).click();
    expect(onSelectPackageIds).toHaveBeenCalled();
  });

  test('selects all packages', async () => {
    await waitFor(async () => {
      await Button('Packages').click();
    });
    await Checkbox({ name: 'select-all' }).exists();
    await Checkbox({ name: 'select-all' }).click();
    expect(onSelectPackageIds).toHaveBeenCalled();
  });

  test('deselects all packages', async () => {
    await waitFor(async () => {
      await Button('Packages').click();
    });
    await Checkbox({ name: 'select-all' }).exists();
    await Checkbox({ name: 'select-all' }).click();
    await Checkbox({ name: 'select-all' }).click();
    expect(onSelectPackageIds).toHaveBeenCalled();
  });

  test('renders the expcted number of MCL columns', async () => {
    await MultiColumnList({ columnCount: 6 }).exists();
  });

  test('renders the expcted number of MCL rows', async () => {
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
});
