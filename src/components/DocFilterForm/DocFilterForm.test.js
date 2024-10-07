import { MemoryRouter } from 'react-router-dom';

import { renderWithIntl, Button, TestForm } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/helpers';
import DocFilterForm from './DocFilterForm';

const onSubmit = jest.fn();
const handlers = {
  closeEditModal: jest.fn(),
  openEditModal: jest.fn(),
};

const atTypeValues = [];
const filters = [];

describe('DocFilterForm', () => {
  describe('DocFilterForm on editing', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <TestForm onSubmit={onSubmit}>
            <DocFilterForm
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
      await Button('ui-agreements.documentFilter.addDocumentFilter').exists();
    });
  });

  describe('DocFilterForm on adding', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <TestForm onSubmit={onSubmit}>
            <DocFilterForm
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
      await Button('ui-agreements.documentFilter.editDocumentFilters').exists();
    });
  });
});
