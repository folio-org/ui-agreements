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
import Link from 'react-router-dom/Link';
import { urls } from '../utilities';

export default class MonographResourceInfo extends React.Component {
  static propTypes = {
    renderIdentifier: PropTypes.func,
    titleInstance: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      subType: PropTypes.shape({
        label: PropTypes.string,
      }),
      type: PropTypes.shape({
        label: PropTypes.string,
      }),
    }).isRequired,
  }

  render() {
    const { renderIdentifier, titleInstance } = this.props;
    return (
      <Card
        cardStyle="positive"
        headerStart={(
          <Link
            to={urls.eresourceView(titleInstance.id)}
          >
            <strong data-test-title-instance-name>{titleInstance.name ?? <NoValue />}</strong>
          </Link>
        )}
        id="title-details-monograph"
        roundedBorder
      >
        <Row>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.type" />}>
              <div data-test-title-instance-type>{titleInstance.type?.label ?? <NoValue />}</div>
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.materialType" />}>
              <div data-test-title-instance-sub-type>{titleInstance.subType?.label ?? <NoValue />}</div>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          {renderIdentifier('ezb')}
          {renderIdentifier('zdb')}
          {renderIdentifier('eissn')}
          {renderIdentifier('pissn')}
        </Row>
      </Card>
    );
  }
}
