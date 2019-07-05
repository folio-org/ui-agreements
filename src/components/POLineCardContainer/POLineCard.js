import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { AppIcon } from '@folio/stripes/core';
import { Card, Col, KeyValue, Row } from '@folio/stripes/components';
import { Spinner } from '@folio/stripes-erm-components';

export default class POLineField extends React.Component {
  static propTypes = {
    headerEnd: PropTypes.node,
    id: PropTypes.string,
    order: PropTypes.shape({
      orderType: PropTypes.string,
      workflowStatus: PropTypes.string,
    }),
    orderLine: PropTypes.shape({
      acquisitionMethod: PropTypes.string,
      id: PropTypes.string,
      title: PropTypes.string,
    }),
    organization: PropTypes.shape({
      name: PropTypes.string,
    })
  }

  render() {
    const { headerEnd, id, orderLine, order, organization } = this.props;

    return (
      <Card
        cardStyle="positive"
        hasMargin
        headerStart={(
          <span>
            <AppIcon app="orders" size="small" />
            &nbsp;
            <strong>
              <FormattedMessage id="ui-agreements.poLines.poLineWithNumber" values={orderLine} />
            </strong>
          </span>
        )}
        headerEnd={headerEnd}
        id={id}
        roundedBorder
      >
        <div>
          <Row>
            <Col xs={12}>
              <KeyValue label={<FormattedMessage id="ui-agreements.poLines.title" />}>
                <div data-test-poline-title>
                  { orderLine ? (orderLine.title || '-') : <Spinner /> }
                </div>
              </KeyValue>
            </Col>
          </Row>
          <Row>
            <Col xs={3}>
              <KeyValue label="Order type">
                <div data-test-poline-order-type>
                  { order ? (order.orderType || '-') : <Spinner /> }
                </div>
              </KeyValue>
            </Col>
            <Col xs={3}>
              <KeyValue label="Order status">
                <div data-test-poline-order-status>
                  { order ? (order.workflowStatus || '-') : <Spinner /> }
                </div>
              </KeyValue>
            </Col>
            <Col xs={3}>
              <KeyValue label="Vendor">
                <div data-test-poline-organization>
                  { organization ? (organization.name || '-') : <Spinner /> }
                </div>
              </KeyValue>
            </Col>
            <Col xs={3}>
              <KeyValue label={<FormattedMessage id="ui-agreements.poLines.acqMethod" />}>
                <div data-test-poline-acq-method>
                  { orderLine ? (orderLine.acquisitionMethod || '-') : <Spinner /> }
                </div>
              </KeyValue>
            </Col>
          </Row>
        </div>
      </Card>
    );
  }
}
