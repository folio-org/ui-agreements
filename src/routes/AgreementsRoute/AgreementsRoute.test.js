
import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { mockErmComponents, renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';
import translationsProperties from '../../../test/helpers';
import AgreementsRoute from './AgreementsRoute';

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  ...mockErmComponents,
  InternalContactSelection: () => <div>InternalContactSelection</div>,
}));

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  Selection: () => <div>Selection</div>,
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAgreementsSettings: jest.fn(() => ({ data: { configs: [{}] } })),
}));

const routeProps = {
  history: {
    push: () => jest.fn()
  },
  location: {},
  match: {
    params: {},
  },
};

describe('AgreementsRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementsRoute {...routeProps} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the agreements component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('agreements')).toBeInTheDocument();
    });

    describe('re-rendering the route', () => { // makes sure that we hit the componentDidUpdate block
      beforeEach(() => {
        renderWithIntl(
          <MemoryRouter>
            <AgreementsRoute {...routeProps} />
          </MemoryRouter>,
          translationsProperties,
          renderComponent.rerender
        );
      });

      test('renders the agreements component', () => {
        const { getByTestId } = renderComponent;
        expect(getByTestId('agreements')).toBeInTheDocument();
      });
    });
  });

  describe('rendering with no permissions', () => {
    let renderComponent;
    beforeEach(() => {
      const { hasPerm } = useStripes();
      hasPerm.mockImplementation(() => false);
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementsRoute
            {...routeProps}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('displays the permission error', () => {
      const { getByText } = renderComponent;
      expect(getByText('Sorry - your permissions do not allow access to this page.')).toBeInTheDocument();
    });
  });
});
