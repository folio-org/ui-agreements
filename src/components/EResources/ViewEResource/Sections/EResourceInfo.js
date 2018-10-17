import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import {
  Accordion,
  Col,
  Headline,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import { EResourceAgreements } from '.';

class EResourceInfo extends React.Component {
  static propTypes = {
    eresource: PropTypes.object,
    id: PropTypes.string,
    match: PropTypes.object,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    intl: intlShape,
  };

  constructor(props) {
    super(props);

    this.connectedEResourceAgreements = props.stripes.connect(EResourceAgreements);
  }

  getIdentifier(type) {
    const { eresource: { identifiers } } = this.props;

    if (!Array.isArray(identifiers) || !identifiers.length) return '-';

    const entry = identifiers.find(i => i.identifier.ns.value === type);
    if (!entry) return '-';

    return entry.identifier.value;
  }

  render() {
    const { eresource, intl } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={intl.formatMessage({ id: 'ui-erm.eresources.erInfo' })}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={4}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-erm.eresources.erType' })}
              value={get(eresource, ['type', 'label'], '-')}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-erm.eresources.publisher' })}
              value={get(eresource, ['publisher', 'label'], '-')}
            />
          </Col>
          <Col xs={2}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-erm.eresources.pIssn' })}
              value={this.getIdentifier('pissn')}
            />
          </Col>
          <Col xs={2}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-erm.eresources.eIssn' })}
              value={this.getIdentifier('eissn')}
            />
          </Col>
        </Row>
        <Headline size="medium" faded>
          <FormattedMessage id="ui-erm.eresources.erAgreements" />
        </Headline>
        <this.connectedEResourceAgreements
          key={`agreements-${eresource.id}`} // Force a remount when changing which eresource we're viewing
          {...this.props}
        />
      </Accordion>
    );
  }
}

export default injectIntl(EResourceInfo);
