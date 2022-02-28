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
  ...jest.requireActual('@folio/stripes-erm-components'),
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
  ],
  'openAccessProperties': [
    {
      'id': '2c9180ad7f1f52ef017f1f548b110057',
      'ctx': 'OpenAccess',
      'name': 'AuthorIdentification',
      'primary': true,
      'category': {
        'id': '2c9180ad7f1f52ef017f1f548817004f',
        'desc': 'AuthIdent',
        'internal': false,
        'values': [{
          'id': '2c9180ad7f1f52ef017f1f5488210052',
          'value': 'orcid',
          'label': 'ORCID'
        }, {
          'id': '2c9180ad7f1f52ef017f1f5488400056',
          'value': 'ror_id',
          'label': 'ROR ID'
        }, {
          'id': '2c9180ad7f1f52ef017f1f54881c0051',
          'value': 'email_domain',
          'label': 'Email Domain'
        }, {
          'id': '2c9180ad7f1f52ef017f1f5488250053',
          'value': 'over_institute',
          'label': 'Over Institute'
        }, {
          'id': '2c9180ad7f1f52ef017f1f5488190050',
          'value': 'other',
          'label': 'Other'
        }, {
          'id': '2c9180ad7f1f52ef017f1f54882e0055',
          'value': 'ringgold_id',
          'label': 'Ringgold ID'
        }, {
          'id': '2c9180ad7f1f52ef017f1f5488280054',
          'value': 'over_ip_range',
          'label': 'Over IP Range'
        }]
      },
      'defaultInternal': true,
      'label': 'Author Identification',
      'description': 'Author Identification',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata'
    }, {
      'id': '2c9180ad7f1f52ef017f1f548b3b0058',
      'ctx': 'OpenAccess',
      'name': 'Eligible authors',
      'primary': true,
      'defaultInternal': true,
      'label': 'Does this agreement support publishing',
      'description': 'Does this agreement support publishing',
      'weight': 0,
      'type': 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'
    }]
};

let renderComponent;

describe.only('FormSupplementaryProperties', () => {
  describe('with supplementaryProperties', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormSupplementaryProperties data={data} id="supplementaryProperties" />
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

  describe('with openAccessProperties', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormSupplementaryProperties data={data} id="openAccessProperties" />
        </TestForm>, translationsProperties
      );
    });

    test('renders the Open access properties accordion', async () => {
      await Accordion('Open access properties').exists();
    });

    test('renders the FormCustomProperties component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormCustomProperties')).toBeInTheDocument();
    });
  });
});
