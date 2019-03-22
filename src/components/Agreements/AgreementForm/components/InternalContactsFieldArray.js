import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Button,
  Col,
  IconButton,
  Layout,
  Row,
  Select,
} from '@folio/stripes/components';

import { withKiwtFieldArray } from '@folio/stripes-erm-components';

import UserPicker from '../../../UserPicker';
import { required } from '../../../../util/validators';

class InternalContactsFieldArray extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    contactRoles: PropTypes.arrayOf(PropTypes.object),
    users: PropTypes.arrayOf(PropTypes.object),
  };

  state = {
    roles: [],
    users: {},
  };

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    const { contactRoles, users } = props;

    if (contactRoles.length !== state.roles.length) {
      newState.roles = contactRoles.map(r => ({ value: r.id, label: r.label }));
    }

    if (users.length > Object.keys(state.users).length) {
      const newUsers = state.users;
      users.forEach(u => { newUsers[u.id] = u; });
      newState.users = newUsers;
    }

    if (Object.keys(newState).length) return newState;

    return null;
  }

  addUser = (user) => {
    this.setState(prevState => ({
      users: {
        ...prevState.users,
        [user.id]: user,
      },
    }));
  }

  renderUserName = (userId) => {
    const user = this.state.users[userId];
    if (!user || !user.personal) return '';

    const { firstName, lastName } = user.personal;
    return firstName ? `${lastName}, ${firstName}` : lastName;
  }

  renderEmpty = () => (
    <Layout className="padding-bottom-gutter">
      <FormattedMessage id="ui-agreements.contacts.noContacts" />
    </Layout>
  );

  renderContacts = () => {
    const { items, onDeleteField } = this.props;

    return items.map((contact, index) => (
      <Row key={index}>
        <Col xs={6}>
          <Field
            addUser={this.addUser}
            component={UserPicker}
            format={this.renderUserName}
            name={`contacts[${index}].user`}
            normalize={value => value.id}
            validate={required}
          />
        </Col>
        <Col xs={5}>
          <FormattedMessage id="ui-agreements.contacts.selectRole">
            {placeholder => (
              <Field
                name={`contacts[${index}].role`}
                component={Select}
                dataOptions={this.state.roles}
                placeholder={placeholder}
                validate={required}
              />
            )}
          </FormattedMessage>
        </Col>
        <Col xs={1}>
          <IconButton
            icon="trash"
            onClick={() => onDeleteField(index, contact)}
          />
        </Col>
      </Row>
    ));
  }

  render() {
    const { items, onAddField } = this.props;

    return (
      <div>
        <div>
          { items.length ? this.renderContacts() : this.renderEmpty() }
        </div>
        <Button onClick={() => onAddField({})}>
          <FormattedMessage id="ui-agreements.contacts.add" />
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(InternalContactsFieldArray);
