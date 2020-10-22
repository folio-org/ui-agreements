import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
  IconButton,
  LoadingPane,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';
import { AppIcon, IfPermission, TitleManager } from '@folio/stripes/core';

export default class Platform extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      platform: PropTypes.object.isRequired,
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
  }

  getActionMenu = ({ onToggle }) => (
    <>
      <IfPermission perm="ui-agreements.agreements.edit">
        <Button
          buttonStyle="dropdownItem"
          id="clickable-dropdown-edit-agreement"
          onClick={this.props.handlers.onEdit}
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-agreements.agreements.edit" />
          </Icon>
        </Button>
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
      </IfPermission>
      <IfPermission perm="ui-agreements.agreements.view">
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
      </IfPermission>
      <IfPermission perm="ui-agreements.agreements.delete">
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
      </IfPermission>
    </>
  )

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
    } = this.props;

    const paneProps = {
      defaultWidth: '55%',
      dismissible: true,
      id: 'pane-view-agreement',
      onClose: handlers.onClose,
    };

    if (isLoading) return <LoadingPane data-loading {...paneProps} />;

    return (
      <>
        <Pane
          actionMenu={this.getActionMenu}
          appIcon={<AppIcon app="agreements" iconKey="platform" />}
          lastMenu={this.renderEditAgreementPaneMenu()}
          paneTitle={data?.platform?.name}
          {...paneProps}
        >
          <TitleManager record={data?.platform?.name} />
        </Pane>
      </>
    );
  }
}
