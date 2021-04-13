import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-final-form';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Card,
  Col,
  FormattedUTCDate,
  KeyValue,
  Layout,
  MessageBanner,
  NoValue,
  Row,
  Tooltip,
} from '@folio/stripes/components';
import { AppIcon, Pluggable } from '@folio/stripes/core';

import { urls } from '../utilities';
import css from '../styles.css';

const propTypes = {
  agreement: PropTypes.shape({
    agreementStatus: PropTypes.shape({
      label: PropTypes.string
    }),
    endDate: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    startDate: PropTypes.string,
  }),
  id: PropTypes.string,
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.node,
    touched: PropTypes.bool,
  }).isRequired,
  onAgreementSelected: PropTypes.func.isRequired,
  parentAgreementId: PropTypes.string,
  parentAgreementName: PropTypes.string,
};
const RelatedAgreementField = ({
  agreement,
  id,
  input,
  meta,
  onAgreementSelected,
  parentAgreementId,
  parentAgreementName,
}) => {
  const [selfLinkedWarning, setSelfLinkedWarning] = useState(false);

  let triggerButton = useRef(null);

  const { change } = useForm();

  useEffect(() => {
    if (!input.value?.id && triggerButton.current) {
      triggerButton.current.focus();
    }
  }, [input, triggerButton]);

  useEffect(() => {
    if (parentAgreementId === input.value?.id && !selfLinkedWarning) {
      change(input.name, undefined);
      setSelfLinkedWarning(true);
    }
    if (input.value && parentAgreementId !== input.value?.id && selfLinkedWarning) {
      setSelfLinkedWarning(false);
    }
  }, [change, input, parentAgreementId, selfLinkedWarning, setSelfLinkedWarning]);

  const renderLinkAgreementButton = value => (
    <Pluggable
      dataKey={id}
      onAgreementSelected={onAgreementSelected}
      renderTrigger={(pluggableRenderProps) => {
        triggerButton = pluggableRenderProps.buttonRef;

        const agreementName = agreement?.name;
        const buttonProps = {
          'aria-haspopup': 'true',
          'buttonRef': triggerButton,
          'buttonStyle': value ? 'default' : 'primary',
          'id': `${id}-find-agreement-btn`,
          'marginBottom0': true,
          'name': input.name,
          'onClick': pluggableRenderProps.onClick
        };

        if (value) {
          return (
            <Tooltip
              id={`${id}-license-button-tooltip`}
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
        to={urls.agreementView(agreement.id)}
      >
        {agreement.name}
      </Link>
      <Row>
        <Col md={4} xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.agreements.startDate" />}
            value={agreement.startDate ? <FormattedUTCDate value={agreement.startDate} /> : <NoValue />}
          />
        </Col>
        <Col md={4} xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.agreements.endDate" />}
            value={agreement.endDate ? <FormattedUTCDate value={agreement.endDate} /> : <NoValue />}
          />
        </Col>
        <Col md={4} xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.agreements.agreementStatus" />}
            value={agreement?.agreementStatus?.label ?? <NoValue />}
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
      { selfLinkedWarning &&
        <Layout className="padding-top-gutter">
          <MessageBanner
            dismissable
            onExited={() => setSelfLinkedWarning(false)}
            type="error"
          >
            <FormattedMessage id="ui-agreements.relatedAgreements.linkToParentError" values={{ agreement: parentAgreementName }} />
          </MessageBanner>
        </Layout> }
    </div>
  );

  const renderError = () => (
    <Layout className={`textCentered ${css.error}`}>
      <strong>
        {meta.error}
      </strong>
    </Layout>
  );

  return (
    <Card
      cardStyle={input.value ? 'positive' : 'negative'}
      headerEnd={renderLinkAgreementButton(input.value)}
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
      {input.value ? renderAgreement() : renderEmpty()}
      {meta.touched && meta.error ? renderError() : null}
    </Card>
  );
};

RelatedAgreementField.propTypes = propTypes;
RelatedAgreementField.defaultProps = {
  agreement: {},
};
export default RelatedAgreementField;

