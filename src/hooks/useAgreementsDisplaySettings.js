import { useQueryClient } from 'react-query';
import { camelCase } from 'lodash';
import { useSettingSection } from '@k-int/stripes-kint-components';
import { parseAgreementDisplaySettings } from '../components/utilities';
import { SETTINGS_ENDPOINT } from '../constants';

const useAgreementsDisplaySettings = ({
  namespaceAppend = []
} = {}) => {
  const queryClient = useQueryClient();
  const displaySettingsQueryKey = ({ queryParams }) => [
    'ERM',
    'Settings',
    'displaySettings',
    SETTINGS_ENDPOINT,
    queryParams,
    ...namespaceAppend
  ];

  const { handleSubmit, settings: rawSettings } = useSettingSection({
    sectionName: 'agreements_display_settings',
    settingEndpoint: SETTINGS_ENDPOINT,
    getQueryNamespaceGenerator: displaySettingsQueryKey
  });

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

  const parsedSettings = parseAgreementDisplaySettings(rawSettings) ?? {};

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
      queryClient.invalidateQueries(['ERM', 'Settings', 'displaySettings']);
    }
  };

  return {
    parsedSettings,
    submitDisplaySettings: onSubmit
  };
};

export default useAgreementsDisplaySettings;
