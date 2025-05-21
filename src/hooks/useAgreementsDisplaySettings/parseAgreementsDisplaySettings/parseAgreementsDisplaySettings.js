import set from 'lodash/set';
import getAgreementsSettingsField from '../getAgreementsSettingsField';

export default function parseAgreementsDisplaySettings(settingsArray = []) {
  const parsedSettings = {
    displaySuppressFromDiscovery: {},
    hideAccordions: {},
    hideEResourcesFunctionality: false,
    pageSize: {},
  };

  settingsArray.forEach(setting => {
    const { key, value, settingType } = setting;
    let parsedValue;
    if (settingType === 'Boolean') {
      parsedValue = value === 'true';
    } else if (settingType === 'Integer') {
      parsedValue = Number(value);
    } else {
      parsedValue = value;
    }

    set(parsedSettings, getAgreementsSettingsField(key), parsedValue);
  });

  return parsedSettings;
}
