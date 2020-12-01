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

    handleMCLSettings = (name) => {
      const { settings = {} } = this.props.resources;
      const parsedSettings = JSON.parse(settings?.records?.[0]?.value || '{}');
      return parsedSettings?.[name];
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          initialLoad={this.handleMCLSettings('initialLoad')}
          pageSize={this.handleMCLSettings('pageSize')}
        />
      );
    }
  }

  GetMCLSettingsValues.displayName = `GetMCLSettingsValues(${getDisplayName(WrappedComponent)})`;
  return GetMCLSettingsValues;
}
