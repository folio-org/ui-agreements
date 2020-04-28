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
      id: PropTypes.number,
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
        hasMargin
        headerStart={(
          <Link
            to={urls.eresourceView(titleInstance.id)}
          >
            {titleInstance.name || <NoValue />}
          </Link>
        )}
        id="title-details-monograph"
        roundedBorder
      >
        <Row>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.type" />}>
              {titleInstance.type?.label || <NoValue />}
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.materialType" />}>
              {titleInstance.subType?.label || <NoValue />}
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
