import { MemoryRouter } from 'react-router-dom';
import { renderWithIntl, mockErmComponents, Button, TestForm } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/helpers';
import DocumentFilterForm from './DocumentFilterForm';

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  ...mockErmComponents,
  DocumentFilterFieldArray: () => <div>DocumentFilterFieldArray</div>,
}));

const onSubmit = jest.fn();
const handlers = {
  closeEditModal: jest.fn(),
  openEditModal: jest.fn(),
};

const atTypeValues = [];
const filters = [];

let renderComponent;
describe('DocumentFilterForm', () => {
  describe('DocumentFilterForm on editing', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <TestForm onSubmit={onSubmit}>
            <DocumentFilterForm
              atTypeValues={atTypeValues}
              editingFilters
              filters={filters}
              handlers={handlers}
              onSubmit={onSubmit}
            />
          </TestForm>
          ,
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the document filters button', async () => {
      await Button('Edit document filters').exists();
    });

    test('renders the DocumentFilterFieldArray component', () => {
      const { getByText } = renderComponent;
      expect(getByText('DocumentFilterFieldArray')).toBeInTheDocument();
    });
  });

  describe('DocumentFilterForm on adding', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <TestForm onSubmit={onSubmit}>
            <DocumentFilterForm
              atTypeValues={atTypeValues}
              editingFilters={false}
              filters={filters}
              handlers={handlers}
              onSubmit={onSubmit}
            />
          </TestForm>
          ,
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the document filters button', async () => {
      await Button('Edit document filters').exists();
    });
  });
});
