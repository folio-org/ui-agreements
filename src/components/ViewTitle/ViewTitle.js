import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import Layout from '@folio/stripes-components/lib/Layout';
import Icon from '@folio/stripes-components/lib/Icon';
import Pane from '@folio/stripes-components/lib/Pane';

export default class ViewTitle extends React.Component {
  static propTypes = {
    parentResources: PropTypes.object,
    match: PropTypes.object,
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func,
  };

  getTitle(props) {
    const records = get(props.parentResources.records, ['records'], []);
    const id = props.match.params.id;

    return records.find(r => r.id === id);
  }

  render() {
    const title = this.getTitle(this.props);

    if (!title) {
      return (
        <Pane
          id="pane-view-title"
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
        id="pane-view-title"
        defaultWidth={this.props.paneWidth}
        paneTitle={title.name}
        dismissible
        onClose={this.props.onClose}
      >
        <h3>View Record</h3>
        <pre>
          {JSON.stringify(title, null, '\t')}
        </pre>
      </Pane>
    );
  }
}
