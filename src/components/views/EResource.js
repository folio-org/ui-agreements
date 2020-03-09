import React from 'react';
import PropTypes from 'prop-types';

import { Pane } from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes-erm-components';

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

    if (isLoading) return <LoadingPane onClose={handlers.onClose} />;

    const EResourceViewComponent = data.eresource.type ? Title : Package;

    return (
      <>
        <Pane
          defaultWidth="55%"
          dismissible
          id="pane-view-eresource"
          onClose={handlers.onClose}
          paneTitle={data.eresource.name}
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
