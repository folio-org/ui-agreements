import ReactRouterDom, { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { renderWithIntl, Pane, Button, TextField, MultiColumnList } from '@folio/stripes-erm-testing';
import { useHandleSubmitSearch } from '@folio/stripes-erm-components';

import translationsProperties from '../../../../test/helpers';

import Agreements from './Agreements';
import data from './testResources';


jest.mock('../../IfEResourcesEnabled', () => ({ children }) => {
  return typeof children === 'function' ? children({ isEnabled: true }) : children;
});

jest.mock('../../AgreementFilters', () => () => <div>AgreementFilters</div>);

// This is seemingly the only method to override imported __mock__ functions.
// (This probably means this setup SUCKS and needs changing)
ReactRouterDom.useLocation = jest.requireActual('react-router-dom').useLocation;

const mockSubmit = jest.fn(e => e.preventDefault());
describe('Agreements', () => {
  useHandleSubmitSearch.mockImplementation(() => ({
    handleSubmitSearch: mockSubmit,
    resultsPaneTitleRef: null
  }));

  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter
        initialEntries={['/erm/agreements']}
      >
        <Agreements
          data={data}
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          source={{
            totalCount: jest.fn(() => data.agreements.length),
            loaded: jest.fn(() => true),
            pending: jest.fn(() => false),
            failure: jest.fn(() => false),
            failureMessage: jest.fn(() => null)
          }}
        >
          <div>children</div>
        </Agreements>
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the expected Search and Filter Pane', async () => {
    await Pane('Search and filter').is({ visible: true });
  });

  test('renders the expected Agreements/Agreement lines buttons', async () => {
    await Button('Agreements').exists();
    await Button('Agreement lines').exists();
  });

  test('renders the expected Search and Reset all Button', async () => {
    await waitFor(async () => {
      await TextField({ id: 'input-agreement-search' }).fillIn('test'); // enables the disabled buttons
    });

    await Button('Search').exists();
    await Button('Reset all').exists();
  });

  test('triggering the search should invoke the useHandleSubmitSearch hook', async () => {
    await waitFor(async () => {
      await TextField({ id: 'input-agreement-search' }).fillIn('test'); // enables the disabled buttons
      await Button('Search').click();
    });

    expect(mockSubmit).toHaveBeenCalled();
  });

  test('renders the Agreement Filters', () => {
    const { getByText } = renderComponent;
    expect(getByText('AgreementFilters')).toBeInTheDocument();
  });

  test('renders the expected Agreements Pane', async () => {
    await Pane('Agreements').is({ visible: true });
  });

  test('renders the expected number of records in the pane sub text', async () => {
    await Pane('Agreements').has({ subtitle: '"3 records found"' });
  });

  test('renders the New agreement button', async () => {
    await Button('New').exists();
  });


  test('renders the expcted number of MCL columns', async () => {
    await MultiColumnList({ columnCount: 5 }).exists();
  });

  test('renders the expcted number of MCL rows', async () => {
    await MultiColumnList({ rowCount: 3 }).exists();
  });

  test('renders expected columns', async () => {
    await MultiColumnList({
      columns: [
        'Name',
        'Status',
        'Start date',
        'End date',
        'Cancellation deadline'
      ],
    }).exists();
  });

  test('renders expected children passed to the component', async () => {
    const { getByText } = renderComponent;
    expect(getByText('children')).toBeInTheDocument();
  });
});
