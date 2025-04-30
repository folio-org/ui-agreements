
import { useQuery } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { renderWithIntl } from '@folio/stripes-erm-testing';
import { useStripes } from '@folio/stripes/core';


import translationsProperties from '../../../test/helpers';
import AgreementsRoute from './AgreementsRoute';
import mockRefdata from '../../../test/jest/refdata';


jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAgreementsDisplaySettings: jest.fn(() => ({ data: { configs: [{}] } })),
  useAgreementsRefdata: () => mockRefdata,
}));

jest.mock('../../components/views/Agreements', () => () => <div>Agreements view component</div>);


const mockPush = jest.fn();
const routeProps = {
  history: {
    push: mockPush
  },
  location: {
    search: '?thisIsAFakeSearch'
  },
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
      const { getByText } = renderComponent;
      expect(getByText('Agreements view component')).toBeInTheDocument();
    });


    // TODO also test with multiple agreements
    test('did not redirect to view pane', () => {
      expect(mockPush.mock.calls.length).toBe(0);
    });
  });

  // EXAMPLE testing redirect in a route Test
  describe('rendering the route with single agreement', () => {
    beforeEach(() => {
      mockPush.mockClear();
      useQuery.mockImplementation(() => ({
        data: { results: [{ title: 'fakeAgreement', id: 'fakeId' }], totalRecords: 1 }
      }));

      renderWithIntl(
        <MemoryRouter>
          <AgreementsRoute {...routeProps} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('redirected to view pane', () => {
      expect(mockPush.mock.calls[0][0]).toEqual('/erm/agreements/fakeId?thisIsAFakeSearch');
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
