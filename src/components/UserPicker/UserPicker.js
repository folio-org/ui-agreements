import React from 'react';
import PropTypes from 'prop-types';

import {
  Icon,
  TextField,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

export default class UserPicker extends React.Component {
  static propTypes = {
    addUser: PropTypes.func,
    input: PropTypes.shape({
      onChange: PropTypes.func,
      onFilter: PropTypes.func,
      value: PropTypes.string,
    }),
  };


  render() {
    const { addUser, input: { onChange, onFilter, value } } = this.props;

    return (
      <TextField
        endControl={(
          <Pluggable
            aria-haspopup="true"
            columnMapping={{
              name: 'Name',
              patronGroup: 'Patron Group',
              username: 'Username',
              barcode: 'Barcode',
            }}
            dataKey="user"
            disableRecordCreation
            searchButtonStyle="fieldControl"
            selectUser={user => {
              addUser(user);
              onChange(user);
            }}
            type="find-user"
            visibleColumns={['name', 'patronGroup', 'username', 'barcode']}
          >
            <span>N/A</span>
          </Pluggable>
        )}
        hasClearIcon={false}
        onChange={onChange}
        onFilter={onFilter}
        readOnly
        value={value}
      />
    );
  }
}
