import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';

class IfEResourcesEnabled extends React.Component {
  static manifest = {
    hideEResourcesFunctionality: {},
  };

  static propTypes = {
    children: PropTypes.node,
    resources: PropTypes.shape({
      hideEResourcesFunctionality: PropTypes.bool,
    }),
  };

  render() {
    const { children, resources: { hideEResourcesFunctionality } } = this.props;

    if (hideEResourcesFunctionality === true) return null;

    return children;
  }
}

export default stripesConnect(IfEResourcesEnabled);
