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
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-agreements.eresources.erType" />}
              value={get(eresource, 'type.label', '-')}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-agreements.eresources.publisher" />}
              value={get(eresource, 'publisher.label', '-')}
            />
          </Col>
          {this.renderIdentifier('pissn', 2)}
          {this.renderIdentifier('eissn', 2)}
        </Row>
        <Row>
          {this.renderIdentifier('doi')}
          {this.renderIdentifier('ezb')}
          {this.renderIdentifier('zdb')}
          {this.renderIdentifier('isbn')}
        </Row>
      </div>
    );
  }
}
