import ReactRouterDom, { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { renderWithIntl, Pane, Button, TextField, MultiColumnList } from '@folio/stripes-erm-testing';
import { useHandleSubmitSearch } from '@folio/stripes-erm-components';

import translationsProperties from '../../../../test/helpers';

import AgreementLines from './AgreementLines';
import { data, history, searchField } from './testResources';


jest.mock('../../IfEResourcesEnabled', () => ({ children }) => {
  return typeof children === 'function' ? children({ isEnabled: true }) : children;
});

jest.mock('../../AgreementLineFilters', () => () => <div>AgreementLineFilters</div>);

// This is seemingly the only method to override imported __mock__ functions.
// (This probably means this setup SUCKS and needs changing)
ReactRouterDom.useLocation = jest.requireActual('react-router-dom').useLocation;

const mockSubmit = jest.fn(e => e.preventDefault());
describe('Agreement lines', () => {
  useHandleSubmitSearch.mockImplementation(() => ({
    handleSubmitSearch: mockSubmit,
    resultsPaneTitleRef: null
  }));

  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter
        initialEntries={['/erm/agreementLines']}
      >
        <AgreementLines
          data={data}
          history={history}
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          searchField={searchField}
          source={{
            totalCount: jest.fn(() => data.agreementLines.length),
            loaded: jest.fn(() => true),
            pending: jest.fn(() => false),
            failure: jest.fn(() => false),
            failureMessage: jest.fn(() => null)
          }}
        >
          <div>children</div>
        </AgreementLines>
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
      await TextField({ id: 'input-agreementLine-search' }).fillIn('test'); // enables the disabled buttons
    });

    await Button('Search').exists();
    await Button('Reset all').exists();
  });

  test('triggering the search should invoke the useHandleSubmitSearch hook', async () => {
    await waitFor(async () => {
      await TextField({ id: 'input-agreementLine-search' }).fillIn('test'); // enables the disabled buttons
      await Button('Search').click();
    });

    expect(mockSubmit).toHaveBeenCalled();
  });

  test('renders the AgreementLine Filters', () => {
    const { getByText } = renderComponent;
    expect(getByText('AgreementLineFilters')).toBeInTheDocument();
  });

  test('renders the expected Agreement lines Pane', async () => {
    await Pane('Agreement lines').is({ visible: true });
  });

  test('renders the expected number of records in the pane sub text', async () => {
    await Pane('Agreement lines').has({ subtitle: '"7 records found"' });
  });

  test('renders the expcted number of MCL columns', async () => {
    await MultiColumnList({ columnCount: 6 }).exists();
  });

  test('renders the expcted number of MCL rows', async () => {
    await MultiColumnList({ rowCount: 7 }).exists();
  });

  test('renders expected columns', async () => {
    await MultiColumnList({
      columns: [
        'Name/Reference',
        'Description',
        'Note',
        'Active from',
        'Active to',
        'Parent agreement'
      ],
    }).exists();
  });

  test('renders expected children passed to the component', async () => {
    const { getByText } = renderComponent;
    expect(getByText('children')).toBeInTheDocument();
  });
});
