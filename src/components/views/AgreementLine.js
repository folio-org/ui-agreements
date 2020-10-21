import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

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
} from '@folio/stripes/components';
import { AppIcon, IfPermission } from '@folio/stripes/core';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import { Info, POLines, Coverage } from '../AgreementLineSections';
import { isExternal, urls } from '../utilities';

const propTypes = {
  data: PropTypes.shape({
    line: PropTypes.shape({
      coverage: PropTypes.arrayOf(PropTypes.object),
      customCoverage: PropTypes.bool,
      endDate: PropTypes.string,
      id: PropTypes.string,
      note: PropTypes.string,
      owner: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      poLines: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        titleOrPackage: PropTypes.string,
        poLineNumber: PropTypes.string,
      })),
      resource: PropTypes.shape({
        _object: PropTypes.object,
      }),
      startDate: PropTypes.string,
      tags: PropTypes.shape({
        length: PropTypes.number,
      }),
    }).isRequired,
    settings: PropTypes.object,
  }),
  handlers: PropTypes.shape({
    isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onToggleTags: PropTypes.func,
  }).isRequired,
  helperApp: PropTypes.node,
  history: PropTypes.object,
  isLoading: PropTypes.bool,
  match: PropTypes.object,
};

const AgreementLine = ({
  data: { line },
  handlers,
  helperApp,
  history,
  isLoading,
  match: { params },
}) => {
  const paneProps = {
    defaultWidth: '55%',
    dismissible: true,
    id: 'pane-view-agreement-line',
    onClose: handlers.onClose,
  };

  const accordionStatusRef = useRef();

  const intl = useIntl();
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

  if (isLoading) return <LoadingPane data-loading {...paneProps} />;

  const resource = isExternal(line) ? line : (line.resource?._object ?? {});
  const resourceName = resource.pti?.titleInstance.name ?? resource.reference_object?.label ?? '';

  const expandAllSections = (e) => {
    e.preventDefault();
    const { state, setStatus } = accordionStatusRef.current;
    // eslint-disable-next-line no-undef
    setStatus(() => _.mapValues(state, () => true));
  };

  const collapseAllSections = (e) => {
    e.preventDefault();
    const { state, setStatus } = accordionStatusRef.current;
    // eslint-disable-next-line no-undef
    setStatus(() => _.mapValues(state, () => false));
  };

  const goToEdit = () => {
    history.push(`/erm/agreements/${params.agreementId}/line/${params.lineId}/edit`);
  };

  const shortcuts = [
    {
      name: 'edit',
      handler: goToEdit,
    },
    {
      name: 'expandAllSections',
      handler: expandAllSections,
    },
    {
      name: 'collapseAllSections',
      handler: collapseAllSections
    }
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope
      scope={document.body}
    >
      <>
        <Pane
          actionMenu={() => (
            <IfPermission perm="ui-agreements.agreements.edit">
              <Button
                buttonStyle="dropdownItem"
                id="clickable-dropdown-edit-agreement-line"
                onClick={handlers.onEdit}
              >
                <Icon icon="edit">
                  <FormattedMessage id="ui-agreements.agreements.edit" />
                </Icon>
              </Button>
              <Button
                buttonStyle="dropdownItem"
                id="clickable-dropdown-delete-agreement-line"
                onClick={() => setShowDeleteConfirmationModal(true)}
              >
                <Icon icon="trash">
                  <FormattedMessage id="ui-agreements.delete" />
                </Icon>
              </Button>
            </IfPermission>
          )}
          appIcon={<AppIcon app="agreements" />}
          lastMenu={
            <IfPermission perm="ui-agreements.agreements.edit">
              <PaneMenu>
                {handlers.onToggleTags &&
                <IconButton
                  ariaLabel={intl.formatMessage({ id: 'ui-agreements.agreements.showTags' })}
                  badgeCount={line?.tags?.length ?? 0}
                  icon="tag"
                  id="clickable-show-tags"
                  onClick={handlers.onToggleTags}
                />
              }
              </PaneMenu>
            </IfPermission>
        }
          paneTitle={<FormattedMessage id="ui-agreements.agreementLine" />}
          {...paneProps}
        >
          <Info
            isSuppressFromDiscoveryEnabled={handlers.isSuppressFromDiscoveryEnabled}
            line={line}
            resource={resource}
          />
          <AccordionStatus ref={accordionStatusRef}>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton id="clickable-expand-all" />
              </Col>
            </Row>
            <AccordionSet>
              <POLines line={line} resource={resource} />
              <Coverage line={line} resource={resource} />
              <FormattedMessage id="ui-agreements.line.lineForAgreement" values={{ agreementName: line.owner?.name }}>
                {title => (
                  <NotesSmartAccordion
                    domainName="agreements"
                    entityId={line.id ?? '-'}
                    entityName={title ?? '-'}
                    entityType="agreementLine"
                    id="agreement-line-notes"
                    pathToNoteCreate={urls.noteCreate()}
                    pathToNoteDetails={urls.notes()}
                  />
                )}
              </FormattedMessage>
            </AccordionSet>
          </AccordionStatus>
        </Pane>
        {helperApp}
        <ConfirmationModal
          buttonStyle="danger"
          confirmLabel={<FormattedMessage id="ui-agreements.delete" />}
          data-test-delete-confirmation-modal
          heading={<FormattedMessage id="ui-agreements.agreementLines.deleteAgreementLine" />}
          id="delete-agreement-line-confirmation"
          message={<SafeHTMLMessage id="ui-agreements.agreementLines.deleteConfirmMessage" values={{ name: resourceName }} />}
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
