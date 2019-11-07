import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
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
      id: PropTypes.string,
      poLineNumber: PropTypes.string,
      title: PropTypes.string,
    }),
  }

  static defaultProps = {
    poLine: {},
  }

  constructor(props) {
    super(props);

    this.findPOLineButtonRef = React.createRef();
  }

  state = {
    poLine: {
      poLineNumber: '?'
    },
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.poLine.id && props.poLine.id) {
      return { poLine: props.poLine };
    }

    return null;
  }

  componentDidMount() {
    if (!this.props.input.value && this.findPOLineButtonRef.current) {
      this.findPOLineButtonRef.current.focus();
    }
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
      addLines={this.handlePOLineSelected}
      dataKey="poline"
      disableRecordCreation
      isSingleSelect
      renderTrigger={(props) => (
        <Button
          aria-haspopup="true"
          buttonRef={this.findPOLineButtonRef}
          buttonStyle="primary"
          id={`poline-${this.props.index}-search-button`}
          marginBottom0
          onClick={props.onClick}
        >
          <FormattedMessage id="ui-agreements.poLines.linkPOLine" />
        </Button>
      )}
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
          <FormattedMessage id="ui-agreements.poLines.noPOLineLinked" />
        </strong>
      </Layout>
      <Layout className="textCentered">
        <FormattedMessage id="ui-agreements.poLines.linkPOLineToStart" />
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
            <AppIcon app="orders" size="small">
              <strong>
                { value ?
                  <FormattedMessage id="ui-agreements.poLines.poLineWithNumber" values={this.state.poLine} /> :
                  <FormattedMessage id="ui-agreements.poLines.poLine" />
                }
              </strong>
            </AppIcon>
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
