
import { FormattedMessage, useIntl } from 'react-intl';

import { useQuery, useQueryClient } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { CustomPropertiesSettings } from '@k-int/stripes-kint-components';

import { REFDATA_ENDPOINT, CUSTPROP_ENDPOINT } from '../../../constants/endpoints';

const AgreementsCustomProperties = () => {
  const intl = useIntl();
  const ky = useOkapiKy();

  const queryClient = useQueryClient();

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

  const labelOverrides = {
    paneTitle: <FormattedMessage id="ui-agreements.settings.supplementaryProperties" />,
  };

  const helpPopovers = {
    name: <FormattedMessage id="ui-agreements.supplementaryProperty.help.name" />,
    label: <FormattedMessage id="ui-agreements.supplementaryProperty.help.label" />
  };

  return (
    <CustomPropertiesSettings
      afterQueryCalls={{
        put: () => queryClient.invalidateQueries(['ui-agreements', 'settings', 'custpropContexts']),
        post: () => queryClient.invalidateQueries(['ui-agreements', 'settings', 'custpropContexts']),
        delete: () => queryClient.invalidateQueries(['ui-agreements', 'settings', 'custpropContexts'])
      }}
      contextFilterOptions={contexts}
      customPropertiesEndpoint={CUSTPROP_ENDPOINT}
      helpPopovers={helpPopovers}
      labelOverrides={labelOverrides}
      refdataEndpoint={REFDATA_ENDPOINT}
    />
  );
};

export default AgreementsCustomProperties;
