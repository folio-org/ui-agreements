import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Layout, Pane } from '@folio/stripes/components';
import { Spinner } from '@folio/stripes-erm-components';

import Package from './Package';
import Title from './Title';

export default class EResource extends React.Component {
  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="45%"
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
    const { data: { eresource }, isLoading } = this.props;

    if (!isLoading) return this.renderLoadingPane();

    return eresource.type ? <Title {...this.props} /> : <Package {...this.props} />;
  }
}
