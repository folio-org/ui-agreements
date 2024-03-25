import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Card, Col, KeyValue, NoValue, Row } from '@folio/stripes/components';

import { AppIcon } from '@folio/stripes/core';

const propTypes = {
  headerEnd: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  resource: PropTypes.object,
};

const ErrorCard = ({
  headerEnd,
  resource,
}) => {
  const error = resource.reference_object;
  const cardHeader = (resource.reference && resource.authority) ? `${resource.reference} - ${resource.authority}` : (resource.authority ? resource.authority : resource.reference);

  return (
    <Card
      cardStyle="positive"
      data-test-error-card
      data-testid="errorCard"
      headerEnd={headerEnd}
      headerStart={(
        <AppIcon app="e-holdings" size="small">
          <strong data-test-error-card-header>
            {cardHeader}
          </strong>
        </AppIcon>
      )}
      roundedBorder
    >
      <Row>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.agreementLines.resourceError" />}>
            <div data-test-error>
              {error?.error ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
        <Col xs={9}>
          <KeyValue label={<FormattedMessage id="ui-agreements.agreementLines.resourceError.message" />}>
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
