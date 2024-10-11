import { MemoryRouter } from 'react-router-dom';

import { renderWithIntl, Button, TestForm } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/helpers';
import DocumentFilterField from './DocumentFilterField';

const onSubmit = jest.fn();

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
describe('DocumentFilterField', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <TestForm onSubmit={onSubmit}>
          <DocumentFilterField atTypeValues={atTypeValues} index={0} name="filters[0]" />
        </TestForm>
        ,
      </MemoryRouter>,
      translationsProperties
    );
  });

  it('display attibute label', () => {
    const { getByText } = renderComponent;
    expect(getByText('Attribute')).toBeInTheDocument();
  });

  it('display operator label', () => {
    const { getByText } = renderComponent;
    expect(getByText('Operator')).toBeInTheDocument();
  });

  it('display value label', () => {
    const { getByText } = renderComponent;
    expect(getByText('Value')).toBeInTheDocument();
  });

  test('renders the add rule button', async () => {
    await Button('Add rule').exists();
  });
});
