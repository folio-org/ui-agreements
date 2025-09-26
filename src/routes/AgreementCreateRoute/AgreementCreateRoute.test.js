import PropTypes from 'prop-types';


import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes, CalloutContext } from '@folio/stripes/core';

import { Button as ButtonInteractor, renderWithIntl } from '@folio/stripes-erm-testing';
import { Button } from '@folio/stripes/components';
import { MemoryRouter } from 'react-router-dom';

import basket from './testResources';

import { useAddFromBasket } from '../../hooks';

import translationsProperties from '../../../test/helpers';
import mockRefdata from '../../../test/jest/refdata';
import AgreementCreateRoute from './AgreementCreateRoute';


const mockBasketLinesAdded = jest.fn();
const mockSendCallout = jest.fn();

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAddFromBasket: jest.fn(() => ({
    isExternalEntitlementLoading: false,
    getAgreementLinesToAdd: () => [],
    handleBasketLinesAdded: mockBasketLinesAdded
  })),
  useAgreementsRefdata: () => mockRefdata,
}));

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
  history: {
    push: historyPushMock
  },
  location: {
    search: '',
    pathname: ''
  },
  resources: {
    basket,
  }
};

describe('AgreementCreateRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <CalloutContext.Provider value={{ sendCallout: mockSendCallout }}>
            <AgreementCreateRoute {...data} />
          </CalloutContext.Provider>
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

    test('calls the BasketLineButton', async () => {
      await waitFor(async () => {
        await ButtonInteractor('BasketLineButton').click();
      });
      await waitFor(async () => {
        expect(mockBasketLinesAdded).toHaveBeenCalled();
      });
    });

    // we check if the button is clicked it calls the historyPushMock(push) function to invoke the child callback (handleClose) defined in Route
    test('calls the CloseButton', async () => {
      await waitFor(async () => {
        await ButtonInteractor('CloseButton').click();
      });

      await waitFor(async () => {
        expect(historyPushMock).toHaveBeenCalled();
      });
    });

    // test('sends a callout when save and close is clicked', async () => {
    //   await waitFor(async () => {
    //     await ButtonInteractor('CloseButton').click();
    //   });
    //   await waitFor(() => {
    //     expect(mockSendCallout).toHaveBeenCalled();
    //   });
    // });
  });

  describe('rendering loading view', () => {
    let renderComponent;
    beforeEach(() => {
      useAddFromBasket.mockImplementationOnce(() => ({
        ...useAddFromBasket(),
        isExternalEntitlementLoading: true
      }));
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementCreateRoute {...data} />
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
      const { hasPerm } = useStripes();
      hasPerm.mockImplementation(() => false);
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementCreateRoute
            {...data}
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
