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
      value: PropTypes.string,
    }).isRequired,
    poLine: PropTypes.shape({
      acquisitionMethod: PropTypes.string,
      poLineNumber: PropTypes.string,
      title: PropTypes.string,
    }),
  }

  static defaultProps = {
    poLine: {},
  }

  state = {
    poLine: {},
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.poLine.id && props.poLine.id) {
      return { poLine: props.poLine };
    }

    return null;
  }

  handlePOLineSelected = ([poLine]) => {
    this.props.input.onChange(poLine.id);
    this.setState({ poLine });
  }

  handlePOLineUnselected = () => {
    this.props.input.onChange(null);
    this.setState({ poLine: {} });
  }

  renderLinkPOLineButton = () => (
    <Pluggable
      aria-haspopup="true"
      buttonProps={{ marginBottom0: true }}
      dataKey="poline"
      disableRecordCreation
      id={`poline-${this.props.index}-search-button`}
      isSingleSelect
      marginBottom0
      searchLabel={<FormattedMessage id="ui-agreements.poLines.addPOLine" />}
      searchButtonStyle="primary"
      addLines={this.handlePOLineSelected}
      type="find-po-line"
    >
      <FormattedMessage id="ui-agreements.poLines.noPOLinePlugin" />
    </Pluggable>
  )

  renderUnlinkPOLineButton = () => (
    <Button
      buttonStyle="danger"
      id={`clickable-unlink-poline-${this.props.index}`}
      marginBottom0
      onClick={this.handlePOLineUnselected}
    >
      <FormattedMessage id="ui-agreements.poLines.unlinkPOLine" />
    </Button>
  )

  renderPOLineInfo = () => {
    const { poLine } = this.state;

    return (
      <div>
        <Row>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-agreements.poLines.title" />}>
              <div data-test-poline-title>
                {poLine.title || '-'}
              </div>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.poLines.acqMethod" />}>
              <div data-test-poline-acq-method>
                {poLine.acquisitionMethod || '-'}
              </div>
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
    const { input: { value } } = this.props;

    return (
      <Card
        cardStyle={value ? 'positive' : 'negative'}
        hasMargin
        headerStart={(
          <span>
            <AppIcon app="orders" size="small" />
            &nbsp;
            <strong>
              { value ?
                <FormattedMessage id="ui-agreements.poLines.poLineWithNumber" values={this.state.poLine} /> :
                <FormattedMessage id="ui-agreements.poLines.poLine" />
              }
            </strong>
          </span>
        )}
        headerEnd={value ? this.renderUnlinkPOLineButton() : this.renderLinkPOLineButton()}
        id={`edit-poline-card-${this.props.index}`}
        roundedBorder
      >
        { value ? this.renderPOLineInfo() : this.renderEmpty() }
      </Card>
    );
  }
}
