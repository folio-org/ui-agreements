import React from 'react';
import PropTypes from 'prop-types';

import { LoadingPane, Pane } from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';

import Package from './Package';
import Title from './Title';

export default class EResource extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      eresource: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.object,
      }),
    }),
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
      onNeedMorePackageContents: PropTypes.func.isRequired,
      onToggleTags: PropTypes.func.isRequired
    }).isRequired,
    helperApp: PropTypes.node,
    isLoading: PropTypes.bool,
  }

  render() {
    const {
      data,
      handlers,
      helperApp,
      isLoading,
    } = this.props;

    const paneProps = {
      defaultWidth: '55%',
      dismissible: true,
      onClose: handlers.onClose,
    };

    if (isLoading) return <LoadingPane id="pane-view-eresource" {...paneProps} />;

    const EResourceViewComponent = data.eresource.type ? Title : Package;

    return (
      <>
        <Pane
          id="pane-view-eresource"
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
