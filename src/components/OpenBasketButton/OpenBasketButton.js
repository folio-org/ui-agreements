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
    }
  });

  static propTypes = {
    resources: PropTypes.shape({
      basket: PropTypes.array,
    }),
  }

  render() {
    const basket = this.props.resources.basket || [];

    return (
      <div style={{ flex: 0 }}>
        <Button buttonStyle="primary" disabled={basket.length === 0}>
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
