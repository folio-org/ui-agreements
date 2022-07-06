import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import PickListSettings from './PickListSettings';

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
