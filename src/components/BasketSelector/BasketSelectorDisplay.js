import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Layout,
  Row,
  Select,
} from '@folio/stripes/components';

export default class BasketSelectorDisplay extends React.Component {
  static manifest = Object.freeze({
    basket: { initialValue: [] },
  });

  static propTypes = {
    addButtonLabel: PropTypes.node,
    basket: PropTypes.arrayOf(PropTypes.object),
    onAdd: PropTypes.func,
  }

  state = {
    item: { id: '' },
  }

  handleChange = (e) => {
    const id = e.target.value;
    const item = this.props.basket.find(i => i.id === id);
    if (!item) return;

    this.setState({ item });
  }

  render() {
    const { addButtonLabel, basket, onAdd } = this.props;
    const { item } = this.state;

    const dataOptions = [
      ...basket.map(resource => ({
        value: resource.id,
        label: resource.name,
        disabled: false,
      }))
    ];

    return (
      <Row>
        <Col xs={12} md={8}>
          <FormattedMessage id="ui-agreements.basketSelector.selectPlaceholder">
            {placeholder => (
              <Select
                dataOptions={dataOptions}
                id="basket-selector"
                label={<FormattedMessage id="ui-agreements.basketSelector.selectLabel" />}
                onChange={this.handleChange}
                placeholder={placeholder}
                value={item.id}
              />
            )}
          </FormattedMessage>
        </Col>
        <Col xs={12} md={4}>
          <Layout style={{ height: '100%' }} className="flex flex-direction-column justify-end">
            <Button
              buttonStyle="primary"
              disabled={!item.id}
              fullWidth
              id="basket-selector-add-button"
              onClick={() => { onAdd(item); }}
            >
              {addButtonLabel}
            </Button>
          </Layout>
        </Col>
      </Row>
    );
  }
}
