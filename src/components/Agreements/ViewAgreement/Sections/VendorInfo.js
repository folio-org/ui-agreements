import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedDate, FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Icon,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import css from './VendorInfo.css';

export default class VendorInfo extends React.Component {
  static propTypes = {
    agreement: PropTypes.object,
  };

  render() {
    const { agreement } = this.props;
    const { startDate, endDate } = agreement;

    return (
      <Row className={css.vendorInfo}>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.agreements.vendorInfo.vendor" />}>
            <div data-test-agreement-vendor-name>{get(agreement, ['vendor', 'name'], '-')}</div>
          </KeyValue>
        </Col>
        <Col xs={2}>
          <KeyValue label={<FormattedMessage id="ui-agreements.agreements.startDate" />}>
            <div data-test-agreement-start-date>{startDate ? <FormattedDate value={startDate} /> : '-'}</div>
          </KeyValue>
        </Col>
        <Col xs={2}>
          <KeyValue label={<FormattedMessage id="ui-agreements.agreements.endDate" />}>
            <div data-test-agreement-end-date>{endDate ? <FormattedDate value={endDate} /> : '-'}</div>
          </KeyValue>
        </Col>
        <Col xs={2}>
          <KeyValue label={<FormattedMessage id="ui-agreements.agreements.vendorInfo.status" />}>
            <div data-test-agreement-status>{get(agreement, ['agreementStatus', 'label'], '-')}</div>
          </KeyValue>
        </Col>
        <Col xs={3}>
          <Button>
            <Icon size="small" icon="external-link">
              <FormattedMessage id="ui-agreements.agreements.vendorInfo.visitPlatform" />
            </Icon>
          </Button>
        </Col>
      </Row>
    );
  }
}
