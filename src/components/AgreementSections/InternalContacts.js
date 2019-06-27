import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Link from 'react-router-dom/Link';
import { FormattedMessage } from 'react-intl';

import { Accordion, Badge } from '@folio/stripes/components';

export default class InternalContacts extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      contacts: PropTypes.arrayOf(
        PropTypes.shape({
          role: PropTypes.shape({
            label: PropTypes.string,
          }),
          user: PropTypes.oneOfType([
            PropTypes.shape({
              personal: PropTypes.shape({
                firstName: PropTypes.string,
                middleName: PropTypes.string,
                lastName: PropTypes.string,
              }).isRequired,
            }).isRequired,
            PropTypes.string
          ]),
        })
      ),
    }).isRequired,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  renderBadge = () => {
    const count = get(this.props, 'agreement.contacts.length', 0);
    return <Badge>{count}</Badge>;
  }

  renderContacts = () => {
    const { contacts = [] } = this.props.agreement;

    if (!contacts.length) return <FormattedMessage id="ui-agreements.contacts.noContacts" />;

    return contacts.map((contact, i) => {
      if (!contact.user) return null;

      const firstName = get(contact, 'user.personal.firstName');
      const lastName = get(contact, 'user.personal.lastName');
      const middleName = get(contact, 'user.personal.middleName');
      let displayName = lastName;
      if (firstName) displayName = `${displayName}, ${firstName}`;
      if (middleName) displayName = `${displayName} ${middleName}`;

      const role = get(contact, 'role.label', '');

      return (
        <div
          data-test-agreement-contact
          key={`${contact.user.id}-${i}`}
        >
          <Link to={`/users/view/${contact.user.id}`}>{displayName}</Link>
          ,&nbsp;
          <span>{role}</span>
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
        { this.renderContacts() }
      </Accordion>
    );
  }
}
