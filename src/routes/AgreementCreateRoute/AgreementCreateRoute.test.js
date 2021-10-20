
import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { noop } from 'lodash';
import {
  agreements,
  agreementStatusValues,
  amendmentStatusValues,
  basket,
  contactRoleValues,
  documentCategories,
  externalAgreementLine,
  isPerpetualValues,
  licenseLinkStatusValues,
  orgRoleValues,
  query,
  reasonForClosureValues,
  relationshipTypeValues,
  renewalPriorityValues,
  loadingView
} from './testResources';
import translationsProperties from '../../../test/helpers';
import AgreementCreateRoute from './AgreementCreateRoute';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingView: () => <div>LoadingView</div>,
}));

const data = {
  checkAsyncValidation: () => jest.fn(),
  handlers: {
    onDownloadFile: () => {},
    onUploadFile: () => {}
  },
  history: {
    push: () => jest.fn()
  },
  location: {},
  mutator: {
    agreements: {
      POST: noop
    },
    query: {
      update: noop
    },
  },
  resources: {
    agreements,
    agreementStatusValues,
    amendmentStatusValues,
    basket,
    contactRoleValues,
    documentCategories,
    externalAgreementLine,
    isPerpetualValues,
    licenseLinkStatusValues,
    orgRoleValues,
    query,
    reasonForClosureValues,
    relationshipTypeValues,
    renewalPriorityValues,
  }
};

const isPendingData = {
  checkAsyncValidation: () => jest.fn(),
  handlers: {
    onDownloadFile: () => {},
    onUploadFile: () => {}
  },
  history: {
    push: () => jest.fn()
  },
  location: {},
  mutator: {
    agreements: {
      POST: noop
    },
    query: {
      update: noop
    },
  },
  resources: {
   loadingView,
   agreementStatusValues,
   amendmentStatusValues,
   basket,
   contactRoleValues,
   documentCategories,
   externalAgreementLine,
   isPerpetualValues,
   licenseLinkStatusValues,
   orgRoleValues,
   query,
   reasonForClosureValues,
   relationshipTypeValues,
   renewalPriorityValues,
  }
};

describe('AgreementCreateRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementCreateRoute {...data} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the agreementForm component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('agreements')).toBeInTheDocument();
    });

    describe('re-rendering the route', () => {
      beforeEach(() => {
        renderWithIntl(
          <MemoryRouter>
            <AgreementCreateRoute {...data} />
          </MemoryRouter>,
          translationsProperties,
          renderComponent.rerender
        );
      });

      test('renders the agreementForm component', () => {
        const { getByTestId } = renderComponent;
        expect(getByTestId('agreements')).toBeInTheDocument();
      });
    });
  });

  describe('rendering loading view', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementCreateRoute {...isPendingData} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders loadingView', () => {
      screen.debug();
      const { getByText } = renderComponent;
      expect(getByText('LoadingView')).toBeInTheDocument();
    });
  });

  describe('rendering with no permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementCreateRoute
            {...data}
            stripes={{ hasPerm: () => false }}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('displays the permission error', () => {
      screen.debug();
      const { getByText } = renderComponent;
      expect(getByText('stripes-smart-components.permissionError')).toBeInTheDocument();
    });
  });
});
