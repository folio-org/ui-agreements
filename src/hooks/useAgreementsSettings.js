import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

import { MOD_SETTINGS_ENDPOINT } from '../constants/endpoints';

const useAgreementsSettings = () => {
  const ky = useOkapiKy();

  const queryObject = useQuery(
    [MOD_SETTINGS_ENDPOINT, 'query=(module=AGREEMENTS and configName=general)', 'ui-agreements', 'useAgreementsSettings'],
    () => ky.get(`${MOD_SETTINGS_ENDPOINT}?query=(module=AGREEMENTS and configName=general)`).json()
  );

  const { data: { configs: { 0: settings = {} } = [] } = {} } = queryObject;

  let parsedSettings = {};
  if (settings.value) {
    try {
      parsedSettings = JSON.parse(settings.value);
    } catch (error) {
      // Error parsing settings JSON
      console.error(error); // eslint-disable-line no-console
    }
  }

  return {
    settings,
    parsedSettings,
    queryObject
  };
};

export default useAgreementsSettings;

