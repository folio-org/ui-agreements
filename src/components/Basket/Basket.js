import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';

import {
  AutoSuggest,
  Button,
  Col,
  Headline,
  IconButton,
  Layer,
  Pane,
  Paneset,
  PaneMenu,
  Row,
} from '@folio/stripes/components';

import BasketList from './BasketList';

const ADD_FROM_BASKET_PARAM = 'addFromBasket';

class Basket extends React.Component {
  static manifest = Object.freeze({
    openAgreements: {
      type: 'okapi',
      path: 'erm/sas',
      perRequest: 100,
      limitParam: 'perPage',
      params: {
        filters: [
          'agreementStatus.value==active',
          'agreementStatus.value==draft',
          'agreementStatus.value==in_negotiation',
          'agreementStatus.value==requested',
        ].join('||')
      }
    },
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
      openAgreements: PropTypes.object,
      query: PropTypes.object,
    }),
  }

  state = {
    selectedItems: {},
    selectedAgreement: undefined,
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

  constructAddToBasketParam = () => {
    const selectedItems = Object.entries(this.state.selectedItems)
      .filter(([_, selected]) => selected)
      .map(([itemId]) => this.props.resources.basket.findIndex(i => i.id === itemId))
      .join(',');

    return `${ADD_FROM_BASKET_PARAM}=${selectedItems}`;
  }

  renderFirstMenu = () => {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-agreements.basket.close">
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
    const disabled = Object.values(this.state.selectedItems).find(v => v) === undefined; // None of the `selectedItems` value's are `true`

    return (
      <Button
        buttonStyle="primary"
        disabled={disabled}
        to={disabled ? null : `/erm/agreements?layer=create&${this.constructAddToBasketParam()}`}
      >
        <FormattedMessage id="ui-agreements.basket.createAgreement" />
      </Button>
    );
  }

  renderAddToAgreementSection = () => {
    const { openAgreements } = this.props.resources;
    if (!openAgreements || !openAgreements.records.length) return null;

    return (
      <div>
        <FormattedMessage tagName="div" id="ui-agreements.basket.addToExistingAgreement" />
        <Row>
          <Col xs={12} md={8}>
            <AutoSuggest
              includeItem={(agreement, searchString) => {
                const lowerCasedSearchString = searchString.toLowerCase();

                return (
                  agreement.name.toLowerCase().includes(lowerCasedSearchString) ||
                  agreement.agreementStatus.label.toLowerCase().includes(lowerCasedSearchString) ||
                  agreement.startDate.toLowerCase().includes(lowerCasedSearchString) ||
                  (agreement.vendor && agreement.vendor.name.toLowerCase().includes(lowerCasedSearchString))
                );
              }}
              items={openAgreements.records}
              onChange={(selectedAgreement) => { this.setState({ selectedAgreement }); }}
              renderOption={agreement => (
                <div>
                  <Headline bold>{agreement.name}&nbsp;&#40;{agreement.agreementStatus.label}&#41;</Headline>{/* eslint-disable-line */}
                  <div>
                    <strong><FormattedMessage id="ui-agreements.agreements.startDate" />: </strong><FormattedDate value={agreement.startDate} /> {/* eslint-disable-line */}
                  </div>
                  {agreement.vendor && (
                    <div>
                      <strong><FormattedMessage id="ui-agreements.agreements.vendorInfo.vendor" />: </strong>{agreement.vendor.name} {/* eslint-disable-line */}
                    </div>
                  )}
                </div>
              )}
              renderValue={agreement => agreement && agreement.name}
              valueKey="id"
            />
          </Col>
          <Col xs={12} md={4}>
            { this.renderAddToAgreementButton() }
          </Col>
        </Row>
      </div>
    );
  }

  renderAddToAgreementButton = () => {
    const disabled = (
      this.state.selectedAgreement === undefined ||
      Object.values(this.state.selectedItems).find(v => v) === undefined // None of the `selectedItems` value's are `true`;
    );

    return (
      <div>
        <Button
          buttonStyle="primary"
          disabled={disabled}
          to={disabled ? null : `/erm/agreements/view/${this.state.selectedAgreement}?layer=edit&${this.constructAddToBasketParam()}`}
        >
          <FormattedMessage id="ui-agreements.basket.addToSelectedAgreement" />
        </Button>
      </div>
    );
  }

  render() {
    const { container, resources } = this.props;

    const basket = resources.basket || [];
    const query = resources.query;

    return (
      <FormattedMessage id="ui-agreements.basket.layerLabel">
        {layerContentLabel => (
          <Layer
            afterClose={() => this.setState({ selectedAgreement: undefined })}
            container={container}
            contentLabel={layerContentLabel}
            isOpen={!!query.basket}
          >
            <Paneset>
              <Pane
                defaultWidth="100%"
                firstMenu={this.renderFirstMenu()}
                paneTitle={<FormattedMessage id="ui-agreements.basket.name" />}
                paneSub={<FormattedMessage id="ui-agreements.basket.recordCount" values={{ count: basket.length }} />}

              >
                <div id="basket-contents">
                  <BasketList
                    basket={basket}
                    onToggleAll={this.handleToggleAll}
                    onToggleItem={this.handleToggleItem}
                    removeItem={this.handleRemoveItem}
                    selectedItems={this.state.selectedItems}
                  />
                  { this.renderCreateAgreementButton() }
                  { this.renderAddToAgreementSection() }
                </div>
              </Pane>
            </Paneset>
          </Layer>
        )}
      </FormattedMessage>
    );
  }
}

export default Basket;
