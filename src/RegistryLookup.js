import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';

import {
  Button,
  Card,
  Col,
  FormattedUTCDate,
  KeyValue,
  Layout,
  NoValue,
  Row,
  Tooltip
} from '@folio/stripes/components';

import { AppIcon, Pluggable } from '@folio/stripes/core';

import { urls } from './components/utilities';

// This must return a function to render a link button

const propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string
  }),
  onResourceSelected: PropTypes.func,
  resource: PropTypes.object
};

const AgreementLookupComponent = ({ disabled, id, input: { name, value }, onResourceSelected, resource }) => {
  let triggerButton = useRef(null);

  const renderAgreementLinkButton = (v) => (
    <Pluggable
      dataKey={id}
      onAgreementSelected={onResourceSelected}
      renderTrigger={(pluggableRenderProps) => {
        triggerButton = pluggableRenderProps.buttonRef;

        const agreementName = resource?.name;
        const buttonProps = {
          'aria-haspopup': 'true',
          'buttonRef': triggerButton,
          'buttonStyle': v ? 'default' : 'primary',
          'disabled': disabled,
          'id': `${id}-find-agreement-btn`,
          'marginBottom0': true,
          'name': name,
          'onClick': pluggableRenderProps.onClick
        };

        if (value) {
          return (
            <Tooltip
              id={`${id}-agreement-button-tooltip`}
              text={<FormattedMessage id="ui-agreements.relatedAgreements.replaceAgreementSpecific" values={{ agreementName }} />}
              triggerRef={triggerButton}
            >
              {({ ariaIds }) => (
                <Button
                  aria-labelledby={ariaIds.text}
                  {...buttonProps}
                >
                  <FormattedMessage id="ui-agreements.relatedAgreements.replaceAgreement" />
                </Button>
              )}
            </Tooltip>
          );
        }
        return (
          <Button
            {...buttonProps}
          >
            <FormattedMessage id="ui-agreements.relatedAgreements.linkAgreement" />
          </Button>
        );
      }}
      type="find-agreement"
    >
      <FormattedMessage id="ui-agreements.relatedAgreements.noPlugin" />
    </Pluggable>
  );

  const renderAgreement = () => (
    <div>
      <Link
        data-test-agreement-card-name
        to={urls.agreementView(resource.id)}
      >
        {resource.name}
      </Link>
      <Row>
        <Col md={4} xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.agreements.startDate" />}
            value={resource.startDate ? <FormattedUTCDate value={resource.startDate} /> : <NoValue />}
          />
        </Col>
        <Col md={4} xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.agreements.endDate" />}
            value={resource.endDate ? <FormattedUTCDate value={resource.endDate} /> : <NoValue />}
          />
        </Col>
        <Col md={4} xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.agreements.agreementStatus" />}
            value={resource?.agreementStatus?.label ?? <NoValue />}
          />
        </Col>
      </Row>
    </div>
  );

  const renderEmpty = () => (
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
  );

  return (
    <Card
      cardStyle={value ? 'positive' : 'negative'}
      headerEnd={renderAgreementLinkButton(value)}
      headerStart={(
        <AppIcon app="agreements" size="small">
          <strong>
            <FormattedMessage id="ui-agreements.agreement" />
          </strong>
        </AppIcon>
        )}
      id={id}
      roundedBorder
    >
      {value ? renderAgreement() : renderEmpty()}
    </Card>
  );
};

AgreementLookupComponent.propTypes = propTypes;

export default AgreementLookupComponent;
