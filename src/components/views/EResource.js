import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Layout, Pane } from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import { Spinner } from '@folio/stripes-erm-components';

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
      onToggleTags: PropTypes.func.isRequired
    }).isRequired,
    helperApp: PropTypes.node,
    isLoading: PropTypes.bool,
  }

  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="55%"
        dismissible
        id="pane-view-eresource"
        onClose={this.props.handlers.onClose}
        paneTitle={<FormattedMessage id="ui-agreements.loading" />}
      >
        <Layout className="marginTop1">
          <Spinner />
        </Layout>
      </Pane>
    );
  }

  render() {
    const {
      data,
      handlers,
      helperApp,
      isLoading,
    } = this.props;

    if (isLoading) return this.renderLoadingPane();

    const EResourceViewComponent = data.eresource.type ? Title : Package;

    return (
      <React.Fragment>
        <Pane
          id="pane-view-eresource"
          defaultWidth="55%"
          paneTitle={data.eresource.name}
          dismissible
          onClose={handlers.onClose}
        >
          <TitleManager record={data.eresource.name}>
            <EResourceViewComponent data={data} handlers={handlers} />
          </TitleManager>
        </Pane>
        {helperApp}
      </React.Fragment>
    );
  }
}
