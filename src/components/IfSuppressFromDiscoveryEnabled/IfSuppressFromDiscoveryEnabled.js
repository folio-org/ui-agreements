import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { stripesConnect } from '@folio/stripes/core';

class IfSuppressFromDiscoveryEnabled extends React.Component {
  static manifest = {
    settings: {
      type: 'okapi',
      path: 'configurations/entries?query=(module=AGREEMENTS and configName=general)',
      records: 'configs',
      shouldRefresh: () => false,
    },
  };

  static propTypes = {
    children: PropTypes.node,
    resources: PropTypes.shape({
      settings: PropTypes.object,
    }),
    sfdLocation: PropTypes.string
  };

  isDisplay = (specific) => {
    const settings = JSON.parse(get(this.props.resources.settings, 'records[0].value', '{}'));
    return settings.displaySuppressFromDiscovery[specific] || false;
  }

  render() {
    const { sfdLocation } = this.props;
    if (this.isDisplay(sfdLocation)) return this.props.children;

    return null;
  }
}

export default stripesConnect(IfSuppressFromDiscoveryEnabled);
