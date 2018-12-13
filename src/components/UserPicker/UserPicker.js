import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  TextField,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

export default class UserPicker extends React.Component {
  static propTypes = {
    addUser: PropTypes.func,
    meta: PropTypes.shape({
      error: PropTypes.node,
    }),
    input: PropTypes.shape({
      onChange: PropTypes.func,
      onFilter: PropTypes.func,
      value: PropTypes.string,
    }),
  };


  render() {
    const { addUser, input: { onChange, value }, meta: { error } } = this.props;

    return (
      <FormattedMessage id="ui-agreements.userpicker.clickSearchButton">
        {placeholder => (
          <TextField
            error={error}
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
                  if (addUser) addUser(user);

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
            placeholder={placeholder}
            readOnly
            value={value}
          />
        )}
      </FormattedMessage>
    );
  }
}
