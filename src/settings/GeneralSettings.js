import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect, withStripes } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import GeneralSettingsForm from './GeneralSettingsForm';

const INITIAL_LOAD_DEFAULT = 10;
const PAGE_SIZE_DEFAULT = 10;

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
    displaySuppressFromDiscovery: { pci: true, agreementLine: true },
    /*  mclPagination: {
      acquisitionOptions: {
        name: 'acquisitionOptions',
        initialLoad: INITIAL_LOAD_DEFAULT,
        pageSize: PAGE_SIZE_DEFAULT,
      },
      agreementLines: {
        name: 'agreementLines',
        initialLoad: INITIAL_LOAD_DEFAULT,
        pageSize: PAGE_SIZE_DEFAULT,
      },
      coveredEresources: {
        name: 'coveredEresources',
        initialLoad: INITIAL_LOAD_DEFAULT,
        pageSize: PAGE_SIZE_DEFAULT,
      },
      entitlementAgreements:  {
        name: 'entitlementAgreements',
        initialLoad: INITIAL_LOAD_DEFAULT,
        pageSize: PAGE_SIZE_DEFAULT,
      },
      packageContents:  {
        name: 'packageContents',
        initialLoad: INITIAL_LOAD_DEFAULT,
        pageSize: PAGE_SIZE_DEFAULT,
      },
    }, */
    initialLoadValues: {
      agreementLines: INITIAL_LOAD_DEFAULT,
      coveredEresources: INITIAL_LOAD_DEFAULT,
      acquisitionOptions: INITIAL_LOAD_DEFAULT,
      packageContents: INITIAL_LOAD_DEFAULT,
      entitlementAgreements: INITIAL_LOAD_DEFAULT,
    },
    pageSizeValues: {
      agreementLines: PAGE_SIZE_DEFAULT,
      coveredEresources: PAGE_SIZE_DEFAULT,
      acquisitionOptions: PAGE_SIZE_DEFAULT,
      packageContents: PAGE_SIZE_DEFAULT,
      entitlementAgreements: PAGE_SIZE_DEFAULT,
    },
  }

  getInitialValues = (settings) => {
    let loadedValues = {};
    try {
      const value = settings.length === 0 ? '' : settings[0].value;
      loadedValues = JSON.parse(value);
    } catch (e) {} // eslint-disable-line no-empty
    console.log(this.defaultValues);
    console.log(loadedValues);
    return {
      ...this.defaultValues,
      ...loadedValues,
    };
  }

  render() {
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
