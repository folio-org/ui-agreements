import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Headline,
  KeyValue,
  Row,
  Layout,
  MetaSection,
  NoValue,
} from '@folio/stripes/components';

import { resourceClasses } from '../../../constants';
import AddToBasketButton from '../../AddToBasketButton';

const propTypes = {
  pci: PropTypes.shape({
    id: PropTypes.string,
    accessEnd: PropTypes.string,
    accessStart: PropTypes.string,
    dateCreated: PropTypes.string,
    lastUpdated: PropTypes.string,
    name: PropTypes.string,
    pti: PropTypes.shape({
      url: PropTypes.string,
    }),
  }).isRequired,
};

const PCIInfo = ({ pci }) => {
  const renderAddTitleToBasketButton = () => {
    const { name: packageName } = pci;
    const entitlementOption = {
      class: resourceClasses.PCI,
      id: pci.id,
      name: pci.name,
      _object: pci,
    };
    return (
      <AddToBasketButton
        addButtonTooltipText={
          <FormattedMessage
            id="ui-agreements.eresources.addTitleButtonTooltip"
            values={{ packageName }}
          />
        }
        addLabel={
          <FormattedMessage id="ui-agreements.eresources.addTitleToBasket" />
        }
        item={entitlementOption}
        removeButtonTooltipText={
          <FormattedMessage
            id="ui-agreements.eresources.removeTitleButtonTooltip"
            values={{ packageName }}
          />
        }
      />
    );
  };

  const renderUrl = () => {
    const url = pci?.pti?.url;
    return url ? (
      <a href={url} rel="noopener noreferrer" target="_blank">
        {url}
      </a>
    ) : (
      <NoValue />
    );
  };

  return (
    <div id="pci-info">
      <Row>
        <Col xs={12}>
          <Headline size="xx-large" tag="h2">
            {pci.name}
          </Headline>
        </Col>
      </Row>
      <MetaSection
        contentId="pciInfoRecordMetaContent"
        createdDate={pci.dateCreated}
        hideSource
        id="pciInfoRecordMeta"
        lastUpdatedDate={pci.lastUpdated}
      />
      <Layout className="display-flex justified">
        <Headline size="large" tag="h3">
          <FormattedMessage id="ui-agreements.eresources.titleAvailability" />
        </Headline>
        <Layout>{renderAddTitleToBasketButton(pci)}</Layout>
      </Layout>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={
              <FormattedMessage id="ui-agreements.eresources.titleOnPlatformURL" />
            }
          >
            {renderUrl(pci)}
          </KeyValue>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={
              <FormattedMessage id="ui-agreements.eresources.accessibleFrom" />
            }
          >
            {pci?.accessStart ?? <NoValue />}
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue
            label={
              <FormattedMessage id="ui-agreements.eresources.accessibleUntil" />
            }
          >
            {pci?.accessEnd ?? <NoValue />}
          </KeyValue>
        </Col>
      </Row>
    </div>
  );
};

PCIInfo.propTypes = propTypes;

export default PCIInfo;
