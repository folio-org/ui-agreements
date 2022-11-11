import ReactRouterDom, { MemoryRouter } from 'react-router-dom';

import { renderWithIntl } from '@folio/stripes-erm-testing';

import { useHandleSubmitSearch } from '@folio/stripes-erm-components';

import { Pane, Button, TextField, MultiColumnList } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import EResources from './EResources';
import data from './testResources';


jest.mock('../../IfEResourcesEnabled', () => ({ children }) => {
  return typeof children === 'function' ? children({ isEnabled: true }) : children;
});

jest.mock('../../EResourceFilters', () => () => <div>AgreementFilters</div>);
jest.mock('../../IdentifierReassignmentForm', () => () => <div>IdentifierReassignmentForm</div>);

// This is seemingly the only method to override imported __mock__ functions.
// (This probably means this setup SUCKS and needs changing)
ReactRouterDom.useLocation = jest.requireActual('react-router-dom').useLocation;

const mockSubmit = jest.fn();

describe('EResources', () => {
  useHandleSubmitSearch.mockImplementation(() => ({
    handleSubmitSearch: mockSubmit,
    resultsPaneTitleRef: null
  }));

  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter
        initialEntries={['/erm/eresources']}
      >
        <EResources
          data={data}
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          source={{
            loaded: () => true,
            totalCount: () => data.eresources.length
          }}
        >
          <div>children</div>
        </EResources>
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the expected Search and Filter Pane', async () => {
    await Pane('Search and filter').is({ visible: true });
  });

  test('renders the expected Agreements/Agreement lines buttons', async () => {
    await Button('E-resources').exists();
    await Button('Platforms').exists();
  });

  test('renders the expected Search and Reset all Button', async () => {
    await Button('E-resources').click();
    await TextField({ id: 'input-eresource-search' }).fillIn('test'); // enables the disabled buttons
    await Button('Search').exists();
    await Button('Reset all').exists();
  });

  test('triggering the search should invoke the useHandleSubmitSearch hook', async () => {
    await Button('E-resources').click();
    await TextField({ id: 'input-eresource-search' }).fillIn('test'); // enables the disabled buttons
    await Button('Search').click();
    expect(mockSubmit).toHaveBeenCalled();
  });

  test('renders the Agreement Filters', () => {
    const { getByText } = renderComponent;
    expect(getByText('AgreementFilters')).toBeInTheDocument();
  });

  test('renders the IdentifierReassignmentForm', () => {
    const { getByText } = renderComponent;
    expect(getByText('IdentifierReassignmentForm')).toBeInTheDocument();
  });

  test('renders the expected E-resources Pane', async () => {
    await Button('E-resources').click();
    await Pane('E-resources').is({ visible: true });
  });

  test('renders the expected number of records in the pane sub text', async () => {
    await Pane('E-resources').has({ subtitle: '"2 records found"' });
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
        'ISBN',
        'ISSN (Online)',
        'ISSN (Print)'
      ],
    }).exists();
  });

  test('renders expected children passed to the component', async () => {
    const { getByText } = renderComponent;
    expect(getByText('children')).toBeInTheDocument();
  });
});
