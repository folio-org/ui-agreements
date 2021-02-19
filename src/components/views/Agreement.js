import React from 'react';
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
import { AppIcon, IfPermission, TitleManager, withStripes } from '@folio/stripes/core';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import DuplicateAgreementModal from '../DuplicateAgreementModal';

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
} from '../AgreementSections';

import { urls } from '../utilities';
import { statuses } from '../../constants';

class Agreement extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      agreement: PropTypes.object.isRequired,
      eresourcesFilterPath: PropTypes.string,
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
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func
    })
  }

  constructor(props) {
    super(props);
    this.accordionStatusRef = React.createRef();
  }

  state = {
    showDeleteConfirmationModal: false,
    showDuplicateAgreementModal: false,
  }

  getSectionProps = (id) => {
    const { data, handlers } = this.props;

    return {
      agreement: data.agreement,
      data,
      eresourcesFilterPath: data.eresourcesFilterPath,
      id,
      handlers,
      searchString: data.searchString,
    };
  }

  openDeleteConfirmationModal = () => {
    this.setState({ showDeleteConfirmationModal: true });
  }

  closeDeleteConfirmationModal = () => {
    this.setState({ showDeleteConfirmationModal: false });
  }

  openDuplicateAgreementModal = () => {
    this.setState({ showDuplicateAgreementModal: true });
  }

  closeDuplicateAgreementModal = () => {
    this.setState({ showDuplicateAgreementModal: false });
  }

  getActionMenu = ({ onToggle }) => {
    const { stripes } = this.props;
    const buttons = [];

    if (stripes.hasPerm('ui-agreements.agreements.edit')) {
      buttons.push(
        <Button
          buttonStyle="dropdownItem"
          id="clickable-dropdown-edit-agreement"
          onClick={this.props.handlers.onEdit}
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-agreements.agreements.edit" />
          </Icon>
        </Button>
      );
      buttons.push(
        <Button
          buttonStyle="dropdownItem"
          id="clickable-dropdown-duplicate-agreement"
          onClick={() => {
            this.openDuplicateAgreementModal();
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
          buttonStyle="dropdownItem"
          id="clickable-dropdown-export-agreement"
          onClick={() => {
            this.props.handlers.onExportAgreement();
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
          buttonStyle="dropdownItem"
          id="clickable-dropdown-delete-agreement"
          onClick={() => {
            this.openDeleteConfirmationModal();
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

  getInitialAccordionsState = () => {
    return {
      allPeriods: false,
      controllingLicense: false,
      externalLicenses: false,
      futureLicenses: false,
      historicalLicenses: false,
      internalContacts: false,
      lines: false,
      notes: false,
      organizations: false,
      relatedAgreements: false,
      supplementaryProperties: false,
      supplementaryDocs: false,
      terms: false,
      usageData: false,
    };
  }

  renderEditAgreementPaneMenu = () => {
    const {
      data: { agreement },
      handlers,
    } = this.props;

    return (
      <IfPermission perm="ui-agreements.agreements.edit">
        <PaneMenu>
          {handlers.onToggleTags &&
            <FormattedMessage id="ui-agreements.agreements.showTags">
              {ariaLabel => (
                <IconButton
                  ariaLabel={ariaLabel}
                  badgeCount={agreement?.tags?.length ?? 0}
                  icon="tag"
                  id="clickable-show-tags"
                  onClick={handlers.onToggleTags}
                />
              )}
            </FormattedMessage>
          }
          <FormattedMessage id="ui-agreements.agreements.editAgreement">
            {ariaLabel => (
              <Button
                aria-label={ariaLabel}
                buttonStyle="primary"
                id="clickable-edit-agreement"
                marginBottom0
                onClick={handlers.onEdit}
              >
                <FormattedMessage id="stripes-components.button.edit" />
              </Button>
            )}
          </FormattedMessage>
        </PaneMenu>
      </IfPermission>
    );
  }

  render() {
    const {
      data,
      isLoading,
      handlers,
      helperApp,
    } = this.props;

    const { showDeleteConfirmationModal, showDuplicateAgreementModal } = this.state;

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

    const shortcuts = [
      {
        name: 'edit',
        handler: handlers.onEdit,
      },
      {
        name: 'expandAllSections',
        handler: (e) => expandAllSections(e, this.accordionStatusRef),
      },
      {
        name: 'collapseAllSections',
        handler: (e) => collapseAllSections(e, this.accordionStatusRef)
      },
      {
        name: 'duplicateRecord',
        handler: () => {
          this.openDuplicateAgreementModal();
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
            actionMenu={this.getActionMenu}
            appIcon={<AppIcon app="agreements" />}
            lastMenu={this.renderEditAgreementPaneMenu()}
            paneTitle={data.agreement.name}
            {...paneProps}
          >
            <TitleManager record={data.agreement.name}>
              <Header {...this.getSectionProps()} />
              <Info {...this.getSectionProps('info')} />
              <AccordionStatus ref={this.accordionStatusRef}>
                <Row end="xs">
                  <Col xs>
                    <ExpandAllButton />
                  </Col>
                </Row>
                <AccordionSet initialStatus={this.getInitialAccordionsState()}>
                  <AllPeriods {...this.getSectionProps('allPeriods')} />
                  { data.agreement?.contacts?.length ?
                    <InternalContacts {...this.getSectionProps('internalContacts')} />
                    :
                    null }
                  <Lines {...this.getSectionProps('lines')} />
                  { controllingLicenses?.length ?
                    <ControllingLicense {...this.getSectionProps('controllingLicense')} />
                    :
                    null }
                  { futureLicenses?.length ?
                    <FutureLicenses {...this.getSectionProps('futureLicenses')} />
                    :
                    null }
                  { historicalLicenses?.length ?
                    <HistoricalLicenses {...this.getSectionProps('historicalLicenses')} />
                    :
                    null }
                  { data.agreement?.externalLicenseDocs?.length ?
                    <ExternalLicenses {...this.getSectionProps('externalLicenses')} />
                    :
                    null }
                  <Terms {...this.getSectionProps('terms')} />
                  { data.agreement?.orgs?.length ?
                    <Organizations {...this.getSectionProps('organizations')} />
                    :
                    null }
                  { data.supplementaryProperties?.length > 0 ?
                    <SupplementaryProperties {...this.getSectionProps('supplementaryProperties')} /> :
                    null }
                  { data.agreement?.supplementaryDocs?.length ?
                    <SupplementaryDocs {...this.getSectionProps('supplementaryDocs')} />
                    :
                    null }
                  { data.agreement?.usageDataProviders?.length ?
                    <UsageData {...this.getSectionProps('usageData')} />
                    :
                    null }
                  { data.agreement?.relatedAgreements?.length ?
                    <RelatedAgreements {...this.getSectionProps('relatedAgreements')} />
                    : null }
                  <NotesSmartAccordion
                    {...this.getSectionProps('notes')}
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
          { showDuplicateAgreementModal &&
          <DuplicateAgreementModal
            name={data.agreement.name}
            onClone={(obj) => handlers.onClone(obj)}
            onClose={this.closeDuplicateAgreementModal}
          />
        }
          <ConfirmationModal
            buttonStyle="danger"
            confirmLabel={<FormattedMessage id="ui-agreements.delete" />}
            data-test-delete-confirmation-modal
            heading={<FormattedMessage id="ui-agreements.agreements.deleteAgreement" />}
            id="delete-agreement-confirmation"
            message={<SafeHTMLMessage id="ui-agreements.agreements.deleteConfirmMessage" values={{ name: data.agreement?.name }} />}
            onCancel={this.closeDeleteConfirmationModal}
            onConfirm={() => {
              handlers.onDelete();
              this.closeDeleteConfirmationModal();
            }}
            open={showDeleteConfirmationModal}
          />
        </>
      </HasCommand>
    );
  }
}

export default withStripes(Agreement);
