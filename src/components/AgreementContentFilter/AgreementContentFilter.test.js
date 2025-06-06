import { MemoryRouter } from 'react-router-dom';

import {
  Select,
  MultiSelect,
  Dropdown,
  renderWithIntl,
} from '@folio/stripes-erm-testing';

import AgreementContentFilter from './AgreementContentFilter';

import translationsProperties from '../../../test/helpers';
import { activeFilters } from './testResources';

const stateMock = jest.fn();

const filterHandlers = {
  state: stateMock,
  checkbox: () => {},
  clear: () => {},
  clearGroup: () => {},
  reset: () => {},
};
describe('AgreementContentFilter', () => {
  beforeEach(() => {
    renderWithIntl(
      <MemoryRouter>
        <AgreementContentFilter
          activeFilters={activeFilters}
          agreementContentFilters={[]}
          filterHandlers={filterHandlers}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the Has/Has not field', async () => {
    await Select({ id: 'agreementContent[0]-attribute-select' }).exists();
  });

  test('renders the Content field', async () => {
    await MultiSelect().exists();
  });

  test('renders the And/Or dropdown', async () => {
    await Dropdown('Add filter').exists();
  });
});
