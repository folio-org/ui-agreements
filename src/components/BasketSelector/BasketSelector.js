import React from 'react';
import PropTypes from 'prop-types';

import BasketSelectorContainer from './BasketSelectorContainer';

class BasketSelector extends React.Component {
  static propTypes = {
    addButtonLabel: PropTypes.string,
    onAdd: PropTypes.func,
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    }),
  }

  constructor(props) {
    super(props);

    this.connectedBasketSelectorContainer = props.stripes.connect(BasketSelectorContainer);
  }

  render() {
    return <this.connectedBasketSelectorContainer {...this.props} />;
  }
}

export default BasketSelector;
