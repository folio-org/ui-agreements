import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import PickListValueSettings from './PickListValueSettings';

const props = {
  mutator: {
    categories: {
      GET: jest.fn(),
      reset: jest.fn(),
    },
  },
};

describe('PickListValueSettings', () => {
  describe('rendering the PickListValueSettings', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <PickListValueSettings {...props} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the ControlledVocab component', () => {
      const { getByText } = renderComponent;
      expect(getByText('ControlledVocab')).toBeInTheDocument();
    });
  });
});
