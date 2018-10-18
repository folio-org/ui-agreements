import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
} from '@folio/stripes/components';

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
      <div style={{ flex: 0 }}>
        <Button
          buttonStyle="primary"
          disabled={basket.length === 0}
          onClick={this.openBasket}
        >
          <FormattedMessage
            id="ui-erm.basketButton"
            values={{ count: basket.length }}
          />
        </Button>
      </div>
    );
  }
}

export default OpenBasketButton;
