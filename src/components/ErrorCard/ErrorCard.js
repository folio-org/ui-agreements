import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Card, Col, KeyValue, NoValue, Row } from '@folio/stripes/components';

const propTypes = {
  error: PropTypes.shape({
    number: PropTypes.number,
    message: PropTypes.string,
  }).isRequired,
  headerEnd: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  headerStart: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

const ErrorCard = ({
  error,
  headerEnd,
  headerStart
}) => {
  return (
    <Card
      cardStyle="positive"
      data-test-error-card
      data-testid="errorCard"
      headerEnd={headerEnd}
      headerProps={{ 'data-test-error-card-header': true }}
      headerStart={headerStart}
      roundedBorder
    >
      <Row>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.errorNumber" />}>
            <div data-test-error-number>
              {error?.number ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
        <Col xs={9}>
          <KeyValue label={<FormattedMessage id="ui-agreements.errorMessage" />}>
            <div data-test-error-message>
              {error?.message ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
      </Row>
    </Card>

  );
};

ErrorCard.propTypes = propTypes;
export default ErrorCard;
