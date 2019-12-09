import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  FormattedUTCDate,
  Headline,
  IconButton,
  Pane,
  PaneMenu,
  Paneset,
  Row,
  Selection,
} from '@folio/stripes/components';

import BasketList from '../BasketList';

export default class Basket extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      basket: PropTypes.array.isRequired,
      openAgreements: PropTypes.array.isRequired,
    }).isRequired,
    handlers: PropTypes.shape({
      onAddToNewAgreement: PropTypes.func.isRequired,
      onAddToExistingAgreement: PropTypes.func.isRequired,
      onClose: PropTypes.func.isRequired,
      onRemoveBasketItem: PropTypes.func.isRequired,
    }),
  }

  state = {
    openAgreements: [],
    selectedAgreementId: undefined,
    selectedItems: {},
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    const { data: { basket, openAgreements } } = props;

    // Add all the items in the basket as selected items.
    if (basket.length > Object.keys(state.selectedItems).length) {
      newState.selectedItems = {};
      basket.forEach(item => { newState.selectedItems[item.id] = true; });
    }

    // Make a `dataOptions`-able array of agreements with a `value` key.
    if (openAgreements.length !== state.openAgreements.length) {
      newState.openAgreements = openAgreements.map(a => ({ ...a, value: a.id }));
    }

    return Object.keys(newState).length ? newState : null;
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

  getSelectedItems = () => {
    return Object.entries(this.state.selectedItems)
      .filter(([_, selected]) => selected)
      .map(([itemId]) => this.props.data.basket.findIndex(i => i.id === itemId))
      .join(',');
  }

  renderPaneFirstMenu = () => {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-agreements.basket.close">
          {ariaLabel => (
            <IconButton
              icon="times"
              id="clickable-close-basket"
              onClick={this.props.handlers.onClose}
              aria-label={ariaLabel}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  renderCreateAgreementButton = () => {
    const disabled = Object.values(this.state.selectedItems).find(v => v) === undefined; // None of the `selectedItems` value's are `true`

    return (
      <Button
        buttonStyle="primary"
        data-test-basket-create-agreement
        disabled={disabled}
        onClick={() => {
          this.props.handlers.onAddToNewAgreement(this.getSelectedItems());
        }}
      >
        <FormattedMessage id="ui-agreements.basket.createAgreement" />
      </Button>
    );
  }

  renderAddToAgreementButton = () => {
    const disabled = (
      this.state.selectedAgreementId === undefined ||
      Object.values(this.state.selectedItems).find(v => v) === undefined // None of the `selectedItems` value's are `true`;
    );

    return (
      <div>
        <Button
          buttonStyle="primary"
          data-test-basket-add-to-agreement
          disabled={disabled}
          onClick={() => {
            this.props.handlers.onAddToExistingAgreement(
              this.getSelectedItems(),
              this.state.selectedAgreementId
            );
          }}
        >
          <FormattedMessage id="ui-agreements.basket.addToSelectedAgreement" />
        </Button>
      </div>
    );
  }

  renderAddToAgreementSection = () => {
    if (!this.state.openAgreements.length) return null;

    return (
      <div>
        <FormattedMessage tagName="div" id="ui-agreements.basket.addToExistingAgreement" />
        <Row>
          <Col xs={12} md={8}>
            <FormattedMessage id="ui-agreements.basket.clickToSelectAgreement">
              {placeholder => (
                <Selection
                  id="select-agreement-for-basket"
                  dataOptions={this.state.openAgreements}
                  formatter={({ option }) => (
                    <div
                      data-test-agreement-id={option.id}
                      style={{ textAlign: 'left' }}
                    >
                      <Headline>{option.name}&nbsp;&#40;{option.agreementStatus.label}&#41;</Headline>{/* eslint-disable-line */}
                      <div>
                        <strong><FormattedMessage id="ui-agreements.agreements.startDate" />: </strong><FormattedUTCDate value={option.startDate} /> {/* eslint-disable-line */}
                      </div>
                    </div>
                  )}
                  onChange={(selectedAgreementId) => { this.setState({ selectedAgreementId }); }}
                  onFilter={(searchString, agreements) => {
                    return agreements.filter(agreement => {
                      const lowerCasedSearchString = searchString.toLowerCase();

                      return (
                        agreement.name.toLowerCase().includes(lowerCasedSearchString) ||
                        agreement.agreementStatus.label.toLowerCase().includes(lowerCasedSearchString) ||
                        (agreement.startDate && agreement.startDate.toLowerCase().includes(lowerCasedSearchString))
                      );
                    });
                  }}
                  optionAlignment="start"
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
          </Col>
          <Col xs={12} md={4}>
            { this.renderAddToAgreementButton() }
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { data, handlers } = this.props;

    return (
      <Paneset id="basket-paneset">
        <Pane
          defaultWidth="100%"
          id="basket-pane"
          firstMenu={this.renderPaneFirstMenu()}
          paneTitle={<FormattedMessage id="ui-agreements.basket.name" />}
          paneSub={<FormattedMessage id="ui-agreements.basket.recordCount" values={{ count: data.basket.length }} />}
        >
          <div id="basket-contents">
            <BasketList
              basket={data.basket}
              onToggleAll={this.handleToggleAll}
              onToggleItem={this.handleToggleItem}
              onRemoveItem={handlers.onRemoveBasketItem}
              selectedItems={this.state.selectedItems}
            />
            { this.renderCreateAgreementButton() }
            { this.renderAddToAgreementSection() }
          </div>
        </Pane>
      </Paneset>
    );
  }
}
