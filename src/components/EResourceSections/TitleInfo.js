import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Col,
  Headline,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import { getResourceIdentifier } from '../utilities';

export default class TitleInfo extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      eresource: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.shape({
          label: PropTypes.string,
        }),
        publisher: PropTypes.shape({
          label: PropTypes.string,
        }),
      })
    }).isRequired,
  }

  renderIdentifier(type, width = 3) {
    const identifier = getResourceIdentifier(this.props.data.eresource, type);
    if (!identifier) return null;

    return (
      <Col xs={width}>
        <KeyValue
          label={<FormattedMessage id={`ui-agreements.identifier.${type}`} />}
          value={identifier}
        />
      </Col>
    );
  }

  render() {
    const { data: { eresource } } = this.props;
    return (
      <div id="title-info">
        <Row>
          <Col xs={12}>
            <Headline
              size="xx-large"
              tag="h2"
            >
              {eresource.name}
            </Headline>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-agreements.eresources.erType" />}
              value={get(eresource, 'type.label', '-')}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-agreements.eresources.publisher" />}
              value={get(eresource, 'publisher.label', '-')}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-agreements.eresources.firstAuthor" />}
              value={get(eresource, 'firstAuthor', '-')}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-agreements.eresources.firstEditor" />}
              value={get(eresource, 'firstEditor', '-')}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-agreements.eresources.datePublished" />}
              value={get(eresource, 'dateMonographPublished', '-')}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-agreements.eresources.edition" />}
              value={get(eresource, 'monographEdition', '-')}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-agreements.eresources.volume" />}
              value={get(eresource, 'monographVolume', '-')}
            />
          </Col>
        </Row>
        <Row>
          {this.renderIdentifier('doi')}
          {this.renderIdentifier('isbn')}
          {this.renderIdentifier('ezb')}
          {this.renderIdentifier('zdb')}
        </Row>
        <Row>
          {this.renderIdentifier('pissn')}
          {this.renderIdentifier('eissn')}
        </Row>
      </div>
    );
  }
}
