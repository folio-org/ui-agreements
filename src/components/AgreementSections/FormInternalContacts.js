import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import { Accordion } from '@folio/stripes/components';
import { InternalContactsFieldArray } from '@folio/stripes-erm-components';

export default class FormInternalContacts extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    data: PropTypes.shape({
      contactRoleValues: PropTypes.array,
      users: PropTypes.array,
    }),
  };

  render() {
    const { id, onToggle, open } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.internalContacts" />}
        onToggle={onToggle}
        open={open}
      >
        <FieldArray
          name="contacts"
          component={InternalContactsFieldArray}
          contactRoles={this.props.data.contactRoleValues}
          users={this.props.data.users}
        />
      </Accordion>
    );
  }
}
