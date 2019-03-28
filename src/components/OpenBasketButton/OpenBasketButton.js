import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
} from '@folio/stripes/components';

import IfEResourcesEnabled from '../IfEResourcesEnabled';
import css from './OpenBasketButton.css';

class OpenBasketButton extends React.Component {
  static manifest = Object.freeze({
    basket: {
      initialValue: [],
    },
    query: {},
  });

  static propTypes = {
    mutator: PropTypes.shape({
      basket: PropTypes.object,
      query: PropTypes.object,
    }),
    resources: PropTypes.shape({
      basket: PropTypes.array,
    }),
  }

  openBasket = () => {
    this.props.mutator.query.update({ basket: '1' });
  }

  render() {
    const basket = this.props.resources.basket || [];

    return (
      <IfEResourcesEnabled>
        <Button
          buttonClass={css.button}
          buttonStyle="primary"
          data-test-open-basket-button
          data-test-basket-size={basket.length}
          disabled={basket.length === 0}
          id="open-basket-button"
          onClick={this.openBasket}
        >
          <FormattedMessage
            id="ui-agreements.basketButton"
            values={{ count: basket.length }}
          />
        </Button>
      </IfEResourcesEnabled>
    );
  }
}

export default OpenBasketButton;
