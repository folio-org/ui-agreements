import { MemoryRouter } from 'react-router-dom';

import { renderWithIntl, Button, TestForm } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/helpers';
import DocFilterFieldArray from './DocFilterFieldArray';

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

describe('DocFilterFieldArray', () => {
  beforeEach(() => {
    renderWithIntl(
      <MemoryRouter>
        <TestForm onSubmit={onSubmit}>
          <DocFilterFieldArray atTypeValues={atTypeValues} />
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
