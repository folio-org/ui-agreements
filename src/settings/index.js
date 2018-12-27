import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import OrgRoleSettings from './OrgRoleSettings';

export default class ErmSettings extends React.Component {
  pages = [
    {
      route: 'org-roles',
      label: <FormattedMessage id="ui-agreements.settings.orgRoles" />,
      component: OrgRoleSettings,
    },
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
