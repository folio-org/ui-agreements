import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import PickListSettings from './PickListSettings';

jest.mock('@k-int/stripes-kint-components', () => ({
  ...jest.requireActual('@k-int/stripes-kint-components'),
  EditableRefdataCategoryList: () => <div>EditableRefdataCategoryList</div>,
}));

describe('PickListSettings', () => {
  describe('rendering the PickListSettings', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <PickListSettings />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the EditableRefdataCategoryList component', () => {
      const { getByText } = renderComponent;
      expect(getByText('EditableRefdataCategoryList')).toBeInTheDocument();
    });
  });
});
