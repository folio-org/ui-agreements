import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { Select } from '@folio/stripes-testing';

import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import PickListValueSettings from './PickListValueSettings';

import mockRefdata from '../../../test/jest/refdata';

jest.mock('@k-int/stripes-kint-components', () => ({
  ...jest.requireActual('@k-int/stripes-kint-components'),
  EditableRefdataList: () => <div>EditableRefdataList</div>,
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAgreementsRefdata: () => mockRefdata,
}));

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

    test('renders expected Refdata selection selector', async () => {
      await Select('Pick list').exists();
    });

    describe('select a pick list', () => {
      beforeEach(async () => {
        await Select().choose('AuthIdent');
      });

      it('renders expected status of AuthIdent', async () => {
        await Select().has({ value: 'AuthIdent' });
      });

      test('renders the EditableRefdataList component', () => {
        const { getByText } = renderComponent;
        expect(getByText('EditableRefdataList')).toBeInTheDocument();
      });
    });
  });
});
