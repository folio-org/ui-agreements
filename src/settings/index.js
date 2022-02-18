import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import { Settings } from '@folio/stripes/smart-components';
import { CustomPropertiesSettings, useSettings } from '@k-int/stripes-kint-components';

import GeneralSettings from './GeneralSettings';

import {
  SupplementaryPropertiesConfigRoute,
  PickListSettings,
  PickListValueSettings
} from './routes';

const REFDATA_ENDPOINT = 'erm/refdata';
const SETTINGS_ENDPOINT = 'erm/settings/appSettings';

const ErmSettings = (props) => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const { isLoading, pageList, SettingsContextProvider } = useSettings({
    dynamicPageExclusions: ['registry'], // Registry AppSettings hold StringTemplating details etc -- not for user editing
    intlKey: 'ui-agreements',
    persistentPages: [],
    refdataEndpoint: REFDATA_ENDPOINT,
    settingEndpoint: SETTINGS_ENDPOINT
  });

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

  const sections = [
    {
      label: <FormattedMessage id="ui-agreements.settings.general" />,
      pages: [
        {
          route: 'general',
          label: <FormattedMessage id="ui-agreements.settings.displaySettings" />,
          perm: 'ui-agreements.generalSettings.manage',
          component: GeneralSettings,
        },
        {
          component: SupplementaryPropertiesConfigRoute,
          label: <FormattedMessage id="ui-agreements.settings.supplementaryProperties" />,
          perm: 'ui-agreements.supplementaryProperties.manage',
          route: 'supplementaryProperties',
        },
        {
          component: () => (
            <CustomPropertiesSettings
              contextFilterOptions={contexts}
              endpoint="erm/custprops"
            />
          ),
          label: <FormattedMessage id="ui-agreements.settings.supplementaryProperties" />,
          perm: 'ui-agreements.supplementaryProperties.manage',
          route: 'customProperties',
        },
      ]
    },
    {
      label: <FormattedMessage id="ui-agreements.settings.supplementaryPropertyPickList" />,
      pages: [
        {
          component: PickListSettings,
          label: <FormattedMessage id="ui-agreements.settings.pickLists" />,
          perm: 'ui-agreements.picklists.manage',
          route: 'pick-lists',
        },
        {
          component: PickListValueSettings,
          label: <FormattedMessage id="ui-agreements.settings.pickListValues" />,
          perm: 'ui-agreements.picklists.manage',
          route: 'pick-list-values',
        },
      ]
    },
    {
      label: <FormattedMessage id="ui-agreements.settings.appSettings" />,
      pages: pageList
    }
  ];

  if (isLoading) {
    return null;
  }

  return (
    <SettingsContextProvider>
      <Settings
        paneTitle={<FormattedMessage id="ui-agreements.meta.title" />}
        sections={sections}
        {...props}
      />
    </SettingsContextProvider>
  );
};

export default ErmSettings;
