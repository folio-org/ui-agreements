import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Headline,
  KeyValue,
  Row,
  Layout,
  NoValue,
} from '@folio/stripes/components';

import AddToBasketButton from '../AddToBasketButton';

export default class PCIInfo extends React.Component {
  static propTypes = {
    pci: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
  }

  renderAddTitleToBasketButton = (pci) => {
    const { name: packageName } = pci;

    return (
      <AddToBasketButton
        addButtonTooltipText={<FormattedMessage id="ui-agreements.eresources.addTitleButtonTooltip" values={{ packageName }} />}
        addLabel={<FormattedMessage id="ui-agreements.eresources.addTitleToBasket" />}
        item={pci}
        removeButtonTooltipText={<FormattedMessage id="ui-agreements.eresources.removeTitleButtonTooltip" values={{ packageName }} />}
      />
    );
  }

  renderUrl = (pci) => {
    const url = pci?.pti?.url;
    return url ? (
      <a
        href={url}
        rel="noopener noreferrer"
        target="_blank"
      >
        {url}
      </a>
    ) : <NoValue />;
  }

  render() {
    const { pci } = this.props;
    return (
      <div id="pci-info">
        <Row>
          <Col xs={12}>
            <Headline
              size="xx-large"
              tag="h2"
            >
              {pci.name}
            </Headline>
          </Col>
        </Row>
        <Layout className="display-flex justified">
          <Headline size="large" tag="h3">
            <FormattedMessage id="ui-agreements.eresources.titleAvailability" />
          </Headline>
          <Layout>
            {this.renderAddTitleToBasketButton(pci)}
          </Layout>
        </Layout>
        <Row>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.titleOnPlatformURL" />}>
              {this.renderUrl(pci)}
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.accessibleFrom" />}>
              {pci?.accessStart ?? <NoValue />}
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.accessibleUntil" />}>
              {pci?.accessEnd ?? <NoValue />}
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.suppressFromDiscovery" />}>
              <div data-test-pci-suppress-from-discovery>
                <FormattedMessage id={`ui-agreements.${pci?.suppressFromDiscovery ? 'yes' : 'no'}`} />
              </div>
            </KeyValue>
          </Col>
        </Row>
      </div>
    );
  }
}
