import React from 'react';
import { FormattedMessage } from 'react-intl';

const commands = [
  {
    name: 'save',
    label: (<FormattedMessage id="ui-users.saveAndClose" />),
    shortcut: 'mod+s',
  },
  {
    name: 'new',
    label: (<FormattedMessage id="stripes-smart-components.new" />),
    shortcut: 'alt+n',
  },
  {
    name: 'search',
    label: (<FormattedMessage id="ui-users.search" />),
    shortcut: 'mod+alt+h',
  },
  {
    name: 'edit',
    label: (<FormattedMessage id="ui-users.edit" />),
    shortcut: 'mod+alt+e',
  },
  {
    name: 'expandAllSections',
    label: (<FormattedMessage id="ui-users.expandAll" />),
    shortcut: 'mod+alt+b'
  },
  {
    name: 'collapseAllSections',
    label: (<FormattedMessage id="ui-users.collapseAll" />),
    shortcut: 'mod+alt+g'
  }
];

export default commands;
