
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';

import translationsProperties from '../../../test/helpers';
import AgreementLinesRoute from './AgreementLinesRoute';
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

describe('AgreementLinesRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
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
