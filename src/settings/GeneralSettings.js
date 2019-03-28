import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect, withStripes } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import GeneralSettingsForm from './GeneralSettingsForm';

class GeneralSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.connectedConfigManager = stripesConnect(ConfigManager);
  }

  defaultValues = {
    hideEResourcesFunctionality: false,
  }

  getInitialValues = (settings) => {
    let loadedValues = {};
    try {
      const value = settings.length === 0 ? '' : settings[0].value;
      loadedValues = JSON.parse(value);
    } catch (e) {} // eslint-disable-line no-empty

    return {
      ...this.defaultValues,
      ...loadedValues,
    };
  }

  render() {
    return (
      <this.connectedConfigManager
        label={<FormattedMessage id="ui-agreements.settings.general" />}
        moduleName="AGREEMENTS"
        configName="general"
        getInitialValues={this.getInitialValues}
        onBeforeSave={this.handleBeforeSave}
        configFormComponent={GeneralSettingsForm}
        stripes={this.props.stripes}
      />
    );
  }
}

export default withStripes(GeneralSettings);
