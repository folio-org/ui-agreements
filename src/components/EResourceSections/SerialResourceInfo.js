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
import Identifier from './Identifier';

export default class SerialResourceInfo extends React.Component {
  static propTypes = {
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
    const { titleInstance } = this.props;
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
          <Identifier titleInstance={titleInstance} type="ezb" />
          <Identifier titleInstance={titleInstance} type="zdb" />
          <Identifier titleInstance={titleInstance} type="eissn" />
          <Identifier titleInstance={titleInstance} type="pissn" />
        </Row>
      </Card>
    );
  }
}
