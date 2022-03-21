import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  HasCommand,
  Icon,
  IconButton,
  LoadingPane,
  Pane,
  PaneMenu,
  Row,
  checkScope,
  collapseAllSections,
  expandAllSections
} from '@folio/stripes/components';
import { AppIcon, TitleManager, HandlerManager, useStripes } from '@folio/stripes/core';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import DuplicateAgreementModal from '../../DuplicateAgreementModal';

import {
  AllPeriods,
  ControllingLicense,
  ExternalLicenses,
  FutureLicenses,
  Header,
  HistoricalLicenses,
  Info,
  InternalContacts,
  Lines,
  Organizations,
  RelatedAgreements,
  SupplementaryDocs,
  SupplementaryProperties,
  Terms,
  UsageData,
} from '../../AgreementSections';

import { urls } from '../../utilities';
import { statuses } from '../../../constants';

const Agreement = ({
  data,
  isLoading,
  handlers,
  helperApp,
}) => {
  const accordionStatusRef = useRef();
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [showDuplicateAgreementModal, setShowDuplicateAgreementModal] = useState(false);

  const stripes = useStripes();

  const getSectionProps = (id) => {
    return {
      agreement: data.agreement,
      data,
      eresourcesFilterPath: data.eresourcesFilterPath,
      id,
      handlers,
      searchString: data.searchString,
    };
  };

  const getActionMenu = ({ onToggle }) => {
    const buttons = [];

    if (stripes.hasPerm('ui-agreements.agreements.edit')) {
      buttons.push(
        <Button
          key="clickable-dropdown-edit-agreement"
          buttonStyle="dropdownItem"
          id="clickable-dropdown-edit-agreement"
          onClick={handlers.onEdit}
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-agreements.agreements.edit" />
          </Icon>
        </Button>
      );
      buttons.push(
        <Button
          key="clickable-dropdown-duplicate-agreement"
          buttonStyle="dropdownItem"
          id="clickable-dropdown-duplicate-agreement"
          onClick={() => {
            setShowDuplicateAgreementModal(true);
            onToggle();
          }}
        >
          <Icon icon="duplicate">
            <FormattedMessage id="ui-agreements.agreements.duplicate" />
          </Icon>
        </Button>
      );
    }

    if (stripes.hasPerm('ui-agreements.agreements.view')) {
      buttons.push(
        <Button
          key="clickable-dropdown-export-agreement"
          buttonStyle="dropdownItem"
          id="clickable-dropdown-export-agreement"
          onClick={() => {
            handlers.onExportAgreement();
            onToggle();
          }}
        >
          <Icon icon="download">
            <FormattedMessage id="ui-agreements.agreements.export" />
          </Icon>
        </Button>
      );
    }

    if (stripes.hasPerm('ui-agreements.agreements.delete')) {
      buttons.push(
        <Button
          key="clickable-dropdown-delete-agreement"
          buttonStyle="dropdownItem"
          id="clickable-dropdown-delete-agreement"
          onClick={() => {
            setShowDeleteConfirmationModal(true);
            onToggle();
          }}
        >
          <Icon icon="trash">
            <FormattedMessage id="ui-agreements.delete" />
          </Icon>
        </Button>
      );
    }

    return buttons.length ? buttons : null;
  };

  const getInitialAccordionsState = () => {
    return {
      allPeriods: false,
      controllingLicense: false,
      externalLicenses: false,
      futureLicenses: false,
      historicalLicenses: false,
      internalContacts: false,
      lines: false,
      notes: false,
      openAccessProperties: false,
      organizations: false,
      relatedAgreements: false,
      supplementaryProperties: false,
      supplementaryDocs: false,
      terms: false,
      usageData: false,
    };
  };

  const showCustpropAccordion = (customPropertyData) => {
    const primaryprops = customPropertyData?.filter(p => p.primary === true).length;
    let custprops = 0;
    if (data.agreement?.customProperties !== undefined) {
      custprops = Object.keys(data.agreement?.customProperties).length;
    }

    return !!(primaryprops || custprops);
  };

  const renderEditAgreementPaneMenu = () => {
    const { agreement } = data;
    return stripes.hasPerm('ui-agreements.agreements.edit') ? (
      <PaneMenu>
        {handlers.onToggleTags &&
          <FormattedMessage id="ui-agreements.agreements.showTags">
            {([ariaLabel]) => (
              <IconButton
                ariaLabel={typeof ariaLabel === 'string' ? ariaLabel : ariaLabel[0]}
                badgeCount={agreement?.tags?.length ?? 0}
                icon="tag"
                id="clickable-show-tags"
                onClick={handlers.onToggleTags}
              />
            )}
          </FormattedMessage>
        }
      </PaneMenu>
    ) : null;
  };

  const paneProps = {
    defaultWidth: '55%',
    dismissible: true,
    id: 'pane-view-agreement',
    onClose: handlers.onClose,
  };

  const licenses = data.agreement?.linkedLicenses || [];
  const controllingLicenses = licenses.filter(l => l.status.value === statuses.CONTROLLING);
  const futureLicenses = licenses.filter(l => l.status.value === statuses.FUTURE);
  const historicalLicenses = licenses.filter(l => l.status.value === statuses.HISTORICAL);

  if (isLoading) return <LoadingPane data-loading {...paneProps} />;

  // istanbul ignore next
  const shortcuts = [
    {
      name: 'edit',
      handler: handlers.onEdit,
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef)
    },
    {
      name: 'duplicateRecord',
      handler: () => {
        setShowDuplicateAgreementModal(true);
      }
    }
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <>
        <Pane
          actionMenu={getActionMenu}
          appIcon={<AppIcon app="agreements" />}
          lastMenu={renderEditAgreementPaneMenu()}
          paneTitle={data.agreement.name}
          {...paneProps}
        >
          <TitleManager record={data.agreement.name}>
            <Header {...getSectionProps()} />
            <Info {...getSectionProps('info')} />
            <AccordionStatus ref={accordionStatusRef}>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton />
                </Col>
              </Row>
              <AccordionSet initialStatus={getInitialAccordionsState()}>
                <AllPeriods {...getSectionProps('allPeriods')} />
                {data.agreement?.contacts?.length > 0 && <InternalContacts {...getSectionProps('internalContacts')} />}
                <Lines {...getSectionProps('lines')} />
                {controllingLicenses?.length > 0 && <ControllingLicense {...getSectionProps('controllingLicense')} />}
                {futureLicenses?.length > 0 && <FutureLicenses {...getSectionProps('futureLicenses')} />}
                {historicalLicenses?.length > 0 && <HistoricalLicenses {...getSectionProps('historicalLicenses')} />}
                {data.agreement?.externalLicenseDocs?.length > 0 && <ExternalLicenses {...getSectionProps('externalLicenses')} />}
                {controllingLicenses?.length > 0 && <Terms {...getSectionProps('terms')} />}
                {data.agreement?.orgs?.length > 0 && <Organizations {...getSectionProps('organizations')} />}
                {showCustpropAccordion(data?.supplementaryProperties) && <SupplementaryProperties {...getSectionProps('supplementaryProperties')} />}
                {data.agreement?.supplementaryDocs?.length > 0 && <SupplementaryDocs {...getSectionProps('supplementaryDocs')} />}
                {data.agreement?.usageDataProviders?.length > 0 && <UsageData {...getSectionProps('usageData')} />}
                {showCustpropAccordion(data?.openAccessProperties) && <SupplementaryProperties {...getSectionProps('openAccessProperties')} />}
                {data.agreement?.relatedAgreements?.length > 0 && <RelatedAgreements {...getSectionProps('relatedAgreements')} />}
                <HandlerManager data={{ data }} event="ui-agreements-extension" stripes={stripes} />
                <NotesSmartAccordion
                  {...getSectionProps('notes')}
                  domainName="agreements"
                  entityId={data.agreement.id}
                  entityName={data.agreement.name}
                  entityType="agreement"
                  pathToNoteCreate={urls.noteCreate()}
                  pathToNoteDetails={urls.notes()}
                />
              </AccordionSet>
            </AccordionStatus>
          </TitleManager>
        </Pane>
        {helperApp}
        {showDuplicateAgreementModal &&
          <DuplicateAgreementModal
            name={data.agreement.name}
            onClone={(obj) => handlers.onClone(obj)}
            onClose={() => setShowDuplicateAgreementModal(false)}
          />
        }
        <ConfirmationModal
          buttonStyle="danger"
          confirmLabel={<FormattedMessage id="ui-agreements.delete" />}
          data-test-delete-confirmation-modal
          heading={<FormattedMessage id="ui-agreements.agreements.deleteAgreement" />}
          id="delete-agreement-confirmation"
          message={<SafeHTMLMessage id="ui-agreements.agreements.deleteConfirmMessage" values={{ name: data.agreement?.name }} />}
          onCancel={() => setShowDeleteConfirmationModal(false)}
          onConfirm={() => {
            handlers.onDelete();
            setShowDeleteConfirmationModal(false);
          }}
          open={showDeleteConfirmationModal}
        />
      </>
    </HasCommand>
  );
};

Agreement.propTypes = {
  data: PropTypes.shape({
    agreement: PropTypes.object.isRequired,
    eresourcesFilterPath: PropTypes.string,
    openAccessProperties: PropTypes.arrayOf(PropTypes.object),
    searchString: PropTypes.string,
    supplementaryProperties: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  handlers: PropTypes.shape({
    onClone: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
    onExportAgreement: PropTypes.func,
    onToggleTags: PropTypes.func,
  }).isRequired,
  helperApp: PropTypes.node,
  isLoading: PropTypes.bool.isRequired,
};

export default Agreement;
