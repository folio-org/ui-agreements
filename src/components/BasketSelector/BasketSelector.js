import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  Layout,
  Row,
  Selection,
} from '@folio/stripes/components';

import { requiredValidator } from '@folio/stripes-erm-components';

export default class BasketSelector extends React.Component {
  static propTypes = {
    addButtonLabel: PropTypes.node,
    autoFocus: PropTypes.bool,
    basket: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.node,
    name: PropTypes.string,
    onAdd: PropTypes.func,
  }

  state = {
    item: { id: '' },
  }

  handleChange = id => {
    const item = this.props.basket.find(i => i.id === id);
    if (!item) return;

    this.setState({ item });
  }

  render() {
    const { addButtonLabel, basket, error, name, onAdd } = this.props;
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
        <Col md={8} xs={12}>
          <Field
            autoFocus={this.props.autoFocus}
            component={Selection}
            dataOptions={dataOptions}
            error={error}
            id={`${name}-basket-selector`}
            label={<FormattedMessage id="ui-agreements.basketSelector.selectLabel" />}
            name={`${name}.selection`}
            onChange={this.handleChange}
            required
            validate={requiredValidator}
            value={item.id}
          />
        </Col>
        <Col md={4} xs={12}>
          <Layout className="flex flex-align-items-center" style={{ height: '100%' }}>
            <Button
              buttonStyle="primary"
              disabled={!item.id}
              fullWidth
              id={`${name}-basket-selector-add-button`}
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
