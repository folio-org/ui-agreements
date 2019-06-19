import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { FieldArray } from 'redux-form';

import { Accordion } from '@folio/stripes/components';
import { InternalContactsFieldArray, Spinner } from '@folio/stripes-erm-components';

export default class AgreementFormInternalContacts extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    open: PropTypes.bool,
    onToggle: PropTypes.func,
    parentResources: PropTypes.shape({
      contacts: PropTypes.object,
      contactRoleValues: PropTypes.object,
      users: PropTypes.object,
    }),
  };

  render() {
    const contactRoles = get(this.props.parentResources, ['contactRoleValues', 'records'], []);
    const users = get(this.props.parentResources, ['users', 'records'], []);
    const contacts = get(this.props.parentResources, ['contacts', 'records'], []);
    if (users.length < contacts.length) {
      return <Spinner />;
    }

    return (
      <Accordion
        closedByDefault
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.agreements.internalContacts" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <FieldArray
          isEmptyMessage={<FormattedMessage id="ui-agreements.contacts.noContacts" />}
          name="contacts"
          component={InternalContactsFieldArray}
          contactRoles={contactRoles}
          users={users}
        />
      </Accordion>
    );
  }
}
