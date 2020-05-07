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
import EResourceIdentifier from '../EResourceIdentifier';

export default class SerialResourceInfo extends React.Component {
  static propTypes = {
    eresourceClass: PropTypes.string,
    searchString: PropTypes.string,
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

  renderSerialResourceInfo = (titleInstance) => {
    return (
      <>
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
          <EResourceIdentifier titleInstance={titleInstance} type="ezb" />
          <EResourceIdentifier titleInstance={titleInstance} type="zdb" />
          <EResourceIdentifier titleInstance={titleInstance} type="eissn" />
          <EResourceIdentifier titleInstance={titleInstance} type="pissn" />
        </Row>
      </>
    );
  };

  render() {
    const { eresourceClass, searchString, titleInstance } = this.props;
    return eresourceClass === 'org.olf.kb.TitleInstance' ?
      (
        <div>
          {this.renderSerialResourceInfo(titleInstance)}
        </div>
      ) :
      (
        <Card
          cardStyle="positive"
          headerStart={(
            <Link
              to={`${urls.eresourceView(titleInstance.id)}${searchString}`}
            >
              <strong data-test-title-instance-name>{titleInstance.name ?? <NoValue />}</strong>
            </Link>
          )}
          id="title-details-monograph"
          roundedBorder
        >
          {this.renderSerialResourceInfo(titleInstance)}
        </Card>
      );
  }
}
