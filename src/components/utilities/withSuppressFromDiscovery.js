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
          path: 'configurations/entries?query=(module=AGREEMENTS and configName=general)',
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
      console.log('settings');
      console.log(settings);
      const parsedSettings = JSON.parse(settings?.records?.[0]?.value || '{}');
      console.log('parsed settings:');
      console.log(parsedSettings);
      // console.log('parsed settings of "' + resource + '": ' + parsedSettings.displaySuppressFromDiscovery?.[resource]);
      // console.log('getDisplayName: ' + WrappedComponent.name); // WrappedComponent.name
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
