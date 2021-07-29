import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Accordion } from '@folio/stripes-testing';
import FormSupplementaryProperties from './FormSupplementaryProperties';
import translationsProperties from '../../../../test/helpers';

/* We mock the FormCustomProperties component here and test if that component renders as expected as a part of this test.
We neednt test out the  FormCustomProperties functionality in theses tests because we shouldnt be concerned with the
underlying implementation of the child component */

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  FormCustomProperties: () => <div>FormCustomProperties</div>,
}));

const onSubmit = jest.fn();

const data = {
  'supplementaryProperties': [
    {
      'id': '2c9180b97af05157017af39754cd004c',
      'name': 'testProperty2',
      'primary': true,
      'defaultInternal': false,
      'label': 'test2',
      'description': 'testDesc2',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
    },
    {
      'id': '2c9180b97af05157017af396c56a004b',
      'name': 'testProperty',
      'primary': false,
      'defaultInternal': true,
      'label': 'test',
      'description': 'test desc',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger'
    }
  ]
};

describe('FormSupplementaryProperties', () => {
  let renderComponent;
  describe('with no initial values', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormSupplementaryProperties data={data} />
        </TestForm>, translationsProperties
      );
    });

    test('renders the Supplementary properties accordion', async () => {
      await Accordion('Supplementary properties').exists();
    });

    test('renders the FormCustomProperties component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormCustomProperties')).toBeInTheDocument();
    });
  });
});
