
import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Pane, Button, TextField, MultiColumnList } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import data from './testResources';
import Platforms from './Platforms';


jest.mock('../../IfEResourcesEnabled', () => ({ children }) => {
  return typeof children === 'function' ? children({ isEnabled: true }) : children;
});

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

describe('Platforms', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <Platforms
          data={data}
          onNeedMoreData={jest.fn()}
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

  test('renders the expected Agreements/E-resources/Platforms Buttons', async () => {
    await Button('Agreements').exists();
    await Button('E-resources').exists();
    await Button('Platforms').exists();
  });

  test('renders the expected Search and Reset all Button', async () => {
    await Button('Platforms').click();
    await TextField({ id: 'input-platform-search' }).fillIn('test'); // enables the disabled buttons
    await Button('Search').exists();
    await Button('Reset all').exists();
  });

  test('triggering the search should invoke the useHandleSubmitSearch hook', async () => {
    await Button('Platforms').click();
    await TextField({ id: 'input-platform-search' }).fillIn('test'); // enables the disabled buttons
    await Button('Search').click();
    expect(mockSubmit).toHaveBeenCalled();
  });

  test('renders the expected Platforms Pane', async () => {
    await Button('Platforms').click();
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
