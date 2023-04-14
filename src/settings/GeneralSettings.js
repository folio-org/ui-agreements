import { FormattedMessage } from 'react-intl';

import { SettingsFormContainer } from '@k-int/stripes-kint-components';

import { defaultMclPageSize, hiddenAccordions } from '../constants';
import GeneralSettingsForm from './GeneralSettingsForm';

const GeneralSettings2 = () => {
  const defaultValues = {
    displaySuppressFromDiscovery: { pci: true, agreementLine: true, title: true },
    hideAccordions: hiddenAccordions,
    hideEResourcesFunctionality: false,
    pageSize: defaultMclPageSize.pageSize,
  };

  const getInitialValues = (settings) => {
    return {
      ...defaultValues,
      ...settings,
    };
  };

  return (
    <SettingsFormContainer
      ConfigFormComponent={GeneralSettingsForm}
      configName="general"
      getInitialValues={getInitialValues}
      label={<FormattedMessage id="ui-agreements.settings.displaySettings" />}
      moduleName="AGREEMENTS"
    />
  );
};

export default GeneralSettings2;
