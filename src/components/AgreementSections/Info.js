import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import {
  Col,
  Headline,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import FormattedUTCDate from '../FormattedUTCDate';

export default class Info extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      beganDate: PropTypes.string,
      currentPeriod: PropTypes.shape({
        cancellationDeadline: PropTypes.string,
      }),
      description: PropTypes.string,
      isPerpetual: PropTypes.shape({
        label: PropTypes.string,
      }),
      name: PropTypes.string,
      renewalPriority: PropTypes.shape({
        label: PropTypes.string,
      }),
    }),
  };

  render() {
    const { agreement } = this.props;
    const cancellationDeadline = get(agreement, 'currentPeriod.cancellationDeadline');

    return (
      <div data-test-agreement-info>
        <Row>
          <Col xs={12}>
            <div data-test-agreement-name>
              <Headline
                size="xx-large"
                tag="h2"
              >
                {agreement.name}
              </Headline>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreements.agreementDescription" />}>
              <div data-test-agreement-description style={{ whiteSpace: 'pre-wrap' }}>
                {agreement.description || '-'}
              </div>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreementPeriods.currentCancellationDeadline" />}>
              <div data-test-agreement-cancellation-deadline>
                {cancellationDeadline ? <FormattedUTCDate value={cancellationDeadline} /> : '-'}
              </div>
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreements.renewalPriority" />}>
              <div data-test-agreement-renewal-priority>
                {get(agreement, 'renewalPriority.label', '-')}
              </div>
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreements.isPerpetual" />}>
              <div data-test-agreement-is-perpetual>
                {get(agreement, 'isPerpetual.label', '-')}
              </div>
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreementPeriods.dateAgreementBegan" />}>
              <div data-test-agreement-began-date>
                {agreement.beganDate ? <FormattedUTCDate value={agreement.beganDate} /> : '-'}
              </div>
            </KeyValue>
          </Col>
        </Row>
      </div>
    );
  }
}
