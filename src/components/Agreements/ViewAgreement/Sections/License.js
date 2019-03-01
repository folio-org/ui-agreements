import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import ExternalLicenses from './ExternalLicenses';

export default class License extends React.Component {
  static propTypes = {
    agreement: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  }.isRequired;

  render() {
    const { agreement } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.agreements.licenseInfo" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-agreements.license.generalNotes" />}>
              <div data-test-license-note>
                {agreement.licenseNote || '-'}
              </div>
            </KeyValue>
          </Col>
        </Row>
        <div style={{ marginLeft: '1rem' }}>
          <ExternalLicenses agreement={agreement} />
        </div>
      </Accordion>
    );
  }
}
