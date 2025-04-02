import { renderWithIntl } from '@folio/stripes-erm-testing';

import { useStripes } from '@folio/stripes/core';

import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import PlatformsRoute from './PlatformsRoute';

jest.mock('../../components/RouteSwitcher', () => () => <div>RouteSwitcher</div>);

const props = {
  history: {
    push: () => jest.fn()
  },
  location: {
    pathname: '',
    search: ''
  },
  match: {
    params: {
      id: ''
    },
  },
};

describe('PlatformsRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <PlatformsRoute {...props} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the platforms component', () => {
      const { getAllByTestId } = renderComponent;
      const platformsElements = getAllByTestId('platforms');
      expect(platformsElements.length).toBeGreaterThan(0);
    });

    // TODO we should actually be _properly_ testing the useEffect, see AgreementsRoute example
    // using memory router to render with props which force it to call history.push mock and measuring that mock output

    /* describe('re-rendering the route', () => { // makes sure that we hit the componentDidUpdate block
      beforeEach(() => {
        renderWithIntl(
          <MemoryRouter>
            <PlatformsRoute {...props} />
          </MemoryRouter>,
          translationsProperties,
          renderComponent.rerender
        );
      });

      test('renders the platforms component', () => {
        const { getAllByTestId } = renderComponent;
        const platformsElements = getAllByTestId('platforms');
        expect(platformsElements.length).toBeGreaterThan(0);
      });
    }); */
  });

  describe('rendering with no permissions', () => {
    let renderComponent;
    beforeEach(() => {
      const { hasPerm } = useStripes();
      hasPerm.mockImplementation(() => false);

      renderComponent = renderWithIntl(
        <MemoryRouter>
          <PlatformsRoute
            {...props}
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
