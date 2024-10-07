import { MemoryRouter } from 'react-router-dom';
import { renderWithIntl, Button, TestForm, TextArea } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/helpers';
import DocFilterRule from './DocFilterRule';

TextArea('Name').exists();

const onSubmit = jest.fn();
const onDelete = jest.fn();
const value = {
  'path': 'docs.name',
  'comparator': '==',
  'value': 'test'
};

describe('DocFilterRule', () => {
  beforeEach(() => {
    renderWithIntl(
      <MemoryRouter>
        <TestForm onSubmit={onSubmit}>
          <DocFilterRule
            ariaLabelledby="selected-document-item-name-0"
            atTypeValues={[]}
            index={0}
            name="filters[0].rules[0]"
            onDelete={onDelete}
            value={value}
          />
        </TestForm>
        ,
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the submit button', async () => {
    await Button('Submit').exists();
  });

  it('renders Name option', () => {
    TextArea('Name').exists();
  });

  it('renders Note option', () => {
    TextArea('Note').exists();
  });

  it('renders Physical location option', () => {
    TextArea('Physical location').exists();
  });

  it('renders URL option', () => {
    TextArea('URL').exists();
  });

  it('renders Content type option', () => {
    TextArea('Content type').exists();
  });

  it('renders File name option', () => {
    TextArea('File name').exists();
  });

  it('renders Category option', () => {
    TextArea('Category').exists();
  });

  it('renders is option', () => {
    TextArea('is').exists();
  });

  it('renders containes option', () => {
    TextArea('containes').exists();
  });

  it('renders does not contain option', () => {
    TextArea('does not contain').exists();
  });
});
