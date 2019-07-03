import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { AppIcon, Pluggable } from '@folio/stripes/core';
import { Button, Card, Col, KeyValue, Layout, Row } from '@folio/stripes/components';

export default class POLineField extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    input: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
    }).isRequired,
  }

  state = {
    poLine: undefined,
  }

  handlePOLineSelected = ([poLine]) => {
    this.props.input.onChange(poLine.id);
    this.setState({ poLine });
  }

  handlePOLineUnselected = () => {
    this.props.input.onChange(null);
    this.setState({ poLine: undefined });
  }

  renderLinkPOLineButton = () => (
    <Pluggable
      aria-haspopup="true"
      buttonProps={{ marginBottom0: true }}
      dataKey="poline"
      disableRecordCreation
      id={`poline-${this.props.index}-search-button`}
      marginBottom0
      searchLabel={<FormattedMessage id="ui-agreements.poLines.addPOLine" />}
      searchButtonStyle="primary"
      addLines={this.handlePOLineSelected}
      type="find-po-line"
    />
  )

  renderUnlinkPOLineButton = () => (
    <Button
      buttonStyle="danger"
      marginBottom0
      onClick={this.handlePOLineUnselected}
    >
      <FormattedMessage id="ui-agreements.poLines.unlinkPOLine" />
    </Button>
  )

  renderPOLineInfo = () => {
    const { poLine = {} } = this.state;

    return (
      <div>
        <Row>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-agreements.poLines.title" />}>
              {poLine.title || '-'}
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.poLines.acqMethod" />}>
              {poLine.acquisitionMethod || '-'}
            </KeyValue>
          </Col>
        </Row>
      </div>
    );
  }

  renderEmpty = () => (
    <div>
      <Layout className="textCentered">
        <strong>
          <FormattedMessage id="ui-agreements.poLines.noPOLineAdded" />
        </strong>
      </Layout>
      <Layout className="textCentered">
        <FormattedMessage id="ui-agreements.poLines.addPOLineToStart" />
      </Layout>
    </div>
  );

  render() {
    const { poLine = {} } = this.state;
    const polSelected = poLine.id !== undefined;

    return (
      <Card
        cardStyle={polSelected ? 'positive' : 'negative'}
        hasMargin
        headerStart={(
          <span>
            <AppIcon app="orders" size="small" />
            &nbsp;
            <strong>
              { polSelected ?
                <FormattedMessage id="ui-agreements.poLines.poLineWithNumber" values={poLine} /> :
                <FormattedMessage id="ui-agreements.poLines.poLine" />
              }
            </strong>
          </span>
        )}
        headerEnd={polSelected ? this.renderUnlinkPOLineButton() : this.renderLinkPOLineButton()}
        roundedBorder
      >
        { polSelected ? this.renderPOLineInfo() : this.renderEmpty() }
      </Card>
    );
  }
}
