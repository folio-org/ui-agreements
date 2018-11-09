import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import {
  Button,
  Col,
  Layout,
  Row,
  Select,
} from '@folio/stripes/components';

class BasketSelectorDisplay extends React.Component {
  static manifest = Object.freeze({
    basket: { initialValue: [] },
  });

  static propTypes = {
    addButtonLabel: PropTypes.string,
    basket: PropTypes.arrayOf(PropTypes.object),
    intl: intlShape,
    onAdd: PropTypes.func,
  }

  state = {
    item: { id: '' },
  }

  handleChange = (e) => {
    const id = e.target.value;
    const item = this.props.basket.find(i => i.id === id);

    this.setState({ item });
  }

  render() {
    const { addButtonLabel, basket, intl, onAdd } = this.props;
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
          <Select
            dataOptions={dataOptions}
            label={intl.formatMessage({ id: 'ui-agreements.basketSelector.selectLabel' })}
            onChange={this.handleChange}
            placeholder={intl.formatMessage({ id: 'ui-agreements.basketSelector.selectPlaceholder' })}
            value={item.id}
          />
        </Col>
        <Col xs={12} md={4}>
          <Layout style={{ height: '100%' }} className="flex flex-direction-column justify-end">
            <Button
              buttonStyle="primary"
              disabled={!item.id}
              fullWidth
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

export default injectIntl(BasketSelectorDisplay);
