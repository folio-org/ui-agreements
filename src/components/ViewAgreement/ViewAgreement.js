import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import Pane from '@folio/stripes-components/lib/Pane';

export default class ViewAgreement extends React.Component {

  getAgreement(props) {
    const records = get(props.parentResources.records, ['records'], []);
    const id = props.match.params.id;

    return records.find(r => r.id === id);
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
        >Loading</Pane>
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
