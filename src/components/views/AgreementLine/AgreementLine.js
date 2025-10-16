import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStripes, AppIcon, IfPermission } from '@folio/stripes/core';

import {
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  HasCommand,
  Icon,
  LoadingPane,
  Pane,
  PaneMenu,
  Row,
  checkScope,
  collapseAllSections,
  expandAllSections,
} from '@folio/stripes/components';

import { NotesSmartAccordion } from '@folio/stripes/smart-components';

import {
  AccessControl,
  AccessControlErrorPane,
} from '@folio/stripes-erm-components';

import {
  Info,
  POLines,
  Coverage,
  Documents,
} from '../../AgreementLineSections';

import { isExternal, urls } from '../../utilities';
import DiscoverySettings from '../../DiscoverySettings';
import { AGREEMENT_LINE_ENTITY_TYPE } from '../../../constants';

const propTypes = {
  accessControlData: PropTypes.shape({
    canRead: PropTypes.bool,
    canReadLoading: PropTypes.bool,
    canEdit: PropTypes.bool,
    canEditLoading: PropTypes.bool,
    canDelete: PropTypes.bool,
    canDeleteLoading: PropTypes.bool,
  }),
  components: PropTypes.shape({
    HelperComponent: PropTypes.elementType,
    TagButton: PropTypes.elementType,
  }),
  data: PropTypes.shape({
    line: PropTypes.shape({
      coverage: PropTypes.arrayOf(PropTypes.shape({})),
      customCoverage: PropTypes.bool,
      endDate: PropTypes.string,
      id: PropTypes.string,
      note: PropTypes.string,
      owner: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      policies: PropTypes.arrayOf(PropTypes.shape({})),
      poLines: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          titleOrPackage: PropTypes.string,
          poLineNumber: PropTypes.string,
        })
      ),
      resource: PropTypes.shape({
        _object: PropTypes.shape({}),
      }),
      startDate: PropTypes.string,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          length: PropTypes.number,
        })
      ),
    }).isRequired,
    tagsInvalidateLinks: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    tagsLink: PropTypes.string,
    settings: PropTypes.shape({}),
  }),
  handlers: PropTypes.shape({
    isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onToggleTags: PropTypes.func,
  }).isRequired,
  helperApp: PropTypes.node,
  isLoading: PropTypes.bool,
  id: PropTypes.string,
};

const AgreementLine = ({
  accessControlData: {
    canRead,
    canReadLoading,
    canEdit,
    canEditLoading,
    canDelete,
    canDeleteLoading,
  } = {
    canRead: true,
    canReadLoading: false,
    canEdit: true,
    canEditLoading: false,
    canDelete: true,
    canDeleteLoading: false,
  }, // If not passed, assume everything is accessible and not loading...?
  components: { TagButton, HelperComponent },
  data: { line, policies, tagsLink, tagsInvalidateLinks },
  handlers,
  isLoading,
  id,
}) => {
  const stripes = useStripes();
  const paneProps = {
    defaultWidth: '55%',
    dismissible: true,
    id: 'pane-view-agreement-line',
    onClose: handlers.onClose,
  };

  const accordionStatusRef = useRef();

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);

  if (isLoading || canReadLoading) return <LoadingPane data-loading {...paneProps} />;

  if (!canRead) {
    return <AccessControlErrorPane {...paneProps} />;
  }

  const resource = isExternal(line) ? line : (line.resource?._object ?? {});
  const resourceName =
    resource.pti?.titleInstance.name ?? resource.reference_object?.label ?? '';

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
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
  ];

  const getActionMenu = () => {
    const buttons = [];
    if (
      stripes.hasPerm('ui-agreements.agreements.edit') &&
      canEdit !== false
    ) {
      buttons.push(
        <Button
          buttonStyle="dropdownItem"
          disabled={canEditLoading}
          id="clickable-dropdown-edit-agreement-line"
          onClick={handlers.onEdit}
        >
          <Icon icon={canEditLoading ? 'spinner-ellipsis' : 'edit'}>
            <FormattedMessage id="ui-agreements.agreements.edit" />
          </Icon>
        </Button>
      );
    }

    if (
      stripes.hasPerm('ui-agreements.agreements.delete') &&
      canDelete !== false
    ) {
      buttons.push(
        <Button
          buttonStyle="dropdownItem"
          disabled={canDeleteLoading}
          id="clickable-dropdown-delete-agreement-line"
          onClick={() => setShowDeleteConfirmationModal(true)}
        >
          <Icon icon={canDeleteLoading ? 'spinner-ellipsis' : 'trash'}>
            <FormattedMessage id="ui-agreements.delete" />
          </Icon>
        </Button>
      );
    }
    return buttons?.length ? buttons : null;
  };

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <>
        <Pane
          actionMenu={getActionMenu}
          appIcon={<AppIcon app="agreements" iconKey="agreementLine" />}
          lastMenu={
            <IfPermission perm="ui-agreements.agreements.edit">
              <PaneMenu>
                <TagButton entity={line} />
              </PaneMenu>
            </IfPermission>
          }
          paneTitle={<FormattedMessage id="ui-agreements.agreementLine" />}
          {...paneProps}
        >
          <Info
            isSuppressFromDiscoveryEnabled={
              handlers.isSuppressFromDiscoveryEnabled
            }
            line={line}
            resource={resource}
          />
          <AccordionStatus ref={accordionStatusRef}>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton id="clickable-expand-all" />
              </Col>
            </Row>
            <AccordionSet initialStatus={{ accessControl: false }}>
              <AccessControl policies={policies} />
              <POLines line={line} resource={resource} />
              <Documents id={id} line={line} resource={resource} />
              <Coverage line={line} resource={resource} />
              <FormattedMessage
                id="ui-agreements.line.lineForAgreement"
                values={{ agreementName: line.owner?.name }}
              >
                {(title) => (
                  <NotesSmartAccordion
                    domainName="agreements"
                    entityId={line.id ?? '-'}
                    entityName={title[0] ?? '-'}
                    entityType={AGREEMENT_LINE_ENTITY_TYPE}
                    id="agreement-line-notes"
                    pathToNoteCreate={urls.noteCreate()}
                    pathToNoteDetails={urls.notes()}
                  />
                )}
              </FormattedMessage>
              {(handlers.isSuppressFromDiscoveryEnabled('pci') ||
                handlers.isSuppressFromDiscoveryEnabled('title') ||
                handlers.isSuppressFromDiscoveryEnabled('agreementLine')) && (
                <DiscoverySettings
                  handlers={handlers}
                  id="discoverySettings"
                  line={line}
                />
              )}
            </AccordionSet>
          </AccordionStatus>
        </Pane>
        <HelperComponent
          invalidateLinks={tagsInvalidateLinks}
          link={tagsLink}
          onToggle={handlers.onToggleTags}
        />
        <ConfirmationModal
          buttonStyle="danger"
          confirmLabel={<FormattedMessage id="ui-agreements.delete" />}
          data-test-delete-confirmation-modal
          heading={
            <FormattedMessage id="ui-agreements.agreementLines.deleteAgreementLine" />
          }
          id="delete-agreement-line-confirmation"
          message={
            <FormattedMessage
              id="ui-agreements.agreementLines.deleteConfirmMessage"
              values={{ name: resourceName }}
            />
          }
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

AgreementLine.propTypes = propTypes;
export default AgreementLine;
