import React from 'react';
import PropTypes from 'prop-types';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';
import { noop } from 'lodash';
import translationsProperties from '../../../test/helpers';
import AgreementEditRoute from './AgreementEditRoute';
import {
    okapi,
    match,
    location,
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

const BasketLineButton = (props) => {
  return <Button onClick={props.handlers.onBasketLinesAdded}>BasketLineButton</Button>;
};

const CloseButton = (props) => {
  return <Button onClick={props.handlers.onClose}>CloseButton</Button>;
};

BasketLineButton.propTypes = {
  handlers: PropTypes.shape({
    onBasketLinesAdded: PropTypes.func,
  }),
};

CloseButton.propTypes = {
  handlers: PropTypes.shape({
    onClose: PropTypes.func,
  }),
};


const queryUpdateMock = jest.fn();
const historyPushMock = jest.fn();
const onSubmitMock = jest.fn();

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingView: () => <div>LoadingView</div>,
}));

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
    onDownloadFile: () => {},
    onUploadFile: () => {}
  },
  history: {
    push: historyPushMock
  },
  location,
  match,
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
  okapi,
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
          <AgreementEditRoute {...data} onSubmit={onSubmitMock} />
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
      expect(getByText('Sorry - your permissions do not allow access to this page.')).toBeInTheDocument();
    });
  });
});
