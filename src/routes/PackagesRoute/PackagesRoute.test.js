import { useQuery } from 'react-query';
import { useStripes } from '@folio/stripes/core';

import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { noop } from 'lodash';
import translationsProperties from '../../../test/helpers';
import PackagesRoute from './PackagesRoute';

const routeProps = {
  history: {
    push: () => jest.fn()
  },
  location: {},
  match: {
    params: {},
  },
  mutator: {
    query: { update: noop },
  },
};

useQuery.mockImplementation(() => ({
  data: [],
  isLoading: false
}));

describe('PackagesRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <PackagesRoute {...routeProps} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the packages component', () => {
      const { getAllByTestId } = renderComponent;
      const packagesElements = getAllByTestId('packages');
      expect(packagesElements.length).toBeGreaterThan(0);
    });

    describe('re-rendering the route', () => { // makes sure that we hit the componentDidUpdate block
      beforeEach(() => {
        renderWithIntl(
          <MemoryRouter>
            <PackagesRoute {...routeProps} />
          </MemoryRouter>,
          translationsProperties,
          renderComponent.rerender
        );
      });

      test('renders the packages component', () => {
        const { getAllByTestId } = renderComponent;
        const packagesElements = getAllByTestId('packages');
        expect(packagesElements.length).toBeGreaterThan(0);
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
          <PackagesRoute
            {...routeProps}
            stripes={{ hasPerm: () => false }}
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
