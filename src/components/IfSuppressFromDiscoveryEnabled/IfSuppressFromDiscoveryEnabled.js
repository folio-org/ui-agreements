import React from 'react';
import PropTypes from 'prop-types';

class IfSuppressFromDiscoveryEnabled extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    settings: PropTypes.object,
    sfdLocation: PropTypes.string
  };

  isDisplay = (specific) => {
    const { settings = {} } = this.props;
    return settings.displaySuppressFromDiscovery ? settings.displaySuppressFromDiscovery[specific] : true;
  }

  render() {
    const { sfdLocation } = this.props;
    if (this.isDisplay(sfdLocation)) return this.props.children;

    return null;
  }
}

export default IfSuppressFromDiscoveryEnabled;
