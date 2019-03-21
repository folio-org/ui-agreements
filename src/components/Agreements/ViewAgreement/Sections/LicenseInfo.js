import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import AllLicenses from './AllLicenses';
import ExternalLicenses from './ExternalLicenses';

export default class LicenseInfo extends React.Component {
  static propTypes = {
    agreement: PropTypes.object.isRequired,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { agreement } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.agreements.licenseInfo" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        { agreement.licenseNote ? (
          <Row>
            <Col xs={12}>
              <KeyValue label={<FormattedMessage id="ui-agreements.license.generalNotes" />}>
                <div data-test-license-note>
                  {agreement.licenseNote}
                </div>
              </KeyValue>
            </Col>
          </Row>
        ) : null }
        <div style={{ marginTop: '1rem', marginLeft: '1rem' }}>
          <AllLicenses agreement={agreement} />
          <ExternalLicenses agreement={agreement} />
        </div>
      </Accordion>
    );
  }
}
