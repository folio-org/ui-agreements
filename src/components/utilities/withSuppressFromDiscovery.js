import React from 'react';
import PropTypes from 'prop-types';

const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default function withSuppressFromDiscovery(WrappedComponent) {
  class WithSuppressFromDiscovery extends React.Component {
    static manifest = Object.freeze(
      { ...WrappedComponent.manifest,
        settings: {
          type: 'okapi',
          path: 'erm/settings/appSettings?section=agreements_display_settings',
          records: 'configs',
        } }
    );

    static propTypes = {
      children: PropTypes.node,
      resources: PropTypes.shape({
        settings: PropTypes.object
      })
    };

    handleSuppressFromDiscoveryEnabled = (resource) => {
      const { settings = {} } = this.props.resources;
      const parsedSettings = JSON.parse(settings?.records?.[0]?.value || '{}');
      return parsedSettings.displaySuppressFromDiscovery?.[resource] ?? true;
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          isSuppressFromDiscoveryEnabled={this.handleSuppressFromDiscoveryEnabled}
        />
      );
    }
  }

  WithSuppressFromDiscovery.displayName = `WithSuppressFromDiscovery(${getDisplayName(WrappedComponent)})`;
  return WithSuppressFromDiscovery;
}
