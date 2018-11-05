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

  handleCloseBasket = () => {
    this.props.mutator.query.update({ basket: undefined });
  }

  handleRemoveItem = (item) => {
    const { mutator, resources } = this.props;

    const basket = resources.basket || [];
    const updatedBasket = basket.filter(i => i.id !== item.id);

    mutator.basket.replace(updatedBasket);
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
                  removeItem={this.handleRemoveItem}
                />
                <Button
                  buttonStyle="primary"
                  to={`/erm/agreements?layer=create&${ADD_FROM_BASKET_PARAM}=${basket.map((a, i) => i).join(',')}`}
                >
                  <FormattedMessage id="ui-erm.basket.createAgreement" />
                </Button>
              </Pane>
            </Paneset>
          </Layer>
        )}
      </FormattedMessage>
    );
  }
}

export default Basket;
