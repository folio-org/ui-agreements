import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Field, FieldArray } from 'redux-form';

import {
  Button,
  Col,
  Icon,
  IconButton,
  Layout,
  Row,
  Select,
} from '@folio/stripes/components';

import UserPicker from '../../../UserPicker';
import { required } from '../../../../util/validators';

export default class AgreementFormInternalContacts extends React.Component {
  static propTypes = {
    parentResources: PropTypes.shape({
      contactRoleValues: PropTypes.object,
      users: PropTypes.object,
    }),
  };

  state = {
    roles: [],
    users: {},
  };

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    const contactRoleValues = get(props.parentResources, ['contactRoleValues', 'records'], []);
    if (contactRoleValues.length !== state.roles.length) {
      newState.roles = contactRoleValues.map(r => ({ value: r.id, label: r.label }));
    }

    const newUsers = get(props.parentResources, ['users', 'records'], []);
    if (newUsers.length > Object.keys(state.users).length) {
      const users = state.users;
      newUsers.forEach(u => { users[u.id] = u; });
      newState.users = users;
    }

    if (Object.keys(newState)) return newState;

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

  onRemoveContact = (fields, index, contact) => {
    // mod-agreements is implemented so that it doesn't expect the entire
    // array of contacts to be sent back on edits bc of the potential
    // size of that array. Instead, contact deletions are expected
    // to be sent back as an object that looks like { id: '123', _delete: true }.
    //
    // There's no "edit" function in redux-form fields so we remove
    // the stale data and append the new data with the deletion marker property.

    fields.remove(index);

    if (contact.id) {
      fields.push({
        id: contact.id,
        _delete: true,
      });
    }
  }

  renderUserName = (userId) => {
    const user = this.state.users[userId];
    if (!user || !user.personal) return '';

    const { firstName, lastName } = user.personal;
    return firstName ? `${lastName}, ${firstName}` : lastName;
  }

  renderNoContacts = () => (
    <Layout className="padding-bottom-gutter">
      <FormattedMessage id="ui-agreements.contacts.noContacts" />
    </Layout>
  );

  renderContactsList = ({ fields }) => {
    const contacts = fields.getAll() || [];
    const renderedContacts = contacts.filter(contact => !contact._delete);

    return (
      <div>
        <div>
          { !renderedContacts.length && this.renderNoContacts() }
          { renderedContacts.map((contact, index) => (
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
                  onClick={() => this.onRemoveContact(fields, index, contact)}
                />
              </Col>
            </Row>
          ))}
        </div>
        <Button onClick={() => fields.push({ })}>
          <FormattedMessage id="ui-agreements.contacts.add" />
        </Button>
      </div>
    );
  }

  render() {
    const users = get(this.props.parentResources, ['users', 'records'], []);
    const contacts = get(this.props.parentResources, ['contacts', 'records'], []);
    if (users.length < contacts.length) {
      return <Icon icon="spinner-ellipsis" width="100px" />;
    }

    return (
      <FieldArray
        name="contacts"
        component={this.renderContactsList}
      />
    );
  }
}
