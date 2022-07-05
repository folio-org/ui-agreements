import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import PickListValueSettings from './PickListValueSettings';


describe('PickListValueSettings', () => {
  describe('rendering the PickListValueSettings', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <PickListValueSettings />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the EditableRefdataList component', () => {
      const { getByText } = renderComponent;
      expect(getByText('EditableRefdataList')).toBeInTheDocument();
    });
  });
});
