import React from 'react';
import PropTypes from 'prop-types';

const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default function getMCLSettingsValues(WrappedComponent) {
  class GetMCLSettingsValues extends React.Component {
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

    handleInitialLoad = (resource) => {
      const { settings = {} } = this.props.resources;
      const parsedSettings = JSON.parse(settings?.records?.[0]?.value || '{}');
      return parsedSettings.initialLoad?.[resource];
    }

    handlePageSize = (resource) => {
      const { settings = {} } = this.props.resources;
      const parsedSettings = JSON.parse(settings?.records?.[0]?.value || '{}');
      return parsedSettings.pageSize?.[resource];
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          initialLoad={this.handleInitialLoad}
          pageSize={this.handlePageSize}
        />
      );
    }
  }

  GetMCLSettingsValues.displayName = `GetMCLSettingsValues(${getDisplayName(WrappedComponent)})`;
  return GetMCLSettingsValues;
}
