import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { FormattedMessage } from 'react-intl';

import {
  Icon
} from '@folio/stripes/components';

export default class InternalContacts extends React.Component {
  static propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.shape({
      role: PropTypes.shape({
        label: PropTypes.string,
      }),
      personal: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
      user: PropTypes.string,
    })),
  };

  renderSpinner = () => (
    <Icon icon="spinner-ellipsis" width="100px" />
  );

  render() {
    const { contacts } = this.props;
    if (contacts === undefined) return this.renderSpinner();

    if (!contacts.length) return <FormattedMessage id="ui-agreements.contacts.noContacts" />;

    return contacts.map((contact, i) => {
      const { firstName, lastName } = contact.personal;
      const displayName = firstName ? `${lastName}, ${firstName}` : lastName;

      return (
        <div>
          <Link to={`/users/view/${contact.user}`}>{displayName}</Link>
          ,&nbsp;
          <span>{contact.role.label}</span>
        </div>
      );
    });
  }
}
