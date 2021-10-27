/* eslint-disable react/prop-types */

import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { noop } from 'lodash';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';

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

const BasketLineButton = (props) => {
  return <Button onClick={props.handlers.onBasketLinesAdded}>BasketLineButton</Button>;
};

const CloseButton = (props) => {
  return <Button onClick={props.handlers.onClose}>CloseButton</Button>;
};

const queryUpdateMock = jest.fn();
const historyPushMock = jest.fn();

jest.mock('../../components/views/AgreementForm', () => {
  return (props) => (
    <div>
      <div>AgreementForm</div>
      <BasketLineButton {...props} />
      <CloseButton {...props} />
    </div>
  );
});

const data = {
  checkAsyncValidation: () => jest.fn(),
  handlers: {
    onDownloadFile: () => { },
    onUploadFile: () => { },
  },
  history: {
    push: historyPushMock
  },
  location: {
    search: ''
  },
  mutator: {
    agreements: {
      POST: noop
    },
    query: {
      update: queryUpdateMock
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
    onDownloadFile: () => { },
    onUploadFile: () => { }
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
    basket,
    contactRoleValues,
    documentCategories,
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
      const { getByText } = renderComponent;
      expect(getByText('AgreementForm')).toBeInTheDocument();
    });

    test('renders the BasketLineButton component', () => {
      const { getByText } = renderComponent;
      expect(getByText('BasketLineButton')).toBeInTheDocument();
    });

    // we check if the button is clicked it calls the queryUpdateMock(update) function to invoke the child callback (handleBasketLinesAdded) defined in Route
    test('calls the BasketLineButton', async () => {
      await ButtonInteractor('BasketLineButton').click();
      expect(queryUpdateMock).toHaveBeenCalled();
    });

    // we check if the button is clicked it calls the historyPushMock(push) function to invoke the child callback (handleClose) defined in Route
    test('calls the CloseButton', async () => {
      await ButtonInteractor('CloseButton').click();
      expect(historyPushMock).toHaveBeenCalled();
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
      const { getByText } = renderComponent;
      expect(getByText('stripes-smart-components.permissionError')).toBeInTheDocument();
    });
  });
});
