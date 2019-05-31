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

import AgreementFormAllLicenses from './AgreementFormAllLicenses';
import AgreementFormExternalLicenses from './AgreementFormExternalLicenses';

class AgreementFormLicense extends React.Component {
  static propTypes = {
    handlers: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.object,
  };

  render() {
    const { handlers } = this.props;
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
              maxLength={255}
              id="edit-agreement-licenseNote"
              name="licenseNote"
              label={<FormattedMessage id="ui-agreements.license.generalNotes" />}
              component={TextArea}
            />
          </Col>
        </Row>
        <div style={{ marginLeft: '2rem' }}>
          <AgreementFormAllLicenses parentResources={this.props.parentResources} />
          <AgreementFormExternalLicenses parentResources={this.props.parentResources} handlers={handlers} />
        </div>
      </Accordion>
    );
  }
}

export default AgreementFormLicense;
