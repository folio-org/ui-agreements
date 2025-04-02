import ReactRouterDom, { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useHandleSubmitSearch } from '@folio/stripes-erm-components';
import { Button, MultiColumnList, Pane, renderWithIntl, TextField } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../../test/helpers';
import Platforms from './Platforms';
import data from './testResources';


jest.mock('../../IfEResourcesEnabled', () => ({ children }) => {
  return typeof children === 'function' ? children({ isEnabled: true }) : children;
});

// This is seemingly the only method to override imported __mock__ functions.
// (This probably means this setup SUCKS and needs changing)
ReactRouterDom.useLocation = jest.requireActual('react-router-dom').useLocation;

const mockSubmit = jest.fn(e => e.preventDefault());
describe('Platforms', () => {
  useHandleSubmitSearch.mockImplementation(() => ({
    handleSubmitSearch: mockSubmit,
    resultsPaneTitleRef: null
  }));
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter
        initialEntries={['/erm/platforms']}
      >
        <Platforms
          data={data}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          source={{
            loaded: () => true,
            totalCount: () => data.platforms.length
          }}
        >
          <div>children</div>
        </Platforms>
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the expected Search and Filter Pane', async () => {
    await Pane('Search and filter').is({ visible: true });
  });

  test('renders the expected local kb buttons', async () => {
    await Button('Packages').exists();
    await Button('Titles').exists();
    await Button('Platforms').exists();
  });

  test('renders the expected Search and Reset all Button', async () => {
    await waitFor(async () => {
      await Button('Platforms').click();
      await TextField({ id: 'input-platform-search' }).fillIn('test'); // enables the disabled buttons
    });
    await Button('Search').exists();
    await Button('Reset all').exists();
  });

  test('triggering the search should invoke the useHandleSubmitSearch hook', async () => {
    await waitFor(async () => {
      await Button('Platforms').click();
      await TextField({ id: 'input-platform-search' }).fillIn('test'); // enables the disabled buttons
      await Button('Search').click();
    });

    await waitFor(async () => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  test('renders the expected Platforms Pane', async () => {
    await waitFor(async () => {
      await Button('Platforms').click();
    });

    await Pane('Platforms').is({ visible: true });
  });

  test('renders the expected number of records in the pane sub text', async () => {
    await Pane('Platforms').has({ subtitle: '"4 records found"' });
  });

  test('renders the expcted number of MCL columns', async () => {
    await MultiColumnList({ columnCount: 1 }).exists();
  });

  test('renders the expcted number of MCL rows', async () => {
    await MultiColumnList({ rowCount: 4 }).exists();
  });

  test('renders expected columns', async () => {
    await MultiColumnList({
      columns: [
        'Name'
      ],
    }).exists();
  });

  test('renders expected children passed to the component', async () => {
    const { getByText } = renderComponent;
    expect(getByText('children')).toBeInTheDocument();
  });
});
