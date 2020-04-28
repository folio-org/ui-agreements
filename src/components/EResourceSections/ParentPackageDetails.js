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

export default class ParentPackageDetails extends React.Component {
  static propTypes = {
    pkg: PropTypes.shape({
      name: PropTypes.string,
      resourceCount: PropTypes.number,
      vendor: PropTypes.shape({
        name: PropTypes.string,
      }),
      source: PropTypes.string,
      reference: PropTypes.string,
    }).isRequired,
  }

  render() {
    const { pkg } = this.props;

    return (
      <Card
        cardStyle="positive"
        hasMargin
        headerStart={(
          <Link
            data-test-agreement-link
            to={urls.eresourceView(pkg?.id)}
          >
            {pkg?.name ?? <NoValue />}
          </Link>
            )}
        id="parent-package-details"
        roundedBorder
      >
        <Row>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.count" />}>
              {pkg?.resourceCount ?? <NoValue />}
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.provider" />}>
              {pkg?.vendor?.name ?? <NoValue />}
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.source" />}>
              {pkg?.source ?? <NoValue />}
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.reference" />}>
              {pkg?.reference ?? <NoValue />}
            </KeyValue>
          </Col>
        </Row>
      </Card>
    );
  }
}
