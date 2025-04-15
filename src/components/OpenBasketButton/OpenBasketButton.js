import { useHistory, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';

import { urls } from '../utilities';
import css from './OpenBasketButton.css';
import { useBasket } from '../../hooks';

const OpenBasketButton = () => {
  const history = useHistory();
  const location = useLocation();
  const handleClick = () => {
    /* Quick FIX for ERM-3673; add from state to history */
    history.push(`${urls.basket()}${location.search}`, { from: location.pathname });
  };

  const { basket } = useBasket();

  return (
    <Button
      buttonClass={css.button}
      buttonStyle="primary"
      data-test-basket-size={basket.length}
      data-test-open-basket-button
      disabled={basket.length === 0}
      id="open-basket-button"
      onClick={handleClick}
    >
      <FormattedMessage
        id="ui-agreements.basketButton"
        values={{ count: basket.length }}
      />
    </Button>
  );
};

export default OpenBasketButton;
