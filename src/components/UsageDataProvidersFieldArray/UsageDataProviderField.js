import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Card, Layout } from '@folio/stripes/components';
import { AppIcon, Pluggable } from '@folio/stripes/core';

import css from '../styles.css';

export default class UsageDataProviderField extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    index: PropTypes.number.isRequired,
    input: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      value: PropTypes.string,
    }).isRequired,
    meta: PropTypes.shape({
      error: PropTypes.node,
    }).isRequired,
    onUDPSelected: PropTypes.func.isRequired,
    udp: PropTypes.shape({
      label: PropTypes.string,
    }),
  }

  static defaultProps = {
    udp: {},
  }

  renderLinkUDPButton = value => (
    <Pluggable
      aria-haspopup="true"
      dataKey="udp"
      id={`udp-${this.props.index}-search-button`}
      marginBottom0
      onUDPSelected={this.props.onUDPSelected}
      searchLabel={<FormattedMessage id={`ui-agreements.usageData.${value ? 'replace' : 'link'}UDP`} />}
      searchButtonStyle={value ? 'default' : 'primary'}
      type="find-erm-usage-data-provider"
    >
      <FormattedMessage id="ui-agreements.usageData.noUDPPlugin" />
    </Pluggable>
  )

  renderUDP = () => {
    const { udp } = this.props;

    return (
      <div data-test-udp-card-name>
        <AppIcon app="erm-usage" size="small">
          <strong>{udp.label}</strong>
        </AppIcon>
      </div>
    );
  }

  renderEmpty = () => (
    <div>
      <Layout className="textCentered">
        <strong>
          <FormattedMessage id="ui-agreements.usageData.noUDPLinked" />
        </strong>
      </Layout>
      <Layout className="textCentered">
        <FormattedMessage id="ui-agreements.usageData.linkUDPToStart" />
      </Layout>
    </div>
  )

  renderError = () => (
    <Layout className={`textCentered ${css.error}`}>
      <strong>
        {this.props.meta.error}
      </strong>
    </Layout>
  )

  render() {
    const {
      id,
      input: { value },
      meta: { error, touched }
    } = this.props;

    return (
      <Card
        cardStyle={value ? 'positive' : 'negative'}
        hasMargin
        headerStart={(
          <AppIcon app="erm-usage" size="small">
            <strong>
              <FormattedMessage id="ui-agreements.usageData.usageDataProvider" />
            </strong>
          </AppIcon>
        )}
        headerEnd={this.renderLinkUDPButton(value)}
        id={id}
        roundedBorder
      >
        { value ? this.renderUDP() : this.renderEmpty() }
        { touched && error ? this.renderError() : null }
      </Card>
    );
  }
}
