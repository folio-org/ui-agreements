import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import GeneralSettings from './general-settings';
import SomeFeatureSettings from './some-feature-settings';

/*
  STRIPES-NEW-APP
  Your app's settings pages are defined here.
  The pages "general" and "some feature" are examples. Name them however you like.
*/

export default class ErmSettings extends React.Component {
  pages = [
    {
      route: 'general',
      label: <FormattedMessage id="ui-agreements.settings.general" />,
      component: GeneralSettings,
    },
    {
      route: 'somefeature',
      label: <FormattedMessage id="ui-agreements.settings.some-feature" />,
      component: SomeFeatureSettings,
    },
    {
      route: 'roles',
      label: <FormattedMessage id="ui-agreements.settings.orgRoles" />,
      component: ControlledVocabularySettings,
    },
  ];

  render() {
    return (
      <Settings {...this.props} pages={this.pages} paneTitle="ui-agreements" />
    );
  }
}
