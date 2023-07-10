
import PropTypes from 'prop-types';

import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';
import translationsProperties from '../../../test/helpers';
import BasketRoute from './BasketRoute';

const mockRemoveFromBasket = jest.fn();
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useBasket: () => ({
    basket: [],
    removeFromBasket: mockRemoveFromBasket
  })
}));

const AddToExistingAgreementButton = (props) => {
  return <Button onClick={props.handlers.onAddToExistingAgreement}>AddToExistingAgreementButton</Button>;
};

AddToExistingAgreementButton.propTypes = {
  handlers: PropTypes.shape({
    onAddToExistingAgreement: PropTypes.func,
  }),
};

const AddToNewAgreementButton = (props) => {
  return <Button onClick={props.handlers.onAddToNewAgreement}>AddToNewAgreementButton</Button>;
};

AddToNewAgreementButton.propTypes = {
  handlers: PropTypes.shape({
    onAddToNewAgreement: PropTypes.func,
  }),
};

const CloseButton = (props) => {
  return <Button onClick={props.handlers.onClose}>CloseButton</Button>;
};

CloseButton.propTypes = {
  handlers: PropTypes.shape({
    onClose: PropTypes.func,
  }),
};

const RemoveBasketItemButton = (props) => {
  return <Button onClick={props.handlers.onRemoveBasketItem}>RemoveBasketItemButton</Button>;
};

RemoveBasketItemButton.propTypes = {
  handlers: PropTypes.shape({
    onRemoveBasketItem: PropTypes.func,
  }),
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

const basketRouteProps = {
  history: {
    push: historyPushMock,
    goBack: historyGoBackMock,
  },
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

    test('renders the AddToNewAgreementButton component', () => {
      const { getByText } = renderComponent;
      expect(getByText('AddToNewAgreementButton')).toBeInTheDocument();
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
      expect(mockRemoveFromBasket).toHaveBeenCalled();
    });
  });
});
