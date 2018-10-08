import React from 'react';
import PropTypes from 'prop-types';

import { SearchAndSort } from '@folio/stripes/smart-components';

import ViewEResource from '../components/EResources/ViewEResource';
import getSASParams from '../util/getSASParams';
import packageInfo from '../../package';

const INITIAL_RESULT_COUNT = 100;

class EResources extends React.Component {
  static manifest = Object.freeze({
    records: {
      type: 'okapi',
      path: 'erm/eresources',
      resourceShouldRefresh: true,
      records: 'results',
      params: getSASParams({
        searchKey: 'name',
        columnMap: {
          'Name': 'name',
          'Type': 'type',
        }
      }),
    },
    query: {},
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  static propTypes = {
    resources: PropTypes.shape({
      records: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
    }),
    mutator: PropTypes.object,
    stripes: PropTypes.object,
  };

  render() {
    const { stripes: { intl } } = this.props;
    const path = '/erm/eresources';
    packageInfo.stripes.route = path;
    packageInfo.stripes.home = path;

    return (
      <React.Fragment>
        <SearchAndSort
          key="eresources"
          packageInfo={packageInfo}
          filterConfig={[]}
          objectName="name"
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={INITIAL_RESULT_COUNT}
          viewRecordComponent={ViewEResource}
          viewRecordPerms="module.erm.enabled"
          onCreate={this.create}
          parentResources={this.props.resources}
          parentMutator={this.props.mutator}
          showSingleResult
          visibleColumns={[
            'name',
            'type',
          ]}
          columnMapping={{
            name: intl.formatMessage({ id: 'ui-erm.eresources.name' }),
            type: intl.formatMessage({ id: 'ui-erm.eresources.type' }),
          }}
          columnWidths={{
            name: 500,
            type: 200,
          }}
          resultsFormatter={{
            type: a => a.type && a.type.label,
          }}
        />
      </React.Fragment>
    );
  }
}

export default EResources;
