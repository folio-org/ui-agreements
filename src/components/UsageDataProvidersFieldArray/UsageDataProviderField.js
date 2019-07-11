import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Card,
  Layout,
} from '@folio/stripes/components';
import { AppIcon, Pluggable } from '@folio/stripes/core';

export default class UsageDataProviderField extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    index: PropTypes.number.isRequired,
    input: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      value: PropTypes.string,
    }).isRequired,
    onUDPSelected: PropTypes.func.isRequired,
    onUDPUnselected: PropTypes.func.isRequired,
    udp: PropTypes.shape({
      label: PropTypes.string,
    }),
  }

  static defaultProps = {
    udp: {},
  }

  renderEmpty = () => (
    <Layout className="padding-bottom-gutter" data-test-udp-empty-message>
      <FormattedMessage id="ui-agreements.usageData.agreementHasNone" />
    </Layout>
  );

  renderLinkUDPButton = () => (
    <Pluggable
      aria-haspopup="true"
      dataKey="udp"
      id={`udp-${this.props.index}-search-button`}
      marginBottom0
      onUDPSelected={this.props.onUDPSelected}
      searchLabel={<FormattedMessage id="ui-agreements.usageData.addUDP" />}
      searchButtonStyle="primary"
      type="find-erm-usage-data-provider"
    >
      <FormattedMessage id="ui-agreements.usageData.noUDPPlugin" />
    </Pluggable>
  )

  renderUnlinkUDPButton = () => (
    <Button
      buttonStyle="danger"
      id={`clickable-unlink-udp-${this.props.index}`}
      marginBottom0
      onClick={this.props.onUDPUnselected}
    >
      <FormattedMessage id="ui-agreements.usageData.unlinkUDP" />
    </Button>
  )


  renderUDP = () => {
    const { udp } = this.props;

    return (
      <div>
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
          <FormattedMessage id="ui-agreements.usageData.noUDPAdded" />
        </strong>
      </Layout>
      <Layout className="textCentered">
        <FormattedMessage id="ui-agreements.usageData.addUDPToStart" />
      </Layout>
    </div>
  )

  render() {
    const { id, input: { value } } = this.props;

    return (
      <Card
        cardStyle={value ? 'positive' : 'negative'}
        hasMargin
        headerStart={(
          <AppIcon app="erm-usage" size="small">
            <FormattedMessage id="ui-agreements.usageData.usageDataProvider" />
          </AppIcon>
        )}
        headerEnd={value ? this.renderUnlinkUDPButton() : this.renderLinkUDPButton()}
        id={id}
        roundedBorder
      >
        { value ? this.renderUDP() : this.renderEmpty() }
      </Card>
    );
  }
}
