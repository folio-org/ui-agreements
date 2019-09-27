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
      cancellationDeadline: PropTypes.string,
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

  constructor(props) {
    super(props);
    this.state = {
      agreementIsClosed: (props.agreement.agreementStatus.value === 'closed' || false)
    }
  };

  render() {
    const { agreement } = this.props;
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
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreements.cancellationDeadline" />}>
              <div data-test-agreement-cancellation-deadline>
                {agreement.cancellationDeadline ? <FormattedUTCDate value={agreement.cancellationDeadline} /> : '-'}
              </div>
            </KeyValue>
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreements.renewalPriority" />}>
              <div data-test-agreement-renewal-priority>
                {get(agreement, 'renewalPriority.label', '-')}
              </div>
            </KeyValue>
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreements.isPerpetual" />}>
              <div data-test-agreement-is-perpetual>
                {get(agreement, 'isPerpetual.label', '-')}
              </div>
            </KeyValue>
          </Col>
        </Row>
        {this.state.agreementIsClosed &&
          <Row>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-agreements.agreements.agreementStatus" />}>
                <div data-test-agreement-status>
                  {get(agreement, 'agreementStatus.label', '-')}
                </div>
              </KeyValue>
            </Col>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-agreements.agreements.reasonForClosure" />}>
                <div data-test-agreement-reason-for-closure>
                  {get(agreement, 'reasonForClosure.label', '-')}
                </div>
              </KeyValue>
            </Col>
          </Row>
        
        }
      </div>
    );
  }
}
