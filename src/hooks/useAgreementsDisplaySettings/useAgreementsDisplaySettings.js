import { useCallback, useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useIntl } from 'react-intl';
import get from 'lodash/get';
import { useCallout } from '@folio/stripes/core';

import { useSettingSection } from '@k-int/stripes-kint-components';

import { SETTINGS_ENDPOINT } from '../../constants';

import parseAgreementDisplaySettings from './parseAgreementsDisplaySettings';
import getAgreementsSettingsField from './getAgreementsSettingsField';

const useAgreementsDisplaySettings = ({
  namespaceAppend = []
} = {}) => {
  const callout = useCallout();
  const intl = useIntl();
  const queryClient = useQueryClient();
  const baseQueryKey = useMemo(() => [
    'ERM',
    'Settings',
    'displaySettings'
  ], []);

  const displaySettingsQueryKey = useCallback(({ queryParams }) => [
    ...baseQueryKey,
    queryParams,
    ...namespaceAppend
  ], [baseQueryKey, namespaceAppend]);

  const { handleSubmit, settings: rawSettings } = useSettingSection({
    sectionName: 'agreements_display_settings',
    settingEndpoint: SETTINGS_ENDPOINT,
    getQueryNamespaceGenerator: displaySettingsQueryKey
  });

  const findFormValue = (values, key) => {
    const formField = getAgreementsSettingsField(key);
    if (formField) {
      return get(values, formField);
    }

    return undefined;
  };

  const parsedSettings = useMemo(() => parseAgreementDisplaySettings(rawSettings) ?? {}, [rawSettings]);

  // A helper function to take a list of updates, and combine them with oldSettings
  // to come up with expected return shape from future get. We will use this to
  // directly update the query cache and have an immediate renderable view of what
  // the values _should_ be while they refetch in the background
  const optimisticUpdateNewSettings = useCallback((updates, oldSettings) => {
    const newSettings = [...(oldSettings || [])];
    updates.forEach(update => {
      const index = newSettings.findIndex(s => s.id === update.id);
      if (index > -1) {
        newSettings[index] = update;
      }
    });

    return newSettings;
  }, []);

  const onSubmit = useCallback((values) => {
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
      const successful = [];
      const failed = [];

      const updatePromises = updates.map(update => handleSubmit(update)
        .then(() => {
          successful.push(update);
        })
        .catch((error) => {
          failed.push({ update, error });
        }));

      return Promise.all(updatePromises)
        .then(() => {
          if (successful.length > 0) {
            // Optimistically update the cache
            queryClient.setQueriesData(baseQueryKey, oldSettings => optimisticUpdateNewSettings(successful, oldSettings));
            queryClient.invalidateQueries(baseQueryKey);

            callout.sendCallout({
              type: 'success',
              message: (
                <ul>
                  {successful.map(update => {
                    const translationId = getAgreementsSettingsField(update.key);
                    const settingLabel = intl.formatMessage({
                      id: `ui-agreements.settings.${translationId}`,
                      fallbackMessage: update.key
                    });

                    return (
                      <li key={update.id}>
                        {intl.formatMessage(
                          { id: 'ui-agreements.settings.update.success' },
                          { settingLabel, newValue: update.value }
                        )}
                      </li>
                    );
                  })}
                </ul>
              )
            });
          }

          if (failed.length > 0) {
            callout.sendCallout({
              type: 'error',
              message: (
                <ul>
                  {failed.map(({ update }) => {
                    const translationId = getAgreementsSettingsField(update.key);
                    const settingLabel = intl.formatMessage({
                      id: `ui-agreements.settings.${translationId}`,
                      fallbackMessage: update.key
                    });

                    return (
                      <li key={update.id}>
                        {intl.formatMessage(
                          { id: 'ui-agreements.settings.update.error' },
                          { settingLabel }
                        )}
                      </li>
                    );
                  })}
                </ul>
              )
            });
          }
          return true;
        });
    }
    // In case we somehow called this with no updates
    // (Shouldn't be possible because of the disabled save button),
    // return an empty promise
    return Promise.resolve(true);
  }, [
    baseQueryKey,
    callout,
    handleSubmit,
    intl,
    optimisticUpdateNewSettings,
    queryClient,
    rawSettings,
  ]);

  return {
    parsedSettings,
    submitDisplaySettings: onSubmit
  };
};

export default useAgreementsDisplaySettings;
