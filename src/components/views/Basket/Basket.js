import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useLocation, useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { useOkapiKy } from '@folio/stripes/core';

import {
  Button,
  Col,
  FormattedUTCDate,
  Headline,
  IconButton,
  Layout,
  MessageBanner,
  Pane,
  PaneMenu,
  Paneset,
  Selection,
} from '@folio/stripes/components';

import { AGREEMENT_ENDPOINT } from '../../../constants';

import { urls } from '../../utilities';

import BasketList from '../../BasketList';
import AgreementModal from '../../AgreementModal';

const propTypes = {
  data: PropTypes.shape({
    basket: PropTypes.arrayOf(PropTypes.object).isRequired,
    openAgreements: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onRemoveBasketItem: PropTypes.func.isRequired,
  }),
};

const Basket = ({
  data: { basket, openAgreements },
  handlers: { onClose, onRemoveBasketItem },
}) => {
  const history = useHistory();
  const location = useLocation();
  const ky = useOkapiKy();
  const [openAgreementsState, setOpenAgreementsState] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAgreementId, setSelectedAgreementId] = useState(undefined);
  const [selectedItems, setSelectedItems] = useState({});

  const { mutateAsync: putAgreement } = useMutation(
    [
      AGREEMENT_ENDPOINT(selectedAgreementId),
      'ui-agreements',
      'Basket',
      'putAgreement',
    ],
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

  const handleAddToExistingAgreement = async (addFromBasket) => {
    const submitValues = {
      items: addFromBasket
        .split(',')
        .map((index) => ({ resource: basket[parseInt(index, 10)] }))
        .filter((line) => line.resource),
    };
    await putAgreement(submitValues);
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

    // Make a `dataOptions`-able array of agreements with a `value` key.
    if (openAgreements.length !== openAgreementsState.length) {
      newState.openAgreements = openAgreements.map((a) => ({
        ...a,
        value: a.id,
      }));
      setOpenAgreementsState(newState.openAgreements);
    }
  }, [basket, selectedItems, openAgreements, openAgreementsState.length]);

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
            setShowModal(true);
          }}
        >
          <FormattedMessage id="ui-agreements.basket.createAgreement" />
        </Button>
      </Layout>
    );
  };

  const renderAddToAgreementButton = () => {
    const disabled =
      selectedAgreementId === undefined ||
      Object.values(selectedItems).find((v) => v) === undefined; // None of the `selectedItems` value's are `true`;

    return (
      <div>
        <Layout className="marginTop1">
          <Button
            buttonStyle="primary"
            data-test-basket-add-to-agreement
            disabled={disabled}
            onClick={async () => {
              await handleAddToExistingAgreement(getSelectedItems());
            }}
          >
            <FormattedMessage id="ui-agreements.basket.addToSelectedAgreement" />
          </Button>
        </Layout>
      </div>
    );
  };

  const renderAddToAgreementSection = () => {
    if (!openAgreementsState.length) return null;

    return (
      <div>
        <Layout className="marginTop1">
          <Headline margin="small" tag="h4">
            <FormattedMessage
              id="ui-agreements.basket.existingAgreements"
              tagName="div"
            />
          </Headline>
        </Layout>
        <Col md={8} xs={12}>
          <Selection
            dataOptions={openAgreementsState}
            formatter={({ option }) => {
              if (!option) {
                return null;
              }
              return (
                <div
                  data-test-agreement-id={option.id}
                  style={{ textAlign: 'left' }}
                >
                  <Headline>
                    {option.name}&nbsp;&#40;{option.agreementStatus.label}&#41;
                  </Headline>
                  {/* eslint-disable-line */}
                  <div>
                    <strong>
                      <FormattedMessage id="ui-agreements.agreements.startDate" />
                      :{' '}
                    </strong>
                    <FormattedUTCDate value={option.startDate} />{' '}
                    {/* eslint-disable-line */}
                  </div>
                </div>
              );
            }}
            id="select-agreement-for-basket"
            onChange={(id) => {
              setSelectedAgreementId(id);
            }}
            onFilter={(searchString, agreements) => {
              return agreements.filter((agreement) => {
                const lowerCasedSearchString = searchString.toLowerCase();

                return (
                  agreement.name
                    .toLowerCase()
                    .includes(lowerCasedSearchString) ||
                  agreement.agreementStatus.label
                    .toLowerCase()
                    .includes(lowerCasedSearchString) ||
                  !!agreement.startDate
                    ?.toLowerCase()
                    ?.includes(lowerCasedSearchString)
                );
              });
            }}
            optionAlignment="start"
            placeholder=" "
          />
        </Col>
        {renderAddToAgreementButton()}
      </div>
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
          {renderAddToAgreementSection()}
        </div>
      </Pane>
      <AgreementModal
        hideModal={() => setShowModal(false)}
        selectedItems={getSelectedItems()}
        showModal={showModal}
      />
    </Paneset>
  );
};

Basket.propTypes = propTypes;

export default Basket;
