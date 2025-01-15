import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useLocation, useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { useOkapiKy } from '@folio/stripes/core';

import {
  Button,
  Col,
  IconButton,
  Layout,
  MessageBanner,
  Pane,
  PaneMenu,
  Paneset,
  Row,
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

  // As things stand, if this gets filled, we IMMEDIATELY trigger a PUT and redirect etc
  const [selectedAgreement, setSelectedAgreement] = useState();

  const { mutateAsync: putAgreement } = useMutation(
    ['ERM', 'Basket', 'addToExistingAgreement', AGREEMENT_ENDPOINT(selectedAgreement?.id), 'PUT'],
    (data) => {
      return ky
        .put(AGREEMENT_ENDPOINT(selectedAgreement?.id), {
          json: data,
        })
        .json()
        .then(() => {
          history.push(
            `${urls.agreementView(selectedAgreement?.id)}${location.search}`
          );
        });
    }
  );

  const handleAddToExistingAgreement = useCallback(async (addFromBasket) => {
    const submitValues = {
      items: addFromBasket
        .split(',')
        .map((index) => ({ resource: basket[parseInt(index, 10)] }))
        .filter((line) => line.resource),
    };

    await putAgreement(submitValues);
  }, [basket, putAgreement]);

  const getSelectedItems = useCallback(() => {
    return Object.entries(selectedItems)
      .filter(([_, selected]) => selected)
      .map(([itemId]) => basket.findIndex((i) => i.id === itemId))
      .join(',');
  }, [basket, selectedItems]);

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


    /* If an agreement gets selected, fire a PUT
      (triggering close/view agreement etc etc)
      If we wish to add confirmation at some point
      this will need changing
     */
    if (selectedAgreement) {
      handleAddToExistingAgreement(getSelectedItems());
      // Unset while we wait for push... what if PUT fails?
      setSelectedAgreement();
    }
  }, [basket, getSelectedItems, handleAddToExistingAgreement, putAgreement, selectedAgreement, selectedItems]);

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
      <Button
        buttonStyle="primary"
        data-test-basket-create-agreement
        disabled={disabled}
        marginBottom0
        onClick={() => {
          setShowCreateAgreementModal(true);
        }}
      >
        <FormattedMessage id="ui-agreements.basket.createAgreement" />
      </Button>
    );
  };

  const renderAddToAgreementButton = () => {
    const disabled = Object.values(selectedItems).find((v) => v) === undefined; // None of the `selectedItems` value's ;
    return (
      <AgreementSearchButton
        buttonProps={{ buttonStyle: 'primary' }}
        disabled={disabled}
        name="agreement"
        onAgreementSelected={(agreement) => {
          setSelectedAgreement(agreement);
        }}
      />
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
          <Layout className="marginTop1">
            <Row>
              <Col xs={3}>
                {renderAddToAgreementButton()}
              </Col>
              <Col xs={3}>
                {renderCreateAgreementButton()}
              </Col>
            </Row>
          </Layout>
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
