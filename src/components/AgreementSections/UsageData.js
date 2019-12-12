import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import Link from 'react-router-dom/Link';

import {
  Accordion,
  Badge,
  Card,
  KeyValue,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import { urls } from '../utilities';

export default class UsageData extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      usageDataProviders: PropTypes.arrayOf(
        PropTypes.shape({
          remoteId: PropTypes.string.isRequired,
          remoteId_object: PropTypes.shape({
            label: PropTypes.string,
          }).isRequired,
          usageDataProviderNote: PropTypes.string,
        })
      ),
    }).isRequired,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  }

  renderUDPs = () => (
    this.props.agreement.usageDataProviders.map((udp, index) => (
      <Card
        cardStyle="positive"
        hasMargin
        headerStart={(
          <AppIcon app="erm-usage" size="small">
            <Link
              data-test-udp-link
              to={urls.udpView(udp.remoteId)}
            >
              <strong>{get(udp, 'remoteId_object.label', udp.remoteId)}</strong>
            </Link>
          </AppIcon>
        )}
        id={`udp-card-${udp.remoteId}`}
        key={index}
        roundedBorder
      >
        <KeyValue
          data-props-udp-note
          label={<FormattedMessage id="ui-agreements.usageData.note" />}
        >
          {udp.usageDataProviderNote || '-'}
        </KeyValue>
      </Card>
    ))
  )

  renderEmpty = () => (
    <FormattedMessage id="ui-agreements.usageData.agreementHasNone" />
  );

  renderBadge = () => (
    <Badge>{get(this.props.agreement, 'usageDataProviders.length', 0)}</Badge>
  )

  render() {
    const {
      agreement: { usageDataProviders = [] },
      id,
      onToggle,
      open,
    } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={<FormattedMessage id="ui-agreements.usageData" />}
        onToggle={onToggle}
        open={open}
      >
        { usageDataProviders.length ? this.renderUDPs() : this.renderEmpty() }
      </Accordion>
    );
  }
}
