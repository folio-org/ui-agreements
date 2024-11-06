
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';
import translationsProperties from '../../../test/helpers';
import AgreementsRoute from './AgreementsRoute';
import mockRefdata from '../../../test/jest/refdata';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAgreementsSettings: jest.fn(() => ({ data: { configs: [{}] } })),
  useAgreementsRefdata: () => mockRefdata,
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
      const { getAllByTestId } = renderComponent;
      const agreementsElements = getAllByTestId('agreements');
      expect(agreementsElements.length).toBeGreaterThan(0);
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
        const { getAllByTestId } = renderComponent;
        const agreementsElements = getAllByTestId('agreements');
        expect(agreementsElements.length).toBeGreaterThan(0);
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
