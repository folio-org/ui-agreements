import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useLocation, useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { useOkapiKy } from '@folio/stripes/core';

import {
  Button,
  IconButton,
  Layout,
  MessageBanner,
  Pane,
  PaneMenu,
  Paneset,
} from '@folio/stripes/components';

import { AGREEMENT_ENDPOINT } from '../../../constants';

import { urls } from '../../utilities';

import BasketList from '../../BasketList';
import AgreementModal from '../../AgreementModal';
import AgreementSearchButton from '../../AgreementSearchButton';

const propTypes = {
  data: PropTypes.shape({
    basket: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onRemoveBasketItem: PropTypes.func.isRequired,
  }),
};

const Basket = ({
  data: { basket },
  handlers: { onClose, onRemoveBasketItem },
}) => {
  const history = useHistory();
  const location = useLocation();
  const ky = useOkapiKy();
  // State to hold basket items
  const [selectedItems, setSelectedItems] = useState({});
  // State to hide/display agreement create modal
  const [showCreateAgreementModal, setShowCreateAgreementModal] = useState(false);
  const [selectedAgreementId, setSelectedAgreementId] = useState(undefined);

  const { mutateAsync: putAgreement } = useMutation(
    ['ERM', 'Basket', 'addToExistingAgreement', AGREEMENT_ENDPOINT(selectedAgreementId), 'PUT'],
    (data) => ky
      .put(AGREEMENT_ENDPOINT(selectedAgreementId), {
        json: data,
      })
      .json()
      .then(() => {
        history.push(
          `${urls.agreementView(selectedAgreementId)}${location.search}`
        );
      })
  );

  const handleAddToExistingAgreement = async (agreementId, addFromBasket) => {
    const submitValues = {
      items: addFromBasket
        .split(',')
        .map((index) => ({ resource: basket[parseInt(index, 10)] }))
        .filter((line) => line.resource),
    };
    await ky
      .put(AGREEMENT_ENDPOINT(agreementId), {
        json: submitValues,
      });
    await putAgreement(agreementId, submitValues);
  };

  useEffect(() => {
    const newState = {};
    // Add all the items in the basket as selected items.
    if (basket.length > Object.keys(selectedItems).length) {
      newState.selectedItems = {};
      basket.forEach((item) => {
        newState.selectedItems[item.id] = true;
      });
      setSelectedItems(newState.selectedItems);
    }
  }, [basket, selectedItems]);

  const handleToggleAll = () => {
    const selectedItemsObj = {};

    const someItemsUnselected = Object.values(selectedItems).includes(false);
    Object.keys(selectedItems).forEach((key) => {
      selectedItemsObj[key] = someItemsUnselected;
    });

    setSelectedItems(selectedItemsObj);
  };

  const handleToggleItem = (item) => {
    setSelectedItems({
      ...selectedItems,
      [item.id]: !selectedItems[item.id],
    });
  };

  const getSelectedItems = () => {
    return Object.entries(selectedItems)
      .filter(([_, selected]) => selected)
      .map(([itemId]) => basket.findIndex((i) => i.id === itemId))
      .join(',');
  };

  const renderPaneFirstMenu = () => {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-agreements.basket.close">
          {([ariaLabel]) => (
            <IconButton
              aria-label={ariaLabel}
              icon="times"
              id="clickable-close-basket"
              onClick={onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  };

  const renderCreateAgreementButton = () => {
    const disabled = Object.values(selectedItems).find((v) => v) === undefined; // None of the `selectedItems` value's are `true`

    return (
      <Layout className="marginTop1">
        <Button
          buttonStyle="primary"
          data-test-basket-create-agreement
          disabled={disabled}
          onClick={() => {
            setShowCreateAgreementModal(true);
          }}
        >
          <FormattedMessage id="ui-agreements.basket.createAgreement" />
        </Button>
      </Layout>
    );
  };

  const renderAddToAgreementButton = () => {
    const disabled = Object.values(selectedItems).find((v) => v) === undefined; // None of the `selectedItems` value's ;
    return (
      <Layout className="marginTop1">
        <AgreementSearchButton
          buttonStyle="primary"
          disabled={disabled}
          name="agreement"
          onAgreementSelected={(agreement) => {
            setSelectedAgreementId(agreement.id);
            handleAddToExistingAgreement(agreement.id, getSelectedItems());
          }}
        />
      </Layout>
    );
  };

  return (
    <Paneset id="basket-paneset">
      <Pane
        defaultWidth="100%"
        firstMenu={renderPaneFirstMenu()}
        id="basket-pane"
        paneSub={
          <FormattedMessage
            id="ui-agreements.basket.recordCount"
            values={{ count: basket.length }}
          />
        }
        paneTitle={<FormattedMessage id="ui-agreements.basket.name" />}
      >
        <MessageBanner>
          <FormattedMessage id="ui-agreements.basket.messageBanner" />
        </MessageBanner>
        <div id="basket-contents">
          <BasketList
            basket={basket}
            onRemoveItem={onRemoveBasketItem}
            onToggleAll={handleToggleAll}
            onToggleItem={handleToggleItem}
            selectedItems={selectedItems}
          />
          {renderCreateAgreementButton()}
          {renderAddToAgreementButton()}
        </div>
      </Pane>
      <AgreementModal
        hideModal={() => setShowCreateAgreementModal(false)}
        selectedItems={getSelectedItems()}
        showModal={showCreateAgreementModal}
      />
    </Paneset>
  );
};

Basket.propTypes = propTypes;

export default Basket;
