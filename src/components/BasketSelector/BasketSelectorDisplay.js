import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Select,
} from '@folio/stripes/components';

class BasketSelectorDisplay extends React.Component {
  static manifest = Object.freeze({
    basket: { initialValue: [] },
  });

  static propTypes = {
    addButtonLabel: PropTypes.string,
    basket: PropTypes.arrayOf(PropTypes.object),
    onAdd: PropTypes.func,
  }

  state = {
    item: undefined,
  }

  handleChange = (e) => {
    const id = e.target.value;
    const item = this.props.basket.find(i => i.id === id);

    this.setState({ item });
  }

  render() {
    const { addButtonLabel, basket, onAdd } = this.props;
    const { item } = this.state;

    const dataOptions = [
      {},
      ...basket.map(resource => ({
        value: resource.id,
        label: resource.name,
        disabled: false,
      }))
    ];

    return (
      <div>
        <Select
          dataOptions={dataOptions}
          label="Select from basket"
          onChange={this.handleChange}
          placeholder="Select e-resource or package"
        />
        <Button
          disabled={item === undefined || item.id === undefined}
          onClick={() => { onAdd(item); }}
        >
          {addButtonLabel}
        </Button>
      </div>
    );
  }
}

export default BasketSelectorDisplay;
