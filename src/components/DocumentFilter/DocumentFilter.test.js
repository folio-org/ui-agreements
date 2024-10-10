import { MemoryRouter } from 'react-router-dom';
import {
  Button,
  Accordion,
  renderWithIntl,
  TestForm,
} from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/helpers';
import DocumentFilter from './DocumentFilter';


jest.mock('../DocumentFilterForm', () => () => <div>DocumentFilterForm</div>);
const onSubmit = jest.fn();

const stateMock = jest.fn();
const activeFilters = {};
const filterHandlers = {
  state: stateMock,
  checkbox: () => {},
  clear: () => {},
  clearGroup: () => {},
  reset: () => { },
};

const atTypeValues = [
  {
    'id': '2c9180a09262108601926219be050022',
    'value': 'consortium_negotiation_document',
    'label': 'Consortium negotiation document',
  },
  {
    'id': '2c9180a09262108601926219bdfc0020',
    'value': 'license',
    'label': 'License',
  },
  {
    'id': '2c9180a09262108601926219be010021',
    'value': 'misc',
    'label': 'Misc',
  },
];

let renderComponent;
describe('DocumentFilter', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <TestForm onSubmit={onSubmit}>
          <DocumentFilter
            activeFilters={activeFilters}
            atTypeValues={atTypeValues}
            filterHandlers={filterHandlers}
          />
        </TestForm>,
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the document filters accordion', async () => {
    await Accordion('Documents').exists();
  });

  it('renders DocumentFilterForm component', () => {
    const { getByText } = renderComponent;
    expect(getByText('DocumentFilterForm')).toBeInTheDocument();
  });

  test('renders the submit button', async () => {
    await Button('Submit').exists();
  });
});
