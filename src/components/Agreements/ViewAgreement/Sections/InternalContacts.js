import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Link from 'react-router-dom/Link';
import { FormattedMessage } from 'react-intl';

import {
  Icon
} from '@folio/stripes/components';

export default class InternalContacts extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      id: PropTypes.string,
    }),
    contacts: PropTypes.arrayOf(PropTypes.shape({
      role: PropTypes.shape({
        label: PropTypes.string,
      }),
      user: PropTypes.string,
    })),
    parentMutator: PropTypes.shape({
      users: PropTypes.shape({
        GET: PropTypes.func,
        reset: PropTypes.func,
      }),
    }),
    parentResources: PropTypes.shape({
      users: PropTypes.object,
    }),
  };

  componentDidMount() {
    this.fetchUsers();
  }

  componentDidUpdate(prevProps) {
    const prevContacts = prevProps.contacts || [];
    const contacts = this.props.contacts || [];
    if (
      (prevProps.agreement.id !== this.props.agreement.id) ||
      (prevContacts.length !== contacts.length)
    ) {
      this.fetchUsers();
    }
  }

  fetchUsers = () => {
    const { parentMutator: { users }, contacts = [] } = this.props;
    users.reset();
    contacts.forEach(contact => users.GET({ path: `users/${contact.user}` }));
  }

  renderSpinner = () => (
    <Icon icon="spinner-ellipsis" width="100px" />
  );

  render() {
    const { contacts } = this.props;
    if (contacts === undefined) return this.renderSpinner();

    const users = get(this.props.parentResources, ['users', 'records'], []);
    if (contacts.length !== users.length) return this.renderSpinner();

    if (!contacts.length) return <FormattedMessage id="ui-agreements.contacts.noContacts" />;

    return contacts.map((contact, i) => {
      const user = users[i];
      const { firstName, lastName } = user.personal;
      const displayName = firstName ? `${lastName}, ${firstName}` : lastName;

      return (
        <div>
          <Link to={`/users/view/${user.id}`}>{displayName}</Link>
          ,&nbsp;
          <span>{contact.role.label}</span>
        </div>
      );
    });
  }
}
