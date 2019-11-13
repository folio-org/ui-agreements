import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Accordion, Badge } from '@folio/stripes/components';
import { InternalContactCard } from '@folio/stripes-erm-components';

export default class InternalContacts extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      contacts: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
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

    return contacts.map(contact => (
      <InternalContactCard
        contact={contact}
        key={contact.id}
      />
    ));
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
