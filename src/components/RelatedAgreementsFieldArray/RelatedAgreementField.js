import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Card,
  Col,
  FormattedUTCDate,
  KeyValue,
  Layout,
  Row,
  Tooltip,
} from '@folio/stripes/components';
import { AppIcon, Pluggable } from '@folio/stripes/core';

import { urls } from '../utilities';
import css from '../styles.css';

export default class RelatedAgreementField extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    }).isRequired,
    meta: PropTypes.shape({
      error: PropTypes.node,
    }).isRequired,
    onAgreementSelected: PropTypes.func.isRequired,
    agreement: PropTypes.shape({
      name: PropTypes.string,
      label: PropTypes.string,
    }),
  }

  static defaultProps = {
    agreement: {},
  }

  componentDidMount() {
    if (!get(this.props, 'input.value.id') && get(this.triggerButton, 'current')) {
      this.triggerButton.current.focus();
    }
  }

  renderLinkAgreementButton = value => {
    const {
      id,
      input: { name },
      onAgreementSelected,
    } = this.props;

    return (
      <Pluggable
        dataKey={id}
        onAgreementSelected={onAgreementSelected}
        renderTrigger={(props) => {
          this.triggerButton = props.buttonRef;

          const agreementName = get(this.props.agreement, 'name');
          const buttonProps = {
            'aria-haspopup': 'true',
            'buttonRef': this.triggerButton,
            'buttonStyle': value ? 'default' : 'primary',
            'id': `${id}-find-agreement-btn`,
            'marginBottom0': 'true',
            'name': this.props.input.name,
            'onClick': props.onClick
          };

          if (value) {
            return (
              <Tooltip
                text={<FormattedMessage id="ui-agreements.relatedAgreements.replaceAgreementSpecific" values={{ agreementName }} />}
                id={`${this.props.id}-license-button-tooltip`}
                triggerRef={this.triggerButton}
              >
                {({ ariaIds }) => (
                  <Button aria-labelledby={ariaIds.text} {...buttonProps}>
                    <FormattedMessage id="ui-agreements.relatedAgreements.replaceAgreement" />
                  </Button>
                )}
                </Tooltip>
            );
          }
          return (
            <Button {...buttonProps}>
              <FormattedMessage id="ui-agreements.relatedAgreements.linkAgreement" />
            </Button>
          );
        }}
        type="find-agreement"
      >
        <FormattedMessage id="ui-agreements.relatedAgreements.noPlugin" />
      </Pluggable>
    );
  }

  renderAgreement = () => {
    const { agreement } = this.props;

    return (
      <div>
        <Link
          data-test-agreement-card-name
          to={urls.agreementView(agreement.id)}
        >
          {agreement.name}
        </Link>
        <Row>
          <Col xs={6} md={4}>
            <KeyValue
              label={<FormattedMessage id="ui-agreements.agreements.startDate" />}
              value={agreement.startDate ? <FormattedUTCDate value={agreement.startDate} /> : '-'}
            />
          </Col>
          <Col xs={6} md={4}>
            <KeyValue
              label={<FormattedMessage id="ui-agreements.agreements.endDate" />}
              value={agreement.endDate ? <FormattedUTCDate value={agreement.endDate} /> : '-'}
            />
          </Col>
          <Col xs={12} md={4}>
            <KeyValue
              label={<FormattedMessage id="ui-agreements.agreements.agreementStatus" />}
              value={get(agreement, 'agreementStatus.label', '-')}
            />
          </Col>
        </Row>
      </div>
    );
  }

  renderEmpty = () => (
    <div>
      <Layout className="textCentered">
        <strong>
          <FormattedMessage id="ui-agreements.relatedAgreements.noneLinked" />
        </strong>
      </Layout>
      <Layout className="textCentered">
        <FormattedMessage id="ui-agreements.relatedAgreements.linkToStart" />
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
          <AppIcon app="agreements" size="small">
            <strong>
              <FormattedMessage id="ui-agreements.agreement" />
            </strong>
          </AppIcon>
        )}
        headerEnd={this.renderLinkAgreementButton(value)}
        id={id}
        roundedBorder
      >
        {value ? this.renderAgreement() : this.renderEmpty()}
        {touched && error ? this.renderError() : null}
      </Card>
    );
  }
}
