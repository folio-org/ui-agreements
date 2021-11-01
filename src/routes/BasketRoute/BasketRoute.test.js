
import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';
import translationsProperties from '../../../test/helpers';
import BasketRoute from './BasketRoute';
import resources from './testResources';

const AddToExistingAgreementButton = (props) => {
  // eslint-disable-next-line react/prop-types
  return <Button onClick={props.handlers.onAddToExistingAgreement}>AddToExistingAgreementButton</Button>;
};

const AddToNewAgreementButton = (props) => {
  // eslint-disable-next-line react/prop-types
  return <Button onClick={props.handlers.onAddToNewAgreement}>AddToNewAgreementButton</Button>;
};

const CloseButton = (props) => {
  // eslint-disable-next-line react/prop-types
  return <Button onClick={props.handlers.onClose}>CloseButton</Button>;
};

const RemoveBasketItemButton = (props) => {
  // eslint-disable-next-line react/prop-types
  return <Button onClick={props.handlers.onRemoveBasketItem}>RemoveBasketItemButton</Button>;
};

jest.mock('../../components/views/Basket', () => {
  return (props) => (
    <div>
      <div>Basket</div>
      <AddToExistingAgreementButton {...props} />
      <AddToNewAgreementButton {...props} />
      <CloseButton {...props} />
      <RemoveBasketItemButton {...props} />
    </div>
  );
});

// mock callbacks
const historyPushMock = jest.fn();
const historyGoBackMock = jest.fn();
const mutatorBasketReplace = jest.fn();

const basketRouteProps = {
  history: {
    push: historyPushMock,
    goBack: historyGoBackMock,
  },
  mutator: {
    basket: {
      replace: mutatorBasketReplace,
    },
    openAgreements: {},
  },
  resources: { resources }
};

describe('BasketRoute', () => {
  describe('rendering the basket route', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <BasketRoute {...basketRouteProps} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the Basket component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Basket')).toBeInTheDocument();
    });

    test('renders the AddToExistingAgreementButton component', () => {
      const { getByText } = renderComponent;
      expect(getByText('AddToExistingAgreementButton')).toBeInTheDocument();
    });

    test('calls the AddToExistingAgreementButton', async () => {
      await ButtonInteractor('AddToExistingAgreementButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('renders the AddToNewAgreementButton component', () => {
      const { getByText } = renderComponent;
      expect(getByText('AddToNewAgreementButton')).toBeInTheDocument();
    });

    test('calls the AddToNewAgreementButton', async () => {
      await ButtonInteractor('AddToNewAgreementButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('renders the CloseButton component', () => {
      const { getByText } = renderComponent;
      expect(getByText('CloseButton')).toBeInTheDocument();
    });

    test('calls the CloseButton', async () => {
      await ButtonInteractor('CloseButton').click();
      expect(historyGoBackMock).toHaveBeenCalled();
    });

    test('renders the RemoveBasketItemButton component', () => {
      const { getByText } = renderComponent;
      expect(getByText('RemoveBasketItemButton')).toBeInTheDocument();
    });

    test('calls the RemoveBasketItemButton', async () => {
      await ButtonInteractor('RemoveBasketItemButton').click();
      expect(mutatorBasketReplace).toHaveBeenCalled();
    });
  });
});
