import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';
import { noop } from 'lodash';
import {
  agreement,
  agreementLines,
  agreementStatusValues,
  amendmentStatusValues,
  supplementaryProperties,
  users,
  basket,
  contactRoleValues,
  documentCategories,
  isPerpetualValues,
  licenseLinkStatusValues,
  orderLines,
  orgRoleValues,
  query,
  reasonForClosureValues,
  relationshipTypeValues,
  renewalPriorityValues,
  loadingView
} from './testResources';
import translationsProperties from '../../../test/helpers';
import AgreementEditRoute from './AgreementEditRoute';


const BasketLineButton = (props) => {
  return <Button onClick={props.handlers.onBasketLinesAdded}>BasketLineButton</Button>;
};
const queryUpdateMock = jest.fn();

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingView: () => <div>LoadingView</div>,
}));

jest.mock('../../components/views/AgreementForm', () => {
  return (props) => (
    <div>
      <div>AgreementForm</div>
      <BasketLineButton {...props} />
    </div>
  );
});

const data = {
  checkAsyncValidation: () => jest.fn(),
  handlers: {
    onDownloadFile: () => {},
    onUploadFile: () => {}
  },
  history: {
    push: () => jest.fn()
  },
  location: {
    search :''
  },
  match: {
    params: {}
  },
  mutator: {
    agreement: {
      PUT: noop
    },
    agreements: {
      PUT: noop
    },
    query: {
      update: queryUpdateMock
    },
  },
  resources: {
    agreement,
    agreementLines,
    agreementStatusValues,
    amendmentStatusValues,
    supplementaryProperties,
    users,
    basket,
    contactRoleValues,
    documentCategories,
    isPerpetualValues,
    licenseLinkStatusValues,
    orderLines,
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
  location: {
    search :{}
  },
  match: {
    params: {}
  },
  mutator: {
    agreement: {
      PUT: noop
    },
    agreements: {
      PUT: noop
    },
    query: {
      update: noop
    },
  },
  resources: {
    loadingView,
    agreementLines,
    agreementStatusValues,
    amendmentStatusValues,
    supplementaryProperties,
    users,
    basket,
    contactRoleValues,
    documentCategories,
    isPerpetualValues,
    licenseLinkStatusValues,
    orderLines,
    orgRoleValues,
    query,
    reasonForClosureValues,
    relationshipTypeValues,
    renewalPriorityValues,
  }
};

describe('AgreementEditRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementEditRoute {...data} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the agreementForm component', () => {
        const { getByText } = renderComponent;
        expect(getByText('AgreementForm')).toBeInTheDocument();
      });

      test('calls the BasketLineButton', async () => {
        await ButtonInteractor('BasketLineButton').click();
        expect(queryUpdateMock).toHaveBeenCalled();
      });
  });

  describe('rendering loading view', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementEditRoute {...isPendingData} />
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
          <AgreementEditRoute
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
