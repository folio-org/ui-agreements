import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Link from 'react-router-dom/Link';
import {
  Card,
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { urls } from '../utilities';

const propTypes = {
  pkg: PropTypes.shape({
    name: PropTypes.string,
    resourceCount: PropTypes.number,
    vendor: PropTypes.shape({
      name: PropTypes.string,
    }),
    source: PropTypes.string,
    reference: PropTypes.string,
  }).isRequired,
  searchString: PropTypes.string,
};

const PackageCard = ({
  pkg,
  searchString = '',
}) => (
  <Card
    cardStyle="positive"
    headerStart={(
      <Link
        data-test-package-link
        to={`${urls.eresourceView(pkg?.id)}${searchString}`}
      >
        <strong>{pkg?.name ?? <NoValue />}</strong>
      </Link>
    )}
    roundedBorder
  >
    <Row>
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.count" />}>
          <div data-test-resource-count>{pkg?.resourceCount ?? <NoValue />}</div>
        </KeyValue>
      </Col>
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.provider" />}>
          <div data-test-vendor-name>{pkg?.vendor?.name ?? <NoValue />}</div>
        </KeyValue>
      </Col>
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.source" />}>
          <div data-test-package-source>{pkg?.source ?? <NoValue />}</div>
        </KeyValue>
      </Col>
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.reference" />}>
          <div data-test-package-reference>{pkg?.reference ?? <NoValue />}</div>
        </KeyValue>
      </Col>
    </Row>
  </Card>
);

PackageCard.propTypes = propTypes;
export default PackageCard;
