import { FormattedMessage } from 'react-intl';
import { useStripes } from '@folio/stripes/core';
import { useSettings } from '@k-int/stripes-kint-components';

import GeneralSettings from './GeneralSettings';

import { PickListSettings } from './routes';

import {
  REFDATA_ENDPOINT,
  SETTINGS_ENDPOINT
} from '../constants';

import { AgreementsCustomProperties } from './components';
import { Pane } from '@folio/stripes/components';

const ErmSettings = (props) => {
  const stripes = useStripes();
  const allowGlobalEdit = stripes.hasPerm('ui-agreements.appSettings.manage');

  const { isLoading, SettingsComponent } = useSettings({
    allowGlobalEdit,
    sections: [
      {
        label: <FormattedMessage id="ui-agreements.settings.general" />,
        pages: [
          {
            route: 'general',
            label: <FormattedMessage id="ui-agreements.settings.displaySettings" />,
            perm: 'ui-agreements.generalSettings.view',
            component: GeneralSettings,
          },
          {
            component: AgreementsCustomProperties,
            label: <FormattedMessage id="ui-agreements.settings.supplementaryProperties" />,
            perm: 'ui-agreements.supplementaryProperties.view',
            route: 'supplementaryProperties',
          },
        ]
      },
      {
        label: <FormattedMessage id="ui-agreements.settings.supplementaryPropertyPickList" />,
        pages: [
          {
            component: PickListSettings,
            label: <FormattedMessage id="ui-agreements.settings.pickLists" />,
            perm: 'ui-agreements.picklists.view',
            route: 'pick-lists',
          },
        ]
      },
      {
        label: <FormattedMessage id="ui-agreements.settings.appSettings" />,
        dynamicPageExclusions: ['registry'], // Registry AppSettings hold StringTemplating details etc -- not for user editing
      }
    ],
    refdataEndpoint: REFDATA_ENDPOINT,
    settingEndpoint: SETTINGS_ENDPOINT
  });

  if (isLoading) {
    return null;
  }

  return (
    <Pane
      fullwidth
    >
      I did a thing
    </Pane>
    /*<SettingsComponent
      paneTitle={<FormattedMessage id="ui-agreements.meta.title" />}
      {...props}
    />*/
  );
};

export default ErmSettings;
