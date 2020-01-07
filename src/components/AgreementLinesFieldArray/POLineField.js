import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Card,
  Col,
  KeyValue,
  Layout,
  Tooltip,
  Row,
} from '@folio/stripes/components';
import { AppIcon, Pluggable } from '@folio/stripes/core';

import css from '../styles.css';

export default class POLineField extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    input: PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    }).isRequired,
    meta: PropTypes.shape({
      error: PropTypes.node,
    }).isRequired,
    onPOLineSelected: PropTypes.func.isRequired,
    poLine: PropTypes.shape({
      acquisitionMethod: PropTypes.string,
      poLineNumber: PropTypes.string,
      title: PropTypes.string,
    }),
  }

  static defaultProps = {
    poLine: {},
  }

  componentDidMount() {
    if (!get(this.props, 'input.value') && get(this.triggerButton, 'current')) {
      this.triggerButton.current.focus();
    }
  }

  renderLinkPOLineButton = value => {
    const { id, input: { name }, onPOLineSelected } = this.props;

    return (
      <Pluggable
        addLines={poLines => onPOLineSelected(poLines[0])}
        dataKey={id}
        isSingleSelect
        renderTrigger={(props) => {
          this.triggerButton = props.buttonRef;
          return (
            value ? 
              <Tooltip
                text={<FormattedMessage id="ui-agreements.poLines.replacePOLineSpecific" values={{ POLineTitle: this.props.poLine ? this.props.poLine.title : ''}} />}
                id={`${this.props.id}-po-line-button-tooltip`}
                triggerRef={this.triggerButton}
              >
                {({ ariaIds }) => (
                  <Button
                    aria-haspopup="true"
                    aria-labelledby={ariaIds.text}
                    buttonRef={this.triggerButton}
                    buttonStyle='default'
                    data-test-po-line-select-po-line
                    id={`${id}-find-poline-btn`}
                    marginBottom0
                    name={name}
                    onClick={props.onClick}
                  >
                    <FormattedMessage id={`ui-agreements.poLines.replacePOLine`} />
                  </Button>
                )}
              </Tooltip> :
              <Button
              aria-haspopup="true"
              buttonRef={this.triggerButton}
              buttonStyle='primary'
              data-test-po-line-select-po-line
              id={`${id}-find-poline-btn`}
              marginBottom0
              name={name}
              onClick={props.onClick}
              >
                <FormattedMessage id={`ui-agreements.poLines.linkPOLine`} />
              </Button>
          );
        }}
        type="find-po-line"
      >
        <FormattedMessage id="ui-agreements.poLines.noPOLinePlugin" />
      </Pluggable>
    );
  }

  renderPOLine = () => {
    const { poLine } = this.props;

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
  )

  renderError = () => (
    <Layout
      className={`textCentered ${css.error}`}
      data-test-error
    >
      <strong>
        {this.props.meta.error}
      </strong>
    </Layout>
  )

  render() {
    const {
      id,
      input: { value },
      meta: { error, touched },
      poLine = {},
    } = this.props;

    return (
      <Card
        cardStyle={value ? 'positive' : 'negative'}
        hasMargin
        headerStart={(
          <AppIcon app="orders" size="small">
            <strong data-test-po-line-number>
              {poLine.poLineNumber ?
                <FormattedMessage id="ui-agreements.poLines.poLineWithNumber" values={{ poLineNumber: poLine.poLineNumber }} /> :
                <FormattedMessage id="ui-agreements.poLines.poLine" />
              }
            </strong>
          </AppIcon>
        )}
        headerEnd={this.renderLinkPOLineButton(value)}
        id={id}
        roundedBorder
      >
        {value ? this.renderPOLine() : this.renderEmpty()}
        {touched && error ? this.renderError() : null}
      </Card>
    );
  }
}
