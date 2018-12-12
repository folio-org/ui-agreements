import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Field, FieldArray } from 'redux-form';

import {
  Button,
  Icon,
  IconButton,
  Col,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

export default class AgreementFormInternalContacts extends React.Component {
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

  renderContactsList = ({ fields }) => {
    const contacts = fields.getAll() || [];
    const renderedContacts = contacts.filter(contact => !contact._delete);

    return (
      <div>
        <div>
          { !renderedContacts.length && <FormattedMessage id="ui-agreements.contacts.noContacts" /> }
          { renderedContacts.map((contact, index) => (
            <Row key={index}>
              <Col xs={6}>
                <Field
                  component={TextField}
                  name={`contacts[${index}].user`}
                />
              </Col>
              <Col xs={5}>
                <Field
                  name={`contacts[${index}].role`}
                  component={Select}
                  dataOptions={[
                    { value: '402881866799100901679989da380002', label: 'Agreement Owner' },
                    { value: '402881866799100901679989da4f0003', label: 'Subject Specialist' },
                  ]}
                />
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
    return (
      <FieldArray
        name="contacts"
        component={this.renderContactsList}
      />
    );
  }
}
