
import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Pane, Button, TextField, MultiColumnList } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import Agreements from './Agreements';
import data from './testResources';


jest.mock('../../IfEResourcesEnabled', () => ({ children }) => {
  return typeof children === 'function' ? children({ isEnabled: true }) : children;
});

jest.mock('../../AgreementFilters', () => () => <div>AgreementFilters</div>);

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

describe('Agreements', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <Agreements
          data={data}
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          source={{
            loaded: () => true,
            totalCount: () => data.agreements.length
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

  test('renders the expected Agreements/E-resources/Platforms Buttons', async () => {
    await Button('Agreements').exists();
    await Button('E-resources').exists();
    await Button('Platforms').exists();
  });

  test('renders the expected Search and Reset all Button', async () => {
    await TextField({ id: 'input-agreement-search' }).fillIn('test'); // enables the disabled buttons
    await Button('Search').exists();
    await Button('Reset all').exists();
  });

  test('triggering the search should invoke the useHandleSubmitSearch hook', async () => {
    await TextField({ id: 'input-agreement-search' }).fillIn('test'); // enables the disabled buttons
    await Button('Search').click();
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
