import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  Icon,
  Layout,
  Pane,
} from '@folio/stripes/components';

import ViewPackage from '../ViewPackage';
import ViewTitle from '../ViewTitle';

class ViewEResource extends React.Component {
  static manifest = Object.freeze({
    selectedEResource: {
      type: 'okapi',
      path: 'erm/resource/:{id}',
    },
    query: {},
  });

  static propTypes = {
    match: PropTypes.object,
    onClose: PropTypes.func,
    resources: PropTypes.object,
    stripes: PropTypes.object,
  };

  getEResource() {
    return get(this.props.resources.selectedEResource, ['records', 0], undefined);
  }

  renderLoadingPane() {
    return (
      <Pane
        id="pane-view-eresource"
        defaultWidth="55%"
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

  render() {
    const resource = this.getEResource();
    if (!resource) return this.renderLoadingPane();

    const childProps = {
      match: this.props.match, // For param substitution in resource paths.
      eresource: this.getEResource(),
      stripes: this.props.stripes,
    };

    return (
      <Pane
        id="pane-view-eresource"
        defaultWidth="55%"
        paneTitle={resource.name}
        dismissible
        onClose={this.props.onClose}
      >
        { resource.type ? <ViewTitle {...childProps} /> : <ViewPackage {...childProps} /> }
      </Pane>
    );
  }
}

export default ViewEResource;
