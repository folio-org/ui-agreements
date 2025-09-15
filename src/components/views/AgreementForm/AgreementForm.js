import React, { useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { FormattedMessage } from 'react-intl';
import setFieldData from 'final-form-set-field-data';

import { CustomPropertiesEdit } from '@k-int/stripes-kint-components';

import { AccessControlErrorPane, FormAccessControl, handleSaveKeyCommand } from '@folio/stripes-erm-components';
import { AppIcon, IfPermission, TitleManager } from '@folio/stripes/core';

import {
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  ExpandAllButton,
  HasCommand,
  IconButton,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  Row,
  checkScope,
  collapseAllSections,
  expandAllSections,
  LoadingPane
} from '@folio/stripes/components';

import stripesFinalForm from '@folio/stripes/final-form';

import {
  FormInfo,
  FormInternalContacts,
  FormLicenses,
  FormLines,
  FormOrganizations,
  FormRelatedAgreements,
  FormSupplementaryDocuments,
  FormUsageData,
} from '../../AgreementSections';

import IfAccordionIsVisible from '../../IfAccordionIsVisible';

import { AGREEMENT_ENDPOINT, AGREEMENTS_ACCESSCONTROL_ENDPOINT, CUSTPROP_ENDPOINT } from '../../../constants';
import { useAgreementsContexts } from '../../../hooks';

const AgreementForm = ({
  accessControlData: {
    isAccessDenied,
    isAccessControlLoading,
    canApplyPolicies,
    canApplyPoliciesLoading,
  } = {},
  data = {},
  form,
  handlers,
  handleSubmit,
  initialValues = {},
  pristine,
  submitting,
  values = {},
}) => {
  const accordionStatusRef = useRef();
  const { data: custpropContexts = [] } = useAgreementsContexts();
  // Ensure the custprops with no contexts get rendered
  const contexts = ['isNull', ...custpropContexts];

  const initialAccordionsState = {
    formInternalContacts: true,
    formLines: true,
    formLicenses: true,
    formOrganizations: true,
    openAccessProperties: true,
    supplementaryProperties: true,
    formSupplementaryDocs: true,
    formUsageProviders: true,
    formRelatedAgreements: true,
  };

  const getSectionProps = (theId) => {
    return {
      data,
      form,
      handlers,
      id: theId,
      initialValues,
      values,
    };
  };

  const renderPaneFooter = () => {
    return (
      <PaneFooter
        renderEnd={(
          <Button
            buttonStyle="primary mega"
            disabled={pristine || submitting}
            id={values.id ? 'clickable-update-agreement' : 'clickable-create-agreement'}
            marginBottom0
            onClick={handleSubmit}
            type="submit"
          >
            <FormattedMessage id="stripes-components.saveAndClose" />
          </Button>
        )}
        renderStart={(
          <Button
            buttonStyle="default mega"
            id="clickable-cancel"
            marginBottom0
            onClick={handlers.onClose}
          >
            <FormattedMessage id="stripes-components.cancel" />
          </Button>
        )}
      />
    );
  };

  const renderFirstMenu = useCallback(() => {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-agreements.agreements.closeEdit">
          {([ariaLabel]) => (
            <IconButton
              aria-label={ariaLabel}
              icon="times"
              id="close-agreement-form-button"
              onClick={handlers.onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }, [handlers.onClose]);

  /* istanbul ignore next */
  const shortcuts = [
    {
      name: 'save',
      handler: (e) => handleSaveKeyCommand(e, { handleSubmit, pristine, submitting }),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    }
  ];

  const { id, name } = values;
  const hasLoaded = form.getRegisteredFields().length > 0;

  const paneProps = useMemo(() => ({
    appIcon: <AppIcon app="agreements" />,
    centerContent: true,
    defaultWidth: '100%',
    firstMenu: renderFirstMenu(),
    id: 'pane-agreement-form',
  }), [renderFirstMenu]);

  if (isAccessControlLoading) return <LoadingPane {...paneProps} />;

  if (isAccessDenied) {
    return (
      <AccessControlErrorPane
        {...paneProps}
      />
    );
  }

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Paneset>
        <FormattedMessage id="ui-agreements.create">
          {create => (
            <Pane
              footer={renderPaneFooter()}
              paneSub={data.agreementLineCount >= 0 ? <FormattedMessage id="ui-agreements.agreementLineCountHeader" values={{ count: data.agreementLineCount }} /> : null}
              paneTitle={id ? <FormattedMessage id="ui-agreements.agreements.editAgreement.name" values={{ name }} /> : <FormattedMessage id="ui-agreements.agreements.createAgreement" />}
              {...paneProps}
            >
              <TitleManager record={id ? name : create?.[0]}>
                <form id="form-agreement">
                  <AccordionStatus ref={accordionStatusRef}>
                    {hasLoaded ? <div id="form-loaded" /> : null}
                    <Row end="xs">
                      <Col xs>
                        <ExpandAllButton />
                      </Col>
                    </Row>
                    <AccordionSet initialStatus={initialAccordionsState}>
                      <FormInfo {...getSectionProps('formInfo')} />
                      <FormAccessControl
                        accessControlEndpoint={AGREEMENTS_ACCESSCONTROL_ENDPOINT}
                        disabled={!canApplyPolicies}
                        isLoading={canApplyPoliciesLoading}
                        resourceEndpoint={AGREEMENT_ENDPOINT(id)}
                        resourceId={id}
                        resourceType="Agreements"
                        {...getSectionProps('formAccessControl')}
                      />
                      <FormLines agreementId={id} agreementLineCount={data.agreementLineCount} />
                      <CustomPropertiesEdit
                        contexts={contexts}
                        customPropertiesEndpoint={CUSTPROP_ENDPOINT}
                        id="supplementaryProperties"
                      />
                      <IfPermission perm="users.collection.get">
                        {({ hasPermission }) => (hasPermission ?
                          <FormInternalContacts {...getSectionProps('formInternalContacts')} />
                          :
                          null)}
                      </IfPermission>
                      <FormLicenses {...getSectionProps('formLicenses')} />
                      <FormOrganizations {...getSectionProps('formOrganizations')} />
                      <FormSupplementaryDocuments {...getSectionProps('formSupplementaryDocs')} />
                      <IfAccordionIsVisible name="usageData">
                        <FormUsageData {...getSectionProps('formUsageProviders')} />
                      </IfAccordionIsVisible>
                      <FormRelatedAgreements {...getSectionProps('formRelatedAgreements')} />
                    </AccordionSet>
                  </AccordionStatus>
                </form>
              </TitleManager>
            </Pane>
          )}
        </FormattedMessage>
      </Paneset>
    </HasCommand>
  );
};

AgreementForm.propTypes = {
  data: PropTypes.shape({
    agreementLineCount: PropTypes.number
  }).isRequired,
  form: PropTypes.shape({
    change: PropTypes.func.isRequired,
    getRegisteredFields: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }).isRequired,
  handlers: PropTypes.PropTypes.shape({
    onBasketLinesAdded: PropTypes.func,
    onClose: PropTypes.func.isRequired,
  }),
  initialValues: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  values: PropTypes.object,
};

export default stripesFinalForm({
  initialValuesEqual: (a, b) => isEqual(a, b),
  keepDirtyOnReinitialize: true,
  subscription: {
    values: true,
  },
  mutators: { setFieldData },
  navigationCheck: true,
})(AgreementForm);
