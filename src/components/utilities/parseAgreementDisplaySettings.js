import { camelCase } from 'lodash';

export default function parseAgreementDisplaySettings(settingsArray = []) {
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

    if (key.startsWith('displaysuppressfromdiscovery_')) {
      const subKey = camelCase(key.replace('displaysuppressfromdiscovery_', ''));
      parsedSettings.displaySuppressFromDiscovery[subKey] = parsedValue;
    } else if (key.startsWith('hideaccordions_')) {
      const subKey = camelCase(key.replace('hideaccordions_', ''));
      parsedSettings.hideAccordions[subKey] = parsedValue;
    } else if (key.startsWith('pagesize_')) {
      const subKey = camelCase(key.replace('pagesize_', ''));
      parsedSettings.pageSize[subKey] = parsedValue;
    } else if (key === 'hideeresourcesfunctionality') {
      parsedSettings.hideEResourcesFunctionality = parsedValue;
    }
  });

  return parsedSettings;
}
