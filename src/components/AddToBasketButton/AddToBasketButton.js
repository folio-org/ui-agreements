import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { get, uniqueId } from 'lodash';

import { Button, Tooltip } from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import { useBasket } from '../../hooks';

const AddToBasketButton = ({
  addButtonTooltipText = '',
  addLabel = 'Add to basket',
  buttonProps = {},
  disabled,
  item,
  removeButtonTooltipText = '',
  removeLabel = 'Remove from basket',
}) => {
  const [itemExistsInBasket, setItemExistsInBasket] = useState(false);

  /*
   * The difference between basketStore and basket is that basket is an array,
   * basketStore is an object indexed by the item id, making for easier
   * existence checking.
   */
  const {
    basketStore,
    addToBasket,
    removeFromBasket
  } = useBasket();

  useEffect(() => {
    if (basketStore[item.id] && !itemExistsInBasket) {
      setItemExistsInBasket(true);
    } else if (!basketStore[item.id] && itemExistsInBasket) {
      setItemExistsInBasket(false);
    }
  }, [
    basketStore,
    item.id,
    itemExistsInBasket
  ]);

  const coverage = JSON.stringify(get(item, '_object.coverage[0]', {}));

  const onClick = useCallback(() => {
    if (itemExistsInBasket) {
      removeFromBasket(item);
    } else {
      addToBasket(item);
    }
  }, [addToBasket, item, itemExistsInBasket, removeFromBasket]);

  const baseProps = {
    'buttonStyle': itemExistsInBasket ? 'default' : 'primary',
    'data-test-basket-add-button': itemExistsInBasket ? undefined : true,
    'data-test-basket-remove-button': itemExistsInBasket ? true : undefined,
    'data-test-coverage-details': coverage,
    'data-test-entitlement-option-id': item.id,
    disabled,
    'onClick': onClick,
    'data-testid': 'addtobasketbutton'
  };

  const button = addButtonTooltipText ?
    (
      <Tooltip
        id={uniqueId('addtobasketbutton')}
        text={itemExistsInBasket ? removeButtonTooltipText : addButtonTooltipText}
      >
        {({ ref, ariaIds }) => (
          <Button
            {...baseProps}
            {...buttonProps}
            ref={ref}
            aria-labelledby={ariaIds.text}
          >
            {itemExistsInBasket ? removeLabel : addLabel}
          </Button>
        )}
      </Tooltip>
    ) : (
      <Button
        {...baseProps}
        {...buttonProps}
      >
        {itemExistsInBasket ? removeLabel : addLabel}
      </Button>
    );

  return (
    <IfPermission perm="ui-agreements.agreements.edit">
      {button}
    </IfPermission>
  );
};

AddToBasketButton.propTypes = {
  addButtonTooltipText: PropTypes.node,
  addLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  buttonProps: PropTypes.object,
  removeLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  disabled: PropTypes.bool,
  item: PropTypes.shape({
    id: PropTypes.string,
  }),
  removeButtonTooltipText: PropTypes.node,
};

export default AddToBasketButton;
