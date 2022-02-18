
import { useIntl } from 'react-intl';

import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import { CustomPropertiesSettings } from '@k-int/stripes-kint-components';

import { REFDATA_ENDPOINT, CUSTPROP_ENDPOINT } from '../../constants/endpoints';

const AgreementsCustomProperties = () => {
  const intl = useIntl();
  const ky = useOkapiKy();

  const { data: custpropContexts = [] } = useQuery(
    ['ui-agreements', 'settings', 'custpropContexts'],
    () => ky('erm/custprops/contexts').json()
  );

  const contexts = [
    {
      value: '',
      label: intl.formatMessage({ id: 'ui-agreements.settings.customProperties.all' })
    },
    ...custpropContexts?.map(cpc => (
      {
        value: cpc,
        label: cpc
      })),
    {
      value: 'isNull',
      label: intl.formatMessage({ id: 'ui-agreements.settings.customProperties.none' })
    }
  ];

  return (
    <CustomPropertiesSettings
      contextFilterOptions={contexts}
      customPropertiesEndpoint={CUSTPROP_ENDPOINT}
      refdataEndpoint={REFDATA_ENDPOINT}
    />
  );
};

export default AgreementsCustomProperties;
