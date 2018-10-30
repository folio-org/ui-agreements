import React from 'react';
import PropTypes from 'prop-types';

import BasketSelectorDisplay from './BasketSelectorDisplay';

class BasketSelectorContainer extends React.Component {
  static manifest = Object.freeze({
    basket: { initialValue: [] },
  });

  static propTypes = {
    resources: PropTypes.shape({
      basket: PropTypes.array,
    }),
  }

  render() {
    const { resources, ...rest } = this.props;

    const basket = resources.basket || [];

    return <BasketSelectorDisplay basket={basket} {...rest} />;
  }
}

export default BasketSelectorContainer;
