import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Headline,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import EResourceAgreements from '../../EResourceAgreements';
import AddToBasketButton from '../../../AddToBasketButton';

class PackageInfo extends React.Component {
  static propTypes = {
    eresource: PropTypes.object,
    id: PropTypes.string,
    match: PropTypes.object,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.connectedEResourceAgreements = props.stripes.connect(EResourceAgreements);
    this.connectedAddToBasketButton = props.stripes.connect(AddToBasketButton);
  }

  getIdentifier(type) {
    const { eresource: { identifiers } } = this.props;

    if (!Array.isArray(identifiers) || !identifiers.length) return '-';

    const entry = identifiers.find(i => i.identifier.ns.value === type);
    if (!entry) return '-';

    return entry.identifier.value;
  }

  render() {
    const { eresource } = this.props;
    const entitlementOption = {
      class: 'org.olf.kb.Pkg',
      id: eresource.id,
      name: eresource.name,
      _object: eresource,
    };

    return (
      <Accordion
        id={this.props.id}
        label="Package information"
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={6}>
            <this.connectedAddToBasketButton
              key={eresource.id}
              addLabel={<FormattedMessage id="ui-agreements.eresources.addPackage" />}
              item={entitlementOption}
              buttonProps={{ 'data-test-add-package-to-basket': true }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <KeyValue
              label="Provider"
              value="-"
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label="Source"
              value={eresource.source || '-'}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label="Reference"
              value={eresource.reference || '-'}
            />
          </Col>
        </Row>
        <Headline size="medium" faded>
          <FormattedMessage id="ui-agreements.eresources.erAgreements" />
        </Headline>
        <this.connectedEResourceAgreements
          key={`agreements-${eresource.id}`} // Force a remount when changing which eresource we're viewing
          type="package"
          {...this.props}
        />
      </Accordion>
    );
  }
}

export default PackageInfo;
