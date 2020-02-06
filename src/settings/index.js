import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';

import GeneralSettings from './GeneralSettings';
import { SupplementaryPropertiesConfigRoute } from './routes';

export default class ErmSettings extends React.Component {
  pages = [
    {
      route: 'general',
      label: <FormattedMessage id="ui-agreements.settings.general" />,
      component: GeneralSettings,
    },
    {
      component: SupplementaryPropertiesConfigRoute,
      label: <FormattedMessage id="ui-agreements.settings.supplementaryProperties" />,
      perm: 'ui-agreements.supplementaryProperties.manage',
      route: 'supplementaryProperties',
    }
  ];

  render() {
    return (
      <Settings
        {...this.props}
        pages={this.pages}
        paneTitle={<FormattedMessage id="ui-agreements.meta.title" />}
      />
    );
  }
}
