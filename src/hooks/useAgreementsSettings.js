import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';
import { parseAgreementSettings } from '../components/utilities';
import { SETTINGS_ENDPOINT } from '../constants';

const useAgreementsSettings = () => {
  const ky = useOkapiKy();
  const queryParams = generateKiwtQueryParams({
    filters: [{ path: 'section', value: 'agreements_display_settings' }],
    sort: [{ path: 'key' }],
    perPage: 100,
    stats: false,
  }, {});

  const { data: rawSettings = [], refetch } = useQuery(
    ['agreements_display_settings'],
    async () => {
      const response = await ky(`${SETTINGS_ENDPOINT}?${queryParams.join('&')}`).json();
      return response;
    }
  );

  const parsedSettings = parseAgreementSettings(rawSettings) ?? {};

  return {
    parsedSettings,
    rawSettings,
    refetchSettings: refetch,
  };
};

export default useAgreementsSettings;
