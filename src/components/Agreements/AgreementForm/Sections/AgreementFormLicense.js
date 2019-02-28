import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Col,
  Row,
  TextArea,
} from '@folio/stripes/components';

class AgreementFormLicense extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.agreements.licenseInfo" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <Field
              id="edit-agreement-licenseNote"
              name="licenseNote"
              label={<FormattedMessage id="ui-agreements.agreements.licenseNote" />}
              component={TextArea}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default AgreementFormLicense;
