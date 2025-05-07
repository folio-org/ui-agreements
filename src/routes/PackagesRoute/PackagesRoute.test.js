import { useQuery } from 'react-query';
import { useStripes } from '@folio/stripes/core';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { noop } from 'lodash';
import translationsProperties from '../../../test/helpers';
import mockRefdata from '../../../test/jest/refdata';
import PackagesRoute from './PackagesRoute';


jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAgreementsDisplaySettings: jest.fn(() => ({ data: { configs: [{}] } })),
  useAgreementsRefdata: () => mockRefdata,
}));

const mockPush = jest.fn();

// TODO really? Why are we having to pass these in again. This is kinda gross.
// Maybe we need a TestRouteWrapper which uses MemoryRouter and PROPERLY hands down this stuff for testing
useLocation.mockImplementation(() => {
  const { useLocation: actualUseLocation } = jest.requireActual('react-router-dom');
  return actualUseLocation();
});
const routeProps = {
  history: {
    push: mockPush,
    location: {
      pathname: '/erm/packages/8a7a5564-16b7-428f-bb59-afa68fe4e24d',
      search: '?filters=synchronisationStatus.true%2CsynchronisationStatus.false&page=1&query=test&sort=name',
    },
  },
  location: {
    pathname: '/erm/packages/8a7a5564-16b7-428f-bb59-afa68fe4e24d',
    search: '?filters=synchronisationStatus.true%2CsynchronisationStatus.false&page=1&query=test&sort=name',
  },
  match: {
    path: '/erm/packages/:id',
    url: '/erm/packages/8a7a5564-16b7-428f-bb59-afa68fe4e24d',
    params: {
      id: '8a7a5564-16b7-428f-bb59-afa68fe4e24d'
    },
  },
  mutator: {
    query: { update: noop },
  },
};

useQuery.mockImplementation(() => ({
  data: [],
  isLoading: false
}));

// TODO we really should be mocking the rendered view component to avoid having to do anything special for child components
describe('PackagesRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter initialEntries={['/erm/packages']}>
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

    test('did not redirect to view pane', () => {
      expect(mockPush.mock.calls.length).toBe(0);
    });

    // TODO we should actually be _properly_ testing the useEffect, see AgreementsRoute example
    // using memory router to render with props which force it to call history.push mock and measuring that mock output

    // describe('re-rendering the route', () => { // makes sure that we hit the componentDidUpdate block
    //   beforeEach(() => {
    //     renderWithIntl(
    //       <MemoryRouter>
    //         <PackagesRoute {...routeProps} />
    //       </MemoryRouter>,
    //       translationsProperties,
    //       renderComponent.rerender
    //     );
    //   });

    //   test('renders the packages component', () => {
    //     const { getAllByTestId } = renderComponent;
    //     const packagesElements = getAllByTestId('packages');
    //     expect(packagesElements.length).toBeGreaterThan(0);
    //   });
    // });
  });

  describe('rendering with no permissions', () => {
    let renderComponent;
    beforeEach(() => {
      const { hasPerm } = useStripes();
      hasPerm.mockImplementation(() => false);

      renderComponent = renderWithIntl(
        <MemoryRouter initialEntries={['/erm/packages']}>
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
