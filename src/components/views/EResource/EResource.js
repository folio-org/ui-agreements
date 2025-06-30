import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  ConfirmationModal,
  Icon,
  LoadingPane,
  Modal,
  ModalFooter,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';
import {
  AppIcon,
  IfPermission,
  TitleManager,
  useStripes,
} from '@folio/stripes/core';

import Package from '../Package';
import Title from '../Title';
import PCI from '../PCI';
import { resourceClasses, syncStates } from '../../../constants';

const propTypes = {
  // components: PropTypes.object,
  components: PropTypes.objectOf(PropTypes.elementType),
  data: PropTypes.shape({
    eresource: PropTypes.shape({
      class: PropTypes.string,
      name: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
      // type: PropTypes.object,
    }),
  }),
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onToggleTags: PropTypes.func.isRequired,
    onSynchronize: PropTypes.func.isRequired,
  }).isRequired,
  helperApp: PropTypes.func,
  isLoading: PropTypes.bool,
};

const EResource = ({
  components: { HelperComponent, TagButton },
  data = {},
  data: { eresource, tagsInvalidateLinks, tagsLink } = {},
  handlers,
  isLoading,
}) => {
  const stripes = useStripes();

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [showOkayConfirmationModal, setShowOkayConfirmationModal] = useState(false);

  const totalCount = data.packageContentsCount;

  // const numberDeleted = totalCount; // for test
  // const numberDeleted = totalCount - 3;
  const numberDeleted = 0;
  const numberNotDeleted = totalCount - numberDeleted;

  const paneProps = {
    defaultWidth: '55%',
    dismissible: true,
    onClose: handlers.onClose,
  };

  if (isLoading) return <LoadingPane data-loading id="pane-view-eresource" {...paneProps} />;

  let EResourceViewComponent = Package;
  let icon = 'package';

  if (eresource.class === resourceClasses.TITLEINSTANCE) {
    EResourceViewComponent = Title;
    icon = 'title';
    if (eresource.subType?.value === 'print') {
      icon = 'printTitle';
    }
  } else if (eresource.class === resourceClasses.PCI) {
    EResourceViewComponent = PCI;
    icon = 'pci';
  }

  const getActionMenu = () => {
    const buttons = [];

    if (stripes.hasPerm('ui-agreements.packages.controlSync.execute')) {
      buttons.push(
        <Button
          key="clickable-dropdown-sync-package"
          buttonStyle="dropdownItem"
          disabled={data.eresource.syncContentsFromSource === true}
          id="clickable-dropdown-sync-package"
          onClick={() => handlers.onSynchronize(syncStates.SYNCHRONIZING)}
        >
          <FormattedMessage id="ui-agreements.eresources.startSync" />
        </Button>
      );

      buttons.push(
        <Button
          key="clickable-dropdown-pause-package"
          buttonStyle="dropdownItem"
          disabled={data.eresource.syncContentsFromSource === false}
          id="clickable-dropdown-pause-package"
          onClick={() => handlers.onSynchronize(syncStates.PAUSED)}
        >
          <FormattedMessage id="ui-agreements.eresources.pauseSync" />
        </Button>
      );
    }

    if (stripes.hasPerm('ui-agreements.resources.delete')) {
      buttons.push(
        <Button
          key="clickable-dropdown-delete-pkg-contents"
          buttonStyle="dropdownItem"
          disabled={data.packageContentsCount === 0}
          id="clickable-dropdown-delete-pkg-contents"
          // onClick={() => console.log('Delete package action not implemented yet')}
          onClick={() => (numberDeleted > 0
            ? setShowDeleteConfirmationModal(true)
            : setShowOkayConfirmationModal(true))
          }
        >
          <Icon icon="trash">
            <FormattedMessage id="ui-agreements.eresources.deletePackageContents" />
          </Icon>
        </Button>
      );
    }

    return buttons.length ? buttons : null;
  };

  const getDeleteConfirmationMessage = () => {
    return (
      <>
        <p>
          <FormattedMessage
            id="ui-agreements.eresources.deleteConfirmationMessage.default"
            values={{ numberDeleted, totalCount, pkgName: eresource.name }}
          />
        </p>
        <p>
          <FormattedMessage id="ui-agreements.eresources.deleteConfirmationMessage.information" />
        </p>
        {numberNotDeleted > 0 && (
          <p>
            <FormattedMessage
              id="ui-agreements.eresources.deleteConfirmationMessage.pciNotDeleted"
              values={{ numberNotDeleted }}
            />
          </p>
        )}
        <p>
          <FormattedMessage id="ui-agreements.eresources.deleteConfirmationMessage.selectDelete" />
        </p>
      </>
    );
  };

  return (
    <>
      <Pane
        {...(eresource.class === resourceClasses.PACKAGE
          ? { actionMenu: getActionMenu }
          : {})}
        appIcon={<AppIcon app="agreements" iconKey={icon} size="small" />}
        id="pane-view-eresource"
        lastMenu={
          eresource.class === resourceClasses.PCI ||
            eresource.class === resourceClasses.TITLEINSTANCE ? (
            <IfPermission perm="ui-agreements.resources.edit">
              <PaneMenu>
                {handlers.onToggleTags && <TagButton entity={eresource} />}
                {eresource.subType?.value !== 'print' && (
                  <Button
                    buttonStyle="primary"
                    id="clickable-edit-eresource"
                    marginBottom0
                    onClick={handlers.onEdit}
                  >
                    <FormattedMessage id="stripes-components.button.edit" />
                  </Button>
                )}
              </PaneMenu>
            </IfPermission>
          ) : null
        }
        onClose={handlers.onClose}
        paneTitle={eresource.name}
        {...paneProps}
      >
        <TitleManager record={eresource.name}>
          <EResourceViewComponent data={data} handlers={handlers} />
        </TitleManager>
      </Pane>
      <HelperComponent
        invalidateLinks={tagsInvalidateLinks}
        link={tagsLink}
        onToggle={handlers.onToggleTags}
      />
      {eresource.class === resourceClasses.PACKAGE && (
        <ConfirmationModal
          buttonStyle="danger"
          confirmLabel={<FormattedMessage id="ui-agreements.delete" />}
          data-test-delete-confirmation-modal
          heading={<FormattedMessage id="ui-agreements.eresources.deleteJob" />}
          id="delete-pkg-contents-confirmation"
          message={getDeleteConfirmationMessage()}
          onCancel={() => setShowDeleteConfirmationModal(false)}
          onConfirm={() => {
            // handlers.onDelete();
            console.log('Delete action not implemented yet');
            setShowDeleteConfirmationModal(false);
          }}
          open={showDeleteConfirmationModal}
        />
      )}
      {numberDeleted === 0 && (
        <Modal
          footer={
            <ModalFooter>
              <Button
                buttonStyle="primary"
                data-test-confirmation-modal-ok-button
                onClick={() => setShowOkayConfirmationModal(false)}
              >
                <FormattedMessage id="ui-agreements.okay" />
              </Button>
            </ModalFooter>
          }
          id="delete-pkg-contents-modal-ok"
          label={<FormattedMessage id="ui-agreements.eresources.deleteJob" />}
          onClose={() => setShowOkayConfirmationModal(false)}
          open={showOkayConfirmationModal}
        >
          <p>
            <FormattedMessage
              id="ui-agreements.eresources.deleteConfirmationMessage.noDeletion"
              values={{ pkgName: eresource.name }}
            />
          </p>
        </Modal>
      )}
    </>
  );
};

EResource.propTypes = propTypes;
export default EResource;
