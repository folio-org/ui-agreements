import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Card,
  Col,
  FormattedUTCDate,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import Link from 'react-router-dom/Link';
import { urls } from '../utilities';
import EResourceIdentifier from '../EResourceIdentifier';

export default class MonographResourceInfo extends React.Component {
  static propTypes = {
    eresourceClass: PropTypes.string,
    searchString: PropTypes.string,
    titleInstance: PropTypes.shape({
      dateMonographPublished: PropTypes.string,
      id: PropTypes.string,
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

  renderMonographResourceInfo = (titleInstance) => {
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
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.firstAuthor" />}>
              <div data-test-title-instance-first-author>{titleInstance.firstAuthor ?? <NoValue />}</div>
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.firstEditor" />}>
              <div data-test-title-instance-first-editor>{titleInstance.firstEditor ?? <NoValue />}</div>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.datePublished" />}>
              <div data-test-title-instance-monograph-publication-date>
                {titleInstance.dateMonographPublished ?
                  <FormattedUTCDate value={titleInstance.dateMonographPublished} />
                  :
                  <NoValue />
                }
              </div>
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.edition" />}>
              <div data-test-title-instance-monograph-edition>{titleInstance.monographEdition ?? <NoValue />}</div>
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.volume" />}>
              <div data-test-title-instance-monograph-volume>{titleInstance.monographVolume ?? <NoValue />}</div>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <EResourceIdentifier titleInstance={titleInstance} type="isbn" />
          <EResourceIdentifier titleInstance={titleInstance} type="doi" />
        </Row>
      </>
    );
  };

  render() {
    const { eresourceClass, searchString, titleInstance = {} } = this.props;
    return eresourceClass === 'org.olf.kb.TitleInstance' ?
      (
        <div>
          {this.renderMonographResourceInfo(titleInstance)}
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
          {this.renderMonographResourceInfo(titleInstance)}
        </Card>
      );
  }
}
