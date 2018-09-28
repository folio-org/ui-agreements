import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { SearchAndSort } from '@folio/stripes-smart-components';

import ViewKB from '../components/KBs/ViewKB';
import packageInfo from '../../package';

const INITIAL_RESULT_COUNT = 100;

const EditRecord = (props) => (
  <div>
    <h3>Edit Record</h3>
    <pre>
      {JSON.stringify(props)}
    </pre>
  </div>
);

export default class KBs extends React.Component {
  static manifest = Object.freeze({
    records: {
      path: 'erm/pci',
      type: 'okapi',
      resourceShouldRefresh: true,
      records: 'results',
      params: (queryParams, pathComponents, resources) => {
        const params = {
          stats: 'true',
        };

        const { query: { query, filters, sort } } = resources;

        if (query) {
          params.match = 'pti.titleInstance.title';
          params.term = query;
        }

        return params;
      },
    },
    query: {},
    resultCount: { },
  });

  static propTypes = {
    resources: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  };

  render() {
    const path = '/erm/kbs';
    packageInfo.stripes.route = path;
    packageInfo.stripes.home = path;

    return (
      <React.Fragment>
        <SearchAndSort
          key="kbs"
          packageInfo={packageInfo}
          filterConfig={[]}
          objectName="kb"
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={INITIAL_RESULT_COUNT}
          viewRecordComponent={ViewKB}
          editRecordComponent={EditRecord}
          visibleColumns={['vendor', 'sourcekb', 'pkg', 'title', 'platform', 'coverage']}
          viewRecordPerms="module.erm.enabled"
          parentResources={this.props.resources}
          parentMutator={this.props.mutator}
          showSingleResult
          columnMapping={{
            vendor: 'Vendor',
            sourcekb: 'KB',
            pkg: 'Package',
            coverage: 'Coverage Summary',
            title: 'Title',
            platform: 'Platform'
          }}
          columnWidths={{
            title: 400,
            platform: 300,
            sourcekb: 100,
            vendor: 100,
            pkg: 300,
            coverage: 200,
          }}
          resultsFormatter={{
            sourcekb: kb => get(kb, ['pkg', 'remoteKb', 'name'], ''),
            pkg: kb => get(kb, ['pkg', 'name'], ''),
            title: kb => get(kb, ['pti', 'titleInstance', 'title'], ''),
            platform: kb => get(kb, ['pti', 'platform', 'name'], ''),
            vendor: kb => get(kb, ['pkg', 'vendor', 'name'], ''),
            coverage: kb => get(kb, ['coverage'], ''),
          }}
        />
      </React.Fragment>
    );
  }
}
