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

import EResourceCount from '../EResourceCount';
import EResourceLink from '../EResourceLink';
import EResourceProvider from '../EResourceProvider';

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
  pkg = {},
  searchString = '',
}) => (
  <Card
    cardStyle="positive"
    data-test-package-card
    headerStart={(
      <strong data-test-package-link>
        <EResourceLink eresource={pkg} searchString={searchString} />
      </strong>
    )}
    roundedBorder
  >
    <Row>
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.type" />}>
          <FormattedMessage id="ui-agreements.eresources.package" />
        </KeyValue>
      </Col>
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.count" />}>
          <div data-test-resource-count>
            <EResourceCount resource={pkg} />
          </div>
        </KeyValue>
      </Col>
      <Col xs={6}>
        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.provider" />}>
          <div data-test-vendor-name>
            <EResourceProvider resource={pkg} />
          </div>
        </KeyValue>
      </Col>
    </Row>
    <Row>
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.source" />}>
          <div data-test-package-source>{pkg?.source ?? pkg?.authority ?? <NoValue />}</div>
        </KeyValue>
      </Col>
      <Col xs={9}>
        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.reference" />}>
          <div data-test-package-reference>{pkg?.reference ?? <NoValue />}</div>
        </KeyValue>
      </Col>
    </Row>
  </Card>
);

PackageCard.propTypes = propTypes;
export default PackageCard;
