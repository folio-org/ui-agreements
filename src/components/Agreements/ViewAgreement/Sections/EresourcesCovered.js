import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  MultiColumnList,
} from '@folio/stripes/components';

import CoverageStatements from '../../../CoverageStatements';

export default class EresourcesCovered extends React.Component {
  static propTypes = {
    fetchMoreEresources: PropTypes.func.isRequired,
    parentResources: PropTypes.shape({
      eresources: PropTypes.object,
    }),
  };

  render() {
    const eresources = get(this.props.parentResources, ['eresources', 'records'], []);

    return (
      <MultiColumnList
        contentData={eresources}
        id="eresources-covered"
        interactive={false}
        height={400}
        onNeedMoreData={this.props.fetchMoreEresources}
        virtualize
        visibleColumns={[
          'name',
          'platform',
          'package',
          'haveAccess',
          'accessStart',
          'accessEnd',
          'coverage',
        ]}
        formatter={{
          name: e => get(e._object, ['pti', 'titleInstance', 'name'], '-'),
          platform: e => get(e._object, ['pti', 'platform', 'name'], '-'),
          package: e => get(e._object, ['pkg', 'name'], '-'),
          haveAccess: () => 'TBD',
          accessStart: () => 'TBD',
          accessEnd: () => 'TBD',
          coverage: e => <CoverageStatements statements={e._object.coverageStatements} />,
        }}
        columnMapping={{
          name: <FormattedMessage id="ui-agreements.eresources.name" />,
          platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
          package: <FormattedMessage id="ui-agreements.eresources.package" />,
          haveAccess: <FormattedMessage id="ui-agreements.eresources.haveAccess" />,
          accessStart: <FormattedMessage id="ui-agreements.eresources.accessStart" />,
          accessEnd: <FormattedMessage id="ui-agreements.eresources.accessEnd" />,
          coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
        }}
      />
    );
  }
}
