import React, { Component } from 'react';
import { Field } from 'redux-form';
import { Col, Row, TextField } from '@folio/stripes-components';

class AgreementForm extends Component {
  render() {
    return (
      <Row>
        <Col xs={8} style={{ margin: '0 auto', padding: '0' }}>
          <Row>
            <Col xs={12}>
              <Field label="Name" name="name" id="name" component={TextField} fullWidth />
            </Col>
            <Col xs={12}>
              <Field label="Description" name="description" id="description" component={TextField} fullWidth />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default AgreementForm;
