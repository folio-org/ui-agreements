
import { FormattedMessage, useIntl } from 'react-intl';

import { useQueryClient } from 'react-query';
import { useStripes } from '@folio/stripes/core';
import { CustomPropertiesSettings } from '@k-int/stripes-kint-components';

import { REFDATA_ENDPOINT, CUSTPROP_ENDPOINT } from '../../../constants/endpoints';
import useAgreementsContexts from '../../../hooks/useAgreementsContexts';

const AgreementsCustomProperties = () => {
  const intl = useIntl();
  const queryClient = useQueryClient();

  const { data: custpropContexts = [] } = useAgreementsContexts();

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

  const stripes = useStripes();
  const perm = stripes.hasPerm('ui-agreements.supplementaryProperties.manage');
  const displayConditions = {
    create: perm,
    delete: perm,
    edit: perm
  };

  const helpPopovers = {
    name: <FormattedMessage id="ui-agreements.supplementaryProperty.help.name" />,
    label: <FormattedMessage id="ui-agreements.supplementaryProperty.help.label" />,
    ctx: <FormattedMessage id="ui-agreements.supplementaryProperty.help.category" />
  };

  return (
    <CustomPropertiesSettings
      afterQueryCalls={{
        put: () => queryClient.invalidateQueries(['erm/custprops/contexts']),
        post: () => queryClient.invalidateQueries(['erm/custprops/contexts']),
        delete: () => queryClient.invalidateQueries(['erm/custprops/contexts'])
      }}
      contextFilterOptions={contexts}
      customPropertiesEndpoint={CUSTPROP_ENDPOINT}
      displayConditions={displayConditions}
      helpPopovers={helpPopovers}
      intlKey="ui-agreements"
      refdataEndpoint={REFDATA_ENDPOINT}
    />
  );
};

export default AgreementsCustomProperties;
