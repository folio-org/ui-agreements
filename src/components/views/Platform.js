import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
  LoadingPane,
  Pane,
} from '@folio/stripes/components';
import { AppIcon, IfPermission, TitleManager } from '@folio/stripes/core';
import { PlatformInfo } from '../PlatformSections';

export default class Platform extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      platform: PropTypes.object.isRequired,
      searchString: PropTypes.string,
    }).isRequired,
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
      onEdit: PropTypes.func,
    }).isRequired,
    isLoading: PropTypes.bool.isRequired,
  }

  getActionMenu = () => (
    <>
      <IfPermission perm="ui-agreements.platforms.edit">
        <Button
          buttonStyle="dropdownItem"
          id="clickable-dropdown-edit-platform"
          onClick={this.props.handlers.onEdit}
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-agreements.platform.edit" />
          </Icon>
        </Button>
      </IfPermission>
    </>
  )

  render() {
    const {
      data: { platform },
      isLoading,
      handlers,
    } = this.props;

    const paneProps = {
      defaultWidth: '55%',
      dismissible: true,
      id: 'pane-view-platform',
      onClose: handlers.onClose,
    };

    if (isLoading) return <LoadingPane data-loading {...paneProps} />;

    return (
      <>
        <Pane
          actionMenu={this.getActionMenu}
          appIcon={<AppIcon app="agreements" iconKey="platform" />}
          paneTitle={platform?.name}
          {...paneProps}
        >
          <TitleManager record={platform?.name}>
            <PlatformInfo platform={platform} />
          </TitleManager>
        </Pane>
      </>
    );
  }
}
