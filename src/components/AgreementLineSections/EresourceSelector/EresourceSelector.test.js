import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import translationsProperties from '../../../../test/helpers';
import EresourceSelector from './EresourceSelector';


const line = {
  'component': 'ƒ EresourceSelector() {}',
  'error': false,
  'name': 'linkedResource',
  'onAdd': () => {},
  'value': ''
};

describe('EresourceSelector', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <EresourceSelector line={line} />,
      translationsProperties
    );
  });

  test('renders eholdings card component', () => {
    const { getByText } = renderComponent;
    expect(getByText('eHoldings')).toBeInTheDocument();
   });
});

