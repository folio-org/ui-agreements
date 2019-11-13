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
} from '@folio/stripes/components';
import { AppIcon, Pluggable } from '@folio/stripes/core';

import { urls } from '../utilities';
import css from '../styles.css';

export default class RelatedAgreementField extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    input: PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    }).isRequired,
    meta: PropTypes.shape({
      error: PropTypes.node,
    }).isRequired,
    onAgreementSelected: PropTypes.func.isRequired,
    agreement: PropTypes.shape({
      label: PropTypes.string,
    }),
  }

  static defaultProps = {
    agreement: {},
  }

  constructor(props) {
    super(props);

    this.findAgreementButtonRef = React.createRef();
  }

  componentDidMount() {
    if (!get(this.props, 'input.value.id') && this.findAgreementButtonRef.current) {
      this.findAgreementButtonRef.current.focus();
    }
  }

  renderLinkAgreementButton = value => {
    const { id, onAgreementSelected } = this.props;

    return (
      <Pluggable
        dataKey={id}
        onAgreementSelected={onAgreementSelected}
        renderTrigger={(props) => (
          <Button
            aria-haspopup="true"
            buttonRef={this.findAgreementButtonRef}
            buttonStyle={value ? 'default' : 'primary'}
            id={`${id}-find-agreement-btn`}
            marginBottom0
            onClick={props.onClick}
          >
            <FormattedMessage id={`ui-agreements.relatedAgreements.${value ? 'replace' : 'link'}Agreement`} />
          </Button>
        )}
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
        { value ? this.renderAgreement() : this.renderEmpty() }
        { touched && error ? this.renderError() : null }
      </Card>
    );
  }
}
