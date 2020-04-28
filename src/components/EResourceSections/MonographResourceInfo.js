import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
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
      dateMonographPublished: PropTypes.string,
      id: PropTypes.number,
      firstAuthor: PropTypes.string,
      firstEditor: PropTypes.string,
      monographEdition: PropTypes.string,
      monographVolume: PropTypes.string,
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
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.firstAuthor" />}>
              {titleInstance.firstAuthor || <NoValue />}
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.firstEditor" />}>
              {titleInstance.firstEditor || <NoValue />}
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.datePublished" />}>
              {titleInstance.dateMonographPublished ?
                <FormattedDate value={titleInstance.dateMonographPublished} />
                :
                <NoValue />
              }
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.edition" />}>
              {titleInstance.monographEdition || <NoValue />}
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.volume" />}>
              {titleInstance.monographVolume || <NoValue />}
            </KeyValue>
          </Col>
        </Row>
        <Row>
          {renderIdentifier('isbn')}
          {renderIdentifier('doi')}
        </Row>
      </Card>
    );
  }
}
