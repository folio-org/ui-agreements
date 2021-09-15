import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { FormattedMessage } from 'react-intl';
import translationsProperties from '../../../../test/helpers';
import EresourceSelector from './EresourceSelector';

const line = {
  'component': 'ƒ EresourceSelector() {}',
  'error': '<Memo />',
  'name': 'linkedResource',
  'onAdd': () => {},
  'value': ''
};

describe('EresourceSelector', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <EresourceSelector error={<FormattedMessage id="ui-agreements.agreementLine.provideEresource" />} line={line} />,
      translationsProperties
    );
  });

  test('renders eholdings card component', () => {
    const { getByText } = renderComponent;
    expect(getByText('eHoldings')).toBeInTheDocument();
   });

   test('renders linkEresourceToStart message', () => {
    const { getByText } = renderComponent;
    expect(getByText('Link an e-resource to get started')).toBeInTheDocument();
   });

   test('renders error message', () => {
    const { getByText } = renderComponent;
    expect(getByText('Please provide an e-resource or description to continue')).toBeInTheDocument();
   });
});

