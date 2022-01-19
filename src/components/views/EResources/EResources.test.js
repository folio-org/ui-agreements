
import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Pane, Button, TextField, MultiColumnList } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import EResources from './EResources';
import data from './testResources';


jest.mock('../../IfEResourcesEnabled', () => ({ children }) => {
  return typeof children === 'function' ? children({ isEnabled: true }) : children;
});

jest.mock('../../EResourceFilters', () => () => <div>AgreementFilters</div>);

const mockSubmit = jest.fn();
jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  useHandleSubmitSearch: () => ({
    handleSubmitSearch: jest.fn().mockImplementation((e) => {
      e.preventDefault();
      mockSubmit();
    })
  }),
}));

describe('EResources', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
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

  test('renders the expected Agreements/E-resources/Platforms Buttons', async () => {
    await Button('Agreements').exists();
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
