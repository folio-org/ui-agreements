import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Headline,
  KeyValue,
  Layout,
  Row,
} from '@folio/stripes/components';

import AddToBasketButton from '../AddToBasketButton';

export default class PackageInfo extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      eresource: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        reference: PropTypes.string,
        source: PropTypes.string,
      })
    }).isRequired,
  }

  render() {
    const { data: { eresource } } = this.props;
    const entitlementOption = {
      class: 'org.olf.kb.Pkg',
      id: eresource.id,
      name: eresource.name,
      _object: eresource,
    };

    return (
      <div id="package-info">
        <Row between="md">
          <Col xs={12} md={8}>
            <Headline
              size="xx-large"
              tag="h2"
            >
              {eresource.name}
            </Headline>
          </Col>
          <Col>
            <Layout className="marginTop1">
              <AddToBasketButton
                key={eresource.id}
                addLabel={<FormattedMessage id="ui-agreements.eresources.addPackageToBasket" />}
                removeLabel={<FormattedMessage id="ui-agreements.eresources.removePackage" />}
                item={entitlementOption}
                buttonProps={{ 'data-test-add-package-to-basket': true }}
              />
            </Layout>
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
      </div>
    );
  }
}
