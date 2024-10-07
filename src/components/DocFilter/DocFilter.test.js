import { MemoryRouter } from 'react-router-dom';

import {
  Accordion,
  renderWithIntl,
  TestForm,
} from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/helpers';
import DocFilter from './DocFilter';


jest.mock('../DocFilterForm', () => () => <div>DocFilterForm</div>);
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
describe('DocFilter', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <TestForm onSubmit={onSubmit}>
          <DocFilter
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
    await Accordion('ui-agreements.documentFilter').exists();
  });

  it('renders DocFilterForm component', () => {
    const { getByText } = renderComponent;
    expect(getByText('DocFilterForm')).toBeInTheDocument();
  });
});
