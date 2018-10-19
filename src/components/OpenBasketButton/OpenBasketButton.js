import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
} from '@folio/stripes/components';

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
      <Button
        buttonClass={css.button}
        buttonStyle="primary"
        disabled={basket.length === 0}
        onClick={this.openBasket}
      >
        <FormattedMessage
          id="ui-erm.basketButton"
          values={{ count: basket.length }}
        />
      </Button>
    );
  }
}

export default OpenBasketButton;
