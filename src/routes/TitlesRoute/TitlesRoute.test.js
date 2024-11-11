import { useQuery } from 'react-query';
import { useStripes } from '@folio/stripes/core';

import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { noop } from 'lodash';
import titles from './testResources';
import translationsProperties from '../../../test/helpers';
import TitlesRoute from './TitlesRoute';

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
  resources: { titles }
};

useQuery.mockImplementation(() => ({
  data: [],
  isLoading: false
}));

describe('TitlesRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <TitlesRoute {...routeProps} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the titles component', () => {
      const { getAllByTestId } = renderComponent;
      const titlesElements = getAllByTestId('titles');
      expect(titlesElements.length).toBeGreaterThan(0);
    });

    // TODO we should actually be _properly_ testing the useEffect, see AgreementsRoute example
    // using memory router to render with props which force it to call history.push mock and measuring that mock output

    /* describe('re-rendering the route', () => { // makes sure that we hit the componentDidUpdate block
      beforeEach(() => {
        renderWithIntl(
          <MemoryRouter>
            <TitlesRoute {...routeProps} />
          </MemoryRouter>,
          translationsProperties,
          renderComponent.rerender
        );
      });

      test('renders the titles component', () => {
        const { getAllByTestId } = renderComponent;
        const titlesElements = getAllByTestId('titles');
        expect(titlesElements.length).toBeGreaterThan(0);
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
          <TitlesRoute
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
