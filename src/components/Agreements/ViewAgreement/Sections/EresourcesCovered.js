import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import Link from 'react-router-dom/Link';

import {
  MultiColumnList,
} from '@folio/stripes/components';

import CoverageStatements from '../../../CoverageStatements';

export default class EresourcesCovered extends React.Component {
  static propTypes = {
    fetchMoreEresources: PropTypes.func.isRequired,
    parentResources: PropTypes.shape({
      agreementEresources: PropTypes.object,
    }),
  };

  state = {
    mountedMCL: false,
  }

  columnMapping = {
    name: <FormattedMessage id="ui-agreements.eresources.name" />,
    platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
    package: <FormattedMessage id="ui-agreements.eresources.package" />,
    haveAccess: <FormattedMessage id="ui-agreements.eresources.haveAccess" />,
    accessStart: <FormattedMessage id="ui-agreements.eresources.accessStart" />,
    accessEnd: <FormattedMessage id="ui-agreements.eresources.accessEnd" />,
    coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
  }

  formatter = {
    name: e => {
      const name = get(e._object, ['pti', 'titleInstance', 'name'], '-');
      const eresourceId = get(e._object, ['pti', 'id']);

      return eresourceId ? <Link to={`/erm/eresources/view/${eresourceId}`}>{name}</Link> : name;
    },
    platform: e => get(e._object, ['pti', 'platform', 'name'], '-'),
    package: e => get(e._object, ['pkg', 'name'], '-'),
    haveAccess: () => 'TBD',
    accessStart: () => 'TBD',
    accessEnd: () => 'TBD',
    coverage: e => <CoverageStatements statements={e._object.coverageStatements} />,
  }

  visibleColumns = [
    'name',
    'platform',
    'package',
    'haveAccess',
    'accessStart',
    'accessEnd',
    'coverage',
  ]

  // The reason for all the `mountedMCL` business is that we have to ensure that the MCL has been mounted
  // and its DOM nodes are up before passing it data. If the data is passed before it has mounted,
  // then the `virtualize` row calculations will be incorrect because the rows will all be of height 0.
  handleMountedMCL = () => {
    this.setState({ mountedMCL: true });
  }

  render() {
    const agreementEresources = get(this.props.parentResources, ['agreementEresources', 'records'], []);

    return (
      <MultiColumnList
        columnMapping={this.columnMapping}
        contentData={this.state.mountedMCL ? agreementEresources : []}
        formatter={this.formatter}
        height={800}
        id="eresources-covered"
        instanceRef={this.handleMountedMCL}
        interactive={false}
        onNeedMoreData={this.props.fetchMoreEresources}
        virtualize
        visibleColumns={this.visibleColumns}
      />
    );
  }
}
