import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { FieldArray } from 'redux-form';

import { Accordion } from '@folio/stripes/components';
import { Spinner } from '@folio/stripes-erm-components';

import InternalContactsFieldArray from '../components/InternalContactsFieldArray';

export default class AgreementFormInternalContacts extends React.Component {
  static propTypes = {
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
        label={<FormattedMessage id="ui-agreements.agreements.internalContacts" />}
      >
        <FieldArray
          name="contacts"
          component={InternalContactsFieldArray}
          contactRoles={contactRoles}
          users={users}
        />
      </Accordion>
    );
  }
}
