import ReactRouterDom, { MemoryRouter } from 'react-router-dom';

import { renderWithIntl, Pane, Button, TextField, MultiColumnList } from '@folio/stripes-erm-testing';

import { useHandleSubmitSearch } from '@folio/stripes-erm-components';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import translationsProperties from '../../../../test/helpers';
import Titles from './Titles';
import data from './testResources';


jest.mock('../../IfEResourcesEnabled', () => ({ children }) => {
  return typeof children === 'function' ? children({ isEnabled: true }) : children;
});

jest.mock('../../TitleFilters', () => () => <div>TitleFilters</div>);
jest.mock('../../IdentifierReassignmentForm', () => () => <div>IdentifierReassignmentForm</div>);

// This is seemingly the only method to override imported __mock__ functions.
// (This probably means this setup SUCKS and needs changing)
ReactRouterDom.useLocation = jest.requireActual('react-router-dom').useLocation;

// const mockSubmit = jest.fn();
const mockSubmit = jest.fn(e => e.preventDefault());

describe('Titles', () => {
  useHandleSubmitSearch.mockImplementation(() => ({
    handleSubmitSearch: mockSubmit,
    resultsPaneTitleRef: null
  }));

  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter
        initialEntries={['/erm/titles']}
      >
        <Titles
          data={data}
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          source={{
            loaded: () => true,
            totalCount: () => data.titles.length
          }}
        >
          <div>children</div>
        </Titles>
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the expected Search and Filter Pane', async () => {
    await Pane('Search and filter').is({ visible: true });
  });

  test('renders the expected Packages/Titles/Platforms lines buttons', async () => {
    await Button('Packages').exists();
    await Button('Titles').exists();
    await Button('Platforms').exists();
  });

  test('renders the expected Search and Reset all Button', async () => {
    await waitFor(async () => {
      await Button('Titles').click();
      await TextField({ id: 'input-title-search' }).fillIn('test'); // enables the disabled buttons
    });

    await Button('Search').exists();
    await Button('Reset all').exists();
  });

  test('triggering the search should invoke the useHandleSubmitSearch hook', async () => {
    await waitFor(async () => {
      await Button('Titles').click();
      await TextField({ id: 'input-title-search' }).fillIn('test'); // enables the disabled buttons
    });

    await waitFor(async () => {
      await Button('Search').click();
    });
    expect(mockSubmit).toHaveBeenCalled();
  });

  test('renders the Title Filters', () => {
    const { getByText } = renderComponent;
    expect(getByText('TitleFilters')).toBeInTheDocument();
  });

  test('renders the IdentifierReassignmentForm', () => {
    const { getByText } = renderComponent;
    expect(getByText('IdentifierReassignmentForm')).toBeInTheDocument();
  });

  test('renders the expected Titles Pane', async () => {
    await waitFor(async () => {
      await Button('Titles').click();
    });
    await Pane('Titles').is({ visible: true });
  });

  test('renders the expected number of records in the pane sub text', async () => {
    await Pane('Titles').has({ subtitle: '"2 records found"' });
  });

  test('renders the expcted number of MCL columns', async () => {
    await MultiColumnList({ columnCount: 5 }).exists();
  });

  test('renders the expcted number of MCL rows', async () => {
    await MultiColumnList({ rowCount: 2 }).exists();
  });

  test('renders expected columns', async () => {
    await MultiColumnList({
      columns: [
        'Name',
        'Publication type',
        'Material type',
        'ISBN',
        'ISSN',
      ],
    }).exists();
  });

  test('renders expected children passed to the component', async () => {
    const { getByText } = renderComponent;
    expect(getByText('children')).toBeInTheDocument();
  });
});
