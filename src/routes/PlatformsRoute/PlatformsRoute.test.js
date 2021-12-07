import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import platforms from './platforms';
import translationsProperties from '../../../test/helpers';
import PlatformsRoute from './PlatformsRoute';

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
  mutator: {
    platforms: {
      DELETE: () => {},
      PUT: () => {},
      POST: () => {},
      cancel: () => {},
    },
    query: {
      update: () => {},
      replace: () => {},
    },
    resultCount: {
      update: () => {},
      replace: () => {},
    }
  },
  resources: {
    platforms
  }
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
      const { getByTestId } = renderComponent;
      expect(getByTestId('platforms')).toBeInTheDocument();
    });

    describe('re-rendering the route', () => { // makes sure that we hit the componentDidUpdate block
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
        const { getByTestId } = renderComponent;
        expect(getByTestId('platforms')).toBeInTheDocument();
      });
    });
  });

  describe('rendering with no permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <PlatformsRoute
            {...props}
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
