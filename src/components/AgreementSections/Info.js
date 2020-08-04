import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Col,
  FormattedUTCDate,
  Headline,
  KeyValue,
  MultiColumnList,
  NoValue,
  Row,
} from '@folio/stripes/components';

import { statuses } from '../../constants';

export default class Info extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      agreementStatus: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      }),
      alternateNames: PropTypes.array,
      cancellationDeadline: PropTypes.string,
      currentPeriod: PropTypes.shape({
        note: PropTypes.string,
      }),
      description: PropTypes.string,
      isPerpetual: PropTypes.shape({
        label: PropTypes.string,
      }),
      name: PropTypes.string,
      reasonForClosure: PropTypes.shape({
        label: PropTypes.string,
      }),
      renewalPriority: PropTypes.shape({
        label: PropTypes.string,
      }),
    }),
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
                {agreement.description || <NoValue />}
              </div>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreements.cancellationDeadline" />}>
              <div data-test-agreement-cancellation-deadline>
                {agreement.cancellationDeadline ? <FormattedUTCDate value={agreement.cancellationDeadline} /> : <NoValue />}
              </div>
            </KeyValue>
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreements.renewalPriority" />}>
              <div data-test-agreement-renewal-priority>
                {agreement?.renewalPriority?.label ?? <NoValue />}
              </div>
            </KeyValue>
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreements.isPerpetual" />}>
              <div data-test-agreement-is-perpetual>
                {agreement?.isPerpetual?.label ?? <NoValue />}
              </div>
            </KeyValue>
          </Col>
        </Row>
        <KeyValue label={<FormattedMessage id="ui-agreements.agreements.currentPeriodNote" />}>
          <div data-test-agreement-current-period-note style={{ whiteSpace: 'pre-wrap' }}>
            {agreement?.currentPeriod?.note ?? <NoValue />}
          </div>
        </KeyValue>
        {agreement?.agreementStatus?.value === statuses.CLOSED &&
          <Row>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-agreements.agreements.agreementStatus" />}>
                <div data-test-agreement-status>
                  {agreement?.agreementStatus?.label ?? <NoValue />}
                </div>
              </KeyValue>
            </Col>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-agreements.agreements.reasonForClosure" />}>
                <div data-test-agreement-reason-for-closure>
                  {agreement?.reasonForClosure?.label ?? <NoValue />}
                </div>
              </KeyValue>
            </Col>
          </Row>
        }
        {agreement?.alternateNames?.length !== 0 &&
          <MultiColumnList
            columnMapping={{ name: <FormattedMessage id="ui-agreements.alternativeNames" /> }}
            contentData={agreement.alternateNames}
            visibleColumns={['name']}
          />
        }
      </div>
    );
  }
}
