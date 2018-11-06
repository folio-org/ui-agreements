import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  IconButton,
  Layer,
  Pane,
  Paneset,
  PaneMenu,
} from '@folio/stripes/components';

import BasketList from './BasketList';

const ADD_FROM_BASKET_PARAM = 'addFromBasket';

class Basket extends React.Component {
  static manifest = Object.freeze({
    basket: { initialValue: [] },
    query: {},
  });

  static propTypes = {
    container: PropTypes.instanceOf(Element).isRequired,
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
  }

  state = {
    selectedItems: {},
  }

  static getDerivedStateFromProps(props, state) {
    const basket = props.resources.basket || [];
    if (basket.length !== Object.keys(state.selectedItems).length) {
      const selectedItems = {};
      basket.forEach(item => { selectedItems[item.id] = true; });

      return { selectedItems };
    }

    return null;
  }

  handleCloseBasket = () => {
    this.props.mutator.query.update({ basket: undefined });
  }

  handleRemoveItem = (item) => {
    const { mutator, resources } = this.props;

    const basket = resources.basket || [];
    const updatedBasket = basket.filter(i => i.id !== item.id);

    mutator.basket.replace(updatedBasket);
  }

  handleToggleAll = () => {
    const selectedItems = {};

    const someItemsUnselected = Object.values(this.state.selectedItems).includes(false);
    Object.keys(this.state.selectedItems).forEach(key => { selectedItems[key] = someItemsUnselected; });

    this.setState({ selectedItems });
  }

  handleToggleItem = (item) => {
    this.setState(prevState => ({
      selectedItems: {
        ...prevState.selectedItems,
        [item.id]: !(prevState.selectedItems[item.id])
      },
    }));
  }

  renderFirstMenu = () => {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-erm.basket.close">
          {ariaLabel => (
            <IconButton
              icon="closeX"
              onClick={this.handleCloseBasket}
              aria-label={ariaLabel}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  renderCreateAgreementButton = () => {
    const selectedItems = Object.entries(this.state.selectedItems)
      .filter(([_, selected]) => selected)
      .map(([itemId]) => this.props.resources.basket.findIndex(i => i.id === itemId))
      .join(',');

    return (
      <Button
        buttonStyle="primary"
        to={`/erm/agreements?layer=create&${ADD_FROM_BASKET_PARAM}=${selectedItems}`}
      >
        <FormattedMessage id="ui-erm.basket.createAgreement" />
      </Button>
    );
  }

  render() {
    const { container, resources } = this.props;

    const basket = resources.basket || [];
    const query = resources.query;

    return (
      <FormattedMessage id="ui-erm.basket.layerLabel">
        {layerContentLabel => (
          <Layer
            container={container}
            contentLabel={layerContentLabel}
            isOpen={!!query.basket}
          >
            <Paneset>
              <Pane
                defaultWidth="100%"
                firstMenu={this.renderFirstMenu()}
                paneTitle={<FormattedMessage id="ui-erm.basket.name" />}
                paneSub={<FormattedMessage id="ui-erm.basket.recordCount" values={{ count: basket.length }} />}

              >
                <BasketList
                  basket={basket}
                  onToggleAll={this.handleToggleAll}
                  onToggleItem={this.handleToggleItem}
                  removeItem={this.handleRemoveItem}
                  selectedItems={this.state.selectedItems}
                />
                { this.renderCreateAgreementButton() }
              </Pane>
            </Paneset>
          </Layer>
        )}
      </FormattedMessage>
    );
  }
}

export default Basket;
