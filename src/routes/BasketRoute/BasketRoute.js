import PropTypes from 'prop-types';

import { useBasket } from '../../hooks';

import View from '../../components/views/Basket';

const BasketRoute = ({ history }) => {
  const { basket, removeFromBasket } = useBasket();

  console.log('BasketRoute', basket);
  const handleClose = () => {
    history.goBack();
  };

  return (
    <View
      data={{
        basket,
      }}
      handlers={{
        onClose: handleClose,
        onRemoveBasketItem: removeFromBasket,
      }}
    />
  );
};

BasketRoute.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default BasketRoute;
