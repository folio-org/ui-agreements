import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';

import ViewKB from '../components/ViewKB';
import packageInfo from '../../package.json';

const INITIAL_RESULT_COUNT = 20;

const EditRecord = (props) => (
  <div>
    <h3>Edit Record</h3>
    <pre>
      {JSON.stringify(props)}
    </pre>
  </div>
);

const MATCH = [
  'title',
  'platform',
  'localReference',
  'vendorReference',
].map(t => `match=${t}`).join('&');

export default class KBs extends React.Component {
  static manifest = Object.freeze({
    records: {
      type: 'okapi',
      resourceShouldRefresh: true,
      path: (queryParams, pathComponents, resources) => {
        let path = 'erm/pci';
        let params = [];

        const { query: { query, filters, sort } } = resources;

        if (query) params.push(`${MATCH}&term=${query}`);

        if (params.length) return `${path}?${params.join('&')}`;

        return path;
      },
    },
    query: {},
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
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
          visibleColumns={['id', 'title', 'platform']}
          viewRecordPerms="module.erm.enabled"
          parentResources={this.props.resources}
          parentMutator={this.props.mutator}
          showSingleResult
          columnMapping={{
            id: 'ID',
            title: 'Title',
            platform: 'Platform'
          }}
          columnWidths={{
            id: 300,
            title: 400,
            platform: 'auto',
          }}
          resultsFormatter={{
            title: kb => get(kb, ['pti', 'titleInstance', 'title'], ''),
            platform: kb => get(kb, ['pti', 'platform', 'name'], ''),
          }}
        />
      </React.Fragment>
    );
  }
}
