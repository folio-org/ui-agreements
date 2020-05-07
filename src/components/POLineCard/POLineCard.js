import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Card,
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

const propTypes = {
  children: PropTypes.node,
  headerEnd: PropTypes.node,
  id: PropTypes.string,
  poLine: PropTypes.shape({
    acquisitionMethod: PropTypes.string,
    poLineNumber: PropTypes.string,
    titleOrPackage: PropTypes.string,
  }).isRequired,
};

const POLineCard = ({
  children,
  headerEnd,
  id,
  poLine,
}) => (
  <Card
    cardStyle="positive"
    headerEnd={headerEnd}
    headerStart={(
      <AppIcon app="orders" size="small">
        <strong data-test-po-line-number>
          <FormattedMessage id="ui-agreements.poLines.poLineWithNumber" values={{ poLineNumber: poLine.poLineNumber }} />
        </strong>
      </AppIcon>
    )}
    id={id}
    roundedBorder
  >
    <div>
      <Row>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.poLines.acqMethod" />}>
            <div data-test-poline-acq-method>
              {poLine.acquisitionMethod ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
      </Row>
      <Row>
        <Col xs={9}>
          <KeyValue label={<FormattedMessage id="ui-agreements.poLines.title" />}>
            <div data-test-poline-title>
              {poLine.titleOrPackage ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
      </Row>
    </div>
    {children}
  </Card>
);

POLineCard.propTypes = propTypes;
export default POLineCard;
