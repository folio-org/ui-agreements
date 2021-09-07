import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Button } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import EresourceSelector from './EresourceSelector';


const data = {
  'component': 'ƒ EresourceSelector() {}',
  'error': false,
  'name': 'linkedResource',
  'onAdd': 'ƒ onAdd() {}',
  'value': ''
};

describe('EresourceSelector', () => {
  let renderComponent;
  beforeEach(() => {
    renderWithIntl(
      <MemoryRouter>
        <EresourceSelector id="eresourceselector" onAdd={data.onAdd} />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders eholdings card component', () => {
    const { getByTestId } = renderComponent;
    expect(getByTestId('eresourceselector')).toBeInTheDocument();
   });
});

