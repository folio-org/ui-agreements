import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Headline,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import AcquisitionOptions from '../sections/AcquisitionOptions';
import EResourceAgreements from '../EResourceAgreements';
import getResourceIdentifier from '../utilities/getResourceIdentifier';

class ViewTitle extends React.Component {
  static propTypes = {
  };

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
    const { data } = this.props;

    return (
      <div id="title-view">
        <div id="title-info">
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-agreements.eresources.erType" />}
                value={get(data.eresource, 'type.label', '-')}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-agreements.eresources.publisher" />}
                value={get(data.eresource, 'publisher.label', '-')}
              />
            </Col>
            { this.renderIdentifier('pissn', 2) }
            { this.renderIdentifier('eissn', 2) }
          </Row>
          <Row>
            { this.renderIdentifier('doi') }
            { this.renderIdentifier('ezb') }
            { this.renderIdentifier('zdb') }
            { this.renderIdentifier('isbn') }
          </Row>
        </div>
        <div id="title-agreements">
          <Headline size="medium" faded>
            <FormattedMessage id="ui-agreements.eresources.erAgreements" />
          </Headline>
          <EResourceAgreements
            agreements={data.entitlements}
            eResourceType="title"
          />
        </div>
        <AcquisitionOptions
          eresource={data.eresource}
          options={data.entitlementOptions}
        />
      </div>
    );
  }
}

export default ViewTitle;
