import {
  Select,
  MultiSelect,
  Dropdown,
  renderWithIntl,
} from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import { activeFilters } from './testResources';
import AgreementContentFilter from './AgreementContentFilter';

const stateMock = jest.fn();

const filterHandlers = {
  state: stateMock,
  checkbox: () => {},
  clear: () => {},
  clearGroup: () => {},
  reset: () => {},
};
describe('AgreementContentFilter', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
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
    await MultiSelect({
      id: 'agreementContent[0]-content-multi-select',
    }).exists();
  });

  test('renders the And/Or dropdown', async () => {
    await Dropdown('Add filter').exists();
  });
});
