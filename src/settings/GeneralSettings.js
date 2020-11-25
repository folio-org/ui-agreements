import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect, withStripes } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import { defaultSettingsValues } from '../constants';
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
    displaySuppressFromDiscovery: { pci: true, agreementLine: true, title: true },
    hideEResourcesFunctionality: false,
    /* initialLoadValues: {
      agreementLines: INITIAL_LOAD_DEFAULT,
      coveredEresources: INITIAL_LOAD_DEFAULT,
      acquisitionOptions: INITIAL_LOAD_DEFAULT,
      packageContents: INITIAL_LOAD_DEFAULT,
      entitlementAgreements: INITIAL_LOAD_DEFAULT
    },
    pageSizeValues: {
      agreementLines: PAGE_SIZE_DEFAULT,
      coveredEresources: PAGE_SIZE_DEFAULT,
      acquisitionOptions: PAGE_SIZE_DEFAULT,
      packageContents: PAGE_SIZE_DEFAULT,
      entitlementAgreements: PAGE_SIZE_DEFAULT
    }, */
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
    console.log(defaultSettingsValues);
    return (
      <this.connectedConfigManager
        configFormComponent={GeneralSettingsForm}
        configName="general"
        getInitialValues={this.getInitialValues}
        label={<FormattedMessage id="ui-agreements.settings.displaySettings" />}
        moduleName="AGREEMENTS"
        stripes={this.props.stripes}
      />
    );
  }
}

export default withStripes(GeneralSettings);
