import React from 'react';
import PropTypes from 'prop-types';

import {
  IconButton,
  Layer,
  Pane,
  Paneset,
  PaneMenu,
} from '@folio/stripes/components';

class Basket extends React.Component {
  static manifest = Object.freeze({
    basket: { initialValue: [] },
    query: {},
  });

  static propTypes = {
    mutator: PropTypes.shape({
      basket: PropTypes.shape({
        replace: PropTypes.func,
      }),
      query: PropTypes.shape({
        update: PropTypes.func,
      }),
    }),
    resources: PropTypes.shape({
      basket: PropTypes.array,
      query: PropTypes.object,
    }),
    stripes: PropTypes.object,
  }

  closeBasket = () => {
    this.props.mutator.query.update({ basket: undefined });
  }

  renderFirstMenu = () => {
    return (
      <PaneMenu>
        <IconButton
          icon="closeX"
          onClick={this.closeBasket}
          aria-label={this.props.stripes.intl.formatMessage({ id: 'ui-erm.basket.close' })}
        />
      </PaneMenu>
    );
  }

  render() {
    const basket = this.props.resources.basket || [];
    const query = this.props.resources.query;

    return (
      <Layer isOpen={query.basket}>
        <Paneset>
          <Pane
            defaultWidth="100%"
            firstMenu={this.renderFirstMenu()}
          >
            <ul>
              {
                basket.map(item => (
                  <li key={item.id}>{item.name}</li>
                ))
              }
            </ul>
          </Pane>
        </Paneset>
      </Layer>
    )
  }
}

export default Basket;
