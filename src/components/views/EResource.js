import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button, Pane, PaneMenu } from '@folio/stripes/components';
import { IfPermission, TitleManager } from '@folio/stripes/core';
import { LoadingPane, Pane } from '@folio/stripes/components';

import Package from './Package';
import Title from './Title';
import PCI from './PCI';
import { resourceClasses } from '../../constants';

export default class EResource extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      eresource: PropTypes.shape({
        class: PropTypes.string,
        name: PropTypes.string,
        type: PropTypes.object,
      }),
    }),
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
      onEdit: PropTypes.func.isRequired,
      onNeedMorePackageContents: PropTypes.func.isRequired,
      onToggleTags: PropTypes.func.isRequired
    }).isRequired,
    helperApp: PropTypes.node,
    isLoading: PropTypes.bool,
  }

  renderEditPCIPaneMenu = () => {
    const {
      data: { eresource },
      handlers,
    } = this.props;

    return (eresource?.class === resourceClasses.PCI) ? (
      <IfPermission perm="ui-agreements.resources.edit">
        <PaneMenu>
          <FormattedMessage id="ui-agreements.eresources.edit">
            {ariaLabel => (
              <Button
                aria-label={ariaLabel}
                buttonStyle="primary"
                id="clickable-edit-eresource"
                marginBottom0
                onClick={handlers.onEdit}
              >
                <FormattedMessage id="stripes-components.button.edit" />
              </Button>
            )}
          </FormattedMessage>
        </PaneMenu>
      </IfPermission>
    ) : null;
  }

  render() {
    const {
      data = {},
      handlers,
      helperApp,
      isLoading,
    } = this.props;

    const paneProps = {
      defaultWidth: '55%',
      dismissible: true,
      onClose: handlers.onClose,
    };

    if (isLoading) return <LoadingPane data-loading id="pane-view-eresource" {...paneProps} />;

    let EResourceViewComponent = Package;

    if (data.eresource?.class === resourceClasses.TITLEINSTANCE) {
      EResourceViewComponent = Title;
    } else if (data.eresource?.class === resourceClasses.PCI) {
      EResourceViewComponent = PCI;
    }

    return (
      <>
        <Pane
          id="pane-view-eresource"
          lastMenu={this.renderEditPCIPaneMenu()}
          onClose={handlers.onClose}
          paneTitle={data.eresource.name}
          {...paneProps}
        >
          <TitleManager record={data.eresource.name}>
            <EResourceViewComponent data={data} handlers={handlers} />
          </TitleManager>
        </Pane>
        {helperApp}
      </>
    );
  }
}
