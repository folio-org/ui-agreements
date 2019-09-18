import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Badge,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import LinkedLicenses from './LinkedLicenses';
import ExternalLicenses from './ExternalLicenses';

export default class Licenses extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      linkedLicenses: PropTypes.array,
      externalLicenseDocs: PropTypes.array,
    }).isRequired,
    handlers: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  renderBadge = () => {
    const linkedLicenses = get(this.props, 'agreement.linkedLicenses.length', 0);
    const externalLicenses = get(this.props, 'agreement.externalLicenseDocs.length', 0);
    return <Badge>{linkedLicenses + externalLicenses}</Badge>;
  }

  render() {
    const {
      agreement,
      handlers,
      id,
      onToggle,
      open
    } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.licenseInfo" />}
        open={open}
        onToggle={onToggle}
      >
        {agreement.licenseNote &&
          <Row>
            <Col xs={12}>
              <KeyValue label={<FormattedMessage id="ui-agreements.license.generalNotes" />}>
                <div data-test-license-note style={{ whiteSpace: 'pre-wrap' }}>
                  {agreement.licenseNote}
                </div>
              </KeyValue>
            </Col>
          </Row>
        }
        <div>
          {/* <LinkedLicenses agreement={agreement} /> */}
          <ExternalLicenses agreement={agreement} handlers={handlers} />
        </div>
      </Accordion>
    );
  }
}
