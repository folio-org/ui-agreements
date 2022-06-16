
import { FormattedMessage, useIntl } from 'react-intl';

import { useQueryClient } from 'react-query';

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

  const labelOverrides = {
    modalTitleEdit: <FormattedMessage id="ui-agreements.supplementaryProperty.editModal" />,
    modalTitleNew: <FormattedMessage id="ui-agreements.supplementaryProperty.newModal" />,
    paneTitle: <FormattedMessage id="ui-agreements.settings.supplementaryProperties" />,
    retired: <FormattedMessage id="ui-agreements.settings.supplementaryProperties.retired" />,
    primaryRetired: <FormattedMessage id="ui-agreements.settings.supplementaryProperties.primaryRetired" />,
    ctx: <FormattedMessage id="ui-agreements.settings.supplementaryProperties.category" />,
    category: <FormattedMessage id="ui-agreements.settings.supplementaryProperties.pickList" />,
    deleteError: (error, custProp) => (<FormattedMessage id="ui-agreements.settings.supplementaryProperties.deleteError" values={{ label: custProp?.label, error }} />)
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
      helpPopovers={helpPopovers}
      labelOverrides={labelOverrides}
      refdataEndpoint={REFDATA_ENDPOINT}
    />
  );
};

export default AgreementsCustomProperties;
