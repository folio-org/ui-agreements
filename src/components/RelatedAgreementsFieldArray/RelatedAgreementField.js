import React, { useRef } from 'react';
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
import useLinkedWarning from './useLinkedWarning';

import { statuses } from '../../constants';
import { urls } from '../utilities';
import css from '../styles.css';

const propTypes = {
  agreement: PropTypes.shape({
    agreementStatus: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
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
  agreement = {},
  id,
  input,
  meta,
  onAgreementSelected,
  parentAgreementId,
  parentAgreementName,
}) => {
  const { change } = useForm();

  const triggerButton = useRef(null);

  const { selfLinkedWarning, setSelfLinkedWarning } = useLinkedWarning(change, input, parentAgreementId, triggerButton);

  const handleAgreementSelected = (selectedAgreement) => {
    onAgreementSelected(selectedAgreement);

    const btnId = `${id}-find-agreement-btn`;

    let tries = 0;
    const tryFocus = () => {
      const el = document.getElementById(btnId);
      if (el && typeof el.focus === 'function') {
        el.focus();
        return;
      }
      tries += 1;
      if (tries < 10) setTimeout(tryFocus, 25);
    };

    setTimeout(tryFocus, 0);
  };

  /* istanbul ignore next */
  const renderLinkAgreementButton = value => (
    <Pluggable
      dataKey={id}
      onAgreementSelected={handleAgreementSelected} // CHANGED
      renderTrigger={(pluggableRenderProps) => {
        const setButtonRef = (node) => {
          triggerButton.current = node;

          const { buttonRef } = pluggableRenderProps;
          if (typeof buttonRef === 'function') {
            buttonRef(node);
          } else if (buttonRef && typeof buttonRef === 'object') {
            buttonRef.current = node;
          }
        };

        const agreementName = agreement?.name;
        const buttonProps = {
          'aria-haspopup': 'true',
          'buttonRef': setButtonRef,
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
      {selfLinkedWarning &&
        <Layout className="padding-top-gutter">
          <MessageBanner
            dismissible
            onExited={() => setSelfLinkedWarning(false)}
            type="error"
          >
            <FormattedMessage id="ui-agreements.relatedAgreements.linkToParentError" values={{ agreement: parentAgreementName }} />
          </MessageBanner>
        </Layout>}
    </div>
  );

  const renderError = () => (
    <Layout className={`textCentered ${css.error}`}>
      <strong>
        {meta.error}
      </strong>
    </Layout>
  );

  const iconKey = agreement?.agreementStatus?.value === statuses.CLOSED ? 'closedAgreement' : 'app';

  return (
    <Card
      cardStyle={input.value ? 'positive' : 'negative'}
      headerEnd={renderLinkAgreementButton(input.value)}
      headerStart={(
        <AppIcon app="agreements" iconKey={iconKey} size="small">
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

export default RelatedAgreementField;
