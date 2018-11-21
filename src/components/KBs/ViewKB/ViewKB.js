import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  Icon,
  Layout,
  Pane,
} from '@folio/stripes/components';

export default class ViewKB extends React.Component {
  static manifest = Object.freeze({
    selectedKB: {
      type: 'okapi',
      path: 'erm/pci/:{id}',
    }
  });

  static propTypes = {
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func,
  };

  getKB(props) {
    return get(props.resources.selectedKB, ['records', 0], {});
  }

  render() {
    const kb = this.getKB(this.props);

    if (!kb) {
      return (
        <Pane
          id="pane-view-kb"
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
        id="pane-view-kb"
        defaultWidth={this.props.paneWidth}
        paneTitle={kb.name}
        dismissible
        onClose={this.props.onClose}
      >
        <h3>View Record</h3>
        <pre>
          {JSON.stringify(kb, null, '\t')}
        </pre>
      </Pane>
    );
  }
}
