
import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { mockErmComponents, renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';

import translationsProperties from '../../../test/helpers';
import AgreementLinesRoute from './AgreementLinesRoute';
import mockRefdata from '../../../test/jest/refdata';

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  ...mockErmComponents
}));

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

    describe('re-rendering the route', () => { // makes sure that we hit the componentDidUpdate block
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
        const { getByTestId } = renderComponent;
        expect(getByTestId('agreementLines')).toBeInTheDocument();
      });
    });
  });
});
