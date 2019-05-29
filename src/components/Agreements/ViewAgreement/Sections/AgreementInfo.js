import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

export default class AgreementInfo extends React.Component {
  static propTypes = {
    agreement: PropTypes.object,
  };

  render() {
    const { agreement } = this.props;
    return (
      <React.Fragment>
        <Row data-test-agreement-info>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreements.name" />}>
              <div data-test-agreement-name>
                {agreement.name}
              </div>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreements.agreementDescription" />}>
              <div data-test-agreement-description>
                {agreement.description}
              </div>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreements.cancellationDeadline" />}>
              <div data-test-agreement-cancellation-deadline>
                {agreement.cancellationDeadline ? <FormattedDate value={agreement.cancellationDeadline} /> : '-'}
              </div>
            </KeyValue>
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreements.renewalPriority" />}>
              <div data-test-agreement-renewal-priority>
                {get(agreement, ['renewalPriority', 'label'], '-')}
              </div>
            </KeyValue>
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreements.isPerpetual" />}>
              <div data-test-agreement-is-perpetual>
                {get(agreement, ['isPerpetual', 'label'], '-')}
              </div>
            </KeyValue>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
