import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Link from 'react-router-dom/Link';
import { FormattedMessage } from 'react-intl';

import { Accordion, Badge, Icon } from '@folio/stripes/components';

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
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  renderSpinner = () => (
    <Icon icon="spinner-ellipsis" width="100px" />
  );

  renderBadge = () => {
    const count = get(this.props.contacts, ['length']);
    return count !== undefined ? <Badge>{count}</Badge> : <Icon icon="spinner-ellipsis" width="10px" />;
  }

  renderContacts = () => {
    const { contacts } = this.props;
    if (contacts === undefined) return this.renderSpinner();

    if (!contacts.length) return <FormattedMessage id="ui-agreements.contacts.noContacts" />;

    return contacts.map((contact) => {
      if (!contact.personal) return null;

      const { firstName, lastName } = contact.personal;
      const displayName = firstName ? `${lastName}, ${firstName}` : lastName;

      return (
        <div key={contact.user}>
          <Link to={`/users/view/${contact.user}`}>{displayName}</Link>
          ,&nbsp;
          <span>{contact.role ? contact.role.label : ''}</span>
        </div>
      );
    });
  }

  render() {
    const { id, onToggle, open } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.internalContacts" />}
        onToggle={onToggle}
        open={open}
      >
        {this.renderContacts()}
      </Accordion>
    );
  }
}
