import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
} from '@folio/stripes/components';

class AddToBasketButton extends React.Component {
  static manifest = Object.freeze({
    basket: {
      initialValue: [],
    }
  });

  static propTypes = {
    addLabel: PropTypes.string,
    buttonProps: PropTypes.object,
    removeLabel: PropTypes.string,
    disabled: PropTypes.bool,
    item: PropTypes.shape({
      id: PropTypes.string,
    }),
    mutator: PropTypes.shape({
      basket: PropTypes.shape({
        replace: PropTypes.func,
      }),
    }),
    resources: PropTypes.shape({
      basket: PropTypes.array,
    }),
  }

  static defaultProps = {
    addLabel: 'Add to basket',
    buttonProps: {},
    removeLabel: 'Remove from basket',
  }

  state = {
    itemExistsInBasket: false,
    basketSize: undefined, // eslint-disable-line react/no-unused-state
  }

  static getDerivedStateFromProps(props, state) {
    const basket = props.resources.basket || [];
    if (basket.length !== state.basketSize) {
      const item = basket.find(i => i.id === props.item.id);
      return {
        itemExistsInBasket: item !== undefined,
        basketSize: basket.length,
      };
    }

    return null;
  }

  addToBasket = () => {
    const { item, mutator, resources } = this.props;

    const basket = [...resources.basket];
    basket.push(item);

    mutator.basket.replace(basket);
  }

  removeFromBasket = () => {
    const { item, mutator, resources } = this.props;

    const basket = resources.basket || [];
    const updatedBasket = basket.filter(i => i.id !== item.id);

    mutator.basket.replace(updatedBasket);
  }

  render() {
    const { itemExistsInBasket } = this.state;
    const { addLabel, buttonProps, disabled, item, removeLabel } = this.props;

    return (
      <Button
        {...buttonProps}
        buttonStyle={itemExistsInBasket ? 'default' : 'primary'}
        data-test-basket-add-button={itemExistsInBasket ? undefined : true}
        data-test-basket-remove-button={itemExistsInBasket ? true : undefined}
        data-test-entitlement-option-id={item.id}
        disabled={disabled}
        onClick={itemExistsInBasket ? this.removeFromBasket : this.addToBasket}
      >
        {itemExistsInBasket ? removeLabel : addLabel}
      </Button>
    );
  }
}

export default AddToBasketButton;
