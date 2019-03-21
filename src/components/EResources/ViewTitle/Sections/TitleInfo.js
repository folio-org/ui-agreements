import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Headline,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import EResourceAgreements from '../../EResourceAgreements';

export default class TitleInfo extends React.Component {
  static propTypes = {
    eresource: PropTypes.object,
    id: PropTypes.string,
    match: PropTypes.object,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.connectedEResourceAgreements = props.stripes.connect(EResourceAgreements);
  }

  renderIdentifier(type, width = 3) {
    const { eresource: { identifiers } } = this.props;

    if (!Array.isArray(identifiers) || !identifiers.length) return null;

    const entry = identifiers.find(i => i.identifier.ns.value === type);
    if (!entry) return null;

    let value = get(entry, ['identifier', 'value']);
    if (!value) return null;

    if (Array.isArray(value)) value = value.map(v => <div>{v}</div>);

    return (
      <Col xs={width}>
        <KeyValue
          label={<FormattedMessage id={`ui-agreements.identifier.${type}`} />}
          value={value}
        />
      </Col>
    );
  }

  render() {
    const { eresource } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.eresources.erInfo" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-agreements.eresources.erType" />}
              value={get(eresource, ['type', 'label'], '-')}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-agreements.eresources.publisher" />}
              value={get(eresource, ['publisher', 'label'], '-')}
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
        <Headline size="medium" faded>
          <FormattedMessage id="ui-agreements.eresources.erAgreements" />
        </Headline>
        <this.connectedEResourceAgreements
          key={`agreements-${eresource.id}`} // Force a remount when changing which eresource we're viewing
          type="title"
          {...this.props}
        />
      </Accordion>
    );
  }
}
