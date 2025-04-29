import { FormattedMessage } from 'react-intl';
import { camelCase } from 'lodash';
import { useSettingSection } from '@k-int/stripes-kint-components';
import { SETTINGS_ENDPOINT } from '../constants';
import { parseAgreementSettings } from '../components/utilities';
import GeneralSettingsForm from './GeneralSettingsForm';
// import { useAgreementsSettings } from '../hooks';

const GeneralSettings = () => {
  const { handleSubmit, settings: rawSettings, refetchSettings } = useSettingSection({
    sectionName: 'agreements_display_settings',
    settingEndpoint: SETTINGS_ENDPOINT,
  });

  const parsedSettings = parseAgreementSettings(rawSettings);

  // const {
  //   handleSubmit,
  //   parsedSettings,
  //   rawSettings,
  //   refetchSettings,
  // } = useAgreementsSettings();

  const findFormValue = (values, key) => {
    if (key.startsWith('displaysuppressfromdiscovery_')) {
      const field = camelCase(key.replace('displaysuppressfromdiscovery_', ''));
      return values.displaySuppressFromDiscovery?.[field];
    }
    if (key.startsWith('hideaccordions_')) {
      const field = camelCase(key.replace('hideaccordions_', ''));
      return values.hideAccordions?.[field];
    }
    if (key.startsWith('pagesize_')) {
      const field = camelCase(key.replace('pagesize_', ''));
      return values.pageSize?.[field];
    }
    if (key === 'hideeresourcesfunctionality') {
      return values.hideEResourcesFunctionality;
    }
    return undefined;
  };

  const onSubmit = async (values) => {
    const updates = [];

    rawSettings.forEach(setting => {
      const formValue = findFormValue(values, setting.key);

      if (formValue !== undefined) {
        let originalValue;
        if (setting.settingType === 'Boolean') {
          originalValue = setting.value === 'true';
        } else if (setting.settingType === 'Integer') {
          originalValue = Number(setting.value);
        } else {
          originalValue = setting.value;
        }

        if (formValue !== originalValue) {
          updates.push({
            ...setting,
            value: formValue.toString()
          });
        }
      }
    });

    if (updates.length > 0) {
      await Promise.all(updates.map(update => handleSubmit(update)));
      await refetchSettings();
    }
  };

  return (
    <GeneralSettingsForm
      initialValues={parsedSettings}
      label={<FormattedMessage id="ui-agreements.settings.displaySettings" />}
      onSubmit={onSubmit}
    />
  );
};

export default GeneralSettings;
