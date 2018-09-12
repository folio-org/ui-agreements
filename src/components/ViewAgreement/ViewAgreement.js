import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import Layout from '@folio/stripes-components/lib/Layout';
import Icon from '@folio/stripes-components/lib/Icon';
import Pane from '@folio/stripes-components/lib/Pane';

export default class ViewAgreement extends React.Component {
  static manifest = Object.freeze({
    selectedAgreement: {
      type: 'okapi',
      path: 'erm/sas/:{id}',
    }
  });

  static propTypes = {
    parentResources: PropTypes.object,
    match: PropTypes.object,
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func,
  };

  getAgreement(props) {
    return get(props.resources.selectedAgreement, ['records', 0], {});
  }

  render() {
    const agreement = this.getAgreement(this.props);

    if (!agreement) {
      return (
        <Pane
          id="pane-view-agreement"
          defaultWidth={this.props.paneWidth}
          paneTitle="Loading..."
          dismissible
          onClose={this.props.onClose}
        >
          <Layout className="marginTop1">
            <Icon icon="spinner-ellipsis" width="100px" />
          </Layout>
        </Pane>
      );
    }

    return (
      <Pane
        id="pane-view-agreement"
        defaultWidth={this.props.paneWidth}
        paneTitle={agreement.name}
        dismissible
        onClose={this.props.onClose}
      >
        <h3>View Record</h3>
        <pre>
          {JSON.stringify(agreement, null, '\t')}
        </pre>
      </Pane>
    );
  }
}
