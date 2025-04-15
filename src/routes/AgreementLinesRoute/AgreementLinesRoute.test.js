
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter, useLocation } from 'react-router-dom';

import translationsProperties from '../../../test/helpers';
import AgreementLinesRoute from './AgreementLinesRoute';
import mockRefdata from '../../../test/jest/refdata';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAgreementsSettings: jest.fn(() => ({ data: { configs: [{}] } })),
  useAgreementsRefdata: () => mockRefdata,
}));

// TODO really? Why are we having to pass these in again. This is kinda gross.
// Maybe we need a TestRouteWrapper which uses MemoryRouter and PROPERLY hands down this stuff for testing
useLocation.mockImplementation(() => {
  const { useLocation: actualUseLocation } = jest.requireActual('react-router-dom');
  return actualUseLocation();
});
const routeProps = {
  history: {
    push: () => jest.fn()
  },
  location: {},
  match: {
    params: {},
  },
};

// TODO we really should be mocking the rendered view component to avoid having to do anything special for child components
describe('AgreementLinesRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter initialEntries={['/erm/agreementLines']}>
          <AgreementLinesRoute {...routeProps} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the agreementLines component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('agreementLines')).toBeInTheDocument();
    });

    // TODO we should actually be _properly_ testing the useEffect, see AgreementsRoute example
    // using memory router to render with props which force it to call history.push mock and measuring that mock output

    /* describe('re-rendering the route', () => { // makes sure that we hit the componentDidUpdate block
      beforeEach(() => {
        renderWithIntl(
          <MemoryRouter>
            <AgreementLinesRoute {...routeProps} />
          </MemoryRouter>,
          translationsProperties,
          renderComponent.rerender
        );
      });

      test('renders the agreementLines component', () => {
        const { getAllByTestId } = renderComponent;
        const agreementLinesElements = getAllByTestId('agreementLines');
        expect(agreementLinesElements.length).toBeGreaterThan(0);
      });
    }); */
  });
});
